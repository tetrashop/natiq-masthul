const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const config = require('../config/config');
const logger = require('../utils/logger');

class KnowledgeService {
  constructor() {
    this.knowledgeFile = config.database.knowledgeFile;
    this.knowledgeBase = [];
    this.initialized = false;
  }

  async initialize() {
    try {
      await fs.mkdir(path.dirname(this.knowledgeFile), { recursive: true });
      
      if (await this.fileExists(this.knowledgeFile)) {
        const data = await fs.readFile(this.knowledgeFile, 'utf8');
        this.knowledgeBase = JSON.parse(data);
        logger.info(`دانش بارگذاری شد: ${this.knowledgeBase.length} آیتم`);
      } else {
        this.knowledgeBase = [];
        await this.saveKnowledgeBase();
        logger.info('پایگاه دانش جدید ایجاد شد');
      }
      
      this.initialized = true;
    } catch (error) {
      logger.error('خطا در راه‌اندازی پایگاه دانش:', error);
      throw error;
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async addItem(item) {
    if (!this.initialized) {
      await this.initialize();
    }

    const knowledgeItem = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...item,
      metadata: {
        ...item.metadata,
        processedAt: new Date().toISOString(),
        version: '2.0.0'
      }
    };

    this.knowledgeBase.unshift(knowledgeItem); // اضافه کردن به ابتدا
    await this.saveKnowledgeBase();
    
    logger.info(`آیتم دانش اضافه شد: ${knowledgeItem.id}`);
    return knowledgeItem;
  }

  async getItems(options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    let filtered = this.knowledgeBase;

    if (options.category) {
      filtered = filtered.filter(item => 
        item.analysis?.categories?.includes(options.category)
      );
    }

    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.content?.subject?.toLowerCase().includes(searchTerm) ||
        item.content?.body?.toLowerCase().includes(searchTerm) ||
        item.analysis?.summary?.toLowerCase().includes(searchTerm)
      );
    }

    // مرتب‌سازی بر اساس زمان
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // صفحه‌بندی
    const start = options.offset || 0;
    const end = options.limit ? start + options.limit : filtered.length;
    
    return filtered.slice(start, end);
  }

  async getItem(id) {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.knowledgeBase.find(item => item.id === id);
  }

  async deleteItem(id) {
    if (!this.initialized) {
      await this.initialize();
    }

    const index = this.knowledgeBase.findIndex(item => item.id === id);
    if (index !== -1) {
      this.knowledgeBase.splice(index, 1);
      await this.saveKnowledgeBase();
      logger.info(`آیتم دانش حذف شد: ${id}`);
      return true;
    }
    return false;
  }

  async getCategories() {
    if (!this.initialized) {
      await this.initialize();
    }

    const categories = new Set();
    this.knowledgeBase.forEach(item => {
      if (item.analysis?.categories) {
        item.analysis.categories.forEach(cat => categories.add(cat));
      }
    });

    return Array.from(categories);
  }

  async getCount() {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.knowledgeBase.length;
  }

  async searchKnowledge(query, options = {}) {
    const results = await this.getItems({
      search: query,
      ...options
    });

    return {
      query,
      count: results.length,
      results
    };
  }

  async saveKnowledgeBase() {
    try {
      const data = JSON.stringify(this.knowledgeBase, null, 2);
      await fs.writeFile(this.knowledgeFile, data, 'utf8');
    } catch (error) {
      logger.error('خطا در ذخیره پایگاه دانش:', error);
      throw error;
    }
  }

  // پشتیبان‌گیری از دانش
  async backup() {
    const backupFile = `${this.knowledgeFile}.backup.${Date.now()}`;
    await fs.copyFile(this.knowledgeFile, backupFile);
    logger.info(`پشتیبان ایجاد شد: ${backupFile}`);
    return backupFile;
  }

  // آمار و آنالیتیکس
  async getStatistics() {
    if (!this.initialized) {
      await this.initialize();
    }

    const stats = {
      total: this.knowledgeBase.length,
      byCategory: {},
      bySource: {},
      timeline: {}
    };

    this.knowledgeBase.forEach(item => {
      // آمار دسته‌بندی
      if (item.analysis?.categories) {
        item.analysis.categories.forEach(cat => {
          stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
        });
      }

      // آمار منبع
      const source = item.source || 'unknown';
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;

      // آمار زمانی
      const date = item.timestamp.split('T')[0];
      stats.timeline[date] = (stats.timeline[date] || 0) + 1;
    });

    return stats;
  }
}

module.exports = new KnowledgeService();
