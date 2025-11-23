const express = require('express');
const app = express();
const PORT = $FREE_PORT;

app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({
        status: '✅ Smart Knowledge Base Server',
        port: PORT,
        timestamp: new Date().toLocaleString('fa-IR'),
        message: 'سرور هوشمند با موفقیت راه‌اندازی شد',
        endpoints: [
            'GET /health - وضعیت سرور',
            'GET /test - تست عملکرد', 
            'POST /test-data - افزودن داده تستی',
            'GET /api/posts - دریافت پست‌ها',
            'POST /api/generate - تولید داده نمونه'
        ]
    });
});

app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'تست سرور هوشمند موفق بود',
        data: {
            nlp: 'پردازش زبان طبیعی',
            ai: 'هوش مصنوعی',
            ml: 'یادگیری ماشین'
        }
    });
});

app.post('/test-data', (req, res) => {
    res.json({
        success: true,
        message: 'داده‌های تستی هوشمند افزوده شدند',
        count: 5,
        items: [
            'شبکه‌های عصبی کانولوشنی',
            'پردازش زبان طبیعی عمیق',
            'مدل‌های زبانی بزرگ',
            'یادگیری انتقالی',
            'پردازش گفتار'
        ]
    });
});

app.get('/api/posts', (req, res) => {
    const samplePosts = [];
    for (let i = 1; i <= 10; i++) {
        samplePosts.push({
            id: i,
            title: 'پست نمونه ' + i,
            content: 'این محتوای نمونه برای پست شماره ' + i + ' است.',
            category: 'NLP',
            tags: ['هوش مصنوعی', 'پردازش متن']
        });
    }
    res.json({ success: true, posts: samplePosts });
});

app.post('/api/generate', (req, res) => {
    const count = req.body.count || 5;
    const items = [];
    
    for (let i = 1; i <= count && i <= 50; i++) {
        items.push({
            id: i,
            title: 'آیتم دانش ' + i,
            content: 'محتوای تخصصی برای آیتم دانش شماره ' + i,
            category: ['NLP', 'AI', 'ML'][i % 3]
        });
    }
    
    res.json({
        success: true,
        message: 'داده‌های نمونه تولید شدند',
        generated: items.length,
        items: items
    });
});

app.get('/', (req, res) => {
    res.redirect('/health');
});

// مدیریت خطا
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'مسیر یافت نشد',
        availableRoutes: [
            '/health', '/test', '/test-data', '/api/posts', '/api/generate'
        ]
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 SMART Knowledge Server Started!');
    console.log('📍 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🕒 Time:', new Date().toLocaleString('fa-IR'));
    console.log('🎉 =================================');
});
