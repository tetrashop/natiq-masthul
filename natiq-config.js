/**
 * فایل پیکربندی سیستم نطق مصطلح
 */

module.exports = {
    // تنظیمات پایگاه دانش
    knowledgeBase: {
        maxInteractions: 1000,
        learningRate: 0.85,
        autoSync: true,
        syncInterval: 300000 // 5 دقیقه
    },
    
    // تنظیمات موتور جستجو
    searchEngine: {
        maxDepth: 3,
        semanticThreshold: 0.7,
        neuralLearningRate: 0.1
    },
    
    // تنظیمات سرور
    server: {
        endpoint: 'https://your-knowledge-server.com/api',
        timeout: 5000,
        retryAttempts: 3
    },
    
    // حوزه‌های تخصصی اولیه
    initialDomains: {
        'algorithm_optimization': {
            name: 'بهینه‌سازی الگوریتم',
            concepts: [
                'حذف اسراف الگوریتمی',
                'بهینه‌سازی حافظه', 
                'کاهش پیچیدگی زمانی',
                'پردازش موازی'
            ]
        },
        'customer_psychology': {
            name: 'روانشناسی مشتری',
            concepts: [
                'مشتری حریص',
                'انگیزه بازگشت',
                'ارزش درک شده'
            ]
        }
    }
};
