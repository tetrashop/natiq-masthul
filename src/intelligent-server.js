const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

console.log('🧠 موتور هوشمند نطق مصطلح راه‌اندازی شد...');

// موتور هوشمند ساده‌شده
class SimpleIntelligentEngine {
    constructor() {
        this.thinkingDepth = 0;
        this.maxThinkingDepth = 5;
        this.conversationContext = [];
    }

    // جلوگیری از حلقه بی‌نهایت
    shouldStopThinking() {
        return this.thinkingDepth >= this.maxThinkingDepth;
    }

    resetThinking() {
        this.thinkingDepth = 0;
    }

    // تحلیل هوشمند سوال
    async analyzeQuestion(question) {
        if (this.shouldStopThinking()) {
            this.resetThinking();
            return {
                conclusion: "🧠 **تحلیل به عمق کافی رسید** - اجتناب از تفکر بی‌نهایت",
                reasoningPath: ["توقف هوشمند برای جلوگیری از حلقه"],
                confidence: 0.9
            };
        }

        this.thinkingDepth++;
        
        const analysis = {
            question: question,
            detectedTopics: this.extractTopics(question),
            complexityLevel: this.assessComplexity(question),
            requiredReasoning: this.determineReasoningType(question),
            context: this.getContext()
        };

        return await this.reasonIntelligently(analysis);
    }

    // استخراج موضوعات
    extractTopics(question) {
        const topics = [];
        if (question.includes('هوش مصنوعی')) topics.push('ai');
        if (question.includes('یادگیری')) topics.push('learning');
        if (question.includes('آینده')) topics.push('future');
        if (question.includes('پردازش زبان')) topics.push('nlp');
        if (question.includes('فارسی')) topics.push('persian');
        return topics;
    }

    // ارزیابی پیچیدگی
    assessComplexity(question) {
        const complexIndicators = ['چرا', 'چگونه', 'مکانیسم', 'تحلیل', 'تفاوت'];
        return complexIndicators.some(indicator => question.includes(indicator)) ? 'high' : 'medium';
    }

    // استدلال هوشمند
    async reasonIntelligently(analysis) {
        const { question, detectedTopics, complexityLevel } = analysis;
        
        // تحلیل بر اساس موضوعات
        if (detectedTopics.includes('ai') && detectedTopics.includes('future')) {
            return {
                conclusion: `🤖 **تحلیل تحول هوش مصنوعی:**

هوش مصنوعی از سه مسیر اصلی آینده بشر را متحول می‌کند:

🔮 **تحول‌های کلیدی:**
1. **خودکارسازی هوشمند**: انتقال از کارهای تکراری به خلاقیت
2. **شبیه‌سازی پیشرفته**: مدل‌سازی سیستم‌های پیچیده انسانی
3. **تعامل انسان-ماشین**: رابط‌های طبیعی و شهودی

⚖️ **ملاحظات اساسی:**
- توازن بین پیشرفت و کنترل انسانی
- عدالت در دسترسی به فناوری
- حفظ حریم خصوصی در عصر داده

💡 **نقش رامین اجلال**: تمرکز بر توسعه سیستم‌های هوش مصنوعی تفسیرپذیر و مسئول`,
                reasoningPath: [
                    "شناسایی روندهای تحول‌آفرین هوش مصنوعی",
                    "تحلیل تاثیر بر جنبه‌های مختلف زندگی بشر", 
                    "بررسی چالش‌های اخلاقی و اجتماعی"
                ],
                confidence: 0.85,
                followupQuestions: ["جنبه خاصی از تحول را بررسی کنیم؟"]
            };
        }

        if (detectedTopics.includes('nlp') && detectedTopics.includes('persian')) {
            return {
                conclusion: `📚 **آینده پردازش زبان فارسی:**

پردازش زبان فارسی در آستانه تحول بزرگی قرار دارد:

🎯 **چالش‌های فعلی:**
• کمبود داده‌های آموزشی با کیفیت
• پیچیدگی‌های دستوری و صرفی زبان فارسی
• نیاز به مدل‌های ویژه برای درک زمینه فرهنگی

🚀 **روندهای آینده:**
1. توسعه مدل‌های زبانی بزرگ فارسی
2. یکپارچه‌سازی هوش مصنوعی در ابزارهای تولید محتوا
3. ایجاد سیستم‌های ترجمه روان و طبیعی

💎 **فرصت برای رامین اجلال:** 
توسعه معماری‌های ویژه برای پردازش کارآمد زبان فارسی`,
                reasoningPath: [
                    "شناسایی چالش‌های زبان فارسی",
                    "تحلیل روندهای فناوری",
                    "بررسی فرصت‌های توسعه"
                ],
                confidence: 0.8,
                followupQuestions: ["کدام جنبه از پردازش فارسی برای شما جذاب‌تر است؟"]
            };
        }

        // پاسخ پیش‌فرض برای سوالات دیگر
        return {
            conclusion: `🧠 **تحلیل سوال شما:**

سوال "${question}" نشان‌دهنده کنجکاوی فکری شماست. 

💡 **من می‌توانم در این حوزه‌ها تحلیل ارائه دهم:**
• هوش مصنوعی و فناوری‌های نوین
• پردازش زبان فارسی و چالش‌های آن
• آینده‌پژوهی و روندهای تحول‌آفرین
• معماری سیستم‌های پیچیده

🎯 **برای تحلیل عمیق‌تر، لطفاً سوال خود را در یکی از این حوزه‌ها مطرح کنید.**`,
            reasoningPath: [
                "درک کلی سوال و زمینه آن",
                "شناسایی حوزه‌های تخصصی مرتبط",
                "ارائه راهنمایی برای سوال دقیق‌تر"
            ],
            confidence: 0.7,
            followupQuestions: ["آیا مایلید در حوزه خاصی عمیق‌تر شویم؟"]
        };
    }

    getContext() {
        return {
            timestamp: new Date(),
            sessionId: 'default',
            thinkingDepth: this.thinkingDepth
        };
    }

    determineReasoningType(question) {
        if (question.includes('چرا')) return 'causal';
        if (question.includes('چگونه')) return 'procedural';
        if (question.includes('تفاوت')) return 'comparative';
        return 'general';
    }
}

// راه‌اندازی موتور
const aiEngine = new SimpleIntelligentEngine();

// تابع ساخت پاسخ
function buildIntelligentResponse(question, analysis) {
    return `${analysis.conclusion}

🧩 **مسیر استدلال:**
${analysis.reasoningPath.map((step, i) => `${i+1}. ${step}`).join('\n')}

${analysis.followupQuestions && analysis.followupQuestions.length > 0 ? 
`💡 **سوالات پیگیری:** ${analysis.followupQuestions.join(' ')}` : ''}

🔍 **عمق تحلیل:** ${analysis.thinkingDepth}/5 | **اعتماد:** ${Math.round(analysis.confidence * 100)}%`;
}

// API هوشمند اصلی
app.get('/api/chat', async (req, res) => {
    try {
        const question = req.query.q;

        if (!question || question.trim().length < 2) {
            return res.json({
                success: false,
                error: 'لطفاً سوال معنادارتری مطرح کنید'
            });
        }

        console.log('🤔 پردازش سوال هوشمند:', question);

        // تحلیل هوشمند
        const analysis = await aiEngine.analyzeQuestion(question);
        
        // ساخت پاسخ نهایی
        const response = buildIntelligentResponse(question, analysis);

        res.json({
            success: true,
            question: question,
            answer: response,
            analysis: {
                complexity: analysis.complexityLevel || 'medium',
                reasoning_depth: analysis.thinkingDepth,
                confidence: analysis.confidence
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ خطا:', error);
        res.json({
            success: false,
            question: req.query.q,
            answer: '⚠️ خطا در پردازش. لطفاً دوباره تلاس کنید.',
            timestamp: new Date().toISOString()
        });
    }
});

// API وضعیت
app.get('/api/status', (req, res) => {
    res.json({
        status: 'intelligent_active',
        system: 'نطق مصطلح - سیستم هوشمند پایدار',
        version: '1.0.2',
        capabilities: [
            'تحلیل مفهومی پیشرفته',
            'استدلال چندمرحله‌ای',
            'مدیریت عمق تفکر',
            'پاسخ‌های زمینه‌آگاه'
        ],
        intelligence_metrics: {
            reasoning_depth: 'controlled',
            avoid_infinite_loops: 'active',
            adaptive_thinking: 'enabled'
        },
        timestamp: new Date().toISOString()
    });
});

// سلامت سرویس
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        message: 'سیستم هوشمند نطق مصطلح فعال است'
    });
});

// روت‌های پایه
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/ai-interface.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 سیستم هوشمند نطق مصطلح در پورت ${PORT} اجرا شد`);
    console.log(`🎯 حالت: هوشمند با کنترل عمق تفکر`);
    console.log(`🔗 دسترسی: http://localhost:${PORT}/ai-interface.html`);
    console.log('✅ آماده پاسخ‌دهی هوشمند و کنترل‌شده');
});

module.exports = app;
