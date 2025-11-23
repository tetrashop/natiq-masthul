const express = require('express');
const path = require('path');
const AdvancedNLPEnhanced = require('./advanced-nlp-enhanced');

const app = express();
const nlpEngine = new AdvancedNLPEnhanced();

app.use(express.json());
app.use(express.static('.'));

// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/ai-interface.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface.html'));
});

app.get('/status', (req, res) => {
    res.json({
        status: 'active',
        system: 'نطق مصطلح - سیستم هوشمند پیشرفته',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        capabilities: {
            deep_analysis: true,
            spell_correction: true,
            context_management: true,
            knowledge_reasoning: true,
            honest_responses: true
        }
    });
});

app.get('/api/chat', async (req, res) => {
    const question = req.query.q;
    const userId = req.query.userId || 'default';
    
    if (!question) {
        return res.json({
            error: 'لطفا سوال خود را وارد کنید',
            question: null,
            answer: null
        });
    }
    
    try {
        const processed = nlpEngine.processQuestion(question, userId);
        
        res.json({
            question: question,
            answer: processed.response,
            analysis: {
                corrected_question: processed.corrected_question,
                true_intent: processed.true_intent,
                confidence: processed.confidence,
                knowledge_available: processed.knowledge_status.available
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.json({
            question: question,
            answer: 'متأسفانه در پردازش سوال مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
            error: error.message,
            timestamp: new Date().toISOString(),
            confidence: 'low'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🧠 نطق مصطلح پیشرفته در پورت ${PORT} اجرا شد`);
    console.log(`🔗 دسترسی: http://localhost:${PORT}`);
});

module.exports = app;
