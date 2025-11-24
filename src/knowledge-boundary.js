/**
 * سیستم تشخیص مرزهای دانش و خودآگاهی
 */

export class KnowledgeBoundary {
    constructor() {
        this.domains = this.defineKnowledgeDomains();
        this.rejectionThreshold = 0.15; // آستانه رد سوالات نامرتبط
    }

    defineKnowledgeDomains() {
        return {
            'ramin-ejlal': {
                name: 'اطلاعات تخصصی رامین اجلال',
                patterns: [
                    'رامین', 'اجلال', 'تحصیلات', 'مدرک', 'دانشگاه',
                    'تخصص', 'مهارت', 'سوابق', 'کار', 'تجربیات',
                    'دستاورد', 'پروژه', 'تحقیق', 'مقاله', 'پژوهش'
                ],
                description: 'اطلاعات حرفه‌ای و تخصصی درباره رامین اجلال'
            },
            'ai-system': {
                name: 'معرفی سیستم هوش مصنوعی',
                patterns: [
                    'سیستم', 'هوش مصنوعی', 'کاربرد', 'قابلیت',
                    'چکار می‌کنی', 'تو کیستی', 'معرفی کن'
                ],
                description: 'معرفی سیستم و قابلیت‌های آن'
            }
        };
    }

    /**
     * تحلیل سوال برای تشخیص مرتبط بودن با حوزه‌های دانش
     */
    async analyzeQuestionRelevance(question) {
        const normalizedQuestion = question.toLowerCase().trim();
        
        let maxScore = 0;
        let bestDomain = null;
        let matchedPatterns = [];

        // محاسبه امتیاز برای هر حوزه دانش
        for (const [domainId, domain] of Object.entries(this.domains)) {
            let domainScore = 0;
            const domainMatches = [];

            for (const pattern of domain.patterns) {
                if (normalizedQuestion.includes(pattern.toLowerCase())) {
                    domainScore += pattern.length * 0.1;
                    domainMatches.push(pattern);
                }
            }

            if (domainScore > maxScore) {
                maxScore = domainScore;
                bestDomain = domain;
                matchedPatterns = domainMatches;
            }
        }

        const relevanceScore = Math.min(1, maxScore);
        const shouldReject = relevanceScore < this.rejectionThreshold;

        return {
            relevant: !shouldReject,
            relevanceScore: relevanceScore,
            domain: bestDomain,
            matchedPatterns: matchedPatterns,
            rejectionReason: shouldReject ? 
                `سوال خارج از حوزه تخصصی سیستم. امتیاز مرتبط بودن: ${(relevanceScore * 100).toFixed(1)}%` : 
                null
        };
    }

    /**
     * تولید پاسخ هوشمند برای سوالات نامرتبط
     */
    generateIntelligentRejection(question, analysis) {
        const responses = [
            `🧠 **درک محدودیت‌ها نشانه خرد است**

سوال شما: "${question}"

من متوجه شدم این سوال خارج از حوزه تخصصی من است. من یک سیستم تخصصی هستم که در این زمینه‌ها می‌توانم کمک کنم:

🎓 **اطلاعات تخصصی درباره رامین اجلال**
• تحصیلات، مهارت‌ها و سوابق کاری
• پروژه‌ها و دستاوردهای تخصصی

🤖 **معرفی سیستم و قابلیت‌ها**
• کاربردهای این سیستم هوش مصنوعی
• راهنمایی استفاده از سیستم

**صداقت در ندانستن، از دانستن نادرست شرافتمندانه‌تر است.**`,

            `🔍 **تشخیص مرزهای دانش**

سوال: "${question}"

این سوال در حوزه تخصصی من نمی‌گنجد. من برای ارائه اطلاعات در این موارد طراحی شده‌ام:

• اطلاعات تخصصی رامین اجلال
• معرفی سیستم و کاربردهای آن

**فضل آن است که ندانی و بدانی که ندانی**`,

            `💡 **خودآگاهی سیستم**

سوال شما خارج از چارچوب تعریف شده من است.

**حوزه‌های پشتیبانی شده:**
📚 اطلاعات تخصصی رامین اجلال
🤖 معرفی سیستم هوش مصنوعی

**سوال شما:** "${question}"

*اعتراف به ندانستن، نخستین گام به سوی دانایی است*`
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return {
            status: 'out_of_scope',
            answer: randomResponse,
            confidence: 0.05,
            analysis: analysis,
            suggestion: 'لطفاً سوال خود را در حوزه‌های ذکر شده مطرح کنید'
        };
    }

    /**
     * بررسی عمق و وضوح سوال
     */
    analyzeQuestionQuality(question) {
        const length = question.length;
        const wordCount = question.split(/\s+/).length;
        const hasQuestionMark = question.includes('؟') || question.includes('?');
        
        let qualityScore = 0;
        
        // امتیاز بر اساس طول سوال
        if (length < 5) qualityScore = 0.1;
        else if (length < 10) qualityScore = 0.3;
        else if (length < 20) qualityScore = 0.6;
        else qualityScore = 0.8;

        // بهبود امتیاز برای سوالات کامل
        if (hasQuestionMark) qualityScore += 0.1;
        if (wordCount >= 3) qualityScore += 0.1;

        return {
            qualityScore: Math.min(1, qualityScore),
            isTooShort: length < 5,
            isWellStructured: qualityScore > 0.5,
            suggestions: this.generateQualitySuggestions(qualityScore, length)
        };
    }

    generateQualitySuggestions(qualityScore, length) {
        if (length < 5) {
            return ['لطفاً سوال خود را کامل‌تر بیان کنید'];
        }
        if (qualityScore < 0.4) {
            return ['سوال خود را واضح‌تر و کامل‌تر بیان کنید'];
        }
        return [];
    }
}

/**
 * سیستم اصلی با خودآگاهی بهبودیافته
 */
export class SelfAwareAISystem {
    constructor() {
        this.knowledgeBoundary = new KnowledgeBoundary();
        this.conversationHistory = [];
    }

    async processQuestion(question) {
        // تحلیل کیفیت سوال
        const qualityAnalysis = this.knowledgeBoundary.analyzeQuestionQuality(question);
        
        if (qualityAnalysis.isTooShort) {
            return {
                status: 'error',
                answer: '❌ سوال شما بسیار کوتاه است. لطفاً سوال کامل‌تری مطرح کنید.',
                confidence: 0.01,
                quality: qualityAnalysis
            };
        }

        // تحلیل مرتبط بودن سوال
        const relevanceAnalysis = await this.knowledgeBoundary.analyzeQuestionRelevance(question);
        
        if (!relevanceAnalysis.relevant) {
            return this.knowledgeBoundary.generateIntelligentRejection(question, relevanceAnalysis);
        }

        // اگر سوال مرتبط است، پردازش ادامه می‌یابد
        return await this.processRelevantQuestion(question, relevanceAnalysis, qualityAnalysis);
    }

    async processRelevantQuestion(question, relevanceAnalysis, qualityAnalysis) {
        // اینجا منطق پردازش سوالات مرتبط پیاده‌سازی می‌شود
        // برای تمرکز بر روی بهبود فعلی، از پیاده‌سازی جزئیات صرف‌نظر می‌کنیم
        
        return {
            status: 'success',
            answer: 'این یک پاسخ نمونه برای سوالات مرتبط است.',
            confidence: relevanceAnalysis.relevanceScore,
            analysis: {
                relevance: relevanceAnalysis,
                quality: qualityAnalysis
            }
        };
    }
}

export default SelfAwareAISystem;
