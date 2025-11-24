const express = require('express');
const cors = require('cors');
const path = require('path');
const comprehensiveApi = require('./comprehensive-api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewareهای اساسی
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API جامع
app.use('/api/comprehensive', comprehensiveApi);

// Route سلامت
app.get('/health', (req, res) => {
    const stats = require('./comprehensive-nlp').getSystemStats();
    res.json({
        status: 'success',
        message: 'سیستم جامع نطق مصطلح فعال است',
        timestamp: new Date().toISOString(),
        version: stats.version,
        mode: 'comprehensive',
        knowledgeBase: 'جامع'
    });
});

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '../')));

// Route اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface-fixed.html'));
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سیستم جامع نطق مصطلح فعال شد');
    console.log('📡 درگاه:', PORT);
    console.log('🌐 آدرس دسترسی: http://localhost:' + PORT);
    console.log('🧠 پایگاه دانش: جامع و تخصصی');
    console.log('💎 آماده پاسخگویی با اطلاعات کامل');
});

module.exports = app;
