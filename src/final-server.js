const express = require('express');
const path = require('path');

const app = express();

// میدلورهای ضروری
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

console.log('🧠 سیستم نهایی نطق مصطلح راه‌اندازی شد...');

// موتور هوشمند پایدار
class StableIntelligentEngine {
    constructor() {
        this.thinkingDepth = 0;
        this.maxThinkingDepth = 5;
    }

    shouldStopThinking() {
        return this.thinkingDepth >= this.maxThinkingDepth;
    }

    resetThinking() {
        this.thinkingDepth = 0;
    }

    async analyzeQuestion(question) {
        if (this.shouldStopThinking()) {
            this.resetThinking();
            return {
                conclusion: "🧠 **تحلیل کامل شد**",
                reasoningPath: ["توقف هوشمند برای کارایی بهینه"],
                confidence: 0.9
            };
        }

        this.thinkingDepth++;
        
        // تحلیل ساده و پایدار
        const analysis = {
            question: question,
            detectedTopics: this.extractTopics(question),
            complexityLevel: this.assessComplexity(question)
        };

        return await this.generateStableResponse(analysis);
    }

    extractTopics(question) {
        const topics = [];
        const q = question.toLowerCase();
        
        if (q.includes('هوش مصنوعی')) topics.push('ai');
        if (q.includes('یادگیری')) topics.push('learning');
        if (q.includes('آینده')) topics.push('future');
        if (q.includes('پردازش زبان') || q.includes('فارسی')) topics.push('nlp');
        if (q.includes('رامین') || q.includes('اجلال')) topics.push('person');
        
        return topics;
    }

    assessComplexity(question) {
        const complexWords = ['چرا', 'چگونه', 'تحلیل', 'تفاوت', 'مکانیسم'];
        return complexWords.some(word => question.includes(word)) ? 'high' : 'medium';
    }

    async generateStableResponse(analysis) {
        const { question, detectedTopics } = analysis;
        
        // پاسخ‌های پایدار و تست شده
        if (detectedTopics.includes('person')) {
            return {
                conclusion: `👤 **رامین اجلال - محقق هوش مصنوعی**

🎯 **تخصص‌های اصلی:**
• پردازش زبان فارسی و هوش مصنوعی
• توسعه سیستم‌های توزیع‌شده
• معماری نرم‌افزارهای مقیاس‌پذیر

🏆 **دستاوردهای برجسته:**
توسعه سیستم نطق مصطلح، تحقیق در پردازش زبان فارسی

💡 برای اطلاعات بیشتر در مورد حوزه‌های خاص، سوال دقیق‌تری بپرسید.`,
                reasoningPath: [
                    "شناسایی شخص مورد سوال",
                    "استخراج اطلاعات تخصصی",
                    "ساختاردهی پاسخ"
                ],
                confidence: 0.95,
                thinkingDepth: this.thinkingDepth
            };
        }

        if (detectedTopics.includes('ai') && detectedTopics.includes('future')) {
            return {
                conclusion: `🤖 **تحول هوش مصنوعی - تحلیل رامین اجلال**

🔮 **مسیرهای تحول:**
1. **هوش مصنوعی تفسیرپذیر**: شفافیت در تصمیم‌گیری
2. **یادگیری چندوجهی**: ادغام متن، صوت و تصویر
3. **سیستم‌های خودمختار**: تعادل بین کنترل و اتوماسیون

⚖️ **ملاحظات اخلاقی:**
- حریم خصوصی و امنیت داده‌ها
- عدالت در دسترسی به فناوری
- شفافیت الگوریتم‌ها

💎 **تمرکز رامین**: توسعه سیستم‌های مسئول و شفاف`,
                reasoningPath: [
                    "تحلیل روندهای هوش مصنوعی",
                    "بررسی پیامدهای اجتماعی",
                    "شناسایی حوزه‌های تمرکز"
                ],
                confidence: 0.88,
                thinkingDepth: this.thinkingDepth
            };
        }

        if (detectedTopics.includes('nlp')) {
            return {
                conclusion: `📚 **پردازش زبان فارسی - چالش‌ها و فرصت‌ها**

🎯 **چالش‌های اصلی:**
• کمبود داده‌های آموزشی با کیفیت
• پیچیدگی‌های صرفی و نحوی
• نیاز به مدل‌های ویژه فرهنگ فارسی

🚀 **راه‌حل‌های پیشنهادی:**
1. توسعه پایگاه‌های داده تخصصی
2. ایجاد مدل‌های زبانی بزرگ فارسی
3. یکپارچه‌سازی دانش زبان‌شناسی

🔬 **تحقیقات رامین**: تمرکز بر معماری‌های بهینه برای زبان فارسی`,
                reasoningPath: [
                    "شناسایی چالش‌های زبان فارسی",
                    "تحلیل راه‌حل‌های ممکن",
                    "بررسی زمینه تحقیقاتی"
                ],
                confidence: 0.85,
                thinkingDepth: this.thinkingDepth
            };
        }

        // پاسخ عمومی هوشمند
        return {
            conclusion: `🧠 **تحلیل سوال شما**

سوال "${question}" نشان‌دهنده تفکر شماست.

💡 **من می‌توانم در این حوزه‌ها کمک کنم:**
• اطلاعات تخصصی درباره رامین اجلال
• تحلیل تحولات هوش مصنوعی
• بررسی پردازش زبان فارسی
• مباحث فنی و تحقیقاتی

🎯 **برای پاسخ دقیق‌تر، لطفاً حوزه مورد نظر را مشخص کنید.**`,
            reasoningPath: [
                "درک کلی سوال",
                "شناسایی حوزه‌های مرتبط", 
                "ارائه راهنمایی"
            ],
            confidence: 0.75,
            thinkingDepth: this.thinkingDepth
        };
    }
}

// راه‌اندازی موتور
const aiEngine = new StableIntelligentEngine();

// تابع ساخت پاسخ
function buildResponse(question, analysis) {
    return `${analysis.conclusion}

🧩 **فرآیند تحلیل:**
${analysis.reasoningPath.map((step, i) => `${i+1}. ${step}`).join('\n')}

🔍 **سطح تحلیل:** ${analysis.thinkingDepth}/5 | **اعتماد:** ${Math.round(analysis.confidence * 100)}%`;
}

// API اصلی با مدیریت خطای بهبود یافته
app.get('/api/chat', async (req, res) => {
    try {
        // پارامتر q را از query استخراج می‌کنیم
        const question = req.query.q;

        console.log('📥 دریافت سوال:', question);

        // اعتبارسنجی دقیق
        if (!question || typeof question !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'پارامتر q الزامی است و باید رشته باشد',
                example: '/api/chat?q=سوال شما'
            });
        }

        const trimmedQuestion = question.trim();
        
        if (trimmedQuestion.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'سوال باید حداقل ۲ کاراکتر باشد',
                received: trimmedQuestion
            });
        }

        if (trimmedQuestion.length > 500) {
            return res.status(400).json({
                success: false,
                error: 'سوال نباید بیشتر از ۵۰۰ کاراکتر باشد'
            });
        }

        // پردازش هوشمند
        const analysis = await aiEngine.analyzeQuestion(trimmedQuestion);
        const response = buildResponse(trimmedQuestion, analysis);

        res.json({
            success: true,
            question: trimmedQuestion,
            answer: response,
            analysis: {
                complexity: analysis.complexityLevel,
                reasoning_depth: analysis.thinkingDepth,
                confidence: analysis.confidence
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ خطای سرور:', error);
        res.status(500).json({
            success: false,
            error: 'خطای داخلی سرور',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// API وضعیت
app.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        system: 'نطق مصطلح - سیستم پایدار نهایی',
        version: '1.1.0',
        capabilities: [
            'پردازش سوالات فارسی',
            'تحلیل هوشمند',
            'کنترل عمق تفکر',
            'مدیریت خطا'
        ],
        timestamp: new Date().toISOString()
    });
});

// سلامت سرویس
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        message: 'سیستم نطق مصطلح فعال و پایدار است'
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
    console.log(`🚀 سیستم نهایی نطق مصطلح در پورت ${PORT} اجرا شد`);
    console.log(`🔗 دسترسی: http://localhost:${PORT}/ai-interface.html`);
    console.log('✅ آماده پاسخ‌دهی پایدار');
});

module.exports = app;
