const natural = require('natural');
const compromise = require('compromise');

class AdvancedNLP {
    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.stemmer = natural.PorterStemmerFa;
        this.conversationContext = new Map();
    }

    // پردازش سوال فارسی
    processQuestion(question, userId = 'default') {
        const normalized = this.normalizeText(question);
        const tokens = this.tokenizer.tokenize(normalized);
        const stems = tokens.map(token => this.stemmer.stem(token));
        
        const intent = this.detectIntent(normalized, stems);
        const entities = this.extractEntities(normalized);
        
        // ذخیره context
        this.updateContext(userId, { question, intent, entities });
        
        return { intent, entities, tokens, stems, normalized };
    }

    // تشخیص هدف سوال
    detectIntent(text, stems) {
        const greetings = ['سلام', 'درود', 'hello', 'hi', 'سلامتی'];
        const identity = ['کسی', 'شناسی', 'می‌شناسی', 'هستی', 'کیستی'];
        const explanation = ['چیست', 'چیه', 'معنی', 'منظور', 'توضیح'];
        const comparison = ['مقایسه', 'تفاوت', 'شباهت', 'مثل', 'شبیه'];

        if (greetings.some(g => text.includes(g))) return 'greeting';
        if (identity.some(i => text.includes(i))) return 'identity_query';
        if (explanation.some(e => text.includes(e))) return 'explanation';
        if (comparison.some(c => text.includes(c))) return 'comparison';
        if (text.includes('رامین') && text.includes('اجلال')) return 'specific_person';
        
        return 'general_query';
    }

    // استخراج موجودیت‌ها
    extractEntities(text) {
        const entities = {};
        
        // تشخیص نام افراد
        const personPatterns = [
            /(رامین\s+اجلال)/i,
            /(من)\s+/i,
            /(تو)\s+/i
        ];
        
        personPatterns.forEach(pattern => {
            const match = text.match(pattern);
            if (match) entities.person = match[1];
        });

        return entities;
    }

    // نرمال‌سازی متن فارسی
    normalizeText(text) {
        return text
            .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim()
            .toLowerCase();
    }

    // تولید پاسخ هوشمند
    generateResponse(processingResult, userId) {
        const { intent, entities } = processingResult;
        const context = this.conversationContext.get(userId);

        switch (intent) {
            case 'greeting':
                return "درود! 👋 من نطق مصطلح هستم، سیستم هوشمند پردازش دانش. چطور می‌تونم کمک کنم؟";
            
            case 'identity_query':
                if (entities.person === 'من') {
                    return "شما کاربر عزیز سیستم نطق مصطلح هستید! 😊 من اینجا هستم تا به سوالات شما پاسخ بدم.";
                }
                return "من نطق مصطلح هستم - یک سیستم هوشمند که برای پردازش دانش و پاسخ به سوالات پیچیده طراحی شده‌ام.";
            
            case 'specific_person':
                return "رامین اجلال یک توسعه‌دهنده و محقق در حوزه هوش مصنوعی و پردازش زبان فارسی است. در پروژه نطق مصطلح مشارکت داشته‌اند.";
            
            case 'comparison':
                return "برای مقایسه دقیق، لطفاً دو موضوع را مشخص کنید تا بتوانم تحلیل جامعی ارائه دهم.";
            
            case 'explanation':
                return "لطفاً موضوع مورد نظر را به طور مشخص بیان کنید تا توضیح کامل بدهم.";
            
            default:
                return "سوال جالبی پرسیدید! 🤔 می‌توانید کمی بیشتر توضیح دهید تا پاسخ دقیق‌تری ارائه کنم؟";
        }
    }

    updateContext(userId, data) {
        if (!this.conversationContext.has(userId)) {
            this.conversationContext.set(userId, { history: [] });
        }
        const userContext = this.conversationContext.get(userId);
        userContext.history.push(data);
        userContext.lastInteraction = new Date();
    }
}

module.exports = AdvancedNLP;
