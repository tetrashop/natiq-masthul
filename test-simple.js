// تست ساده برای بررسی ماژول‌ها
console.log('🧠 تست ماژول‌های سیستم نطق مصطلح\n');

try {
    const CoreKnowledgeGraph = require('./knowledge-graph/core-knowledge');
    console.log('✅ ماژول CoreKnowledgeGraph با موفقیت بارگذاری شد');
    
    const MultiAlgorithmProcessor = require('./reasoning-engine/multi-algorithm-processor');
    console.log('✅ ماژول MultiAlgorithmProcessor با موفقیت بارگذاری شد');
    
    const UnifiedResponseBuilder = require('./integration-layer/unified-response-builder');
    console.log('✅ ماژول UnifiedResponseBuilder با موفقیت بارگذاری شد');
    
    console.log('\n🎉 تمام ماژول‌ها با موفقیت بارگذاری شدند!');
    console.log('سیستم آماده اجراست.\n');
    
    // تست سریع عملکرد
    const kg = new CoreKnowledgeGraph();
    const patterns = ['مشتری', 'ناراضی', 'بازگرداندن'];
    const activeNodes = kg.activateNodes(patterns);
    console.log('🔍 گره‌های فعال:', activeNodes.map(n => n.id));
    
} catch (error) {
    console.log('❌ خطا در بارگذاری ماژول:', error.message);
    console.log('\n📁 ساختار فایل‌های موجود:');
    const fs = require('fs');
    
    try {
        const files = fs.readdirSync('.');
        console.log('فایل‌های اصلی:', files.filter(f => f.endsWith('.js')));
    } catch (e) {}
    
    try {
        const kgFiles = fs.readdirSync('./knowledge-graph');
        console.log('فایل‌های knowledge-graph:', kgFiles);
    } catch (e) {
        console.log('❌ پوشه knowledge-graph وجود ندارد');
    }
    
    try {
        const reFiles = fs.readdirSync('./reasoning-engine');
        console.log('فایل‌های reasoning-engine:', reFiles);
    } catch (e) {
        console.log('❌ پوشه reasoning-engine وجود ندارد');
    }
    
    try {
        const ilFiles = fs.readdirSync('./integration-layer');
        console.log('فایل‌های integration-layer:', ilFiles);
    } catch (e) {
        console.log('❌ پوشه integration-layer وجود ندارد');
    }
}
