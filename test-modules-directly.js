// تست مستقیم ماژول‌ها
import wisdomModule from './wisdom-layer/enlightened-wisdom.js';
import efficiencyModule from './efficiency-optimizer/productivity-master.js';

async function testModules() {
  console.log('🧪 تست مستقیم ماژول‌ها\\n');
  
  try {
    // تست ماژول خرد
    console.log('1. تست ماژول خرد...');
    let wisdom;
    if (typeof wisdomModule === 'function') {
      wisdom = new wisdomModule();
    } else {
      wisdom = new wisdomModule.default();
    }
    console.log('✅ ماژول خرد ساخته شد');
    
    const concern = wisdom.extractCoreConcern('چگونه تعادل ایجاد کنم؟');
    console.log('   نگرانی اصلی:', concern);
    
    // تست ماژول کارایی
    console.log('\\n2. تست ماژول کارایی...');
    let efficiency;
    if (typeof efficiencyModule === 'function') {
      efficiency = new efficiencyModule();
    } else {
      efficiency = new efficiencyModule.default();
    }
    console.log('✅ ماژول کارایی ساخته شد');
    
    const profile = efficiency.analyzeQuestionProfile('تست سوال');
    console.log('   پروفایل سوال:', profile.complexity);
    
    console.log('\\n🎉 همه ماژول‌ها به درستی کار می‌کنند!');
    
  } catch (error) {
    console.log('❌ خطا در تست ماژول‌ها:', error.message);
    console.log('🔍 جزئیات:', error.stack);
  }
}

testModules();
