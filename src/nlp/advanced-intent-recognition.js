class AdvancedIntentRecognition {
    constructor() {
        this.intentPatterns = {
            person_inquiry: [
                /(کیست|هستی|معرفی|کیه)\s+(رامین|اجلال)/,
                /(رامین|اجلال)\s+(کیست|چیه|کیه)/
            ],
            achievement_inquiry: [
                /(دستاورد|کار|پروژه|انجام)\s+(رامین|اجلال)/,
                /(رامین|اجلال)\s+(دستاورد|کار|پروژه)/
            ],
            article_request: [
                /(مقاله|مطلب|متن)\s+(بنویس|نویس|تهیه)/,
                /(بنویس|نویس)\s+(مقاله|مطلب|متن)/
            ],
            technical_question: [
                /(هوش مصنوعی|AI|NLP|پردازش)\s+(چیه|چیست|چگونه)/,
                /(تعریف|منظور)\s+(هوش مصنوعی|AI|NLP)/
            ]
        };
    }

    detectIntent(text) {
        const normalized = this.normalizeText(text);
        
        for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
            for (const pattern of patterns) {
                if (pattern.test(normalized)) {
                    return {
                        intent: intent,
                        confidence: this.calculateConfidence(normalized, pattern),
                        entities: this.extractEntities(normalized)
                    };
                }
            }
        }
        
        return {
            intent: 'general_inquiry',
            confidence: 0.3,
            entities: this.extractEntities(normalized)
        };
    }

    normalizeText(text) {
        return text.replace(/\s+/g, ' ').trim().toLowerCase();
    }

    calculateConfidence(text, pattern) {
        const match = text.match(pattern);
        return match ? 0.9 : 0.3;
    }

    extractEntities(text) {
        const entities = {};
        
        // تشخیص نام افراد
        if (text.includes('رامین') || text.includes('اجلال')) {
            entities.person = 'رامین اجلال';
        }
        
        // تشخیص موضوعات
        if (text.includes('هوش مصنوعی') || text.includes('ai')) {
            entities.topic = 'هوش مصنوعی';
        }
        
        if (text.includes('مقاله') || text.includes('مطلب')) {
            entities.action = 'generate_article';
        }
        
        return entities;
    }
}

module.exports = AdvancedIntentRecognition;
