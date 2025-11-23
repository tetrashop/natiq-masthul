const express = require('express');
const app = express();

app.use(express.json());

// Route اصلی API
app.get('/api', (req, res) => {
  res.json({
    message: '🧠 Natiq Masthul API Gateway',
    status: '✅ Active',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api - وضعیت سرور',
      'GET /api/knowledge/health - سلامت پایگاه دانش',
      'GET /api/knowledge/items - دریافت آیتم‌ها',
      'POST /api/knowledge/items - افزودن آیتم جدید'
    ]
  });
});

// Route سلامت
app.get('/api/knowledge/health', (req, res) => {
  res.json({
    status: '✅ Knowledge Base - Vercel Deployment',
    timestamp: new Date().toISOString(),
    message: 'سیستم نطق مصطلح در Vercel فعال است'
  });
});

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
  }
];

// دریافت آیتم‌ها
app.get('/api/knowledge/items', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  res.json({
    success: true,
    page: page,
    limit: limit,
    totalItems: knowledgeItems.length,
    totalPages: Math.ceil(knowledgeItems.length / limit),
    items: knowledgeItems.slice(startIndex, endIndex)
  });
});

// افزودن آیتم جدید
app.post('/api/knowledge/items', (req, res) => {
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

// Route not found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

module.exports = app;
