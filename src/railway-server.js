const express = require('express');
const cors = require('cors');
const path = require('path');
const comprehensiveApi = require('./comprehensive-api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewareهای اساسی
app.use(cors({
    origin: [
        'https://natiq-masthul.railway.app',
        'https://natiq-masthul-production.up.railway.app',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API جامع
app.use('/api/comprehensive', comprehensiveApi);

// Route سلامت
app.get('/health', (req, res) => {
    const stats = require('./comprehensive-nlp').getSystemStats();
    res.json({
        status: 'success',
        message: 'سیستم نطق مصطلح روی Railway فعال است',
        timestamp: new Date().toISOString(),
        version: stats.version,
        environment: process.env.NODE_ENV || 'development',
        railway: true
    });
});

// Route اطلاعات سیستم
app.get('/system', (req, res) => {
    const stats = require('./comprehensive-nlp').getSystemStats();
    res.json({
        status: 'success',
        system: 'نطق مصطلح - Railway Deployment',
        version: stats.version,
        environment: process.env.NODE_ENV || 'development',
        features: [
            'پایگاه دانش جامع',
            'پردازش زبان فارسی',
            'APIهای RESTful',
            'سیستم Enterprise'
        ],
        timestamp: new Date().toISOString()
    });
});

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '../')));

// Route اصلی - رابط کاربری
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../railway-interface.html'));
});

// Route fallback برای SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../railway-interface.html'));
});

// مدیریت خطاها
app.use((err, req, res, next) => {
    console.error('❌ خطای سرور:', err);
    res.status(500).json({
        status: 'error',
        message: 'خطای داخلی سرور',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سیستم نطق مصطلح روی Railway فعال شد');
    console.log('📡 درگاه:', PORT);
    console.log('🌐 محیط:', process.env.NODE_ENV || 'development');
    console.log('💎 سیستم آماده ارائه خدمات است');
});

module.exports = app;
