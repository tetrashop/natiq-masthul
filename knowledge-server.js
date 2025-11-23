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
