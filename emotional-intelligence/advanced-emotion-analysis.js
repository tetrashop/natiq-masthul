/**
 * سیستم تحلیل احساسات پیشرفته برای درک عمیق‌تر حالت‌های عاطفی
 */

class AdvancedEmotionAnalysis {
    constructor() {
        this.emotionLexicon = new Map();
        this.contextualEmotionPatterns = new Map();
        this.initEmotionLexicon();
        this.initContextualPatterns();
    }

    initEmotionLexicon() {
        // دایره لغات احساسی فارسی
        this.emotionLexicon.set('خوشحالی', {
            intensity: 0.8,
            synonyms: ['شاد', 'خرم', 'مسرور', 'شادمان', 'خوشبخت'],
            triggers: ['موفق', 'پیروز', 'برنده', 'خوشا', 'آفرین'],
            physicalSigns: ['لبخند', 'خنده', 'انرژی بالا'],
            opposite: 'ناراحتی'
        });

        this.emotionLexicon.set('ناراحتی', {
            intensity: 0.7,
            synonyms: ['غمگین', 'اندوهگین', 'دلگیر', 'افسرده', 'مالیخولیایی'],
            triggers: ['از دست دادن', 'شکست', 'تنهایی', 'گیر کردن', 'مشکل'],
            physicalSigns: ['گریه', 'سکوت', 'کم‌انرژی'],
            opposite: 'خوشحالی'
        });

        this.emotionLexicon.set('ترس', {
            intensity: 0.75,
            synonyms: ['هراس', 'وحشت', 'اضطراب', 'نگران', 'دلهره'],
            triggers: ['نگران', 'می‌ترسم', 'اضطراب', 'هراس', 'ریسک'],
            physicalSigns: ['لرزش', 'عرق', 'ضربان قلب'],
            opposite: 'امنیت'
        });

        this.emotionLexicon.set('عصبانیت', {
            intensity: 0.85,
            synonyms: ['خشم', 'خشمی', 'برآشفته', 'خروش', 'غضب'],
            triggers: ['عصبانی', 'خشمگین', 'ناعادلانه', 'تحقیر', 'توهین'],
            physicalSigns: ['گرمی بدن', 'مشت گره کرده', 'صدای بلند'],
            opposite: 'آرامش'
        });

        this.emotionLexicon.set('آرامش', {
            intensity: 0.4,
            synonyms: ['صلح', 'سکون', 'اطمینان', 'آسودگی', 'رفاه'],
            triggers: ['آرام', 'صلح', 'اطمینان', 'سکوت', 'مدیتیشن'],
            physicalSigns: ['تنفس عمیق', 'عضلات رها', 'صدای نرم'],
            opposite: 'عصبانیت'
        });

        this.emotionLexicon.set('امید', {
            intensity: 0.6,
            synonyms: ['امیدواری', 'انتظار', 'اشتیاق', 'رویا', 'آرزو'],
            triggers: ['انشاالله', 'امیدوار', 'آینده', 'رویا', 'هدف'],
            physicalSigns: ['چشم‌های درخشان', 'صدا پرانرژی'],
            opposite: 'ناامیدی'
        });
    }

    initContextualPatterns() {
        // الگوهای احساسی مبتنی بر context
        this.contextualEmotionPatterns.set('موفقیت', {
            primary: 'خوشحالی',
            secondary: 'امید',
            typicalPhrases: [
                'چگونه موفق شوم', 'راه پیشرفت', 'هدف زندگی',
                'رشد شخصی', 'تغییر شغل', 'تحول'
            ]
        });

        this.contextualEmotionPatterns.set('رابطه', {
            primary: 'ناراحتی',
            secondary: 'عصبانیت',
            typicalPhrases: [
                'مشکل با', 'درگیری', 'سوءتفاهم',
                'بخشش', 'اعتماد', 'وفاداری'
            ]
        });

        this.contextualEmotionPatterns.set('تصمیم', {
            primary: 'ترس',
            secondary: 'اضطراب',
            typicalPhrases: [
                'تصمیم گیری', 'انتخاب سخت', 'راه درست',
                'مشورت', 'عواقب', 'مسئولیت'
            ]
        });

        this.contextualEmotionPatterns.set('معنویت', {
            primary: 'آرامش',
            secondary: 'امید',
            typicalPhrases: [
                'بخشش', 'تقوا', 'رضایت',
                'معنای زندگی', 'ارتباط با خدا', 'اخلاق'
            ]
        });
    }

    // تحلیل پیشرفته احساسات
    advancedEmotionAnalysis(question, context = {}) {
        const analysis = {
            detectedEmotions: [],
            dominantEmotion: null,
            emotionIntensity: 0.3,
            emotionalContext: null,
            supportLevel: 'low',
            recommendedTone: 'neutral',
            emotionalTriggers: []
        };

        // تشخیص احساسات از طریق لغات
        this.detectEmotionsFromText(question, analysis);
        
        // تحلیل context
        this.analyzeEmotionalContext(question, analysis);
        
        // تعیین احساس غالب
        this.determineDominantEmotion(analysis);
        
        // محاسبه شدت احساس
        analysis.emotionIntensity = this.calculateEmotionIntensity(analysis);
        
        // تعیین سطح حمایت مورد نیاز
        analysis.supportLevel = this.determineSupportLevel(analysis);
        
        // تعیین tone مناسب
        analysis.recommendedTone = this.determineAppropriateTone(analysis);

        return analysis;
    }

    detectEmotionsFromText(text, analysis) {
        const words = text.toLowerCase().split(' ');
        const detectedEmotions = new Map();

        words.forEach(word => {
            for (const [emotion, data] of this.emotionLexicon) {
                // بررسی مستقیم emotion
                if (word === emotion) {
                    this.addEmotionToAnalysis(detectedEmotions, emotion, data.intensity);
                }

                // بررسی synonyms
                if (data.synonyms.includes(word)) {
                    this.addEmotionToAnalysis(detectedEmotions, emotion, data.intensity * 0.8);
                }

                // بررسی triggers
                if (data.triggers.includes(word)) {
                    this.addEmotionToAnalysis(detectedEmotions, emotion, data.intensity * 0.6);
                    analysis.emotionalTriggers.push(word);
                }
            }
        });

        // تبدیل به آرایه و مرتب‌سازی
        analysis.detectedEmotions = Array.from(detectedEmotions.entries())
            .map(([emotion, intensity]) => ({ emotion, intensity }))
            .sort((a, b) => b.intensity - a.intensity);
    }

    addEmotionToAnalysis(emotionsMap, emotion, intensity) {
        if (emotionsMap.has(emotion)) {
            emotionsMap.set(emotion, Math.max(emotionsMap.get(emotion), intensity));
        } else {
            emotionsMap.set(emotion, intensity);
        }
    }

    analyzeEmotionalContext(question, analysis) {
        for (const [context, pattern] of this.contextualEmotionPatterns) {
            if (pattern.typicalPhrases.some(phrase => question.includes(phrase))) {
                analysis.emotionalContext = context;
                
                // افزودن احساسات context-based
                this.addEmotionFromContext(analysis, pattern.primary, 0.7);
                this.addEmotionFromContext(analysis, pattern.secondary, 0.5);
                break;
            }
        }
    }

    addEmotionFromContext(analysis, emotion, intensity) {
        const existingEmotion = analysis.detectedEmotions.find(e => e.emotion === emotion);
        
        if (existingEmotion) {
            existingEmotion.intensity = Math.max(existingEmotion.intensity, intensity);
        } else {
            analysis.detectedEmotions.push({ emotion, intensity });
        }
    }

    determineDominantEmotion(analysis) {
        if (analysis.detectedEmotions.length === 0) {
            analysis.dominantEmotion = 'neutral';
            return;
        }

        analysis.dominantEmotion = analysis.detectedEmotions[0].emotion;
    }

    calculateEmotionIntensity(analysis) {
        if (analysis.detectedEmotions.length === 0) return 0.3;

        const maxIntensity = Math.max(...analysis.detectedEmotions.map(e => e.intensity));
        const averageIntensity = analysis.detectedEmotions.reduce((sum, e) => sum + e.intensity, 0) / analysis.detectedEmotions.length;
        
        return Math.min(1.0, (maxIntensity * 0.7) + (averageIntensity * 0.3));
    }

    determineSupportLevel(analysis) {
        if (analysis.emotionIntensity >= 0.8) return 'high';
        if (analysis.emotionIntensity >= 0.6) return 'medium';
        return 'low';
    }

    determineAppropriateTone(analysis) {
        const emotion = analysis.dominantEmotion;
        const intensity = analysis.emotionIntensity;

        if (intensity >= 0.8) {
            if (emotion === 'عصبانیت') return 'calm_assertive';
            if (emotion === 'ترس') return 'reassuring_gentle';
            if (emotion === 'ناراحتی') return 'compassionate_nurturing';
        }

        if (intensity >= 0.6) {
            if (emotion === 'خوشحالی') return 'warm_celebratory';
            if (emotion === 'امید') return 'encouraging_optimistic';
        }

        return 'balanced_supportive';
    }

    // تولید پاسخ مبتنی بر تحلیل احساسات
    generateEmotionallyIntelligentResponse(baseResponse, emotionAnalysis) {
        let enhancedResponse = baseResponse;

        // افزودن validation احساسی
        enhancedResponse = this.addEmotionalValidation(enhancedResponse, emotionAnalysis);

        // افزودن حمایت احساسی
        if (emotionAnalysis.supportLevel !== 'low') {
            enhancedResponse = this.addEmotionalSupport(enhancedResponse, emotionAnalysis);
        }

        // تنظیم tone بر اساس تحلیل
        enhancedResponse = this.adjustTone(enhancedResponse, emotionAnalysis.recommendedTone);

        return enhancedResponse;
    }

    addEmotionalValidation(response, analysis) {
        if (analysis.detectedEmotions.length === 0) return response;

        const validationPhrases = {
            'ناراحتی': "درک می‌کنم که این شرایط می‌تواند بسیار سخت و ناراحت‌کننده باشد.",
            'عصبانیت': "احساس عصبانیت شما کاملاً قابل درک است و حق با شماست که چنین احساسی دارید.",
            'ترس': "این ترس و نگرانی کاملاً طبیعی است و بسیاری از افراد در چنین موقعیتی همین احساس را دارند.",
            'خوشحالی': "چه زیبا که این حس خوب را تجربه می‌کنید، искренانه خوشحالم برای شما.",
            'امید': "این امیدواری و نگاه مثبت شما واقعاً الهام‌بخش است.",
            'آرامش': "چه آرامش ارزشمندی، این حالت روحی واقعاً غنیمت است."
        };

        const dominantEmotion = analysis.dominantEmotion;
        if (validationPhrases[dominantEmotion]) {
            return validationPhrases[dominantEmotion] + "\n\n" + response;
        }

        return response;
    }

    addEmotionalSupport(response, analysis) {
        const supportPhrases = {
            'high': {
                'ناراحتی': "\n\n💝 **همراهی ویژه:** بدانید که تنها نیستید و این احساسات موقتی هستند. اجازه دهید همراهتان باشم در این مسیر.",
                'عصبانیت': "\n\n🧘 **همراهی ویژه:** نفس عمیق بکشید. این عصبانیت گذراست. با آرامش می‌توانیم راه‌حل بهتری پیدا کنیم.",
                'ترس': "\n\n🛡️ **همراهی ویژه:** این ترس طبیعی است. قدم‌های کوچک بردارید. من اینجا هستم تا همراهیتان کنم."
            },
            'medium': {
                'default': "\n\n🌟 **همراهی:** هر احساسی معلمی است در مسیر زندگی. از این تجربه بیاموزید و رشد کنید."
            }
        };

        const supportLevel = analysis.supportLevel;
        const emotion = analysis.dominantEmotion;

        if (supportLevel === 'high' && supportPhrases.high[emotion]) {
            return response + supportPhrases.high[emotion];
        }

        if (supportLevel === 'medium') {
            return response + supportPhrases.medium.default;
        }

        return response;
    }

    adjustTone(response, tone) {
        // در این نسخه ساده، فقط tone را به پاسخ اضافه می‌کنیم
        // در نسخه کامل می‌توان ساختار جمله را تغییر داد
        return response;
    }

    // دریافت آمار تحلیل احساسات
    getEmotionAnalysisStats() {
        return {
            totalEmotions: this.emotionLexicon.size,
            totalContextPatterns: this.contextualEmotionPatterns.size,
            emotionCoverage: this.calculateEmotionCoverage()
        };
    }

    calculateEmotionCoverage() {
        const emotions = Array.from(this.emotionLexicon.keys());
        return {
            basicEmotions: emotions.length,
            coveragePercentage: (emotions.length / 8) * 100 // 8 احساس اصلی
        };
    }
}

module.exports = AdvancedEmotionAnalysis;
