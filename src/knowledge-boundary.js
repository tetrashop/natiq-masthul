/**
 * سیستم تشخیص مرزهای دانش و خودآگاهی - نسخه بهبود یافته
 */

export class KnowledgeBoundary {
    constructor() {
        this.domains = this.defineKnowledgeDomains();
        this.rejectionThreshold = 0.1; // کاهش آستانه برای پذیرش سوالات بیشتر
    }

    defineKnowledgeDomains() {
        return {
            'ramin-ejlal': {
                name: 'اطلاعات تخصصی رامین اجلال',
                patterns: [
                    'رامین', 'اجلال', 'تحصیلات', 'مدرک', 'دانشگاه',
                    'تخصص', 'مهارت', 'سوابق', 'کار', 'تجربیات',
                    'دستاورد', 'پروژه', 'تحقیق', 'مقاله', 'پژوهش',
                    'کارنامه', 'پورتفولیو', 'موفقیت'
                ]
            },
            'ai-system': {
                name: 'معرفی سیستم هوش مصنوعی',
                patterns: [
                    'سیستم', 'هوش مصنوعی', 'کاربرد', 'قابلیت',
                    'چکار می‌کنی', 'تو کیستی', 'معرفی کن', 'کار'
                ]
            },
            'problem-solving': {
                name: 'حل مسئله و استدلال',
                patterns: [
                    'محاسبه کن', 'حل کن', 'مسئله', 'ریاضی', 'جمع', 'تفریق',
                    'ضرب', 'تقسیم', 'معادله', 'محاسبه', 'چند میشود', 'حاصل',
                    'منطقی', 'استدلال', 'اگر آنگاه', 'الگو', 'دنباله',
                    'پترن', 'قاعده', 'فرمول', 'عدد', 'اعداد'
                ]
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
                    domainScore += 0.5; // افزایش امتیاز برای تطابق
                    domainMatches.push(pattern);
                }
            }

            if (domainScore > maxScore) {
                maxScore = domainScore;
                bestDomain = domain;
                matchedPatterns = domainMatches;
            }
        }

        // اگر سوال شامل اعداد است، آن را مرتبط در نظر بگیر
        const hasNumbers = /\d+/.test(question);
        if (hasNumbers && maxScore < 0.5) {
            maxScore = 0.6;
            bestDomain = this.domains['problem-solving'];
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

    generateIntelligentRejection(question, analysis) {
        return {
            status: 'out_of_scope',
            answer: `🧠 **درک محدودیت‌ها نشانه خرد است**

سوال شما: "${question}"

من متوجه شدم این سوال خارج از حوزه تخصصی من است. من یک سیستم تخصصی هستم که در این زمینه‌ها می‌توانم کمک کنم:

🎓 **اطلاعات تخصصی درباره رامین اجلال**
• تحصیلات، مهارت‌ها و سوابق کاری
• پروژه‌ها و دستاوردهای تخصصی

🔢 **حل مسائل محاسباتی**
• مسائل ریاضی ساده (جمع، تفریق، ضرب، تقسیم)
• تشخیص الگوهای عددی
• استدلال‌های منطقی پایه

🤖 **معرفی سیستم و قابلیت‌ها**
• کاربردهای این سیستم هوش مصنوعی
• راهنمایی استفاده از سیستم

**صداقت در ندانستن، از دانستن نادرست شرافتمندانه‌تر است.**`,
            confidence: 0.05,
            analysis: analysis,
            suggestion: 'لطفاً سوال خود را در حوزه‌های ذکر شده مطرح کنید'
        };
    }
}

/**
 * سیستم اصلی با قابلیت استدلال ساده
 */
export class SelfAwareAISystem {
    constructor() {
        this.knowledgeBoundary = new KnowledgeBoundary();
    }

    async processQuestion(question) {
        const relevanceAnalysis = await this.knowledgeBoundary.analyzeQuestionRelevance(question);
        
        if (!relevanceAnalysis.relevant) {
            return this.knowledgeBoundary.generateIntelligentRejection(question, relevanceAnalysis);
        }

        // اگر سوال مرتبط با حل مسئله است
        if (relevanceAnalysis.domain?.name === 'حل مسئله و استدلال') {
            return await this.solveProblem(question);
        }

        return await this.processKnowledgeQuestion(question, relevanceAnalysis);
    }

    async solveProblem(question) {
        try {
            const numbers = question.match(/\d+/g)?.map(Number) || [];
            
            if (question.includes('جمع') || question.includes('+') || numbers.length >= 2) {
                const result = numbers.reduce((a, b) => a + b, 0);
                return {
                    status: 'solved',
                    answer: `🔢 **حل مسئله ریاضی:**

سوال: "${question}"

مراحل حل:
${numbers.map((num, i) => `• عدد ${i+1}: ${num}`).join('\n')}
• جمع: ${numbers.join(' + ')} = **${result}**

✅ مسئله با موفقیت حل شد!`,
                    confidence: 0.9,
                    result: result,
                    learned: false
                };
            }
            else if (question.includes('ضرب') || question.includes('*') || question.includes('×')) {
                const result = numbers.reduce((a, b) => a * b, 1);
                return {
                    status: 'solved',
                    answer: `🔢 **حل مسئله ریاضی:**

سوال: "${question}"

مراحل حل:
${numbers.map((num, i) => `• عدد ${i+1}: ${num}`).join('\n')}
• ضرب: ${numbers.join(' × ')} = **${result}**

✅ مسئله با موفقیت حل شد!`,
                    confidence: 0.9,
                    result: result,
                    learned: false
                };
            }
            else if (question.includes('تفریق') || question.includes('-')) {
                if (numbers.length >= 2) {
                    const result = numbers[0] - numbers[1];
                    return {
                        status: 'solved',
                        answer: `🔢 **حل مسئله ریاضی:**

سوال: "${question}"

• تفریق: ${numbers[0]} - ${numbers[1]} = **${result}**

✅ مسئله با موفقیت حل شد!`,
                        confidence: 0.9,
                        result: result,
                        learned: false
                    };
                }
            }
            else if (numbers.length >= 3 && question.includes('دنباله')) {
                // تشخیص الگوی ساده
                const differences = [];
                for (let i = 1; i < numbers.length; i++) {
                    differences.push(numbers[i] - numbers[i-1]);
                }
                
                if (differences.every(diff => diff === differences[0])) {
                    const nextNumber = numbers[numbers.length - 1] + differences[0];
                    return {
                        status: 'solved',
                        answer: `🔍 **تشخیص الگو:**

سوال: "${question}"

الگو تشخیص داده شده: **جمع ${differences[0]}**

دنباله: ${numbers.join(', ')} → **${nextNumber}**

عدد بعدی: **${nextNumber}**

✅ الگو با موفقیت تشخیص داده شد!`,
                        confidence: 0.8,
                        result: nextNumber,
                        learned: false
                    };
                }
            }
            else if (numbers.length >= 2) {
                // اگر اعداد وجود دارند اما عملگر مشخص نیست، جمع می‌کنیم
                const result = numbers.reduce((a, b) => a + b, 0);
                return {
                    status: 'solved',
                    answer: `🔢 **حل مسئله ریاضی:**

سوال: "${question}"

من این سوال را به عنوان جمع تفسیر کردم:

${numbers.map((num, i) => `• عدد ${i+1}: ${num}`).join('\n')}
• جمع: ${numbers.join(' + ')} = **${result}**

✅ مسئله با موفقیت حل شد!`,
                    confidence: 0.7,
                    result: result,
                    learned: false
                };
            }

            return {
                status: 'cannot_solve',
                answer: `❌ **نمی‌توانم این مسئله را حل کنم:**

سوال: "${question}"

متأسفانه نمی‌توانم این نوع مسئله را حل کنم. من می‌توانم:

• محاسبات ریاضی ساده (جمع، تفریق، ضرب، تقسیم)
• تشخیص الگوهای عددی ساده
• استدلال‌های منطقی پایه

لطفاً سوال خود را ساده‌تر بیان کنید.`,
                confidence: 0.3
            };

        } catch (error) {
            return {
                status: 'error',
                answer: `❌ **خطا در حل مسئله:**

متأسفانه در حین حل مسئله خطایی رخ داد.

خطا: ${error.message}

لطفاً سوال خود را دوباره بررسی کنید.`,
                confidence: 0.1
            };
        }
    }

    async processKnowledgeQuestion(question, relevanceAnalysis) {
        const knowledgeBase = {
            'تحصیلات': {
                patterns: ['تحصیلات', 'مدرک', 'دانشگاه', 'رشته', 'آموزش'],
                response: `🎓 **سوابق تحصیلی رامین اجلال:**

• **کارشناسی ارشد هوش مصنوعی** - دانشگاه تهران
• **کارشناسی مهندسی کامپیوتر** - دانشگاه صنعتی شریف  
• **دیپلم ریاضی فیزیک** - مدرسه تیزهوشان علامه حلی`
            },
            'تخصص': {
                patterns: ['تخصص', 'مهارت', 'توانایی', 'فنی', 'قابلیت'],
                response: `💻 **تخصص‌های فنی رامین اجلال:**

**هوش مصنوعی و یادگیری ماشین:**
• پردازش زبان طبیعی (NLP)
• بینایی کامپیوتر و پردازش تصویر
• سیستم‌های توصیه‌گر

**توسعه نرم‌افزار:**
• معماری سیستم‌های توزیع‌شده
• توسعه API های مقیاس‌پذیر
• پایگاه‌های داده NoSQL و SQL`
            },
            'دستاوردها': {
                patterns: ['دستاورد', 'پروژه', 'کارنامه', 'پورتفولیو', 'تجربیات'],
                response: `🏆 **دستاوردها و پروژه‌های شاخص:**

**پروژه‌های هوش مصنوعی:**
• توسعه سیستم پردازش زبان فارسی
• طراحی سیستم توصیه‌گر
• پیاده‌سازی مدل‌های طبقه‌بندی متون

**پروژه‌های نرم‌افزاری:**
• طراحی سیستم توزیع‌شده
• توسعه فریمورک مدیریت داده
• بهینه‌سازی پایگاه‌های داده`
            },
            'معرفی': {
                patterns: ['تو کیستی', 'معرفی کن', 'چکار می‌کنی', 'کاربرد'],
                response: `🧠 **من سیستم نطق مصطلح - نسخه استدلال‌گر هستم**

**ویژگی‌های اصلی:**
• سیستم هوش مصنوعی تخصصی
• پردازش زبان فارسی
• خودآگاهی و تشخیص مرزهای دانش
• **قابلیت حل مسائل ریاضی و تشخیص الگو**

**حوزه‌های تخصصی:**
🎓 اطلاعات تحصیلی و تخصصی
💻 مهارت‌های فنی
🏆 پروژه‌ها و دستاوردها
🔢 حل مسائل ریاضی

من می‌توانم مسائل ریاضی ساده را حل کنم و الگوهای عددی را تشخیص دهم!`
            }
        };

        let bestResponse = null;
        let maxScore = 0;

        for (const [category, data] of Object.entries(knowledgeBase)) {
            let score = 0;
            for (const pattern of data.patterns) {
                if (question.toLowerCase().includes(pattern)) {
                    score += 1;
                }
            }
            if (score > maxScore) {
                maxScore = score;
                bestResponse = data.response;
            }
        }

        const defaultResponse = `🤔 **سوال شما:** "${question}"

💡 **پاسخ تخصصی:**
برای اطلاعات دقیق‌تر، لطفاً در یکی از این حوزه‌ها سوال کنید:

🎓 تحصیلات و مدارک
💻 تخصص‌های فنی  
🏆 پروژه‌ها و دستاوردها
🔢 حل مسائل ریاضی
🤖 معرفی سیستم

من می‌توانم مسائل ریاضی ساده را حل کنم!`;

        return {
            status: 'success',
            question: question,
            answer: bestResponse || defaultResponse,
            confidence: bestResponse ? 0.9 : 0.7,
            analysis: relevanceAnalysis
        };
    }
}
