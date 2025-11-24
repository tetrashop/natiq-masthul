/**
 * رفع مشکل ارتباط سرور - نطق مصطلح v3.0
 */

const express = require('express');
const cors = require('cors');

function initializeServer() {
    const app = express();
    
    // Middlewareهای ضروری
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));
    
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    // Route سلامت سرور
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'سرور نطق مصطلف فعال است',
            timestamp: new Date().toISOString(),
            version: '3.0.0'
        });
    });
    
    // Route اصلی پردازش سوالات
    app.post('/api/ask', (req, res) => {
        try {
            const { question } = req.body;
            
            if (!question) {
                return res.status(400).json({
                    status: 'error',
                    message: 'سوال ارسال نشده است'
                });
            }
            
            // پردازش هوشمند سوال
            console.log('📝 سوال دریافت شد:', question);
            
            // پاسخ موقت - در نسخه کامل با AI ادغام می‌شود
            const response = {
                status: 'success',
                answer: `سوال شما "${question}" دریافت شد. سیستم در حال پردازش پاسخ تخصصی است...`,
                timestamp: new Date().toISOString(),
                questionId: Math.random().toString(36).substr(2, 9)
            };
            
            res.json(response);
            
        } catch (error) {
            console.error('❌ خطا در پردازش سوال:', error);
            res.status(500).json({
                status: 'error',
                message: 'خطای داخلی سرور',
                error: error.message
            });
        }
    });
    
    return app;
}

module.exports = { initializeServer };
