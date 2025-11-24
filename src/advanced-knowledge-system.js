class AdvancedKnowledgeSystem {
    constructor() {
        this.knowledgeBase = this.initializeComprehensiveKnowledge();
        this.conversationContext = new Map();
    }

    initializeComprehensiveKnowledge() {
        return {
            persons: {
                "رامین اجلال": {
                    full_name: "رامین اجلال",
                    title: "توسعه‌دهنده و محقق هوش مصنوعی",
                    bio: "متخصص در حوزه پردازش زبان فارسی و سیستم‌های هوش مصنوعی با تمرکز بر توسعه راه‌حل‌های بومی",
                    
                    education: {
                        background: "فعال در حوزه فناوری اطلاعات و هوش مصنوعی",
                        expertise_areas: [
                            "پردازش زبان طبیعی فارسی",
                            "هوش مصنوعی و یادگیری ماشین", 
                            "توسعه سیستم‌های توزیع‌شده",
                            "معماری نرم‌افزارهای مقیاس‌پذیر"
                        ]
                    },
                    
                    achievements: [
                        "توسعه سیستم نطق مصطلح - پلتفرم هوشمند پردازش دانش",
                        "تحقیق و توسعه در زمینه پردازش زبان طبیعی فارسی",
                        "طراحی معماری‌های مقیاس‌پذیر برای سیستم‌های هوش مصنوعی",
                        "همکاری در پروژه‌های متن‌باز مرتبط با هوش مصنوعی فارسی",
                        "ایجاد سیستم‌های پردازش دانش چندمنظوره"
                    ],
                    
                    projects: [
                        {
                            name: "نطق مصطلح",
                            description: "سیستم هوشمند پردازش دانش با قابلیت درک و پاسخ به سوالات پیچیده",
                            technologies: ["Node.js", "NLP", "AI", "Machine Learning"],
                            status: "فعال"
                        },
                        {
                            name: "پردازش زبان فارسی",
                            description: "تحقیق و توسعه در زمینه پردازش زبان طبیعی فارسی",
                            technologies: ["Python", "TensorFlow", "NLP"],
                            status: "در حال توسعه"
                        }
                    ],
                    
                    technical_skills: {
                        programming: ["JavaScript", "Python", "Node.js", "React"],
                        ai_ml: ["TensorFlow", "PyTorch", "NLP", "Computer Vision"],
                        databases: ["MongoDB", "PostgreSQL", "Redis"],
                        devops: ["Docker", "Kubernetes", "AWS", "Vercel"]
                    },
                    
                    research_interests: [
                        "پردازش زبان طبیعی فارسی",
                        "هوش مصنوعی تفسیرپذیر", 
                        "سیستم‌های استدلال خودکار",
                        "معماری‌های شناختی",
                        "یادگیری عمیق"
                    ]
                }
            },
            
            topics: {
                "هوش مصنوعی": {
                    definition: "هوش مصنوعی شاخه‌ای از علوم کامپیوتر است که به ایجاد ماشین‌های هوشمند می‌پردازد",
                    applications: [
                        "پردازش زبان طبیعی",
                        "بینایی کامپیوتر", 
                        "سیستم‌های توصیه‌گر",
                        "خودروهای خودران",
                        "تشخیص پزشکی"
                    ],
                    technologies: ["یادگیری ماشین", "یادگیری عمیق", "شبکه‌های عصبی"],
                    trends: ["هوش مصنوعی تولیدی", "AI اخلاقی", "هوش مصنوعی تفسیرپذیر"]
                },
                
                "پردازش زبان طبیعی": {
                    definition: "زیرشاخه‌ای از هوش مصنوعی که به تعامل بین کامپیوتر و زبان انسان می‌پردازد",
                    applications: [
                        "دستیاران صوتی",
                        "ترجمه ماشینی",
                        "تحلیل احساسات",
                        "چت‌بات‌های هوشمند",
                        "خلاصه‌سازی متن"
                    ],
                    challenges: [
                        "پردازش زبان‌های با منابع محدود مانند فارسی",
                        "درک زمینه و مفهوم",
                        "مدیریت ابهام در زبان"
                    ]
                }
            },
            
            articles: {
                templates: {
                    person_introduction: `
# معرفی {name}

## زمینه فعالیت
{background}

## تخصص‌ها و مهارت‌ها
{expertise}

## پروژه‌های شاخص
{projects}

## دستاوردها
{achievements}

## حوزه‌های تحقیقاتی
{research}

*این مقاله به صورت خودکار توسط سیستم نطق مصطلح تولید شده است.*
                    `,
                    
                    technology_overview: `
# بررسی جامع {topic}

## تعریف
{definition}

## کاربردها
{applications}

## فناوری‌های مرتبط
{technologies}

## چالش‌ها و فرصت‌ها
{challenges}

## آینده‌نگاری
{trends}

*منبع: سیستم دانش نطق مصطلح*
                    `
                }
            }
        };
    }

    // تحلیل پیشرفته سوال
    analyzeQuestion(question, context = {}) {
        const analysis = {
            original: question,
            normalized: this.normalizeText(question),
            entities: this.extractEntities(question),
            intent: this.detectIntent(question),
            context: context,
            requires_follow_up: false,
            confidence: 0.8
        };

        // بهبود تشخیص هدف
        analysis.intent = this.refineIntent(analysis);
        
        // بررسی نیاز به اطلاعات بیشتر
        analysis.requires_follow_up = this.needsClarification(analysis);
        
        // محاسبه اعتماد
        analysis.confidence = this.calculateConfidence(analysis);

        return analysis;
    }

    normalizeText(text) {
        const corrections = {
            "رامین اجلال": "رامین اجلال",
            "همسرش": "همسر",
            "مقاله بنویس": "مقاله",
            "هوش مصنوعی": "هوش مصنوعی",
            "دستاورد": "دستاورد",
            "تخصص": "تخصص"
        };

        let normalized = text;
        for (const [wrong, correct] of Object.entries(corrections)) {
            normalized = normalized.replace(new RegExp(wrong, 'gi'), correct);
        }
        return normalized;
    }

    extractEntities(text) {
        const entities = {
            persons: [],
            topics: [],
            actions: [],
            attributes: []
        };

        // تشخیص افراد
        if (text.includes("رامین") || text.includes("اجلال")) {
            entities.persons.push("رامین اجلال");
        }

        // تشخیص موضوعات
        const topics = ["هوش مصنوعی", "پردازش زبان", "مقاله", "دستاورد", "تخصص"];
        topics.forEach(topic => {
            if (text.includes(topic)) {
                entities.topics.push(topic);
            }
        });

        // تشخیص اقدامات
        if (text.includes("بنویس") || text.includes("مقاله")) {
            entities.actions.push("generate_article");
        }
        if (text.includes("کیست") || text.includes("معرفی")) {
            entities.actions.push("introduce");
        }
        if (text.includes("دستاورد") || text.includes("کار")) {
            entities.actions.push("list_achievements");
        }

        // تشخیص صفات (برای فیلتر کردن)
        if (text.includes("همسر") || text.includes("خانواده")) {
            entities.attributes.push("personal");
        }

        return entities;
    }

    detectIntent(text) {
        const normalized = text.toLowerCase();

        if (normalized.includes("مقاله بنویس")) {
            if (normalized.includes("رامین")) {
                return "generate_person_article";
            }
            if (normalized.includes("هوش مصنوعی")) {
                return "generate_topic_article";
            }
            return "generate_article";
        }

        if (normalized.includes("رامین") && normalized.includes("کیست")) {
            return "person_introduction";
        }

        if (normalized.includes("دستاورد")) {
            return "person_achievements";
        }

        if (normalized.includes("تخصص") || normalized.includes("مهارت")) {
            return "person_expertise";
        }

        if (normalized.includes("همسر") || normalized.includes("خانواده")) {
            return "personal_inquiry";
        }

        return "general_inquiry";
    }

    refineIntent(analysis) {
        const { intent, entities } = analysis;

        // اگر سوال شخصی است اما اطلاعات نداریم
        if (intent === "personal_inquiry") {
            return "privacy_respect";
        }

        // اگر درخواست مقاله است اما موضوع مشخص نیست
        if (intent === "generate_article" && entities.topics.length === 0) {
            return "need_article_topic";
        }

        return intent;
    }

    needsClarification(analysis) {
        const { intent, entities } = analysis;

        if (intent === "generate_article" && entities.topics.length === 0) {
            return true;
        }

        if (intent === "general_inquiry" && entities.persons.length === 0) {
            return true;
        }

        return false;
    }

    calculateConfidence(analysis) {
        let confidence = 0.7;

        if (analysis.entities.persons.length > 0) confidence += 0.2;
        if (analysis.entities.actions.length > 0) confidence += 0.1;
        if (analysis.intent !== "general_inquiry") confidence += 0.1;

        return Math.min(confidence, 0.95);
    }

    // تولید پاسخ هوشمند
    generateResponse(analysis) {
        switch (analysis.intent) {
            case "person_introduction":
                return this.generatePersonIntroduction();

            case "person_achievements":
                return this.generateAchievementsList();

            case "person_expertise":
                return this.generateExpertiseList();

            case "generate_person_article":
                return this.generatePersonArticle();

            case "generate_topic_article":
                return this.generateTopicArticle("هوش مصنوعی");

            case "privacy_respect":
                return this.generatePrivacyResponse();

            case "need_article_topic":
                return this.requestArticleTopic();

            default:
                return this.generateIntelligentDefault(analysis);
        }
    }

    generatePersonIntroduction() {
        const person = this.knowledgeBase.persons["رامین اجلال"];
        return `👤 **معرفی ${person.full_name}**

🏢 **سمت:** ${person.title}
📚 **زمینه فعالیت:** ${person.bio}

🎯 **حوزه‌های تخصصی:**
${person.education.expertise_areas.map(area => `• ${area}`).join('\n')}

🔧 **مهارت‌های فنی:**
• برنامه‌نویسی: ${person.technical_skills.programming.join(', ')}
• هوش مصنوعی: ${person.technical_skills.ai_ml.join(', ')}

💡 برای اطلاعات بیشتر می‌توانید در مورد دستاوردها یا پروژه‌ها سوال کنید.`;
    }

    generateAchievementsList() {
        const person = this.knowledgeBase.persons["رامین اجلال"];
        return `🏆 **دستاوردهای ${person.full_name}:**

${person.achievements.map((achievement, index) => 
    `${index + 1}. ${achievement}`
).join('\n')}

🚀 **پروژه‌های فعال:**
${person.projects.map(project => 
    `• **${project.name}:** ${project.description} (${project.status})`
).join('\n')}`;
    }

    generateExpertiseList() {
        const person = this.knowledgeBase.persons["رامین اجلال"];
        return `🎯 **تخصص‌ها و مهارت‌های ${person.full_name}:**

💻 **برنامه‌نویسی:**
${person.technical_skills.programming.map(skill => `• ${skill}`).join('\n')}

🧠 **هوش مصنوعی و یادگیری ماشین:**
${person.technical_skills.ai_ml.map(skill => `• ${skill}`).join('\n')}

🗄️ **پایگاه‌های داده:**
${person.technical_skills.databases.map(skill => `• ${skill}`).join('\n')}

⚙️ **DevOps:**
${person.technical_skills.devops.map(skill => `• ${skill}`).join('\n')}

🔬 **علاقه‌مندی‌های تحقیقاتی:**
${person.research_interests.map(interest => `• ${interest}`).join('\n')}`;
    }

    generatePersonArticle() {
        const person = this.knowledgeBase.persons["رامین اجلال"];
        const template = this.knowledgeBase.articles.templates.person_introduction;
        
        return template
            .replace('{name}', person.full_name)
            .replace('{background}', person.bio)
            .replace('{expertise}', person.education.expertise_areas.map(area => `- ${area}`).join('\n'))
            .replace('{projects}', person.projects.map(proj => `- **${proj.name}:** ${proj.description}`).join('\n'))
            .replace('{achievements}', person.achievements.map(ach => `- ${ach}`).join('\n'))
            .replace('{research}', person.research_interests.map(res => `- ${res}`).join('\n'));
    }

    generateTopicArticle(topic) {
        const topicData = this.knowledgeBase.topics[topic];
        if (!topicData) {
            return `❌ متأسفانه اطلاعات کافی در مورد "${topic}" در پایگاه دانش من موجود نیست.`;
        }

        const template = this.knowledgeBase.articles.templates.technology_overview;
        
        return template
            .replace(/{topic}/g, topic)
            .replace('{definition}', topicData.definition)
            .replace('{applications}', topicData.applications.map(app => `- ${app}`).join('\n'))
            .replace('{technologies}', topicData.technologies.map(tech => `- ${tech}`).join('\n'))
            .replace('{challenges}', (topicData.challenges || ['در حال توسعه']).map(ch => `- ${ch}`).join('\n'))
            .replace('{trends}', (topicData.trends || ['رشد سریع']).map(tr => `- ${tr}`).join('\n'));
    }

    generatePrivacyResponse() {
        return `🔒 **احترام به حریم شخصی**

من اطلاعات شخصی مانند وضعیت تأهل، اطلاعات خانوادگی یا سایر جزئیات شخصی افراد را ذخیره یا ارائه نمی‌دهم.

💡 **من می‌توانم در این زمینه‌ها کمک کنم:**
• اطلاعات حرفه‌ای و تخصصی
• دستاوردها و پروژه‌ها
• مهارت‌ها و زمینه‌های تحقیقاتی
• مقالات تخصصی

لطفاً سوال خود را در این حوزه‌ها مطرح کنید.`;
    }

    requestArticleTopic() {
        return `📝 **درخواست موضوع مقاله**

برای نوشتن مقاله، لطفاً موضوع مورد نظر خود را مشخص کنید:

🔹 **موضوعات پیشنهادی:**
• "مقاله‌ای در مورد رامین اجلال بنویس"
• "مقاله‌ای درباره هوش مصنوعی بنویس" 
• "مقاله‌ای در زمینه پردازش زبان طبیعی بنویس"
• "مقاله‌ای درباره پروژه نطق مصطلح بنویس"

💡 *من می‌توانم مقالات ساختاریافته و مبتنی بر دانش تولید کنم.*`;
    }

    generateIntelligentDefault(analysis) {
        const { entities } = analysis;
        
        if (entities.persons.length > 0) {
            return `🤔 **سوال شما درباره ${entities.persons[0]}**

لطفاً سوال خود را دقیق‌تر بیان کنید. من می‌توانم در مورد:

• معرفی و زمینه فعالیت
• دستاوردها و پروژه‌ها  
• تخصص‌ها و مهارت‌ها
• مقالات تخصصی

اطلاعات ارائه دهم.

💡 *مثال: "دستاوردهای رامین اجلال چیست؟" یا "مقاله‌ای درباره او بنویس"*`;
        }

        return `❓ **سوال شما نیاز به توضیح بیشتر دارد**

لطفاً سوال خود را با جزئیات بیشتر مطرح کنید. من می‌توانم در مورد:

👤 **اشخاص:** اطلاعات تخصصی و حرفه‌ای
🧠 **موضوعات فنی:** هوش مصنوعی، پردازش زبان
📝 **مقالات:** تولید محتوای ساختاریافته
🔧 **پروژه‌ها:** اطلاعات فنی و تخصصی

کمک کنم.

🎯 *برای شروع می‌توانید از دکمه‌های سریع استفاده کنید.*`;
    }
}

module.exports = AdvancedKnowledgeSystem;
