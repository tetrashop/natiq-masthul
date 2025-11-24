const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeServer } = require('./server-fix');
const enhancedNlpApi = require('./nlp-api-enhanced');

const app = initializeServer();
const PORT = process.env.PORT || 3001;

// اضافه کردن routes NLP پیشرفته
app.use('/api/nlp', enhancedNlpApi);

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '../')));

// Route اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface-fixed.html'));
});

// Route سلامت با اطلاعات پیشرفته
app.get('/health-detailed', (req, res) => {
    const nlpStats = require('./nlp-engine-enhanced').getNLPStats();
    res.json({
        status: 'success',
        message: 'سرور نطق مصطلح فعال است - نسخه پیشرفته',
        timestamp: new Date().toISOString(),
        version: '3.0.0',
        nlp: nlpStats,
        endpoints: {
            health: '/health',
            ask: '/api/ask',
            nlp_ask: '/api/nlp/ask-ai',
            nlp_stats: '/api/nlp/stats',
            interface: '/ai-interface-fixed.html'
        }
    });
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سرور حرفه‌ای نطق مصطلح فعال شد - نسخه پیشرفته');
    console.log('📡 درگاه:', PORT);
    console.log('🌐 آدرس دسترسی: http://localhost:' + PORT);
    console.log('🧠 موتور NLP پیشرفته با پایگاه دانش گسترده فعال است');
    console.log('💎 سیستم آماده پاسخگویی تخصصی است');
});

module.exports = app;
