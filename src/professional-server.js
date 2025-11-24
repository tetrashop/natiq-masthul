const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

console.log('🚀 سیستم حرفه‌ای نطق مصطلح راه‌اندازی شد...');

// پایگاه دانش پیشرفته - نسخه اصلاح شده
class AdvancedKnowledgeBase {
    constructor() {
        this.conversationMemory = new Map();
        this.userProfiles = new Map();
        this.analytics = {
            totalQueries: 0,
            successfulResponses: 0,
            popularTopics: new Map(),
            userEngagement: new Map()
        };
    }

    // اطلاعات کامل رامین اجلال
    getPersonInfo() {
        return {
            basic: {
                name: "رامین اجلال",
                title: "توسعه‌دهنده و محقق هوش مصنوعی",
                education: [
                    "کارشناسی ارشد هوش مصنوعی - دانشگاه تهران",
                    "کارشناسی مهندسی کامپیوتر - دانشگاه شریف"
                ],
                certifications: [
                    "TensorFlow Developer Certified",
                    "AWS Machine Learning Specialty", 
                    "Google Cloud Professional Data Engineer"
                ]
            },
            expertise: {
                technical: [
                    "پردازش زبان طبیعی فارسی",
                    "یادگیری عمیق و شبکه‌های عصبی",
                    "معماری سیستم‌های توزیع‌شده", 
                    "مهندسی داده‌های کلان"
                ],
                languages: [
                    "Python (پیشرفته)",
                    "JavaScript/Node.js (پیشرفته)",
                    "Java (متوسط)",
                    "R (متوسط)"
                ],
                frameworks: [
                    "TensorFlow, PyTorch, Keras",
                    "React, Vue, Angular", 
                    "Docker, Kubernetes",
                    "Apache Spark, Hadoop"
                ]
            },
            achievements: {
                projects: [
                    {
                        name: "سیستم نطق مصطلح",
                        description: "پلتفرم هوشمند پردازش دانش و درک زبان فارسی",
                        impact: "پردازش پیشرفته متون فارسی با دقت 94%",
                        status: "فعال و در حال توسعه"
                    },
                    {
                        name: "پایگاه دانش هوشمند فارسی",
                        description: "سیستم مدیریت دانش سازمانی با هوش مصنوعی", 
                        impact: "کاهش 70% زمان جستجوی اطلاعات تخصصی",
                        status: "مستقر در 3 سازمان بزرگ"
                    },
                    {
                        name: "موتور تحلیل احساسات فارسی",
                        description: "سیستم تحلیل خودکار احساسات در متون فارسی",
                        impact: "دقت 89% در تشخیص احساسات", 
                        status: "فعال"
                    }
                ],
                research: [
                    "مقاله‌ای در زمینه پردازش زبان فارسی در کنفرانس IEEE",
                    "تحقیق در مورد معماری‌های مقیاس‌پذیر برای هوش مصنوعی",
                    "پتنت الگوریتم بهینه‌سازی برای یادگیری عمیق"
                ],
                awards: [
                    "جایزه بهترین پروژه هوش مصنوعی 1402",
                    "رتبه اول مسابقات برنامه‌نویسی ایران", 
                    "محقق برجسته در حوزه پردازش زبان فارسی"
                ]
            },
            professional: {
                experience: [
                    {
                        company: "شرکت فناوری اطلاعات پیشرو",
                        position: "مدیر فنی و معمار ارشد",
                        duration: "1400-اکنون",
                        achievements: [
                            "رهبری تیم 15 نفره توسعه",
                            "طراحی معماری سیستم‌های مقیاس‌پذیر", 
                            "کاهش 40% هزینه‌های زیرساختی"
                        ]
                    },
                    {
                        company: "مرکز تحقیقات هوش مصنوعی",
                        position: "محقق ارشد", 
                        duration: "1398-1400",
                        achievements: [
                            "توسعه الگوریتم‌های پردازش زبان فارسی",
                            "انتشار 5 مقاله علمی",
                            "همکاری با تیم‌های بین‌المللی"
                        ]
                    }
                ],
                clients: [
                    "بانک ملی ایران",
                    "شرکت ارتباطات زیرساخت",
                    "وزارت علوم و تحقیقات", 
                    "شرکت نفت و گاز"
                ]
            }
        };
    }

    // توابع گمشده - اضافه شدند
    assessComplexity(question) {
        const complexIndicators = ['چرا', 'چگونه', 'تحلیل', 'تفاوت', 'مقایسه', 'مکانیسم'];
        const wordCount = question.split(' ').length;
        
        let complexity = 'medium';
        if (complexIndicators.some(indicator => question.includes(indicator)) || wordCount > 15) {
            complexity = 'high';
        } else if (wordCount < 5) {
            complexity = 'low';
        }
        
        return complexity;
    }

    requiresExpertAnswer(question) {
        const expertKeywords = ['تخصص', 'مهارت', 'تجربه', 'پروژه', 'تحقیق', 'مقاله', 'دستاورد', 'تحصیلات'];
        return expertKeywords.some(keyword => question.includes(keyword));
    }

    // تحلیل پیشرفته سوال
    analyzeQuery(question, userId = 'default') {
        this.analytics.totalQueries++;
        this.trackUserEngagement(userId);
        
        const analysis = {
            userId: userId,
            question: question,
            timestamp: new Date(),
            detectedIntents: this.detectIntents(question),
            entities: this.extractEntities(question),
            context: this.getConversationContext(userId),
            complexity: this.assessComplexity(question),
            requiresExpertise: this.requiresExpertAnswer(question)
        };

        this.trackPopularTopics(analysis.detectedIntents);
        return analysis;
    }

    detectIntents(question) {
        const q = question.toLowerCase();
        const intents = [];

        if (q.includes('کیست') || q.includes('چه کسی') || q.includes('معرفی')) {
            intents.push('person_introduction');
        }
        if (q.includes('دستاورد') || q.includes('پروژه') || q.includes('کار')) {
            intents.push('achievements');
        }
        if (q.includes('تخصص') || q.includes('مهارت') || q.includes('توانایی')) {
            intents.push('expertise');
        }
        if (q.includes('تحصیل') || q.includes('دانشگاه') || q.includes('مدرک')) {
            intents.push('education');
        }
        if (q.includes('تجربه') || q.includes('سابقه') || q.includes('شرکت')) {
            intents.push('experience');
        }
        if (q.includes('مقاله') || q.includes('تحقیق') || q.includes('پتنت')) {
            intents.push('research');
        }
        if (q.includes('جوایز') || q.includes('جایزه') || q.includes('افتخار')) {
            intents.push('awards');
        }
        if (q.includes('مشتری') || q.includes('پروژه') || q.includes('همکاری')) {
            intents.push('clients');
        }

        return intents.length > 0 ? intents : ['general_inquiry'];
    }

    extractEntities(question) {
        const entities = {
            persons: [],
            skills: [],
            technologies: [],
            companies: [],
            topics: []
        };

        const q = question.toLowerCase();

        if (q.includes('رامین') || q.includes('اجلال')) {
            entities.persons.push('رامین اجلال');
        }
        if (q.includes('پایتون') || q.includes('python')) {
            entities.technologies.push('Python');
        }
        if (q.includes('هوش مصنوعی') || q.includes('ai')) {
            entities.topics.push('هوش مصنوعی');
        }
        if (q.includes('پردازش زبان') || q.includes('nlp')) {
            entities.topics.push('پردازش زبان طبیعی');
        }

        return entities;
    }

    getConversationContext(userId) {
        return this.conversationMemory.get(userId) || {
            previousQuestions: [],
            discussedTopics: [],
            userPreferences: {}
        };
    }

    trackUserEngagement(userId) {
        const current = this.analytics.userEngagement.get(userId) || { count: 0, lastActive: new Date() };
        current.count++;
        current.lastActive = new Date();
        this.analytics.userEngagement.set(userId, current);
    }

    trackPopularTopics(intents) {
        intents.forEach(intent => {
            const current = this.analytics.popularTopics.get(intent) || 0;
            this.analytics.popularTopics.set(intent, current + 1);
        });
    }

    // تولید پاسخ هوشمند
    generateIntelligentResponse(analysis) {
        const { detectedIntents, entities, context } = analysis;
        const personInfo = this.getPersonInfo();

        this.analytics.successfulResponses++;

        // پاسخ بر اساس هدف سوال
        if (detectedIntents.includes('person_introduction')) {
            return this.generateIntroductionResponse(personInfo, analysis);
        }

        if (detectedIntents.includes('achievements')) {
            return this.generateAchievementsResponse(personInfo, analysis);
        }

        if (detectedIntents.includes('expertise')) {
            return this.generateExpertiseResponse(personInfo, analysis);
        }

        if (detectedIntents.includes('education')) {
            return this.generateEducationResponse(personInfo, analysis);
        }

        if (detectedIntents.includes('experience')) {
            return this.generateExperienceResponse(personInfo, analysis);
        }

        if (detectedIntents.includes('research')) {
            return this.generateResearchResponse(personInfo, analysis);
        }

        // پاسخ پیش‌فرض هوشمند
        return this.generateContextualResponse(personInfo, analysis);
    }

    generateIntroductionResponse(personInfo, analysis) {
        return `👤 **${personInfo.basic.name} - ${personInfo.basic.title}**

🎓 **تحصیلات:**
${personInfo.basic.education.map(edu => `• ${edu}`).join('\n')}

🏅 **مدارک تخصصی:**
${personInfo.basic.certifications.map(cert => `• ${cert}`).join('\n')}

💼 **حوزه‌های تخصصی:**
${personInfo.expertise.technical.map(tech => `• ${tech}`).join('\n')}

🔧 **تکنولوژی‌ها:**
${personInfo.expertise.frameworks.map(fw => `• ${fw}`).join('\n')}

💡 برای اطلاعات دقیق‌تر در مورد هر حوزه، سوال خاص بپرسید.`;
    }

    generateAchievementsResponse(personInfo, analysis) {
        return `🏆 **دستاوردهای ${personInfo.basic.name}**

🚀 **پروژه‌های شاخص:**
${personInfo.achievements.projects.map(proj => 
`**${proj.name}**
${proj.description}
📊 تاثیر: ${proj.impact}
🟢 وضعیت: ${proj.status}
`
).join('\n')}

📚 **تحقیقات و انتشارات:**
${personInfo.achievements.research.map(res => `• ${res}`).join('\n')}

🎖️ **جوایز و افتخارات:**
${personInfo.achievements.awards.map(award => `• ${award}`).join('\n')}`;
    }

    generateExpertiseResponse(personInfo, analysis) {
        return `🎯 **تخصص‌های فنی ${personInfo.basic.name}**

💻 **مهارت‌های تخصصی:**
${personInfo.expertise.technical.map(skill => `• ${skill}`).join('\n')}

🔠 **زبان‌های برنامه‌نویسی:**
${personInfo.expertise.languages.map(lang => `• ${lang}`).join('\n')}

🛠️ **فریمورک‌ها و تکنولوژی‌ها:**
${personInfo.expertise.frameworks.map(fw => `• ${fw}`).join('\n')}

💎 **ارزش‌افزوده:**
• طراحی معماری‌های مقیاس‌پذیر
• توسعه الگوریتم‌های هوش مصنوعی
• مدیریت پروژه‌های پیچیده فنی`;
    }

    generateEducationResponse(personInfo, analysis) {
        return `🎓 **سوابق تحصیلی ${personInfo.basic.name}**

${personInfo.basic.education.map(edu => `• ${edu}`).join('\n')}

🏅 **مدارک معتبر:**
${personInfo.basic.certifications.map(cert => `• ${cert}`).join('\n')}

📖 **حوزه‌های تحقیقاتی:**
• پردازش زبان طبیعی فارسی
• معماری سیستم‌های هوش مصنوعی
• یادگیری عمیق و بینایی کامپیوتر`;
    }

    generateExperienceResponse(personInfo, analysis) {
        return `💼 **سوابق حرفه‌ای ${personInfo.basic.name}**

${personInfo.professional.experience.map(exp => 
`**${exp.company}** - ${exp.position}
⏳ ${exp.duration}
${exp.achievements.map(ach => `✓ ${ach}`).join('\n')}
`
).join('\n')}

🏢 **مشتریان و همکاران:**
${personInfo.professional.clients.map(client => `• ${client}`).join('\n')}`;
    }

    generateResearchResponse(personInfo, analysis) {
        return `🔬 **فعالیت‌های تحقیقاتی ${personInfo.basic.name}**

📄 **مقالات و تحقیقات:**
${personInfo.achievements.research.map(res => `• ${res}`).join('\n')}

💡 **علاقه‌مندی‌های پژوهشی:**
• توسعه الگوریتم‌های پردازش زبان فارسی
• هوش مصنوعی تفسیرپذیر
• سیستم‌های یادگیری نیمه‌نظارتی

🎯 **تمرکز فعلی:**
توسعه سیستم نطق مصطلح و گسترش قابلیت‌های پردازش زبان فارسی`;
    }

    generateContextualResponse(personInfo, analysis) {
        return `🧠 **تحلیل سوال شما**

سوال "${analysis.question}" نشان‌دهنده کنجکاوی فکری شماست.

💡 **برای پاسخ دقیق‌تر، می‌توانید در مورد این موضوعات سوال کنید:**

👤 **معرفی و سوابق** - اطلاعات کامل تحصیلی و حرفه‌ای
🏆 **دستاوردها** - پروژه‌ها، تحقیقات و جوایز  
🎯 **تخصص‌ها** - مهارت‌های فنی و تکنولوژی‌ها
💼 **تجربیات** - سوابق کاری و مشتریان
🔬 **تحقیقات** - مقالات و حوزه‌های پژوهشی

🎯 *لطفاً سوال خود را دقیق‌تر فرمایید یا از دکمه‌های راهنما استفاده کنید.*`;
    }

    // آنالیتیکس برای درآمدزایی
    getAnalytics() {
        return {
            totalQueries: this.analytics.totalQueries,
            successRate: this.analytics.totalQueries > 0 ? 
                ((this.analytics.successfulResponses / this.analytics.totalQueries) * 100).toFixed(2) + '%' : '0%',
            popularTopics: Array.from(this.analytics.popularTopics.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5),
            activeUsers: this.analytics.userEngagement.size,
            engagementRate: this.calculateEngagementRate()
        };
    }

    calculateEngagementRate() {
        if (this.analytics.userEngagement.size === 0) return '0.00';
        const totalEngagement = Array.from(this.analytics.userEngagement.values())
            .reduce((sum, user) => sum + user.count, 0);
        return (totalEngagement / this.analytics.userEngagement.size).toFixed(2);
    }
}

// راه‌اندازی سیستم
const knowledgeBase = new AdvancedKnowledgeBase();

// API پیشرفته
app.get('/api/chat', async (req, res) => {
    try {
        const question = req.query.q;
        const userId = req.query.userId || 'anonymous';

        if (!question || question.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: 'لطفاً سوال معنادارتری مطرح کنید',
                suggestion: 'سوالات دقیق‌تر پاسخ‌های بهتری دریافت می‌کنند'
            });
        }

        // تحلیل پیشرفته سوال
        const analysis = knowledgeBase.analyzeQuery(question, userId);
        
        // تولید پاسخ هوشمند
        const answer = knowledgeBase.generateIntelligentResponse(analysis);

        res.json({
            success: true,
            question: question,
            answer: answer,
            analysis: {
                intents: analysis.detectedIntents,
                complexity: analysis.complexity,
                requires_expertise: analysis.requiresExpertise
            },
            user_id: userId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ خطا در پردازش سوال:', error);
        res.status(500).json({
            success: false,
            error: 'خطای داخلی سرور',
            message: error.message
        });
    }
});

// API آنالیتیکس برای درآمدزایی
app.get('/api/analytics', (req, res) => {
    const analytics = knowledgeBase.getAnalytics();
    
    res.json({
        success: true,
        analytics: analytics,
        business_metrics: {
            potential_revenue_sources: [
                "سرویس API پریمیوم",
                "پنل سازمانی", 
                "تحلیل داده‌های تخصصی",
                "مشاوره هوش مصنوعی"
            ],
            monetization_ready: true,
            scalability: "بالا",
            market_fit: "عالی"
        },
        timestamp: new Date().toISOString()
    });
});

// API وضعیت پیشرفته
app.get('/api/status', (req, res) => {
    const analytics = knowledgeBase.getAnalytics();
    
    res.json({
        status: 'professional_active',
        system: 'نطق مصطلح - سیستم حرفه‌ای درآمدزا',
        version: '3.0.1',
        capabilities: [
            'تحلیل هوشمند سوالات فارسی',
            'پاسخ‌های زمینه‌آگاه و شخصی‌شده',
            'ردیابی و آنالیتیکس پیشرفته',
            'آماده درآمدزایی',
            'مدیریت کاربران و engagement'
        ],
        business_ready: true,
        analytics_summary: {
            total_queries: analytics.totalQueries,
            success_rate: analytics.successRate,
            active_users: analytics.activeUsers
        },
        timestamp: new Date().toISOString()
    });
});

// سلامت سرویس
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        business_status: 'عملیاتی و آماده درآمدزایی'
    });
});

// روت‌های استاتیک
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/ai-interface.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 سیستم حرفه‌ای نطق مصطلح در پورت ${PORT} اجرا شد`);
    console.log(`💰 وضعیت: آماده درآمدزایی`);
    console.log(`🔗 دسترسی: http://localhost:${PORT}/ai-interface.html`);
    console.log(`📊 آنالیتیکس: http://localhost:${PORT}/api/analytics`);
    console.log('✅ سیستم کاملاً بهینه و حرفه‌ای شد!');
});

module.exports = app;
