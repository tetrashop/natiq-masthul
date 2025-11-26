// تست ساده‌تر برای بررسی ماژول‌های اصلی
import('./wisdom-system/master-natiq.js')
  .then(module => {
    console.log('✅ ماژول master-natiq با موفقیت بارگذاری شد');
    return module.default;
  })
  .then(masterNatiq => {
    console.log('✅ کلاس MasterNatiq در دسترس است');
    console.log('🧠 سیستم آماده است!');
    process.exit(0);
  })
  .catch(error => {
    console.log('❌ خطا در بارگذاری:', error.message);
    console.log('📍 مسیر خطا:', error.stack.split('\n')[1]);
    process.exit(1);
  });
