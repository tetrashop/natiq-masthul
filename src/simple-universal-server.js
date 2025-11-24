const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middlewareهای اساسی
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '../')));

// Route سلامت
app.get('/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'سرور نطق مصطلح فعال است',
        timestamp: new Date().toISOString(),
        version: '3.1.0'
    });
});

// API جهانی ساده
app.post('/api/universal/ask', (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({
                status: 'error',
                message: 'سوال ارسال نشده است'
            });
        }

        console.log('📝 سوال دریافت شد:', question);

        // پاسخ ساده برای تست
        const response = {
            status: 'success',
            answer: `سوال شما "${question}" دریافت شد. سیستم نطق مصطلح با موفقیت پاسخ می‌دهد. این یک پاسخ تستی از سرور ساده است.`,
            confidence: 0.95,
            postsCount: 166,
            timestamp: new Date().toISOString(),
            questionId: Math.random().toString(36).substr(2, 9)
        };

        res.json(response);

    } catch (error) {
        console.error('❌ خطا:', error);
        res.status(500).json({
            status: 'error',
            message: 'خطای داخلی سرور'
        });
    }
});

// Route اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface-fixed.html'));
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سرور ساده نطق مصطلح فعال شد');
    console.log('📡 درگاه:', PORT);
    console.log('🌐 آدرس: http://localhost:' + PORT);
    console.log('💎 سیستم آماده پاسخگویی است');
});

// مدیریت graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 توقف سرور...');
    process.exit(0);
});
