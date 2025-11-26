import { DeepWisdomDatabase } from '../wisdom-database/deep-wisdom.js';
import { ConceptualAnalysisEngine } from '../advanced-analysis/conceptual-engine.js';

export class AdvancedResponseGenerator {
    constructor() {
        this.wisdomDB = new DeepWisdomDatabase();
        this.analysisEngine = new ConceptualAnalysisEngine();
        this.responseTemplates = this.buildResponseTemplates();
    }

    buildResponseTemplates() {
        return {
            comprehensive: {
                structure: [
                    "درک عمیق سوال",
                    "اصول بنیادی مرتبط", 
                    "راهکارهای عملی",
                    "سوالات تفکربرانگیز",
                    "گام بعدی پیشنهادی"
                ],
                tone: "همدلانه، عمیق، عملی"
            },
            practical: {
                structure: [
                    "تشخیص سریع مسئله",
                    "۳ راهکار فوری",
                    "۱ تمرین کوچک برای شروع",
                    "هشدارهای احتمالی"
                ],
                tone: "مستقیم، عمل‌گرا، تشویق‌کننده"
            },
            reflective: {
                structure: [
                    "بازتاب ابعاد مختلف",
                    "سوالات عمیق‌تر",
                    "بینش‌های فلسفی",
                    "فرآیند کشف شخصی"
                ],
                tone: "فلسفی، کنجکاو، غیرقطعی"
            }
        };
    }

    async generateResponse(question, userContext = {}) {
        const analysis = this.analysisEngine.analyzeQuestion(question, userContext);
        const primaryConcept = analysis.primaryConcept;
        const deepInsights = this.wisdomDB.findDeepInsight(primaryConcept, userContext);
        const responseStyle = this.selectResponseStyle(question, analysis);
        const response = this.constructResponse(analysis, deepInsights, responseStyle, userContext);
        
        return {
            response: response.content,
            analysis: analysis,
            metadata: {
                style: responseStyle,
                depthLevel: this.calculateDepthLevel(analysis, deepInsights),
                confidence: this.calculateConfidence(analysis),
                suggestedFollowUps: this.generateFollowUpQuestions(analysis)
            }
        };
    }

    selectResponseStyle(question, analysis) {
        const questionIndicators = {
            comprehensive: ['چگونه', 'راهکار', 'می‌خواهم', 'نیاز دارم'],
            practical: ['فوری', 'سریع', 'الان', 'همین حالا'],
            reflective: ['چرا', 'معنا', 'هدف', 'حکمت']
        };

        for (const [style, indicators] of Object.entries(questionIndicators)) {
            if (indicators.some(indicator => question.includes(indicator))) {
                return style;
            }
        }

        return analysis.underlyingNeeds.includes('نیاز به راهنمایی عملی') ? 'practical' : 'comprehensive';
    }

    constructResponse(analysis, deepInsights, style, userContext) {
        const template = this.responseTemplates[style];
        let content = '';

        switch (style) {
            case 'comprehensive':
                content = this.buildComprehensiveResponse(analysis, deepInsights);
                break;
            case 'practical':
                content = this.buildPracticalResponse(analysis, deepInsights);
                break;
            case 'reflective':
                content = this.buildReflectiveResponse(analysis, deepInsights);
                break;
        }

        return {
            content,
            structure: template.structure,
            tone: template.tone
        };
    }

    buildComprehensiveResponse(analysis, deepInsights) {
        const primaryInsight = deepInsights[0];
        
        return `
🧠 **درک عمیق سوال شما درباره "${analysis.primaryConcept}"**

من می‌بینم که شما در جستجوی ${analysis.underlyingNeeds.join(' و ')} هستید. این کاملاً طبیعی است و نشان‌دهنده رشد و خودآگاهی شماست.

📚 **اصول بنیادی:**
${primaryInsight.principles.map(p => `• ${p}`).join('\n')}

🎯 **راهکارهای عملی:**
${primaryInsight.practices.map(p => `• ${p}`).join('\n')}

💭 **سوالات برای تفکر عمیق‌تر:**
${primaryInsight.questions.map(q => `• ${q}`).join('\n')}

🚀 **گام بعدی پیشنهادی:**
امروز یکی از راهکارها را انتخاب کنید و به مدت یک هفته اجرا نمایید. سپس تأثیرات آن را بررسی کنید.

${this.getEncouragementMessage()}
        `.trim();
    }

    buildPracticalResponse(analysis, deepInsights) {
        const practices = deepInsights[0].practices.slice(0, 3);
        
        return `
⚡ **راهکارهای فوری برای "${analysis.primaryConcept}"**

🔍 **تشخیص:** ${analysis.underlyingNeeds[0]}

🎯 **۳ اقدام عملی برای شروع:**
${practices.map((p, i) => `${i + 1}. ${p}`).join('\n')}

📝 **تمرین کوچک امروز:**
"${practices[0]}"

⚠️ **هشدار:** از کمال‌گرایی پرهیزید. همین که شروع کنید، نصف راه را رفته‌اید!

${this.getMotivationalQuote()}
        `.trim();
    }

    buildReflectiveResponse(analysis, deepInsights) {
        return `
🌌 **بازتابی بر سوال عمیق شما**

سوال شما درباره "${analysis.relatedConcepts.join('، ')}" مرا به تفکر واداشت...

💫 **ابعاد مختلف مسئله:**
• ${analysis.conceptualDimensions.join('\n• ')}

🔎 **سوالاتی برای کاوش بیشتر:**
${deepInsights[0].questions.map(q => `• "${q}"`).join('\n')}

🌱 **فرآیند پیشنهادی برای کشف پاسخ:**
۱. با هر یک از سوالات فوق ۱۰ دقیقه خلوت کنید
۲. پاسخ‌های اولیه خود را بدون قضاوت بنویسید
۳. پس از ۲۴ ساعت بازگردید و بازتاب دهید

"پرسش‌های درست، نیمی از پاسخ هستند..."
        `.trim();
    }

    calculateDepthLevel(analysis, deepInsights) {
        let depth = 1;
        if (analysis.relatedConcepts.length > 2) depth++;
        if (deepInsights.some(insight => insight.domain === 'philosophical')) depth++;
        if (analysis.inferencePath.length > 0) depth++;
        return Math.min(depth, 5);
    }

    calculateConfidence(analysis) {
        const baseConfidence = 0.7;
        const conceptBonus = analysis.primaryConcept in this.analysisEngine.conceptNetwork ? 0.2 : 0;
        const needsBonus = analysis.underlyingNeeds.length > 0 ? 0.1 : 0;
        return Math.min(baseConfidence + conceptBonus + needsBonus, 0.95);
    }

    generateFollowUpQuestions(analysis) {
        const followUps = [
            `چگونه این راهکارها را با شرایط خاص خودتان تطبیق می‌دهید؟`,
            `چه موانعی ممکن است در اجرا با آنها روبرو شوید؟`,
            `چه شاخص‌هایی برای سنجش پیشرفت در نظر می‌گیرید؟`
        ];

        return followUps.slice(0, 2);
    }

    getEncouragementMessage() {
        const encouragements = [
            "به مسیر خود اعتماد کنید، هر گام کوچک مهم است.",
            "رشد واقعی در پیوستگی و استمرار است، نه در کمال.",
            "شما در حال ساختن قابلیت‌های درونی ارزشمندی هستید."
        ];
        return encouragements[Math.floor(Math.random() * encouragements.length)];
    }

    getMotivationalQuote() {
        const quotes = [
            "بزرگ‌ترین سفرها با کوچک‌ترین گام‌ها آغاز می‌شوند.",
            "امروز بهترین روز برای شروع است.",
            "تمرکز بر پیشرفت، نه کمال."
        ];
        return `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    }
}
