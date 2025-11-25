// تست سیستم استدلال‌گر جدید
import { SelfAwareAISystem } from './src/knowledge-boundary.js';

const ai = new SelfAwareAISystem();

async function testReasoningSystem() {
    console.log('🧠 تست سیستم نطق مصطلح - نسخه استدلال‌گر\n');
    
    const testQuestions = [
        'حاصل جمع ۱۵ و ۲۵ و ۱۰ چیست؟',
        'اگر ۵ را در ۸ ضرب کنیم چه می‌شود؟',
        '۴۰ منهای ۱۷ چند می‌شود؟',
        'دنباله اعداد ۲, ۴, ۶, ۸ را ادامه بده',
        'تحصیلات رامین اجلال چیست؟',
        'پیش بینی قیمت دلار فردا چیست؟' // سوال نامرتبط
    ];

    for (const question of testQuestions) {
        console.log(`\n🔍 سوال: "${question}"`);
        console.log('─'.repeat(50));
        
        const result = await ai.processQuestion(question);
        
        console.log(`📊 وضعیت: ${result.status}`);
        console.log(`🎯 اعتماد به نفس: ${result.confidence}`);
        
        if (result.learned) {
            console.log('💾 ✅ این مسئله یاد گرفته و ذخیره شد!');
        }
        
        console.log(`\n💬 پاسخ:\n${result.answer}`);
        console.log('═'.repeat(50));
        
        // مکث بین تست‌ها
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // نمایش آمار سیستم
    const stats = await ai.getSystemStats();
    console.log('\n📈 آمار سیستم:');
    console.log(JSON.stringify(stats, null, 2));
}

testReasoningSystem().catch(console.error);
