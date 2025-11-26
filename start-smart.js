const { NatiqEnhanced } = require('./natiq-ecosystem/NAtiQ-ENHANCED.js');

console.log('🧠 در حال بارگذاری نطق مصطلح...');
console.log('🔍 در جستجوی پورت آزاد...');

async function startNatiq() {
    try {
        const natiq = new NatiqEnhanced();
        await natiq.startServer(3000); // شروع از پورت 3000
        
        console.log('\n🎉 نطق مصطلح با موفقیت راه‌اندازی شد!');
        console.log('📚 امکانات موجود:');
        console.log('   • پردازش زبان فارسی پیشرفته');
        console.log('   • سیستم کش هوشمند');
        console.log('   • تحلیل احساسات و موجودیت‌ها');
        console.log('   • رابط REST API کامل');
        console.log('   • داشبورد مدیریت یکپارچه');
        console.log('   • سیستم پیدا کردن خودکار پورت آزاد');
        
    } catch (error) {
        console.error('❌ خطا در راه‌اندازی:', error.message);
        process.exit(1);
    }
}

startNatiq();
