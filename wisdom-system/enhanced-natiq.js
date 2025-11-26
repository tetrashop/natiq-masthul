import EnhancedAnalyzer from './enhanced-analyzer.js';

class EnhancedNatiq {
    static async ask(question) {
        console.log('🔍 تحلیل پیشرفته سوال:', question);
        
        // تشخیص زبان
        const language = EnhancedAnalyzer.detectLanguage(question);
        console.log('🌐 زبان تشخیص داده شده:', language);
        
        // تحلیل مفهومی پیشرفته
        const analysis = EnhancedAnalyzer.analyzeQuestion(question);
        
        // تولید پاسخ بر اساس تحلیل
        const response = this.enhanceResponse(analysis.response, language);
        
        return {
            success: true,
            question: question,
            response: response,
            analysis: {
                primaryConcept: analysis.concept,
                depthLevel: analysis.depth,
                languageDetected: language,
                complexity: question.length > 50 ? 'high' : 'medium'
            },
            metadata: {
                system: "نطق مصطلح پیشرفته",
                version: "2.0.0",
                timestamp: new Date().toISOString(),
                responseTime: "فوری"
            },
            scores: {
                relevance: 0.9,
                depth: analysis.depth / 5,
                practicality: 0.85
            }
        };
    }

    static enhanceResponse(baseResponse, language) {
        // اضافه کردن نکات تکمیلی بر اساس زبان
        const enhancements = {
            mixed: "\n\n💫 **نکته**: شما از هر دو زبان استفاده می‌کنید - این نشان‌دهنده ذهن بین‌المللی و open-minded است!",
            english: "\n\n🌍 **Note**: Your question shows global thinking - consider balancing Eastern wisdom with Western practicality.",
            persian: "\n\n🌟 **اشاره**: سوال شما نشان‌دهنده تفکر عمیق و جستجوی حقیقت است."
        };

        return baseResponse + (enhancements[language] || "");
    }

    static getStatus() {
        return {
            status: "فعال 🟢",
            version: "2.0.0",
            features: [
                "تحلیل مفهومی پیشرفته",
                "تشخیص زبان خودکار", 
                "پاسخ‌های چندلایه",
                "پشتیبانی از سوالات پیچیده"
            ],
            enhanced: true,
            timestamp: new Date().toISOString()
        };
    }
}

export default EnhancedNatiq;
