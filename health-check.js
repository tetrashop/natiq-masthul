// بررسی سلامت سیستم یکپارچه - نسخه ES Module
console.log('🧠 بررسی سلامت سیستم نطق مصطلح...');

async function checkHealth() {
    try {
        // بارگذاری ماژول‌ها به صورت ES Module
        const natiqModule = await import('./natiq-ecosystem/natiq-core.js');
        const nlpModule = await import('./natiq-ecosystem/nlp-engine.js');
        
        const NatiqCore = natiqModule.default;
        const PersianNLP = nlpModule.default;
        
        console.log('✅ ماژول‌های اصلی بارگذاری شدند');
        
        // تست عملکرد
        const core = new NatiqCore();
        const nlp = new PersianNLP();
        
        const testQuestion = "سلام چطور میتونم برنامه نویسی یاد بگیرم؟";
        const analysis = core.analyzeQuestion(testQuestion);
        const nlpAnalysis = nlp.processText(testQuestion);
        
        console.log('🎯 تست عملکرد موفق:');
        console.log('   📝 سوال: "' + testQuestion + '"');
        console.log('   🎯 هدف: ' + analysis.intent);
        console.log('   😊 احساس: ' + nlpAnalysis.sentiment);
        console.log('   📊 کلمات: ' + nlpAnalysis.statistics.wordCount);
        console.log('   🧠 پیچیدگی: ' + (nlpAnalysis.statistics.complexity * 100).toFixed(1) + '%');
        
        // تست وضعیت سیستم
        const status = core.getPerformanceStats();
        console.log('📈 آمار سیستم:');
        console.log('   🔄 تعداد تعاملات: ' + status.interactionCount);
        console.log('   📈 نرخ موفقیت: ' + status.successRate + '%');
        console.log('   ⏱️ زمان فعالیت: ' + status.uptime + ' ثانیه');
        
        console.log('🎉 سیستم نطق مصطلح کاملاً سالم است!');
        return true;
        
    } catch (error) {
        console.error('❌ خطا در بررسی سلامت:', error.message);
        console.error('   جزئیات:', error.stack);
        return false;
    }
}

// اجرای بررسی
checkHealth().then(success => {
    if (success) {
        console.log('🚀 آماده برای دپلوی روی Cloudflare!');
    } else {
        console.log('🔧 نیاز به تعمیر قبل از دپلوی');
    }
});
