/**
 * پیکربندی سیستم NLP - نطق مصطلح
 * تنظیمات پیشرفته برای پردازش زبان طبیعی
 */

const nlpConfig = {
  version: "3.0.0",
  postSettings: {
    maxPosts: 166,  // ✅ تنظیم دقیقاً ۱۶۶ پست
    postsPerPage: 20,
    defaultLanguage: "fa"
  },
  
  // تنظیمات پردازش متن فارسی
  textProcessing: {
    maxLength: 1000,
    enableStemming: true,
    enableLemmatization: true,
    removeStopWords: true
  },
  
  // تنظیمات مدل زبانی
  languageModel: {
    modelName: "persian-advanced",
    confidenceThreshold: 0.8,
    enableContext: true
  },
  
  // تنظیمات API
  apiConfig: {
    rateLimit: 100,
    timeout: 30000,
    maxRetries: 3
  }
};

module.exports = nlpConfig;
