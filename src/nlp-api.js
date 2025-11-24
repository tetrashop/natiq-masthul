const express = require('express');
const nlpEngine = require('./nlp-engine');

const router = express.Router();

// Endpoint پردازش سوالات با NLP پیشرفته
router.post('/ask-ai', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({
                status: 'error',
                message: 'سوال ارسال نشده است'
            });
        }

        console.log('🧠 پردازش سوال با NLP:', question);
        
        // استفاده از موتور NLP پیشرفته
        const nlpResponse = await nlpEngine.processQuestion(question);
        
        res.json({
            status: 'success',
            answer: nlpResponse.answer,
            confidence: nlpResponse.confidence,
            postsCount: nlpResponse.postsCount,
            timestamp: new Date().toISOString(),
            questionId: Math.random().toString(36).substr(2, 9)
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

// Endpoint دریافت اطلاعات NLP
router.get('/stats', (req, res) => {
    const stats = nlpEngine.getNLPStats();
    res.json({
        status: 'success',
        nlp: stats,
        system: 'نطق مصطلح v3.0.0',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
