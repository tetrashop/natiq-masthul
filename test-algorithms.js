const AdvancedIntentRecognition = require('./src/nlp/advanced-intent-recognition');

console.log('🧪 تست الگوریتم تشخیص هدف پیشرفته...\n');

const recognizer = new AdvancedIntentRecognition();
const testQuestions = [
    'رامین اجلال کیست؟',
    'دستاوردهایش چیست؟',
    'مقاله‌ای درباره هوش مصنوعی بنویس',
    'تخصص‌های رامین اجلال'
];

testQuestions.forEach((q, index) => {
    console.log(`سوال ${index + 1}: "${q}"`);
    const result = recognizer.detectIntent(q);
    console.log('نتیجه:', result);
    console.log('---');
});
