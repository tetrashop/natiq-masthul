import { ask, getStatus, runTests } from './wisdom-system/master-natiq.js';

async function comprehensiveTest() {
  console.log('🎯 تست جامع سیستم نطق مصطلح\\n');

  // 1. بررسی وضعیت سیستم
  console.log('1. 📊 وضعیت سیستم:');
  const status = getStatus();
  console.log('   وضعیت:', status.system.status);
  console.log('   سطح خرد:', status.system.wisdomLevel);
  console.log('   رضایت کاربر:', status.interface.userSatisfaction);
  console.log('   کارایی:', (status.performance.efficiency * 100).toFixed(1) + '%\\n');

  // 2. تست سوالات مختلف
  console.log('2. 🧪 تست سوالات مختلف:');
  
  const testCases = [
    {
      question: "چگونه می‌توانم در شغلم پیشرفت کنم؟",
      context: { urgency: true }
    },
    {
      question: "برای حل تعارض با همکاران چه راهکاری پیشنهاد می‌کنید؟",
      context: { emotionalNeed: true }
    },
    {
      question: "چطور زمان خود را بهتر مدیریت کنم؟",
      context: { formal: true }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\\n   سوال: "${testCase.question}"`);
    console.log('   زمینه:', testCase.context);
    
    try {
      const result = await ask(testCase.question, testCase.context);
      console.log('   ✅ موفق - امتیاز:', result.finalResponse.scores.combinedScore.toFixed(2));
      console.log('   استراتژی:', result.finalResponse.strategy.name);
      console.log('   زمان پردازش:', result.performanceMetrics.processingTime + 'ms');
    } catch (error) {
      console.log('   ❌ خطا:', error.message);
    }
  }

  // 3. تست تشخیص عملکرد
  console.log('\\n3. 🔍 تست تشخیص عملکرد:');
  try {
    const diagnostics = await runTests();
    console.log('   میانگین امتیاز خرد:', diagnostics.summary.averageWisdom.toFixed(2));
    console.log('   وضعیت کلی:', diagnostics.summary.overallStatus);
    console.log('   نتیجه:', diagnostics.summary.overallStatus === 'optimal' ? 'عالی 🏆' : 'نیاز بهبود 🔧');
  } catch (error) {
    console.log('   ❌ خطا در تشخیص:', error.message);
  }

  console.log('\\n🎉 تست کامل شد!');
}

// اجرای تست
setTimeout(comprehensiveTest, 1500);
