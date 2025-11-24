const express = require('express');
const comprehensiveNLP = require('./comprehensive-nlp');

const router = express.Router();

// Endpoint پردازش سوالات با NLP جامع
router.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({
                status: 'error',
                message: 'سوال ارسال نشده است'
            });
        }

        console.log('🧠 پردازش سوال جامع:', question);
        
        // استفاده از موتور NLP جامع
        const nlpResponse = await comprehensiveNLP.processQuestion(question);
        
        res.json({
            status: 'success',
            answer: nlpResponse.answer,
            confidence: nlpResponse.confidence,
            postsCount: nlpResponse.postsCount,
            category: nlpResponse.category,
            timestamp: new Date().toISOString(),
            questionId: Math.random().toString(36).substr(2, 9),
            system: 'نطق مصطلح v3.2.0 - نسخه جامع'
        });

    } catch (error) {
        console.error('❌ خطا در پردازش NLP:', error);
        res.status(500).json({
            status: 'error',
            message: 'خطا در پردازش هوشمند سوال',
            error: error.message
        });
    }
});

// Endpoint دریافت اطلاعات سیستم
router.get('/system-info', (req, res) => {
    const stats = comprehensiveNLP.getSystemStats();
    res.json({
        status: 'success',
        system: {
            name: 'نطق مصطلح - سیستم جامع',
            version: stats.version,
            description: 'سیستم هوش مصنوعی با پایگاه دانش کامل و تخصصی'
        },
        capabilities: {
            domains: ['تحصیلات', 'تخصص‌ها', 'سوابق کاری', 'دستاوردها', 'تحقیقات'],
            features: ['پاسخ‌های تخصصی', 'اطلاعات جامع', 'تحلیل هوشمند', 'پشتیبانی چندحوزه‌ای']
        },
        stats: stats,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
