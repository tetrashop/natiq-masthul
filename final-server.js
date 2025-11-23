const express = require('express');
const app = express();
const PORT = 3020;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ 
        status: '✅ FINAL Knowledge Server Running',
        port: PORT,
        message: 'سیستم پایگاه دانش با موفقیت راه‌اندازی شد',
        timestamp: new Date().toLocaleString('fa-IR')
    });
});

app.get('/test', (req, res) => {
    res.json({ success: true, message: 'آزمایش موفق' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 FINAL Server started on port', PORT);
});
