const NatiqMasthulIntegratedSystem = require('./main');

async function testSystem() {
    const system = new NatiqMasthulIntegratedSystem();
    
    const questions = [
        "چگونه مشتری ناراضی را بازگردانیم؟",
        "استراتژی بازگشت سرمایه در جذب مشتری چیست؟",
        "روانشناسی مشتری حریص چگونه است؟"
    ];

    for (const question of questions) {
        console.log('\n' + '🔍'.repeat(50));
        console.log(`سوال: ${question}`);
        console.log('🔍'.repeat(50));
        
        const result = await system.processQuestion(question);
        console.log(result.response);
        console.log('\n📊 آمار:', JSON.stringify(result.performance, null, 2));
    }
}

testSystem();
