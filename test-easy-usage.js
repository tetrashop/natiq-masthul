import { ask, getStatus } from './wisdom-system/master-natiq.js';

async function testEasyUsage() {
  console.log('🎯 تست استفاده آسان از نطق مصطلح\\n');
  
  // تست سریع
  const question = 'چگونه زندگی شاد و موفقی داشته باشم؟';
  console.log('سوال:', question);
  
  const answer = await ask(question);
  console.log('\\n🤖 پاسخ سیستم:');
  console.log(answer.finalResponse.content);
  console.log('\\n📈 امتیاز:', answer.finalResponse.scores.combinedScore.toFixed(2));
  
  // تست وضعیت
  const status = getStatus();
  console.log('\\n📊 وضعیت سیستم:', status.system.status);
  console.log('سطح خرد:', status.system.wisdomLevel.toFixed(2));
}

testEasyUsage();
