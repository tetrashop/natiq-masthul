const express = require('express');
const app = express();

// Middleware پایه
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

console.log('🔧 سرور تست ساده راه‌اندازی شد...');

// API چت بسیار ساده
app.get('/api/chat', (req, res) => {
    console.log('📥 دریافت درخواست - Query:', req.query);
    console.log('📥 پارامتر q:', req.query.q);
    
    const question = req.query.q;
    
    if (!question) {
        return res.status(400).json({
            success: false,
            error: 'پارامتر q وجود ندارد',
            received: req.query
        });
    }
    
    res.json({
        success: true,
        question: question,
        answer: `🧠 پاسخ تست: سوال "${question}" دریافت شد. سیستم کار می‌کند!`,
        timestamp: new Date().toISOString()
    });
});

// وضعیت سیستم
app.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        system: 'سرور تست ساده',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// سلامت
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 سرور تست در پورت ${PORT} اجرا شد`);
    console.log('✅ آماده تست API...');
});
