const NatiqMasthulIntegratedSystem = require('./main');

async function advancedTest() {
    const system = new NatiqMasthulIntegratedSystem();
    
    const testQuestions = [
        "چگونه مشتری حریصی که نرم‌افزار ما را کنار گذاشته بازگردانیم؟",
        "استراتژی بازگشت سرمایه برای جذب مجدد مشتریان ناراضی چیست؟",
        "روانشناسی مشتری حریص و راهکارهای عملی برای بازگرداندن آنها",
        "چگونه با ارتباط مؤثر مشتریان از دست رفته را بازگردانیم؟"
    ];

    console.log('🧠 تست پیشرفته سیستم نطق مصطلح\n');

    for (let i = 0; i < testQuestions.length; i++) {
        const question = testQuestions[i];
        console.log(`\n${'='.repeat(70)}`);
        console.log(`سوال ${i + 1}: ${question}`);
        console.log(`${'='.repeat(70)}`);
        
        const result = await system.processQuestion(question);
        console.log('\n💬 پاسخ سیستم:');
        console.log(result.response);
        
        console.log('\n📊 آمار عملکرد:');
        console.log(`• اعتماد سیستم: ${(result.performance.overallAverageConfidence * 100).toFixed(1)}%`);
        console.log(`• وضعیت سلامت: ${result.performance.systemHealth.status}`);
        console.log(`• الگوریتم‌های استفاده شده: ${result.metadata.algorithmsUsed.join(', ')}`);
        
        if (i < testQuestions.length - 1) {
            console.log('\n⏳ منتظر 2 ثانیه برای تست بعدی...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log(`\n${'🎉'.repeat(30)}`);
    console.log('تست پیشرفته با موفقیت تکمیل شد!');
    console.log(`${'🎉'.repeat(30)}\n`);
}

advancedTest().catch(console.error);
