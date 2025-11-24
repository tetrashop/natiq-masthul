import SelfAwareAISystem from '../src/knowledge-boundary.js';

async function testSystem() {
    console.log("🧪 شروع تست سیستم خودآگاه...\n");
    
    const ai = new SelfAwareAISystem();
    
    const testQuestions = [
        "قضیه اجلال در کارهای مریم میرزاخانی از آن که بود",
        "تحصیلات رامین اجلال چیست؟",
        "سلام",
        "تو کیستی؟",
        "نظریه نسبیت انیشتین چیست؟",
        "س"
    ];
    
    for (const question of testQuestions) {
        console.log(`❓ سوال: "${question}"`);
        console.log("─".repeat(50));
        
        const result = await ai.processQuestion(question);
        
        console.log(`📊 وضعیت: ${result.status}`);
        console.log(`🎯 اعتماد: ${(result.confidence * 100).toFixed(1)}%`);
        
        if (result.analysis?.relevance) {
            console.log(`🔍 امتیاز مرتبط بودن: ${(result.analysis.relevance.relevanceScore * 100).toFixed(1)}%`);
        }
        
        console.log(`💡 پاسخ:`);
        console.log(result.answer);
        console.log("\n" + "=".repeat(70) + "\n");
    }
}

testSystem().catch(console.error);
