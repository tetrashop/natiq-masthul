const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3017;

app.use(express.json());

// اتصال به MongoDB بدون گزینه‌های قدیمی
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge_base';

console.log('🧠 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Continuing without MongoDB...');
});

// Routes - کار کند حتی اگر MongoDB وصل نباشد
app.get('/health', (req, res) => {
    res.json({
        status: '✅ Knowledge Base Server FINAL',
        port: PORT,
        timestamp: new Date().toLocaleString('fa-IR'),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        endpoints: [
            'GET /health - وضعیت سرور',
            'GET /test - تست عملکرد',
            'POST /test-data - افزودن داده تستی',
            'GET /api/knowledge - دریافت دانش',
            'POST /api/knowledge - افزودن دانش'
        ]
    });
});

app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'تست سرور دانش موفق بود',
        timestamp: new Date().toISOString(),
        features: ['NLP', 'AI', 'Machine Learning', 'Knowledge Management'],
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Working without DB'
    });
});

// داده‌های موقت در حافظه
let temporaryKnowledge = [
    {
        id: 1,
        title: 'پردازش زبان طبیعی (NLP)',
        content: 'پردازش زبان طبیعی شاخه‌ای از هوش مصنوعی است که به کامپیوترها توانایی درک، تفسیر و تولید زبان انسانی را می‌دهد.',
        category: 'هوش مصنوعی',
        tags: ['NLP', 'پردازش متن', 'هوش مصنوعی'],
        createdAt: new Date()
    },
    {
        id: 2,
        title: 'یادگیری عمیق',
        content: 'یادگیری عمیق زیرشاخه‌ای از یادگیری ماشین است که از شبکه‌های عصبی با لایه‌های متعدد استفاده می‌کند.',
        category: 'هوش مصنوعی',
        tags: ['Deep Learning', 'شبکه عصبی'],
        createdAt: new Date()
    }
];

app.post('/test-data', (req, res) => {
    // افزودن داده تستی جدید
    const newItem = {
        id: temporaryKnowledge.length + 1,
        title: 'شبکه‌های عصبی کانولوشنی',
        content: 'این شبکه‌ها برای پردازش داده‌های دارای ساختار شبکه‌ای مانند تصاویر طراحی شده‌اند.',
        category: 'بینایی کامپیوتر',
        tags: ['CNN', 'پردازش تصویر'],
        createdAt: new Date()
    };
    
    temporaryKnowledge.push(newItem);
    
    res.json({
        success: true,
        message: 'داده تستی با موفقیت افزوده شد',
        addedItem: newItem,
        totalItems: temporaryKnowledge.length
    });
});

app.get('/api/knowledge', (req, res) => {
    res.json({
        success: true,
        count: temporaryKnowledge.length,
        items: temporaryKnowledge
    });
});

app.post('/api/knowledge', (req, res) => {
    const { title, content, category, tags } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({
            success: false,
            message: 'عنوان و محتوا الزامی است'
        });
    }
    
    const newItem = {
        id: temporaryKnowledge.length + 1,
        title,
        content,
        category: category || 'عمومی',
        tags: tags || [],
        createdAt: new Date()
    };
    
    temporaryKnowledge.push(newItem);
    
    res.json({
        success: true,
        message: 'آیتم دانش با موفقیت افزوده شد',
        item: newItem
    });
});

// جستجو در دانش
app.get('/api/knowledge/search', (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.json({
            success: true,
            count: temporaryKnowledge.length,
            items: temporaryKnowledge
        });
    }
    
    const results = temporaryKnowledge.filter(item => 
        item.title.includes(query) || 
        item.content.includes(query) ||
        item.tags.some(tag => tag.includes(query))
    );
    
    res.json({
        success: true,
        query: query,
        count: results.length,
        items: results
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
            '/health', 
            '/test', 
            '/test-data', 
            '/api/knowledge',
            '/api/knowledge/search?q=query'
        ]
    });
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 FINAL Knowledge Base Server Started!');
    console.log('📍 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🕒 Time:', new Date().toLocaleString('fa-IR'));
    console.log('💾 Storage:', 'In-Memory (MongoDB disabled)');
    console.log('🎉 =================================');
});
