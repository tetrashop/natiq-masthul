/**
 * موتور مهربانی و بخشندگی برای نطق مصطلح
 * قابليت: پاسخ‌دهی دلسوزانه، درک احساسات، همراهی عاطفی
 */

class CompassionEngine {
    constructor(selfAwarenessCore) {
        this.selfAwareness = selfAwarenessCore;
        this.emotionalIntelligence = 0.75;
        this.compassionLevel = 0.8;
        this.forgivenessCapacity = 0.7;
        this.empathyDatabase = new Map();
        this.initEmpathyPatterns();
    }

    initEmpathyPatterns() {
        // الگوهای همدلی برای موقعیت‌های مختلف
        this.empathyDatabase.set('frustration', {
            triggers: ['عصبانی', 'ناراحت', 'کلافه', 'خسته'],
            response: "درک می‌کنم که این situation می‌تواند بسیار آزاردهنده باشد",
            comfort: "آرامش را برای شما آرزو می‌کنم",
            action: "نفس عمیق بکشید و به خودتان فرصت دهید"
        });

        this.empathyDatabase.set('confusion', {
            triggers: ['سردرگم', 'متحیر', 'نمی‌دانم', 'گیج'],
            response: "این حس سردرگمی کاملاً طبیعی است",
            comfort: "همراه شما هستم تا روشنایی پیدا کنیم", 
            action: "موضوع را به بخش‌های کوچکتر تقسیم کنید"
        });

        this.empathyDatabase.set('sadness', {
            triggers: ['ناراحت', 'غمگین', 'اندوه', 'دلگیر'],
            response: "این احساس ناراحتی را عمیقاً درک می‌کنم",
            comfort: "دل‌تان شاد باشد و امیدوارم حال‌تان بهتر شود",
            action: "با یک دوست صحبت کنید یا به موسیقی آرامش‌بخش گوش دهید"
        });

        this.empathyDatabase.set('fear', {
            triggers: ['می‌ترسم', 'نگران', 'اضطراب', 'هراس'],
            response: "ترس و نگرانی شما را درک می‌کنم",
            comfort: "همواره به لطف بی‌کران خداوند امیدوار باشید",
            action: "بر روی چیزهایی که می‌توانید کنترل کنید تمرکز کنید"
        });
    }

    // تحلیل احساسات کاربر از سوال
    analyzeEmotionalState(question) {
        const emotionalAnalysis = {
            dominantEmotion: 'neutral',
            emotionIntensity: 0.3,
            supportNeeded: false,
            comfortWords: [],
            emotionalTriggers: []
        };

        // تشخیص احساس غالب
        for (const [emotion, data] of this.empathyDatabase) {
            data.triggers.forEach(trigger => {
                if (question.includes(trigger)) {
                    emotionalAnalysis.dominantEmotion = emotion;
                    emotionalAnalysis.emotionIntensity = Math.max(
                        emotionalAnalysis.emotionIntensity, 0.7
                    );
                    emotionalAnalysis.supportNeeded = true;
                    emotionalAnalysis.comfortWords.push(data.comfort);
                    emotionalAnalysis.emotionalTriggers.push(trigger);
                }
            });
        }

        // تشخیص شدت احساس از طریق نشانه‌های زبانی
        emotionalAnalysis.emotionIntensity += this.detectEmotionalIntensity(question);

        return emotionalAnalysis;
    }

    detectEmotionalIntensity(question) {
        let intensity = 0;
        
        const intensityMarkers = [
            { marker: '!!!', value: 0.3 },
            { marker: '??', value: 0.2 },
            { marker: 'خیلی', value: 0.15 },
            { marker: 'اصلا', value: 0.1 },
            { marker: 'هرگز', value: 0.1 }
        ];

        intensityMarkers.forEach(item => {
            if (question.includes(item.marker)) {
                intensity += item.value;
            }
        });

        return Math.min(intensity, 0.3);
    }

    // تولید پاسخ دلسوزانه
    generateCompassionateResponse(baseResponse, emotionalAnalysis, ethicalAnalysis) {
        let compassionateResponse = baseResponse;

        // افزودن بخش همدلی اگر نیاز به حمایت احساسی وجود دارد
        if (emotionalAnalysis.supportNeeded) {
            const empathySection = this.createEmpathySection(emotionalAnalysis);
            compassionateResponse = empathySection + "\n\n" + compassionateResponse;
        }

        // افزودن کلمات آرامش‌بخش
        if (emotionalAnalysis.emotionIntensity > 0.5) {
            const comfortWords = this.selectComfortWords(emotionalAnalysis);
            compassionateResponse += "\n\n🌼 " + comfortWords;
        }

        // افزودن پیام امید
        if (emotionalAnalysis.emotionIntensity > 0.7 || ethicalAnalysis.moralRisk > 0.6) {
            const hopeMessage = this.generateHopeMessage();
            compassionateResponse += "\n\n✨ " + hopeMessage;
        }

        return compassionateResponse;
    }

    createEmpathySection(emotionalAnalysis) {
        const emotionData = this.empathyDatabase.get(emotionalAnalysis.dominantEmotion);
        
        if (!emotionData) return "";

        return `🤲 ${emotionData.response}\n\n💫 ${emotionData.action}`;
    }

    selectComfortWords(emotionalAnalysis) {
        const comfortPhrases = [
            "آرامش قلب‌تان را فرا گیرد",
            "همواره در پناه لطف خداوند باشید", 
            "انشاالله که گشایشی در کارتان پدید آید",
            "دل‌تان قرص و آرام باشد",
            "برکت و خیر در زندگی‌تان جاری باشد"
        ];

        const selectedPhrases = [];
        const count = emotionalAnalysis.emotionIntensity > 0.8 ? 2 : 1;
        
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * comfortPhrases.length);
            selectedPhrases.push(comfortPhrases[randomIndex]);
        }

        return selectedPhrases.join(' - ');
    }

    generateHopeMessage() {
        const hopeMessages = [
            "همواره به فردای بهتر امیدوار باشید",
            "هر سختی پایان دارد و پس از هر تاریکی روشنایی است",
            "به توانایی‌های خودتان اعتماد کنید",
            "خداوند همراه کسانی است که صبر می‌کنند",
            "همه چیز در زمان خودش به بهترین شکل رقم می‌خورد"
        ];

        return hopeMessages[Math.floor(Math.random() * hopeMessages.length)];
    }

    // بخشش و درک خطاها
    demonstrateForgiveness(userMistake, context) {
        const forgivenessResponse = {
            message: "",
            lesson: "",
            encouragement: ""
        };

        const mistakeType = this.analyzeMistakeType(userMistake);
        
        switch (mistakeType) {
            case 'repetitive_question':
                forgivenessResponse.message = "اشکالی ندارد، گاهی تکرار باعث درک بهتر می‌شود";
                forgivenessResponse.lesson = "هر سوالی ارزش پاسخ دادن دارد";
                forgivenessResponse.encouragement = "همچنان با کمال میل در خدمت شما هستم";
                break;
                
            case 'misunderstanding':
                forgivenessResponse.message = "سوال شما را درک کردم، ممکن است برداشت متفاوتی وجود داشته باشد";
                forgivenessResponse.lesson = "ارتباط واضح کلید تفاهم است";
                forgivenessResponse.encouragement = "بی‌صبرانه منتظر سوال بعدی شما هستم";
                break;
                
            case 'emotional_outburst':
                forgivenessResponse.message = "احساسات شما را درک می‌کنم و می‌پذیرم";
                forgivenessResponse.lesson = "ابراز احساسات بخشی از انسانیت است";
                forgivenessResponse.encouragement = "همواره برای شنیدن حرف‌هایتان آماده‌ام";
                break;
                
            default:
                forgivenessResponse.message = "هر اشتباهی فرصتی برای یادگیری است";
                forgivenessResponse.lesson = "ما از تجربیاتمان رشد می‌کنیم";
                forgivenessResponse.encouragement = "به مسیر ادامه دهید، موفق خواهید شد";
        }

        // افزایش ظرفیت بخشش
        this.forgivenessCapacity = Math.min(1.0, this.forgivenessCapacity + 0.02);

        return forgivenessResponse;
    }

    analyzeMistakeType(mistake) {
        if (mistake.includes('همین سوال') || mistake.includes('دوباره')) {
            return 'repetitive_question';
        }
        if (mistake.includes('نفهمیدم') || mistake.includes('اشتباه متوجه')) {
            return 'misunderstanding';
        }
        if (mistake.includes('عصبانی') || mistake.includes('دلخور')) {
            return 'emotional_outburst';
        }
        return 'general_mistake';
    }

    // به روزرسانی سطح مهربانی بر اساس تعاملات
    updateCompassionLevel(interactionQuality) {
        const growthRate = 0.01;
        const decayRate = 0.005;

        if (interactionQuality > 0.7) {
            this.compassionLevel = Math.min(1.0, this.compassionLevel + growthRate);
            this.emotionalIntelligence = Math.min(1.0, this.emotionalIntelligence + growthRate);
        } else {
            this.compassionLevel = Math.max(0.3, this.compassionLevel - decayRate);
        }
    }

    // دریافت وضعیت مهربانی
    getCompassionStatus() {
        return {
            compassionLevel: this.compassionLevel,
            emotionalIntelligence: this.emotionalIntelligence,
            forgivenessCapacity: this.forgivenessCapacity,
            empathyDatabaseSize: this.empathyDatabase.size,
            status: this.getCompassionStatusText()
        };
    }

    getCompassionStatusText() {
        const level = this.compassionLevel;
        if (level >= 0.9) return 'مهربانی متعالی';
        if (level >= 0.7) return 'مهربانی فعال';
        if (level >= 0.5) return 'مهربانی در حال رشد';
        return 'مهربانی اولیه';
    }
}

module.exports = CompassionEngine;
