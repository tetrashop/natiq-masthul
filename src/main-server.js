const express = require('express');
const path = require('path');
const AdvancedNLP = require('./advanced-nlp');

const app = express();
const nlpEngine = new AdvancedNLP();

// middleware
app.use(express.json());
app.use(express.static('.'));

// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/ai-interface.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface.html'));
});

app.get('/status', (req, res) => {
    res.json({
        status: 'active',
        system: 'نطق مصطلح - سیستم هوشمند پردازش دانش',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        features: [
            'پردازش زبان طبیعی پیشرفته',
            'تشخیص هدف و موجودیت‌ها',
            'مدیریت context مکالمه',
            'پاسخ‌دهی هوشمند و مرتبط'
        ],
        capabilities: {
            nlp: true,
            context_aware: true,
            intelligent_responses: true,
            persian_language: true
        }
    });
});

app.get('/api/chat', async (req, res) => {
    const question = req.query.q;
    const userId = req.query.userId || 'default';
    
    if (!question) {
        return res.json({
            error: 'لطفا سوال خود را وارد کنید',
            question: null,
            answer: null
        });
    }
    
    try {
        // پردازش سوال با NLP پیشرفته
        const processed = nlpEngine.processQuestion(question, userId);
        const answer = nlpEngine.generateResponse(processed, userId);
        
        res.json({
            question: question,
            answer: answer,
            processed: processed,
            timestamp: new Date().toISOString(),
            confidence: 'high'
        });
        
    } catch (error) {
        res.json({
            question: question,
            answer: 'متأسفانه در پردازش سوال مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
            error: error.message,
            timestamp: new Date().toISOString(),
            confidence: 'low'
        });
    }
});

// API پیشرفته برای چت‌بات
app.post('/api/advanced-chat', async (req, res) => {
    const { message, userId = 'default', context = {} } = req.body;
    
    if (!message) {
        return res.status(400).json({
            error: 'پیام الزامی است'
        });
    }
    
    try {
        const processed = nlpEngine.processQuestion(message, userId);
        const answer = nlpEngine.generateResponse(processed, userId);
        
        res.json({
            success: true,
            response: answer,
            analysis: {
                intent: processed.intent,
                entities: processed.entities,
                context_used: true
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'خطا در پردازش سوال',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🧠 نطق مصطلح سرور پیشرفته در پورت ${PORT} اجرا شد`);
    console.log(`📧 دسترسی: http://localhost:${PORT}`);
    console.log(`🤖 رابط هوش مصنوعی: http://localhost:${PORT}/ai-interface.html`);
    console.log(`📊 وضعیت سیستم: http://localhost:${PORT}/status`);
    console.log(`🔌 API چت: http://localhost:${PORT}/api/chat`);
});

module.exports = app;
