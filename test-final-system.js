import masterNatiq from './wisdom-system/master-natiq.js';

async function comprehensiveTest() {
  console.log('🧪 تست جامع سیستم تعمیر شده\\n');
  
  const testQuestions = [
    'چگونه در زندگی تعادل ایجاد کنم؟',
    'راههای افزایش بهره‌وری در کار چیست؟',
    'برای تصمیم‌گیری اخلاقی چه معیارهایی داشته باشم؟'
  ];

  for (const question of testQuestions) {
    console.log('🤔 سوال:', question);
    
    try {
      const result = await masterNatiq.ask(question);
      
      console.log('✅ موفق!');
      console.log('📝 پاسخ:', result.finalResponse.content);
      console.log('📊 امتیاز خرد:', result.finalResponse.scores.wisdomScore.toFixed(2));
      console.log('📊 امتیاز کارایی:', result.finalResponse.scores.efficiencyScore.toFixed(2));
      console.log('⏱ زمان:', result.performanceMetrics.processingTime + 'ms');
      console.log('---\\n');
      
    } catch (error) {
      console.log('❌ خطا:', error.message);
      console.log('🔍 جزئیات:', error.stack.split('\\n')[0]);
      console.log('---\\n');
    }
  }

  // تست وضعیت سیستم
  try {
    const status = masterNatiq.getStatus();
    console.log('📊 وضعیت نهایی سیستم:');
    console.log('   وضعیت:', status.system.status);
    console.log('   ماژول‌ها:', status.system.modules.join(', '));
    console.log('   سطح خرد:', status.system.wisdomLevel.toFixed(2));
    console.log('   کارایی:', (status.system.efficiency * 100).toFixed(1) + '%');
  } catch (error) {
    console.log('❌ خطا در دریافت وضعیت:', error.message);
  }
}

// صبر برای راه‌اندازی سیستم
setTimeout(comprehensiveTest, 3000);
