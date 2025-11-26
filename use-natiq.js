import { ask, getStatus } from './wisdom-system/master-natiq.js';

// استفاده ساده
async function soal(question) {
  const result = await ask(question);
  return result.finalResponse.content;
}

// دریافت وضعیت
function vaziat() {
  return getStatus();
}

// صادر کردن برای استفاده جهانی
export { soal, vaziat, ask, getStatus };

// برای استفاده در اسکریپت‌های ساده
if (import.meta.url === `file://${process.argv[1]}`) {
  const question = process.argv[2] || 'چگونه زندگی بهتری داشته باشم؟';
  soal(question).then(answer => {
    console.log('🧠 نطق مصطلح:');
    console.log('🤔 سوال:', question);
    console.log('💡 پاسخ:', answer);
  });
}
