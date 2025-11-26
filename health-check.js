// بررسی سلامت سیستم یکپارچه - نسخه CommonJS
console.log('🔍 بررسی سلامت سیستم...');

try {
  const natiqCore = require('./natiq-ecosystem/natiq-core.js');
  console.log('✅ natiq-core بارگذاری شد');
  
  const nlpEngine = require('./natiq-ecosystem/nlp-engine.js');
  console.log('✅ nlp-engine بارگذاری شد');
  
  // تست عملکرد
  const core = new natiqCore();
  const nlp = new nlpEngine();
  
  const testQuestion = "سلام چطور میتونم برنامه نویسی یاد بگیرم؟";
  const analysis = core.analyzeQuestion(testQuestion);
  const nlpAnalysis = nlp.processText(testQuestion);
  
  console.log('✅ تست عملکرد موفقیت‌آمیز بود');
  console.log('📊 تحلیل سوال:', analysis.intent);
  console.log('🧠 تحلیل NLP:', nlpAnalysis.sentiment);
  
} catch (err) {
  console.error('❌ خطا در بررسی سلامت:', err.message);
}
