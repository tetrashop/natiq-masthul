console.log('🧪 تست الگوریتم تشخیص هدف...\n');

try {
    const AdvancedIntentRecognition = require('./src/nlp/advanced-intent-recognition');
    const recognizer = new AdvancedIntentRecognition();
    
    const tests = [
        'رامین اجلال کیست؟',
        'دستاوردهایش چیست؟',
        'مقاله‌ای درباره هوش مصنوعی بنویس',
        'تخصص‌های رامین اجلال',
        'همسرش کیست؟',
        'سلام چطوری؟'
    ];

    tests.forEach((question, index) => {
        console.log(`${index + 1}. سوال: "${question}"`);
        const result = recognizer.detectIntent(question);
        console.log(`   هدف: ${result.intent}`);
        console.log(`   اعتماد: ${result.confidence}`);
        console.log(`   موجودیت‌ها:`, result.entities);
        console.log('   ---');
    });
    
    console.log('✅ تست الگوریتم با موفقیت انجام شد');
} catch (error) {
    console.log('❌ خطا در تست الگوریتم:', error.message);
    console.log('📍 مسیر فایل: ./src/nlp/advanced-intent-recognition.js');
}
