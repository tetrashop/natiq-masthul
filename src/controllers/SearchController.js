const KnowledgeService = require('../services/KnowledgeService');
const NLPService = require('../services/NLPService');
const logger = require('../utils/logger');

class SearchController {
  async searchKnowledge(req, res) {
    try {
      const { 
        q: query, 
        category, 
        dateFrom, 
        dateTo, 
        sentiment,
        limit = 20,
        offset = 0 
      } = req.query;

      if (!query && !category && !dateFrom) {
        return res.status(400).json({
          success: false,
          error: 'حداقل یک پارامتر جستجو الزامی است'
        });
      }

      // جستجوی پایه
      let results = await KnowledgeService.getItems({
        search: query,
        category,
        limit: 1000 // برای فیلترهای اضافی
      });

      // فیلترهای پیشرفته
      if (dateFrom || dateTo || sentiment) {
        results = this.applyAdvancedFilters(results, {
          dateFrom,
          dateTo, 
          sentiment
        });
      }

      // مرتب‌سازی بر اساس ارتباط
      const sortedResults = this.sortByRelevance(results, query);

      // صفحه‌بندی نهایی
      const start = parseInt(offset);
      const end = start + parseInt(limit);
      const paginatedResults = sortedResults.slice(start, end);

      // تحلیل آماری
      const stats = this.calculateSearchStats(sortedResults, query);

      res.json({
        success: true,
        query,
        total: sortedResults.length,
        count: paginatedResults.length,
        stats,
        results: paginatedResults
      });

    } catch (error) {
      logger.error('Search failed:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در جستجو'
      });
    }
  }

  applyAdvancedFilters(results, filters) {
    return results.filter(item => {
      let match = true;

      // فیلتر تاریخ
      if (filters.dateFrom) {
        const itemDate = new Date(item.timestamp);
        const fromDate = new Date(filters.dateFrom);
        match = match && itemDate >= fromDate;
      }

      if (filters.dateTo) {
        const itemDate = new Date(item.timestamp);
        const toDate = new Date(filters.dateTo);
        match = match && itemDate <= toDate;
      }

      // فیلتر احساس
      if (filters.sentiment && item.analysis?.sentiment) {
        match = match && item.analysis.sentiment.label === filters.sentiment;
      }

      return match;
    });
  }

  sortByRelevance(results, query) {
    if (!query) {
      return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return results.map(item => {
      let score = 0;

      // امتیازدهی بر اساس تطابق در موضوع
      if (item.content?.subject?.toLowerCase().includes(query.toLowerCase())) {
        score += 10;
      }

      // امتیازدهی بر اساس تطابق در محتوا
      if (item.content?.body?.toLowerCase().includes(query.toLowerCase())) {
        score += 5;
      }

      // امتیازدهی بر اساس خلاصه
      if (item.analysis?.summary?.toLowerCase().includes(query.toLowerCase())) {
        score += 7;
      }

      // امتیازدهی بر اساس دسته‌بندی
      if (item.analysis?.categories?.some(cat => 
        cat.toLowerCase().includes(query.toLowerCase()))
      ) {
        score += 3;
      }

      // امتیاز بر اساس جدید بودن
      const daysAgo = (new Date() - new Date(item.timestamp)) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.max(0, 5 - (daysAgo / 7));
      score += recencyScore;

      return { ...item, relevanceScore: score };
    })
    .filter(item => item.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  calculateSearchStats(results, query) {
    const stats = {
      totalResults: results.length,
      byCategory: {},
      bySentiment: {},
      byDate: {},
      averageRelevance: 0
    };

    let totalScore = 0;

    results.forEach(item => {
      // آمار دسته‌بندی
      if (item.analysis?.categories) {
        item.analysis.categories.forEach(cat => {
          stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
        });
      }

      // آمار احساس
      const sentiment = item.analysis?.sentiment?.label || 'unknown';
      stats.bySentiment[sentiment] = (stats.bySentiment[sentiment] || 0) + 1;

      // آمار تاریخی
      const date = item.timestamp.split('T')[0];
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;

      // محاسبه امتیاز مرتبط
      totalScore += item.relevanceScore || 0;
    });

    stats.averageRelevance = results.length > 0 ? totalScore / results.length : 0;

    return stats;
  }

  async getSearchSuggestions(req, res) {
    try {
      const { q: query } = req.query;
      
      if (!query || query.length < 2) {
        return res.json({
          success: true,
          suggestions: []
        });
      }

      const allItems = await KnowledgeService.getItems({ limit: 1000 });
      
      const suggestions = new Set();

      // استخراج پیشنهادات از موضوعات
      allItems.forEach(item => {
        if (item.content?.subject?.toLowerCase().includes(query.toLowerCase())) {
          const words = item.content.subject.split(/\s+/);
          words.forEach(word => {
            if (word.toLowerCase().startsWith(query.toLowerCase()) && word.length > 2) {
              suggestions.add(word);
            }
          });
        }
      });

      // استخراج پیشنهادات از دسته‌بندی‌ها
      allItems.forEach(item => {
        if (item.analysis?.categories) {
          item.analysis.categories.forEach(cat => {
            if (cat.toLowerCase().includes(query.toLowerCase())) {
              suggestions.add(cat);
            }
          });
        }
      });

      res.json({
        success: true,
        query,
        suggestions: Array.from(suggestions).slice(0, 10)
      });

    } catch (error) {
      logger.error('Suggestions failed:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در دریافت پیشنهادات'
      });
    }
  }
}

module.exports = new SearchController();
