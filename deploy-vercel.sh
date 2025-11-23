#!/bin/bash

echo "🚀 آماده‌سازی برای دیپلوی در Vercel"
echo "==================================="

# نصب Vercel CLI
echo "1. نصب Vercel CLI..."
npm install -g vercel

# لاگین به Vercel
echo "2. لاگین به Vercel..."
vercel login

# ساخت فرانت‌اند
echo "3. ساخت فرانت‌اند..."
cd frontend
npm run build
cd ..

# ایجاد فایل‌های مستقل برای هر سرویس
echo "4. ایجاد فایل‌های مستقل..."

# پایگاه دانش برای Vercel
cat > knowledge-server.js << 'KNOWLEDGE_EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3018;

app.use(express.json());

let knowledgeItems = [
    {
        id: 1,
        title: 'پردازش زبان طبیعی (NLP)',
        content: 'پردازش زبان طبیعی شاخه‌ای از هوش مصنوعی است که به کامپیوترها توانایی درک، تفسیر و تولید زبان انسانی را می‌دهد.',
        category: 'هوش مصنوعی',
        tags: ['NLP', 'پردازش متن', 'هوش مصنوعی'],
        createdAt: new Date(),
        views: 150
    }
];

// Routes مشابه simple-knowledge-server.js
app.get('/health', (req, res) => {
    res.json({
        status: '✅ Knowledge Base - Vercel',
        port: PORT,
        timestamp: new Date().toISOString(),
        totalItems: knowledgeItems.length
    });
});

app.get('/api/items', (req, res) => {
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

app.post('/api/items', (req, res) => {
    const { title, content, category, tags } = req.body;
    
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

app.listen(PORT, () => {
    console.log('🧠 Knowledge Base running on port', PORT);
});

module.exports = app;
KNOWLEDGE_EOF

# دیپلوی
echo "5. شروع دیپلوی..."
vercel --prod

echo "✅ دیپلوی کامل شد!"
echo "🌐 آدرس‌های دسترسی:"
echo "   - فرانت‌اند: https://your-app.vercel.app"
echo "   - API: https://your-app.vercel.app/api"
