const express = require('express');
const app = express();
app.use(express.json());

console.log('🔍 شروع دیباگ سرور...');

// تست ماژول‌ها
try {
    const AdvancedIntentRecognition = require('./src/nlp/advanced-intent-recognition');
    console.log('✅ ماژول تشخیص هدف بارگذاری شد');
} catch (e) {
    console.log('❌ خطا در بارگذاری تشخیص هدف:', e.message);
}

try {
    const AdvancedKnowledgeGraph = require('./src/knowledge/advanced-knowledge-graph');
    console.log('✅ ماژول پایگاه دانش بارگذاری شد');
} catch (e) {
    console.log('❌ خطا در بارگذاری پایگاه دانش:', e.message);
}

// تست مستقیم API
app.get('/api/debug-chat', (req, res) => {
    const question = req.query.q || 'تست';
    
    try {
        // پاسخ ساده مستقیم
        const answer = `🧪 **پاسخ دیباگ**: سوال "${question}" دریافت شد
        
✅ سیستم در حال کار است
🔧 حالت: دیباگ مستقیم
💡 این نشان می‌دهد که سرور فعال است`;

        res.json({
            success: true,
            question: question,
            answer: answer,
            debug: true
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

app.listen(3001, () => {
    console.log('🔧 سرور دیباگ در پورت 3001 اجرا شد');
});
