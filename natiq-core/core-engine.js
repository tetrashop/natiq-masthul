const crypto = require('crypto');

class NatiqCore {
    constructor() {
        this.interactionCount = 0;
        this.performanceStats = {
            totalRequests: 0,
            successfulResponses: 0,
            averageResponseTime: 0,
            cacheHitRate: 0
        };
        this.startTime = Date.now();
    }

    // تحلیل سوال کاربر
    analyzeQuestion(question) {
        this.interactionCount++;
        this.performanceStats.totalRequests++;
        
        const analysis = {
            id: crypto.randomBytes(8).toString('hex'),
            timestamp: new Date().toISOString(),
            question: question,
            language: this.detectLanguage(question),
            intent: this.extractIntent(question),
            entities: this.extractEntities(question),
            complexity: this.assessComplexity(question),
            urgency: this.assessUrgency(question)
        };
        
        return analysis;
    }

    // تشخیص زبان
    detectLanguage(text) {
        const persianRegex = /[\u0600-\u06FF]/;
        const englishRegex = /[a-zA-Z]/;
        
        if (persianRegex.test(text)) {
            return 'fa';
        } else if (englishRegex.test(text)) {
            return 'en';
        } else {
            return 'unknown';
        }
    }

    // استخراج هدف کاربر
    extractIntent(question) {
        const intents = {
            greeting: ['سلام', 'hello', 'hi', 'درود'],
            question: ['چرا', 'چگونه', 'چطور', 'کی', 'کجا', 'چه', 'why', 'how', 'when', 'where', 'what'],
            command: ['انجام بده', 'محاسبه کن', 'بیاب', 'جستجو', 'do', 'calculate', 'find', 'search'],
            technical: ['کد', 'برنامه', 'الگوریتم', 'کامپیوتر', 'code', 'program', 'algorithm', 'computer']
        };

        const lowerQuestion = question.toLowerCase();
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
                return intent;
            }
        }
        
        return 'general';
    }

    // استخراج موجودیت‌ها
    extractEntities(question) {
        const entities = [];
        
        // تشخیص اعداد
        const numbers = question.match(/\d+/g);
        if (numbers) {
            entities.push(...numbers.map(num => ({ type: 'number', value: num })));
        }
        
        // تشخیص کلمات کلیدی فنی
        const techKeywords = ['کد', 'برنامه', 'الگوریتم', 'داده', 'هوش مصنوعی', 'ماشین'];
        techKeywords.forEach(keyword => {
            if (question.includes(keyword)) {
                entities.push({ type: 'technical', value: keyword });
            }
        });
        
        return entities;
    }

    // ارزیابی پیچیدگی
    assessComplexity(question) {
        const words = question.split(/\s+/).length;
        if (words < 5) return 'low';
        if (words < 10) return 'medium';
        return 'high';
    }

    // ارزیابی فوریت
    assessUrgency(question) {
        const urgentWords = ['فوری', '紧急', 'urgent', 'asap', 'important'];
        return urgentWords.some(word => question.toLowerCase().includes(word)) ? 'high' : 'normal';
    }

    // تولید پاسخ
    generateResponse(analysis, context = {}) {
        const responseTemplates = {
            greeting: {
                fa: 'درود! من نطق مصطلح هستم. چگونه می‌توانم کمک کنم؟',
                en: 'Hello! I am Natiq Masthul. How can I help you?'
            },
            general: {
                fa: 'پرسش خوبی مطرح کردید. اجازه دهید در این مورد تحقیق کنم.',
                en: 'That\'s an interesting question. Let me research this for you.'
            },
            technical: {
                fa: 'سوال فنی جالبی پرسیدید. بیایید با جزئیات بیشتری بررسی کنیم.',
                en: 'Interesting technical question. Let\'s dive deeper into the details.'
            }
        };

        const template = responseTemplates[analysis.intent] || responseTemplates.general;
        const language = analysis.language === 'fa' ? 'fa' : 'en';
        
        const baseResponse = template[language];
        
        const fullResponse = {
            id: analysis.id,
            timestamp: new Date().toISOString(),
            question: analysis.question,
            response: baseResponse,
            analysis: analysis,
            context: context,
            metadata: {
                responseTime: Date.now() - this.startTime,
                confidence: 0.85,
                sources: ['internal_knowledge_base']
            }
        };

        this.performanceStats.successfulResponses++;
        
        return fullResponse;
    }

    // دریافت آمار عملکرد
    getPerformanceStats() {
        const uptime = Date.now() - this.startTime;
        const successRate = this.performanceStats.totalRequests > 0 
            ? (this.performanceStats.successfulResponses / this.performanceStats.totalRequests) * 100 
            : 0;
            
        return {
            ...this.performanceStats,
            successRate: Math.round(successRate * 100) / 100,
            uptime: Math.floor(uptime / 1000),
            interactionCount: this.interactionCount
        };
    }
}

module.exports = NatiqCore;
