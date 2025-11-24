/**
 * سیستم تشخیص مرزهای دانش و خودآگاهی - نسخه بهبود یافته با قابلیت استدلال
 */

import { ReasoningEngine } from './reasoning-engine.js';

export class KnowledgeBoundary {
    constructor() {
        this.domains = this.defineKnowledgeDomains();
        this.rejectionThreshold = 0.15;
        this.reasoningEngine = new ReasoningEngine();
    }

    defineKnowledgeDomains() {
        return {
            'ramin-ejlal': {
                name: 'اطلاعات تخصصی رامین اجلال',
                patterns: [
                    'رامین', 'اجلال', 'تحصیلات', 'مدرک', 'دانشگاه',
                    'تخصص', 'مهارت', 'سوابق', 'کار', 'تجربیات',
                    'دستاورد', 'پروژه', 'تحقیق', 'مقاله', 'پژوهش',
                    'کارنامه', 'پورتفولیو', 'تجربیات', 'موفقیت'
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
            },
            'problem-solving': {
                name: 'حل مسئله و استدلال',
                patterns: [
                    'محاسبه کن', 'حل کن', 'مسئله', 'ریاضی', 'جمع', 'تفریق',
                    'ضرب', 'تقسیم', 'معادله', 'محاسبه', 'چند میشود', 'حاصل',
                    'منطقی', 'استدلال', 'اگر آنگاه', 'شرطی', 'استنتاج',
                    'الگو', 'دنباله', 'پترن', 'قاعده', 'فرمول'
                ],
                description: 'حل مسائل ریاضی، منطقی و تشخیص الگو'
            }
        };
    }

    async analyzeQuestionRelevance(question) {
        const normalizedQuestion = question.toLowerCase().trim();
        
        let maxScore = 0;
        let bestDomain = null;
        let matchedPatterns = [];

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

        // بررسی قابلیت حل مسئله
        const problemAnalysis = await this.reasoningEngine.analyzeProblemType(question);
        if (problemAnalysis.isSolvable) {
            maxScore = Math.max(maxScore, problemAnalysis.confidence);
            if (problemAnalysis.confidence > 0.5) {
                bestDomain = this.domains['problem-solving'];
            }
        }

        const relevanceScore = Math.min(1, maxScore);
        const shouldReject = relevanceScore < this.rejectionThreshold;

        return {
            relevant: !shouldReject,
            relevanceScore: relevanceScore,
            domain: bestDomain,
            matchedPatterns: matchedPatterns,
            problemAnalysis: problemAnalysis,
            rejectionReason: shouldReject ? 
                `سوال خارج از حوزه تخصصی سیستم. امتیاز مرتبط بودن: ${(relevanceScore * 100).toFixed(1)}%` : 
                null
        };
    }

    generateIntelligentRejection(question, analysis) {
        const responses = [
            `🧠 **درک محدودیت‌ها نشانه خرد است**

سوال شما: "${question}"

من متوجه شدم این سوال خارج از حوزه تخصصی من است. من یک سیستم تخصصی هستم که در این زمینه‌ها می‌توانم کمک کنم:

🎓 **اطلاعات تخصصی درباره رامین اجلال**
• تحصیلات، مهارت‌ها و سوابق کاری
• پروژه‌ها و دستاوردهای تخصصی

🔢 **حل مسائل محاسباتی**
• مسائل ریاضی ساده
• تشخیص الگوهای عددی
• استدلال‌های منطقی پایه

🤖 **معرفی سیستم و قابلیت‌ها**
• کاربردهای این سیستم هوش مصنوعی
• راهنمایی استفاده از سیستم

**صداقت در ندانستن، از دانستن نادرست شرافتمندانه‌تر است.**`,

            `🔍 **تشخیص مرزهای دانش**

سوال: "${question}"

این سوال در حوزه تخصصی من نمی‌گنجد. من برای ارائه اطلاعات در این موارد طراحی شده‌ام:

• اطلاعات تخصصی رامین اجلال
• حل مسائل محاسباتی و منطقی
• معرفی سیستم و کاربردهای آن

**فضل آن است که ندانی و بدانی که ندانی**`
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

    async processProblemSolving(question, problemAnalysis) {
        // ابتدا بررسی می‌کنیم آیا این مسئله قبلاً حل شده است
        const similarProblem = await this.reasoningEngine.recallSimilarProblem(question);
        
        if (similarProblem) {
            return {
                status: 'solved_from_memory',
                answer: `💾 **حل از حافظه:**

سوال مشابه: "${similarProblem.question}"

${similarProblem.solution.explanation}

✅ این مسئله قبلاً حل شده و در حافظه من ذخیره شده است.`,
                confidence: similarProblem.confidence * 0.9, // کمی کمتر چون دقیقاً همان سوال نیست
                solution: similarProblem.solution,
                learned: true
            };
        }

        // حل مسئله جدید
        const solution = await problemAnalysis.type.solver(question);
        
        if (solution.solvable && solution.confidence > this.reasoningEngine.learningThreshold) {
            // یادگیری و ذخیره مسئله جدید
            const problemId = await this.reasoningEngine.learnNewProblem(question, solution, problemAnalysis.type.name);
            
            return {
                status: 'solved_and_learned',
                answer: `🎯 **مسئله حل شد و یاد گرفته شد:**

${solution.explanation}

💡 **یادگیری:** این راه‌حل در حافظه من ذخیره شد (ID: ${problemId}) و می‌توانم از آن برای سوالات مشابه استفاده کنم.`,
                confidence: solution.confidence,
                solution: solution,
                learned: true,
                problemId: problemId
            };
        } else if (solution.solvable) {
            return {
                status: 'solved',
                answer: `🔢 **حل مسئله:**

${solution.explanation}

⚠️ **توجه:** این راه‌حل به دلیل اطمینان پایین (${(solution.confidence * 100).toFixed(1)}%) در حافظه ذخیره نشد.`,
                confidence: solution.confidence,
                solution: solution,
                learned: false
            };
        } else {
            return {
                status: 'cannot_solve',
                answer: `❌ **نمی‌توانم این مسئله را حل کنم:**

سوال: "${question}"

خطا: ${solution.error}

امتیاز اطمینان: ${(solution.confidence * 100).toFixed(1)}%

🔍 **پیشنهاد:** سوال خود را ساده‌تر یا واضح‌تر بیان کنید.`,
                confidence: solution.confidence,
                error: solution.error
            };
        }
    }

    analyzeQuestionQuality(question) {
        const length = question.length;
        const wordCount = question.split(/\s+/).length;
        const hasQuestionMark = question.includes('؟') || question.includes('?');
        
        let qualityScore = 0;
        
        if (length < 5) qualityScore = 0.1;
        else if (length < 10) qualityScore = 0.3;
        else if (length < 20) qualityScore = 0.6;
        else qualityScore = 0.8;

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

    getLearningStatistics() {
        return this.reasoningEngine.getLearningStats();
    }
}

/**
 * سیستم اصلی با خودآگاهی و قابلیت استدلال
 */
export class SelfAwareAISystem {
    constructor() {
        this.knowledgeBoundary = new KnowledgeBoundary();
        this.conversationHistory = [];
    }

    async processQuestion(question) {
        const qualityAnalysis = this.knowledgeBoundary.analyzeQuestionQuality(question);
        
        if (qualityAnalysis.isTooShort) {
            return {
                status: 'error',
                answer: '❌ سوال شما بسیار کوتاه است. لطفاً سوال کامل‌تری مطرح کنید.',
                confidence: 0.01,
                quality: qualityAnalysis
            };
        }

        const relevanceAnalysis = await this.knowledgeBoundary.analyzeQuestionRelevance(question);
        
        if (!relevanceAnalysis.relevant) {
            return this.knowledgeBoundary.generateIntelligentRejection(question, relevanceAnalysis);
        }

        // اگر سوال مربوط به حل مسئله است
        if (relevanceAnalysis.problemAnalysis.isSolvable) {
            return await this.knowledgeBoundary.processProblemSolving(question, relevanceAnalysis.problemAnalysis);
        }

        return await this.processRelevantQuestion(question, relevanceAnalysis, qualityAnalysis);
    }

    async processRelevantQuestion(question, relevanceAnalysis, qualityAnalysis) {
        // دانش تخصصی رامین اجلال - به روز شده
        const knowledgeBase = {
            'تحصیلات': {
                patterns: ['تحصیلات', 'مدرک', 'دانشگاه', 'رشته', 'آموزش'],
                response: `🎓 **سوابق تحصیلی رامین اجلال:**

• **کارشناسی ارشد هوش مصنوعی** - دانشگاه تهران (معدل: ۱۹.۲)
• **کارشناسی مهندسی کامپیوتر** - دانشگاه صنعتی شریف (معدل: ۱۸.۷)
• **دیپلم ریاضی فیزیک** - مدرسه تیزهوشان علامه حلی (معدل: ۱۹.۸)

**دوره‌های تخصصی تکمیلی:**
- دوره پیشرفته Machine Learning - دانشگاه استنفورد (Grade: A+)
- دوره تخصصی NLP - deeplearning.ai (Certification)
- دوره سیستم‌های توزیع‌شده - MIT OpenCourseWare
- دوره کلود کامپیوتینگ - AWS Academy`
            },
            'تخصص': {
                patterns: ['تخصص', 'مهارت', 'توانایی', 'فنی', 'قابلیت'],
                response: `💻 **تخصص‌های فنی رامین اجلال:**

**هوش مصنوعی و یادگیری ماشین:**
• پردازش زبان طبیعی (NLP) فارسی و انگلیسی
• بینایی کامپیوتر و پردازش تصویر
• سیستم‌های توصیه‌گر پیشرفته
• مدل‌های زبانی بزرگ (LLMs)

**توسعه نرم‌افزار:**
• معماری سیستم‌های توزیع‌شده
• توسعه API های مقیاس‌پذیر
• پایگاه‌های داده NoSQL و SQL
• میکروسرویس و کانتینر

**فناوری‌های ابری:**
• AWS, Google Cloud, Azure
• Kubernetes و Docker
• DevOps و CI/CD`
            },
            'دستاوردها': {
                patterns: ['دستاورد', 'پروژه', 'کارنامه', 'پورتفولیو', 'تجربیات', 'موفقیت'],
                response: `🏆 **دستاوردها و پروژه‌های شاخص رامین اجلال:**

**پروژه‌های هوش مصنوعی:**
• توسعه سیستم پردازش زبان فارسی با دقت ۹۴٪
• طراحی معماری سیستم توصیه‌گر برای پلتفرم تجارت الکترونیک
• پیاده‌سازی مدل‌های طبقه‌بندی متون با BERT فارسی
• ساخت چت‌بات هوشمند با قابلیت درک context

**پروژه‌های نرم‌افزاری:**
• طراحی سیستم توزیع‌شده با قابلیت سرویس دهی به ۱۰۰۰۰ کاربر همزمان
• توسعه فریمورک داخلی برای مدیریت pipeline های داده
• بهینه‌سازی عملکرد پایگاه‌های داده NoSQL
• پیاده‌سازی سیستم real-time analytics

**مقالات و پژوهش‌ها:**
• ارائه مقاله در کنفرانس بین‌المللی هوش مصنوعی
• پژوهش در زمینه بهینه‌سازی الگوریتم‌های یادگیری ماشین
• مشارکت در پروژه‌های متن‌باز حوزه NLP
• توسعه کتابخانه‌های تخصصی پردازش زبان فارسی`
            },
            'سوابق': {
                patterns: ['سوابق', 'کاری', 'تجربه', 'شغلی', 'کار'],
                response: `💼 **سوابق کاری و تجربیات حرفه‌ای:**

**سابقه کاری:**
• مدیر فنی در استارتاپ فناوری (۱۴۰۰-۱۴۰۲)
• مهندس ارشد نرم‌افزار در شرکت بین‌المللی (۱۳۹۸-۱۴۰۰)
• توسعه دهنده full-stack در پروژه‌های freelancing (۱۳۹۶-۱۳۹۸)

**مسئولیت‌های کلیدی:**
• راهبری تیم‌های توسعه ۸ نفره
• طراحی معماری سیستم‌های enterprise
• بهینه‌سازی عملکرد و مقیاس‌پذیری
• مدیریت پروژه‌های agile`
            },
            'معرفی': {
                patterns: ['تو کیستی', 'معرفی کن', 'چکار می‌کنی', 'کاربرد'],
                response: `🧠 **من سیستم نطق مصطلح - نسخه استدلال‌گر هستم**

**ویژگی‌های اصلی:**
• سیستم هوش مصنوعی تخصصی با تمرکز بر پردازش زبان فارسی
• پایگاه دانش ساختاریافته و سلسله‌مراتبی
• الگوریتم‌های پیشرفته تشخیص و پاسخ‌دهی
• خودآگاهی و تشخیص مرزهای دانش
• **قابلیت حل مسئله و یادگیری پویا**

**حوزه‌های تخصصی:**
🎓 اطلاعات تحصیلی و تخصصی
💻 مهارت‌های فنی و تکنولوژی
💼 تجربیات کاری و پروژه‌ها
🏆 دستاوردها و موفقیت‌ها
🔢 حل مسائل ریاضی و منطقی

**یادگیری:** من می‌توانم مسائل جدید را حل کنم و راه‌حل‌ها را در حافظه ذخیره کنم!

چه سوال تخصصی دارید؟`
            }
        };

        // پیدا کردن بهترین پاسخ بر اساس سوال
        let bestResponse = null;
        let maxScore = 0;
        let bestCategory = null;

        for (const [category, data] of Object.entries(knowledgeBase)) {
            let score = 0;
            for (const pattern of data.patterns) {
                if (question.toLowerCase().includes(pattern)) {
                    score += pattern.length;
                }
            }
            if (score > maxScore) {
                maxScore = score;
                bestResponse = data.response;
                bestCategory = category;
            }
        }

        const defaultResponse = `🤔 **سوال شما:** "${question}"

💡 **پاسخ تخصصی:**
برای دریافت اطلاعات دقیق‌تر، لطفاً سوال خود را در یکی از این حوزه‌ها مطرح کنید:

🎓 **تحصیلات و مدارک**
💻 **تخصص‌های فنی**  
💼 **سوابق کاری**
🏆 **پروژه‌ها و دستاوردها**
🔢 **حل مسائل ریاضی و منطقی**
🤖 **معرفی سیستم**

من با افتخار محدودیت‌های دانش خود را می‌شناسم و می‌توانم مسائل جدید را یاد بگیرم و حل کنم!`;

        return {
            status: 'success',
            question: question,
            answer: bestResponse || defaultResponse,
            confidence: bestResponse ? 0.9 : 0.7,
            analysis: {
                relevance: relevanceAnalysis,
                quality: qualityAnalysis
            },
            domain: relevanceAnalysis.domain?.name || 'عمومی',
            category: bestCategory
        };
    }

    async getSystemStats() {
        const learningStats = this.knowledgeBoundary.getLearningStatistics();
        
        return {
            version: '5.0.0-reasoning',
            capabilities: [
                'خودآگاهی پیشرفته',
                'تشخیص مرزهای دانش', 
                'حل مسائل ریاضی',
                'استدلال منطقی',
                'تشخیص الگو',
                'یادگیری پویا',
                'ذخیره دانش اکتسابی'
            ],
            learningStatistics: learningStats,
            totalConversations: this.conversationHistory.length,
            activeDomains: Object.keys(this.knowledgeBoundary.domains)
        };
    }
}

export default SelfAwareAISystem;
