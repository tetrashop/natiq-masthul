const express = require('express');
const app = express();
const PORT = 3004;

app.use(express.json());
app.use(express.static('.'));

let nlpPosts = [];

// Route سلامت
app.get('/health', (req, res) => {
    res.json({
        status: '✅ NLP Server Active',
        port: PORT,
        postsCount: nlpPosts.length,
        timestamp: new Date().toLocaleString('fa-IR'),
        message: 'سرور NLP پایدار راه‌اندازی شد'
    });
});

// تولید ۱۶۲ پست نمونه
app.post('/api/nlp/generate-samples', (req, res) => {
    console.log('🚀 Generating 162 sample posts...');
    nlpPosts = [];
    
    for (let i = 1; i <= 162; i++) {
        nlpPosts.push({
            id: i,
            title: `پست NLP نمونه ${i}`,
            content: `این محتوای پیشرفته برای پست NLP شماره ${i} است. این پست شامل مباحث تخصصی پردازش زبان طبیعی می‌باشد.`,
            tags: ['NLP', 'پردازش متن', 'هوش مصنوعی'],
            category: 'پردازش زبان طبیعی',
            createdAt: new Date(),
            views: Math.floor(Math.random() * 1000),
            likes: Math.floor(Math.random() * 500)
        });
    }
    
    console.log(`✅ Generated ${nlpPosts.length} posts successfully`);
    res.json({
        success: true,
        message: `۱۶۲ پست نمونه ایجاد شد`,
        count: nlpPosts.length,
        lastPost: nlpPosts[nlpPosts.length - 1]
    });
});

// دریافت پست‌ها
app.get('/api/nlp/posts', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const result = {
        success: true,
        page: page,
        limit: limit,
        totalPosts: nlpPosts.length,
        totalPages: Math.ceil(nlpPosts.length / limit),
        posts: nlpPosts.slice(startIndex, endIndex)
    };
    
    res.json(result);
});

// Route اصلی
app.get('/', (req, res) => {
    res.json({
        message: '🚀 NLP Server Running',
        endpoints: [
            'GET /health - وضعیت سرور',
            'POST /api/nlp/generate-samples - تولید ۱۶۲ پست نمونه',
            'GET /api/nlp/posts - دریافت پست‌ها (با پارامتر page و limit)',
            'GET /api/nlp/posts?page=1&limit=20 - صفحه‌بندی پست‌ها'
        ]
    });
});

// مدیریت خطا
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'مسیر یافت نشد',
        availableRoutes: [
            '/health',
            '/api/nlp/generate-samples', 
            '/api/nlp/posts'
        ]
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 STABLE NLP Server Started!');
    console.log('📍 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🎉 =================================');
});
