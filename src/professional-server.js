const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeServer } = require('./server-fix');

const app = initializeServer();
const PORT = process.env.PORT || 3001;

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '../')));

// Route اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface.html'));
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سرور حرفه‌ای نطق مصطلح فعال شد');
    console.log('📡 درگاه:', PORT);
    console.log('🌐 آدرس دسترسی: http://localhost:' + PORT);
    console.log('💎 سیستم آماده پاسخگویی به سوالات است');
});

module.exports = app;
