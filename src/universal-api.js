const express = require('express');
const universalNLP = require('./universal-nlp');

const router = express.Router();

// Endpoint اصلی برای تمام سوالات
router.post('/ask', async (req, res) => {
    try {
        const { question, mode = 'universal' } = req.body;
        
        if (!question) {
            return res.status(400).json({
                status: 'error',
                message: 'سوال ارسال نشده است'
            });
        }

        console.log('🌐 پردازش سوال جهانی:', question);
        
        // استفاده از موتور جهانی
        const response = await universalNLP.processUniversalQuestion(question);
        
        res.json({
            status: 'success',
            answer: response.answer,
            confidence: response.confidence,
            domain: response.domain,
            postsCount: response.postsCount,
            systemMode: response.systemMode,
            timestamp: response.timestamp,
            questionId: Math.random().toString(36).substr(2, 9)
        });

    } catch (error) {
        console.error('❌ خطا در پردازش سوال جهانی:', error);
        res.status(500).json({
            status: 'error',
            message: 'خطا در پردازش سوال',
            error: error.message
        });
    }
});

// Endpoint دریافت اطلاعات سیستم
router.get('/system-info', (req, res) => {
    const stats = universalNLP.getSystemStats();
    res.json({
        status: 'success',
        system: {
            name: 'نطق مصطلح - سیستم جهانی',
            version: stats.version,
            mode: 'universal',
            description: 'سیستم هوش مصنوعی همه‌کاره برای پاسخ به سوالات متنوع'
        },
        capabilities: {
            domains: Object.keys(universalNLP.knowledgeDomains),
            coverage: 'تمامی حوزه‌های فناوری اطلاعات و کسب‌وکار',
            features: ['پاسخ تخصصی', 'مشاوره عمومی', 'تحلیل سیستم', 'راه‌نمایی حرفه‌ای']
        },
        stats: stats,
        timestamp: new Date().toISOString()
    });
});

// Endpoint دریافت حوزه‌های پشتیبانی شده
router.get('/domains', (req, res) => {
    const domains = universalNLP.knowledgeDomains;
    res.json({
        status: 'success',
        domains: {
            تخصصی: domains.core_expertise,
            عمومی: domains.general_knowledge,
            خدماتی: domains.general_services
        },
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
