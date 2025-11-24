console.log('🧪 تست نهایی سیستم پیشرفته...\n');

try {
    const AdvancedIntentRecognition = require('./src/nlp/advanced-intent-recognition');
    const recognizer = new AdvancedIntentRecognition();
    
    const testQuestions = [
        'رامین اجلال کیست؟',
        'دستاوردهایش چیست؟',
        'مقاله‌ای درباره هوش مصنوعی بنویس',
        'تخصص‌های رامین اجلال',
        'همسرش کیست؟'
    ];

    testQuestions.forEach((q, index) => {
        console.log(`سوال ${index + 1}: "${q}"`);
        const result = recognizer.detectIntent(q);
        console.log('• هدف تشخیص داده شده:', result.intent);
        console.log('• اعتماد سیستم:', result.confidence);
        console.log('• موجودیت‌ها:', result.entities);
        console.log('---');
    });
    
    console.log('✅ تست الگوریتم تشخیص هدف با موفقیت انجام شد');
} catch (error) {
    console.log('❌ خطا در تست:', error.message);
}
