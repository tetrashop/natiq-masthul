const express = require('express');
const app = express();
const PORT = 3018;

app.use(express.json());

// داده‌های نمونه در حافظه
let knowledgeItems = [
    {
        id: 1,
        title: 'پردازش زبان طبیعی (NLP)',
        content: 'پردازش زبان طبیعی شاخه‌ای از هوش مصنوعی است که به کامپیوترها توانایی درک، تفسیر و تولید زبان انسانی را می‌دهد.',
        category: 'هوش مصنوعی',
        tags: ['NLP', 'پردازش متن', 'هوش مصنوعی'],
        createdAt: new Date(),
        views: 150
    },
    {
        id: 2,
        title: 'یادگیری عمیق',
        content: 'یادگیری عمیق زیرشاخه‌ای از یادگیری ماشین است که از شبکه‌های عصبی با لایه‌های متعدد استفاده می‌کند.',
        category: 'هوش مصنوعی',
        tags: ['Deep Learning', 'شبکه عصبی'],
        createdAt: new Date(),
        views: 200
    },
    {
        id: 3,
        title: 'شبکه‌های عصبی کانولوشنی',
        content: 'این شبکه‌ها برای پردازش داده‌های دارای ساختار شبکه‌ای مانند تصاویر طراحی شده‌اند.',
        category: 'بینایی کامپیوتر',
        tags: ['CNN', 'پردازش تصویر'],
        createdAt: new Date(),
        views: 120
    }
];

// Routes
app.get('/health', (req, res) => {
    res.json({
        status: '✅ Simple Knowledge Base Server',
        port: PORT,
        timestamp: new Date().toLocaleString('fa-IR'),
        totalItems: knowledgeItems.length,
        endpoints: [
            'GET /health - وضعیت سرور',
            'GET /test - تست عملکرد',
            'POST /test-data - افزودن داده تستی',
            'GET /api/items - دریافت همه آیتم‌ها',
            'POST /api/items - افزودن آیتم جدید',
            'GET /api/search?q=query - جستجو',
            'GET /api/analytics - آمار و تحلیل',
            'GET /api/items/:id - دریافت آیتم خاص'
        ]
    });
});

app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'تست سرور ساده موفق بود',
        server: 'Simple Knowledge Base',
        version: '1.0',
        itemsCount: knowledgeItems.length
    });
});

app.post('/test-data', (req, res) => {
    const newItem = {
        id: knowledgeItems.length + 1,
        title: 'مدل‌های زبانی بزرگ',
        content: 'مدل‌های زبانی بزرگ مانند GPT توانایی درک و تولید متن پیچیده را دارند و در کاربردهای مختلف NLP استفاده می‌شوند.',
        category: 'پردازش زبان طبیعی',
        tags: ['LLM', 'GPT', 'NLP'],
        createdAt: new Date(),
        views: 0
    };
    
    knowledgeItems.push(newItem);
    
    res.json({
        success: true,
        message: 'داده تستی با موفقیت افزوده شد',
        addedItem: newItem,
        totalItems: knowledgeItems.length
    });
});

app.get('/api/items', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const result = {
        success: true,
        page: page,
        limit: limit,
        totalItems: knowledgeItems.length,
        totalPages: Math.ceil(knowledgeItems.length / limit),
        items: knowledgeItems.slice(startIndex, endIndex)
    };
    
    res.json(result);
});

app.post('/api/items', (req, res) => {
    const { title, content, category, tags } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({
            success: false,
            message: 'عنوان و محتوا الزامی است'
        });
    }
    
    const newItem = {
        id: knowledgeItems.length + 1,
        title,
        content,
        category: category || 'عمومی',
        tags: tags || [],
        createdAt: new Date(),
        views: 0
    };
    
    knowledgeItems.push(newItem);
    
    res.json({
        success: true,
        message: 'آیتم دانش با موفقیت افزوده شد',
        item: newItem
    });
});

app.get('/api/search', (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.json({
            success: true,
            message: 'لطفاً عبارت جستجو را وارد کنید',
            totalItems: knowledgeItems.length,
            items: knowledgeItems
        });
    }
    
    const results = knowledgeItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({
        success: true,
        query: query,
        resultsCount: results.length,
        items: results
    });
});

app.get('/api/analytics', (req, res) => {
    const categories = {};
    const tags = {};
    
    knowledgeItems.forEach(item => {
        // شمارش دسته‌بندی‌ها
        categories[item.category] = (categories[item.category] || 0) + 1;
        
        // شمارش تگ‌ها
        if (item.tags) {
            item.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        }
    });
    
    const totalViews = knowledgeItems.reduce((sum, item) => sum + (item.views || 0), 0);
    
    res.json({
        success: true,
        analytics: {
            totalItems: knowledgeItems.length,
            totalViews: totalViews,
            averageViews: knowledgeItems.length > 0 ? Math.round(totalViews / knowledgeItems.length) : 0,
            categories: categories,
            popularTags: Object.entries(tags)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .reduce((obj, [tag, count]) => {
                    obj[tag] = count;
                    return obj;
                }, {}),
            lastUpdated: new Date().toLocaleString('fa-IR')
        }
    });
});

app.get('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = knowledgeItems.find(item => item.id === id);
    
    if (!item) {
        return res.status(404).json({
            success: false,
            message: 'آیتم مورد نظر یافت نشد'
        });
    }
    
    // افزایش تعداد بازدید
    item.views = (item.views || 0) + 1;
    
    res.json({
        success: true,
        item: item
    });
});

app.get('/', (req, res) => {
    res.redirect('/health');
});

// مدیریت خطا - استفاده از نحو صحیح Express
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'مسیر یافت نشد',
        availableRoutes: [
            '/health',
            '/test', 
            '/test-data',
            '/api/items',
            '/api/items/:id',
            '/api/search?q=query',
            '/api/analytics'
        ]
    });
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 SIMPLE Knowledge Base Server Started!');
    console.log('📍 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🕒 Time:', new Date().toLocaleString('fa-IR'));
    console.log('💾 Storage: In-Memory (No MongoDB)');
    console.log('📊 Items:', knowledgeItems.length);
    console.log('🎉 =================================');
});
