const express = require('express');
const cors = require('cors');
const path = require('path');
const universalApi = require('./universal-api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewareهای اساسی
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API جهانی
app.use('/api/universal', universalApi);

// Route سلامت
app.get('/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'سیستم جهانی نطق مصطلح فعال است',
        timestamp: new Date().toISOString(),
        version: '3.1.0',
        mode: 'universal'
    });
});

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '../')));

// Route اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface-fixed.html'));
});

// Route اطلاعات سیستم
app.get('/system', (req, res) => {
    res.json({
        status: 'success',
        system: 'نطق مصطلح - نسخه جهانی',
        version: '3.1.0',
        description: 'سیستم هوش مصنوعی همه‌کاره برای پاسخ به سوالات متنوع',
        features: [
            'پاسخ‌دهی به سوالات تخصصی',
            'مشاوره در حوزه‌های عمومی',
            'تحلیل سیستم‌ها و فرآیندها',
            'راه‌نمایی حرفه‌ای',
            'پشتیبانی از تمامی حوزه‌های فناوری'
        ],
        timestamp: new Date().toISOString()
    });
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سیستم جهانی نطق مصطلح فعال شد');
    console.log('📡 درگاه:', PORT);
    console.log('🌐 آدرس دسترسی: http://localhost:' + PORT);
    console.log('💎 حالت: جهانی (پاسخ به تمام سوالات)');
    console.log('🧠 پایگاه دانش: جامع و همه‌کاره');
    console.log('🎯 آماده پاسخگویی به هر نوع سوال!');
});

module.exports = app;
