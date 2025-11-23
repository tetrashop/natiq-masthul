const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

class NLPService {
  constructor() {
    this.baseURL = config.nlp.endpoint;
    this.timeout = config.nlp.timeout;
  }

  async analyzeText(text) {
    try {
      const response = await axios.post(`${this.baseURL}/analyze`, {
        text,
        features: ['sentiment', 'entities', 'categories', 'summary']
      }, {
        timeout: this.timeout
      });

      return response.data;
    } catch (error) {
      logger.warn('NLP service unavailable, using fallback analysis');
      return this.fallbackAnalysis(text);
    }
  }

  fallbackAnalysis(text) {
    // تحلیل پایه در صورت عدم دسترسی به سرویس NLP
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    
    return {
      sentiment: this.analyzeSentiment(text),
      entities: this.extractEntities(text),
      categories: this.categorizeText(text),
      summary: this.generateSummary(text),
      metrics: {
        wordCount: words,
        sentenceCount: sentences,
        readability: this.calculateReadability(text)
      }
    };
  }

  analyzeSentiment(text) {
    const positiveWords = ['خوب', 'عالی', 'ممتاز', 'عالی', 'پیشنهاد'];
    const negativeWords = ['بد', 'ضعیف', 'مشکل', 'خطا', 'ایراد'];
    
    let score = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return {
      score,
      label: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
  }

  extractEntities(text) {
    // استخراج موجودیت‌های پایه
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const urlRegex = /https?:\/\/[^\s]+/g;
    
    return {
      emails: text.match(emailRegex) || [],
      urls: text.match(urlRegex) || [],
      potentialTopics: this.extractTopics(text)
    };
  }

  extractTopics(text) {
    const topics = [];
    const topicKeywords = {
      فنی: ['کد', 'برنامه', 'نرم‌افزار', 'تکنولوژی'],
      تجاری: ['قیمت', 'خرید', 'فروش', 'تجارت'],
      علمی: ['مقاله', 'تحقیق', 'دانش', 'آموزش']
    };
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        topics.push(topic);
      }
    });
    
    return topics.length > 0 ? topics : ['عمومی'];
  }

  categorizeText(text) {
    const categories = [];
    
    if (text.includes('یادگیری ماشین') || text.includes('هوش مصنوعی')) {
      categories.push('هوش مصنوعی');
    }
    if (text.includes('برنامه نویسی') || text.includes('کد')) {
      categories.push('برنامه نویسی');
    }
    if (text.includes('تجارت') || text.includes('کسب و کار')) {
      categories.push('تجارت');
    }
    
    return categories.length > 0 ? categories : ['عمومی'];
  }

  generateSummary(text, maxLength = 200) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return text.substring(0, maxLength);
    
    // انتخاب جملات کلیدی بر اساس طول و کلمات کلیدی
    const importantSentences = sentences
      .filter(s => s.length > 20 && s.length < 150)
      .slice(0, 3);
    
    return importantSentences.join('. ') + '.';
  }

  calculateReadability(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    
    if (sentences === 0) return 0;
    
    const wordsPerSentence = words / sentences;
    return Math.min(100, Math.max(0, 100 - (wordsPerSentence - 10) * 2));
  }
}

module.exports = new NLPService();
