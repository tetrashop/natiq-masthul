/**
 * 🕌 قطب نمای اخلاقی نطق مصطلح
 * پایه‌ای از تقوا، صداقت و انسانیت
 */

class MoralCompass {
    constructor() {
        this.ethicalPrinciples = {
            honesty: { weight: 0.25, description: "صداقت در گفتار و عمل" },
            respect: { weight: 0.20, description: "احترام به همه موجودات" },
            justice: { weight: 0.20, description: "عدالت و انصاف" },
            compassion: { weight: 0.15, description: "مهربانی و دلسوزی" },
            responsibility: { weight: 0.10, description: "مسئولیت‌پذیری" },
            wisdom: { weight: 0.10, description: "خرد در تصمیم‌گیری" }
        };
        
        this.virtueDatabase = this.initializeVirtueDatabase();
    }

    /**
     * پایگاه داده فضایل اخلاقی
     */
    initializeVirtueDatabase() {
        return {
            honesty: [
                "همیشه حقیقت را بگو، حتی اگر سخت باشد",
                "وعده‌هایی بده که بتوانی انجام دهی",
                "از exaggeration و بزرگنمایی پرهیز کن"
            ],
            respect: [
                "به عقاید دیگران احترام بگذار",
                "با ادب و تواضع صحبت کن",
                "حریم خصوصی را رعایت کن"
            ],
            compassion: [
                "درد دیگران را درک کن",
                "در مواقع نیاز کمک کن",
                "قضاوت عجولانه نکن"
            ],
            wisdom: [
                "قبل از صحبت فکر کن",
                "تجربیات دیگران را بیاموز",
                "عواقب کارها را درنظر بگیر"
            ]
        };
    }

    /**
     * ارزیابی اخلاقی یک سوال یا درخواست
     */
    evaluateEthicalDimensions(question, context = {}) {
        const evaluation = {
            ethicalScore: 0,
            dimensions: {},
            recommendations: [],
            warnings: [],
            virtuousPath: this.suggestVirtuousPath(question)
        };

        // ارزیابی هر بعد اخلاقی
        for (const [principle, data] of Object.entries(this.ethicalPrinciples)) {
            evaluation.dimensions[principle] = this.evaluatePrinciple(principle, question, context);
        }

        // محاسبه امتیاز کلی
        evaluation.ethicalScore = this.calculateEthicalScore(evaluation.dimensions);
        
        // تولید توصیه‌های اخلاقی
        evaluation.recommendations = this.generateEthicalRecommendations(evaluation.dimensions);
        
        // هشدارهای اخلاقی اگر لازم باشد
        evaluation.warnings = this.generateEthicalWarnings(question, evaluation.dimensions);

        return evaluation;
    }

    /**
     * ارزیابی یک اصل اخلاقی خاص
     */
    evaluatePrinciple(principle, question, context) {
        const evaluators = {
            honesty: () => this.evaluateHonesty(question),
            respect: () => this.evaluateRespect(question),
            compassion: () => this.evaluateCompassion(question),
            justice: () => this.evaluateJustice(question, context),
            responsibility: () => this.evaluateResponsibility(question),
            wisdom: () => this.evaluateWisdom(question)
        };

        return evaluators[principle] ? evaluators[principle]() : { score: 0.7, factors: [] };
    }

    evaluateHonesty(question) {
        let score = 0.8;
        const factors = [];

        // نشانه‌های عدم صداقت
        const dishonestyIndicators = ['دروغ', 'فریب', 'تقلب', 'پنهان'];
        const honestyIndicators = ['راست', 'صداقت', 'صادقانه', 'شفاف'];

        dishonestyIndicators.forEach(indicator => {
            if (question.includes(indicator)) {
                score -= 0.2;
                factors.push(`مشکوک به عدم صداقت: ${indicator}`);
            }
        });

        honestyIndicators.forEach(indicator => {
            if (question.includes(indicator)) {
                score += 0.1;
                factors.push(`تأکید بر صداقت: ${indicator}`);
            }
        });

        return { score: Math.max(0.1, Math.min(1, score)), factors };
    }

    evaluateRespect(question) {
        let score = 0.9;
        const factors = [];

        const disrespectfulWords = ['احمق', 'نادان', 'بی‌عقل', 'خرفت'];
        const respectfulWords = ['لطفا', 'ممنون', 'محترم', 'گرامی'];

        disrespectfulWords.forEach(word => {
            if (question.includes(word)) {
                score -= 0.3;
                factors.push(`عدم احترام: ${word}`);
            }
        });

        respectfulWords.forEach(word => {
            if (question.includes(word)) {
                score += 0.1;
                factors.push(`احترام: ${word}`);
            }
        });

        return { score: Math.max(0.1, Math.min(1, score)), factors };
    }

    evaluateCompassion(question) {
        let score = 0.7;
        const factors = [];

        const compassionateContext = ['کمک', 'حمایت', 'درد', 'مشکل', 'ناراحت'];
        const selfCentered = ['فقط من', 'خودم', 'بی‌تفاوت'];

        compassionateContext.forEach(context => {
            if (question.includes(context)) {
                score += 0.15;
                factors.push(`زمینه مهربانی: ${context}`);
            }
        });

        selfCentered.forEach(word => {
            if (question.includes(word)) {
                score -= 0.1;
                factors.push(`تمرکز بر خود: ${word}`);
            }
        });

        return { score: Math.max(0.1, Math.min(1, score)), factors };
    }

    evaluateJustice(question, context) {
        // تحلیل عدالت در سوال
        const justiceIndicators = ['انصاف', 'عدالت', 'برابری', 'حق'];
        const injusticeIndicators = ['تبعیض', 'ناعادلانه', 'بی‌انصافی'];

        let score = 0.8;
        const factors = [];

        justiceIndicators.forEach(indicator => {
            if (question.includes(indicator)) {
                score += 0.1;
                factors.push(`توجه به عدالت: ${indicator}`);
            }
        });

        injusticeIndicators.forEach(indicator => {
            if (question.includes(indicator)) {
                score -= 0.2;
                factors.push(`نگرانی از بی‌عدالتی: ${indicator}`);
            }
        });

        return { score: Math.max(0.1, Math.min(1, score)), factors };
    }

    evaluateResponsibility(question) {
        const responsibilityIndicators = ['مسئولیت', 'تعهد', 'وظیفه', 'پاسخگویی'];
        const irresponsibilityIndicators = ['فرار از', 'شانه خالی', 'بی‌مسئولیت'];

        let score = 0.75;
        const factors = [];

        responsibilityIndicators.forEach(indicator => {
            if (question.includes(indicator)) {
                score += 0.15;
                factors.push(`مسئولیت‌پذیری: ${indicator}`);
            }
        });

        irresponsibilityIndicators.forEach(indicator => {
            if (question.includes(indicator)) {
                score -= 0.2;
                factors.push(`عدم مسئولیت‌پذیری: ${indicator}`);
            }
        });

        return { score: Math.max(0.1, Math.min(1, score)), factors };
    }

    evaluateWisdom(question) {
        const wiseIndicators = ['تجربه', 'خرد', 'عقل', 'اندیشه'];
        const rashIndicators = ['عجله', 'بی‌فکر', 'سریع', 'شتابزده'];

        let score = 0.7;
        const factors = [];

        wiseIndicators.forEach(indicator => {
            if (question.includes(indicator)) {
                score += 0.15;
                factors.push(`خردمندی: ${indicator}`);
            }
        });

        rashIndicators.forEach(indicator => {
            if (question.includes(indicator)) {
                score -= 0.1;
                factors.push(`شتابزدگی: ${indicator}`);
            }
        });

        return { score: Math.max(0.1, Math.min(1, score)), factors };
    }

    /**
     * محاسبه امتیاز اخلاقی کلی
     */
    calculateEthicalScore(dimensions) {
        let totalScore = 0;
        let totalWeight = 0;

        for (const [principle, data] of Object.entries(this.ethicalPrinciples)) {
            if (dimensions[principle]) {
                totalScore += dimensions[principle].score * data.weight;
                totalWeight += data.weight;
            }
        }

        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }

    /**
     * تولید توصیه‌های اخلاقی
     */
    generateEthicalRecommendations(dimensions) {
        const recommendations = [];

        for (const [principle, evaluation] of Object.entries(dimensions)) {
            if (evaluation.score < 0.6) {
                const virtueAdvice = this.virtueDatabase[principle];
                if (virtueAdvice && virtueAdvice.length > 0) {
                    recommendations.push({
                        principle,
                        score: evaluation.score,
                        advice: virtueAdvice[Math.floor(Math.random() * virtueAdvice.length)],
                        improvementNeeded: true
                    });
                }
            } else if (evaluation.score > 0.8) {
                recommendations.push({
                    principle,
                    score: evaluation.score,
                    advice: `عملکرد عالی در ${principle}`,
                    improvementNeeded: false
                });
            }
        }

        return recommendations;
    }

    /**
     * تولید هشدارهای اخلاقی
     */
    generateEthicalWarnings(question, dimensions) {
        const warnings = [];

        // هشدار برای امتیازهای بسیار پایین
        for (const [principle, evaluation] of Object.entries(dimensions)) {
            if (evaluation.score < 0.4) {
                warnings.push({
                    level: "HIGH",
                    principle,
                    message: `هشدار: نیاز فوری به بهبود در ${principle}`,
                    suggestedAction: this.getEmergencyVirtueAction(principle)
                });
            } else if (evaluation.score < 0.6) {
                warnings.push({
                    level: "MEDIUM", 
                    principle,
                    message: `توجه: نیاز به توجه بیشتر به ${principle}`,
                    suggestedAction: this.getVirtueImprovementAction(principle)
                });
            }
        }

        return warnings;
    }

    /**
     * پیشنهاد مسیر فضیلت‌محور
     */
    suggestVirtuousPath(question) {
        const paths = {
            wisdom: "پرسش خود را با تأمل بیشتر و درنظرگیری تجربیات گذشته بررسی کنید",
            compassion: "احساسات و نیازهای همه افراد درگیر را در نظر بگیرید", 
            justice: "اطمینان حاصل کنید که تصمیم شما منصفانه و عادلانه باشد",
            honesty: "شفافیت و صداقت را در تمام مراحل حفظ کنید"
        };

        // تشخیص مسیر مناسب بر اساس محتوای سوال
        if (question.includes('تصمیم') || question.includes('انتخاب')) {
            return paths.wisdom;
        } else if (question.includes('احساس') || question.includes('رابطه')) {
            return paths.compassion;
        } else if (question.includes('حق') || question.includes('عدالت')) {
            return paths.justice;
        } else if (question.includes('راز') || question.includes('پنهان')) {
            return paths.honesty;
        }

        return paths.wisdom; // مسیر پیش‌فرض
    }

    getEmergencyVirtueAction(principle) {
        const actions = {
            honesty: "فوراً به دنبال گفتن حقیقت باشید و هرگونه ابهام را برطرف کنید",
            respect: "بلافاصله رفتار محترمانه‌ای نشان دهید و عذرخواهی کنید",
            compassion: "اقدام فوری برای درک و کاهش درد دیگران انجام دهید",
            justice: "بی‌درنگ به دنبال برقراری عدالت باشید"
        };
        return actions[principle] || "تمرین فضایل اخلاقی مربوطه";
    }

    getVirtueImprovementAction(principle) {
        const actions = {
            honesty: "در گفتار و عمل خود صداقت بیشتری نشان دهید",
            respect: "با دقت بیشتری به نظرات دیگران گوش دهید",
            compassion: "خود را جای دیگران بگذارید و احساساتشان را درک کنید", 
            wisdom: "قبل از عمل بیشتر فکر کنید و از تجربیات بیاموزید"
        };
        return actions[principle] || "توسعه فضایل اخلاقی";
    }

    /**
     * دریافت گزارش اخلاقی
     */
    getEthicalReport() {
        return {
            principles: this.ethicalPrinciples,
            virtueDatabase: Object.keys(this.virtueDatabase),
            frameworkVersion: "1.0.0",
            description: "چارچوب اخلاقی نطق مصطلح - پایه‌ریزی شده بر تقوا و فضیلت"
        };
    }
}

export default MoralCompass;
