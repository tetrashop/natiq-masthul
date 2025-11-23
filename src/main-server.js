const express = require('express');
const path = require('path');
const app = express();

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
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        features: [
            'پردازش زبان طبیعی',
            'پاسخگویی هوشمند',
            'یادگیری پیشرفته',
            'پشتیبانی از سوالات پیچیده'
        ]
    });
});

app.get('/api/chat', (req, res) => {
    const question = req.query.q;
    
    if (!question) {
        return res.json({
            error: 'لطفا سوال خود را وارد کنید',
            question: null,
            answer: null
        });
    }
    
    // پاسخ هوشمند شبیه‌سازی شده
    const responses = [
        `پاسخ به سوال "${question}": این یک پاسخ هوشمند از سیستم نطق مصطلح است!`,
        `سوال خوبی پرسیدید: "${question}". سیستم پردازش دانش من در حال تحلیل است.`,
        `در مورد "${question}" می‌توانم بگویم که سیستم نطق مصطلح برای پاسخ به چنین سوالاتی طراحی شده است.`,
        `پاسخ پیشرفته به "${question}": این نشان‌دهنده توانایی سیستم در پردازش سوالات پیچیده است.`
    ];
    
    const answer = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({
        question: question,
        answer: answer,
        timestamp: new Date().toISOString(),
        confidence: (Math.random() * 0.5 + 0.5).toFixed(2) // اطمینان 50-100%
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🧠 نطق مصطلح سرور در پورت ${PORT} اجرا شد`);
    console.log(`📧 دسترسی: http://localhost:${PORT}`);
    console.log(`🤖 رابط هوش مصنوعی: http://localhost:${PORT}/ai-interface.html`);
    console.log(`📊 وضعیت سیستم: http://localhost:${PORT}/status`);
});

module.exports = app;
