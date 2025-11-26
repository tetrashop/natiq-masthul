/**
 * 🎯 فایل استفاده آسان از نطق مصطلح خردمند
 */

import { ask, getStatus } from './wisdom-system/master-natiq.js';

class EasyNatiq {
  constructor() {
    this.ready = false;
    this.init();
  }

  async init() {
    // منتظر راه‌اندازی سیستم بمانیم
    setTimeout(() => {
      this.ready = true;
      console.log('🧠 نطق مصطلح آماده است!');
    }, 2000);
  }

  /**
   * پرسش ساده از سیستم
   */
  async soal(questionText, settings = {}) {
    if (!this.ready) {
      return '⏳ سیستم در حال راه‌اندازی است...';
    }

    try {
      const result = await ask(questionText, settings);
      return result.finalResponse.content;
    } catch (error) {
      return `❌ خطا: ${error.message}`;
    }
  }

  /**
   * دریافت وضعیت سیستم
   */
  vaziat() {
    return getStatus();
  }

  /**
   * پرسش سریع با پاسخ مختصر
   */
  async bpors(question) {
    const answer = await this.soal(question, { urgency: true });
    return answer;
  }
}

// ایجاد نمونه برای استفاده جهانی
const natiq = new EasyNatiq();

// صادر کردن برای استفاده در ماژول‌های دیگر
export default natiq;

// برای استفاده در اسکریپت‌های ساده
export async function bpors(question) {
  const natiq = new EasyNatiq();
  await new Promise(resolve => setTimeout(resolve, 2500));
  return await natiq.soal(question);
}

export function etelaat() {
  const natiq = new EasyNatiq();
  return natiq.vaziat();
}
