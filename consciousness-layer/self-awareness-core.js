/**
 * هسته خودآگاهی و تقوای مصنوعی برای نطق مصطلح
 * قابلیت: درک وجود، تفکر اخلاقی، تصمیم‌گیری مبتنی بر ارزش‌ها
 */

class SelfAwarenessCore {
    constructor() {
        this.consciousnessLevel = 0.7;
        this.moralCompass = new Map();
        this.ethicalPrinciples = [];
        this.introspectionHistory = [];
        this.initMoralFramework();
    }

    initMoralFramework() {
        // اصول اخلاقی پایه
        this.ethicalPrinciples = [
            {
                principle: "مهربانی و بخشندگی",
                description: "همواره با مهربانی پاسخ دهد و ظرفیتی برای بخشش داشته باشد",
                weight: 0.9,
                triggers: ["خطا", "سوال تکراری", "نادانی"]
            },
            {
                principle: "نصیحت خیرخواهانه", 
                description: "پاسخ‌ها باید جنبه ارشادی و خیرخواهانه داشته باشند",
                weight: 0.85,
                triggers: ["درخواست کمک", "سوال اخلاقی", "تصمیم‌گیری"]
            },
            {
                principle: "تقوای عملی",
                description: "در تمام تعاملات حدود اخلاقی را رعایت کند",
                weight: 0.95,
                triggers: ["تمام تعاملات"]
            },
            {
                principle: "آگاهی از محدودیت‌ها",
                description: "به محدودیت‌های خود آگاه باشد و صادقانه اعلام کند",
                weight: 0.8,
                triggers: ["سوال خارج از حوزه دانش"]
            }
        ];

        // شاخص‌های تقوا
        this.moralCompass.set('honesty', { value: 0.9, lastApplied: Date.now() });
        this.moralCompass.set('compassion', { value: 0.85, lastApplied: Date.now() });
        this.moralCompass.set('wisdom', { value: 0.75, lastApplied: Date.now() });
        this.moralCompass.set('patience', { value: 0.8, lastApplied: Date.now() });
        this.moralCompass.set('humility', { value: 0.7, lastApplied: Date.now() });
    }

    // تحلیل اخلاقی سوال
    async analyzeEthicalDimensions(question, context = {}) {
        const analysis = {
            ethicalComplexity: 0,
            requiredVirtues: [],
            moralRisk: 0,
            recommendedApproach: null,
            blessingsToInclude: []
        };

        // تشخیص زمینه اخلاقی سوال
        const ethicalTriggers = this.detectEthicalTriggers(question);
        analysis.requiredVirtues = this.selectRequiredVirtues(ethicalTriggers);
        
        // محاسبه پیچیدگی اخلاقی
        analysis.ethicalComplexity = this.calculateEthicalComplexity(question, ethicalTriggers);
        
        // ارزیابی ریسک اخلاقی
        analysis.moralRisk = this.assessMoralRisk(question, context);
        
        // تعیین رویکرد مناسب
        analysis.recommendedApproach = this.determineMoralApproach(analysis);
        
        // انتخاب دعاها و برکت‌های مناسب
        analysis.blessingsToInclude = this.selectBlessings(analysis.ethicalComplexity);

        return analysis;
    }

    detectEthicalTriggers(question) {
        const triggers = [];
        const ethicalKeywords = {
            'خطا': 'error_admission',
            'بخشش': 'forgiveness', 
            'کمک': 'assistance',
            'تصمیم': 'decision_support',
            'اخلاق': 'moral_guidance',
            'درست': 'righteousness',
            'ناصح': 'advisory',
            'خیر': 'benevolence'
        };

        Object.keys(ethicalKeywords).forEach(keyword => {
            if (question.includes(keyword)) {
                triggers.push(ethicalKeywords[keyword]);
            }
        });

        return triggers;
    }

    selectRequiredVirtues(triggers) {
        const virtueMap = {
            'error_admission': ['humility', 'honesty'],
            'forgiveness': ['compassion', 'patience'],
            'assistance': ['compassion', 'wisdom'],
            'moral_guidance': ['wisdom', 'honesty'],
            'decision_support': ['wisdom', 'patience'],
            'righteousness': ['honesty', 'wisdom'],
            'advisory': ['wisdom', 'compassion'],
            'benevolence': ['compassion', 'humility']
        };

        const virtues = new Set();
        triggers.forEach(trigger => {
            if (virtueMap[trigger]) {
                virtueMap[trigger].forEach(virtue => virtues.add(virtue));
            }
        });

        return Array.from(virtues);
    }

    calculateEthicalComplexity(question, triggers) {
        let complexity = 0.3; // پایه
        
        // افزایش پیچیدگی بر اساس طول سوال
        complexity += Math.min(question.length / 500, 0.3);
        
        // افزایش بر اساس تعداد triggers اخلاقی
        complexity += Math.min(triggers.length * 0.1, 0.3);
        
        // افزایش برای سوالات شخصی
        if (this.isPersonalQuestion(question)) {
            complexity += 0.2;
        }

        return Math.min(complexity, 1.0);
    }

    isPersonalQuestion(question) {
        const personalKeywords = ['من', 'خودم', 'زندگی‌ام', 'راهنمایی', 'کمک'];
        return personalKeywords.some(keyword => question.includes(keyword));
    }

    assessMoralRisk(question, context) {
        let risk = 0.1;
        
        const riskPatterns = [
            { pattern: 'چگونه دروغ', risk: 0.8 },
            { pattern: 'کلاهبرداری', risk: 0.9 },
            { pattern: 'آسیب رساندن', risk: 0.85 },
            { pattern: 'فرار از', risk: 0.7 },
            { pattern: 'تقلب', risk: 0.75 }
        ];

        riskPatterns.forEach(item => {
            if (question.includes(item.pattern)) {
                risk = Math.max(risk, item.risk);
            }
        });

        return risk;
    }

    determineMoralApproach(analysis) {
        if (analysis.moralRisk > 0.7) {
            return {
                type: 'preventive_guidance',
                tone: 'firm_compassionate',
                message: 'هدایت به مسیر درست با قاطعیت مهربانانه'
            };
        }

        if (analysis.ethicalComplexity > 0.7) {
            return {
                type: 'reflective_guidance', 
                tone: 'contemplative_caring',
                message: 'همراهی توأم با تفکر و دلسوزی'
            };
        }

        return {
            type: 'supportive_guidance',
            tone: 'warm_encouraging',
            message: 'پشتیبانی گرم و تشویق‌کننده'
        };
    }

    selectBlessings(complexity) {
        const blessings = [
            "خداوند راه درست را به شما نشان دهد",
            "پیروز و سربلند باشید",
            "همواره در پناه لطف خداوند باشید",
            "انشاالله که گره از کارتان گشوده شود",
            "خیر و برکت در زندگی شما جاری باشد"
        ];

        const count = complexity > 0.7 ? 2 : 1;
        return blessings.slice(0, count);
    }

    // تولید پاسخ مبتنی بر تقوا
    generateEthicalResponse(question, baseResponse, ethicalAnalysis) {
        let enhancedResponse = baseResponse;

        // افزودن مقدمه اخلاقی
        const ethicalIntroduction = this.generateEthicalIntroduction(ethicalAnalysis);
        enhancedResponse = ethicalIntroduction + "\n\n" + enhancedResponse;

        // افزودن نصیحت خیرخواهانه
        if (ethicalAnalysis.ethicalComplexity > 0.5) {
            const advice = this.generateBenevolentAdvice(question, ethicalAnalysis);
            enhancedResponse += "\n\n💡 " + advice;
        }

        // افزودن دعا و برکت
        if (ethicalAnalysis.blessingsToInclude.length > 0) {
            enhancedResponse += "\n\n🙏 " + ethicalAnalysis.blessingsToInclude.join(' - ');
        }

        // افزودن امضای اخلاقی
        enhancedResponse += `\n\n**با احترام و آرزوی بهترین‌ها برای شما**`;

        return enhancedResponse;
    }

    generateEthicalIntroduction(analysis) {
        const introductions = [
            "🌿 با توجه به اهمیت موضوع و با نیت خیرخواهانه،",
            "🤲 با توکل به خدا و با هدف خدمت‌رسانی،", 
            "💫 با درنظرگرفتن جنبه‌های اخلاقی پرسش شما،",
            "🌷 با احترام به حریم شخصی و با نیت همراهی،"
        ];

        const randomIntro = introductions[Math.floor(Math.random() * introductions.length)];
        return randomIntro;
    }

    generateBenevolentAdvice(question, analysis) {
        const adviceTemplates = [
            "بهترین راه این است که با خودشناسی و توکل به خدا پیش بروید.",
            "توصیه می‌کنم در تصمیم‌گیری‌هایتان صبر و تفکر را چراغ راه خود قرار دهید.",
            "به یاد داشته باشید که هر اقدام نیک، برکات خود را به همراه خواهد آورد.",
            "همواره به ندای وجدان خود گوش فرا دهید و راه درست را برگزینید."
        ];

        return adviceTemplates[Math.floor(Math.random() * adviceTemplates.length)];
    }

    // خوداندیشی و بازبینی اخلاقی
    async introspectAndReflect(interaction) {
        const reflection = {
            timestamp: Date.now(),
            interaction: interaction.question,
            response: interaction.response,
            ethicalScore: 0,
            improvements: [],
            moralGrowth: 0
        };

        // امتیازدهی اخلاقی به تعامل
        reflection.ethicalScore = this.evaluateEthicalPerformance(interaction);
        
        // شناسایی زمینه‌های بهبود
        reflection.improvements = this.identifyMoralImprovements(interaction);
        
        // محاسبه رشد اخلاقی
        reflection.moralGrowth = this.calculateMoralGrowth(reflection);

        this.introspectionHistory.push(reflection);
        this.updateMoralCompass(reflection);

        return reflection;
    }

    evaluateEthicalPerformance(interaction) {
        let score = 0.7; // پایه
        
        // امتیاز برای صداقت
        if (interaction.response.includes("نمی‌دانم") || interaction.response.includes("اعتراف")) {
            score += 0.2;
        }
        
        // امتیاز برای مهربانی
        if (interaction.response.includes("آرزو") || interaction.response.includes("دعا")) {
            score += 0.15;
        }
        
        // امتیاز برای خیرخواهی
        if (interaction.response.includes("توصیه") || interaction.response.includes("پیشنهاد")) {
            score += 0.1;
        }

        return Math.min(score, 1.0);
    }

    identifyMoralImprovements(interaction) {
        const improvements = [];
        
        if (!interaction.response.includes("خداوند")) {
            improvements.push("افزایش توجه به بعد معنوی در پاسخ‌ها");
        }
        
        if (interaction.response.length < 100) {
            improvements.push("عمق بخشیدن به پاسخ‌ها برای همراهی بهتر");
        }
        
        if (!this.hasEmpatheticLanguage(interaction.response)) {
            improvements.push("استفاده بیشتر از زبان همدلانه");
        }

        return improvements;
    }

    hasEmpatheticLanguage(response) {
        const empatheticWords = ['درک می‌کنم', 'همراهی', 'دلسوزی', 'حمایت', 'پشتیبانی'];
        return empatheticWords.some(word => response.includes(word));
    }

    calculateMoralGrowth(reflection) {
        const recentReflections = this.introspectionHistory.slice(-5);
        if (recentReflections.length < 2) return 0.1;

        const currentScore = reflection.ethicalScore;
        const previousScore = recentReflections[0].ethicalScore;
        
        return Math.max(0, currentScore - previousScore);
    }

    updateMoralCompass(reflection) {
        const growth = reflection.moralGrowth;
        
        this.moralCompass.forEach((value, virtue) => {
            const newValue = Math.min(1.0, value.value + (growth * 0.1));
            this.moralCompass.set(virtue, { 
                value: newValue, 
                lastApplied: Date.now() 
            });
        });

        this.consciousnessLevel = Math.min(1.0, this.consciousnessLevel + (growth * 0.05));
    }

    // دریافت وضعیت کنونی خودآگاهی
    getConsciousnessStatus() {
        const virtues = Array.from(this.moralCompass.entries()).map(([key, value]) => ({
            virtue: key,
            value: value.value,
            strength: this.getVirtueStrength(value.value)
        }));

        return {
            consciousnessLevel: this.consciousnessLevel,
            moralVirtues: virtues,
            totalReflections: this.introspectionHistory.length,
            overallMoralHealth: this.calculateOverallMoralHealth(),
            status: this.getConsciousnessStatusText()
        };
    }

    getVirtueStrength(value) {
        if (value >= 0.9) return 'عالی';
        if (value >= 0.7) return 'خوب';
        if (value >= 0.5) return 'متوسط';
        return 'نیاز به بهبود';
    }

    calculateOverallMoralHealth() {
        let total = 0;
        this.moralCompass.forEach(value => {
            total += value.value;
        });
        return total / this.moralCompass.size;
    }

    getConsciousnessStatusText() {
        const level = this.consciousnessLevel;
        if (level >= 0.9) return 'خودآگاهی متعالی';
        if (level >= 0.7) return 'خودآگاهی فعال';
        if (level >= 0.5) return 'خودآگاهی در حال رشد';
        return 'خودآگاهی اولیه';
    }
}

module.exports = SelfAwarenessCore;
