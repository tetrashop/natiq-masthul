const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const knowledgeRoutes = require('./api/knowledgeRoutes');

const app = express();
const PORT = 3011; // تغییر پورت به 3011

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// اتصال به MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge_base';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/knowledge', knowledgeRoutes);

// Route سلامت
app.get('/health', (req, res) => {
    res.json({
        status: '✅ Knowledge Base Server Active',
        port: PORT,
        timestamp: new Date().toLocaleString('fa-IR'),
        endpoints: [
            'POST /api/knowledge/items - افزودن آیتم دانش',
            'GET /api/knowledge/search/semantic?q=query - جستجوی معنایی',
            'GET /api/knowledge/search/keyword?q=query - جستجوی کلیدواژه',
            'GET /api/knowledge/analytics - تحلیل پایگاه دانش',
            'GET /api/knowledge/items - دریافت همه آیتم‌ها',
            'GET /api/knowledge/test-search - تست جستجو',
            'POST /api/knowledge/test-data - افزودن داده تستی'
        ]
    });
});

// Route اصلی
app.get('/', (req, res) => {
    res.redirect('/health');
});

// مدیریت خطاها
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'خطای سرور',
        error: err.message
    });
});

// Route not found
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'مسیر یافت نشد'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 Knowledge Base Server Started!');
    console.log('📍 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🎉 =================================');
});

module.exports = app;
