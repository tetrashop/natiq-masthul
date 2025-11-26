import masterNatiq from './wisdom-system/master-natiq.js';

async function testFixedSystem() {
  console.log('🔧 تست سیستم تعمیر شده\\n');
  
  const testQuestions = [
    'چگونه در زندگی تعادل ایجاد کنم؟',
    'برای تصمیم‌گیری اخلاقی چه کنم؟',
    'چطور بهره‌وری خود را افزایش دهم؟'
  ];

  for (const question of testQuestions) {
    console.log('🤔 سوال:', question);
    try {
      const result = await masterNatiq.ask(question);
      console.log('✅ موفق - امتیاز:', result.finalResponse.scores.combinedScore.toFixed(2));
      console.log('⏱ زمان:', result.performanceMetrics.processingTime + 'ms');
      console.log('---\\n');
    } catch (error) {
      console.log('❌ خطا:', error.message);
      console.log('---\\n');
    }
  }

  // تست وضعیت سیستم
  const status = masterNatiq.getStatus();
  console.log('📊 وضعیت نهایی سیستم:');
  console.log('   وضعیت:', status.system.status);
  console.log('   سطح خرد:', status.system.wisdomLevel);
  console.log('   کارایی:', (status.performance.efficiency * 100).toFixed(1) + '%');
}

setTimeout(testFixedSystem, 2000);
