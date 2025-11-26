const { NatiqEnhanced } = require('./natiq-ecosystem/NAtiQ-ENHANCED.js');

console.log('🧠 در حال بارگذاری نطق مصطلح...');
console.log('⏳ لطفا کمی صبر کنید...');

setTimeout(() => {
    try {
        const natiq = new NatiqEnhanced();
        natiq.startServer(3001);  // تغییر به پورت 3001
        
        console.log('\n🎉 نطق مصطلح آماده است!');
        console.log('📚 امکانات موجود:');
        console.log('   • پردازش زبان فارسی پیشرفته');
        console.log('   • سیستم کش هوشمند');
        console.log('   • تحلیل احساسات و موجودیت‌ها');
        console.log('   • رابط REST API کامل');
        console.log('   • داشبورد مدیریت یکپارچه');
        console.log('📍 آدرس جدید: http://localhost:3001');
        
    } catch (error) {
        console.error('❌ خطا در راه‌اندازی:', error.message);
        process.exit(1);
    }
}, 1000);
