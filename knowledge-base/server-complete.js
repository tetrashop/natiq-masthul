const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3013; // پورت جدید برای اطمینان

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// اتصال به MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge_base';

console.log('🧠 Initializing Knowledge Base Service...');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('✅ Connected to MongoDB');
    
    // ایجاد مدل ساده برای تست
    const knowledgeSchema = new mongoose.Schema({
        title: String,
        content: String,
        category: String,
        tags: [String],
        createdAt: { type: Date, default: Date.now }
    });
    
    const KnowledgeItem = mongoose.model('KnowledgeItem', knowledgeSchema);
    
    // Routes
    app.get('/health', (req, res) => {
        res.json({
            status: '✅ Knowledge Base Server Active',
            port: PORT,
            timestamp: new Date().toLocaleString('fa-IR'),
            database: 'Connected',
            endpoints: [
                'GET /health - وضعیت سرور',
                'GET /test - تست پایه',
                'POST /test-data - افزودن داده تستی'
            ]
        });
    });
    
    app.get('/test', async (req, res) => {
        try {
            const count = await KnowledgeItem.countDocuments();
            res.json({
                success: true,
                message: 'تست سرور موفق بود',
                itemCount: count
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'خطا در تست سرور',
                error: error.message
            });
        }
    });
    
    app.post('/test-data', async (req, res) => {
        try {
            const testItems = [
                {
                    title: 'پردازش زبان طبیعی',
                    content: 'پردازش زبان طبیعی شاخه‌ای از هوش مصنوعی است که به تعامل بین کامپیوتر و زبان انسان می‌پردازد.',
                    category: 'هوش مصنوعی',
                    tags: ['NLP', 'هوش مصنوعی']
                },
                {
                    title: 'یادگیری عمیق',
                    content: 'یادگیری عمیق زیرشاخه‌ای از یادگیری ماشین است که از شبکه‌های عصبی با لایه‌های متعدد استفاده می‌کند.',
                    category: 'هوش مصنوعی',
                    tags: ['Deep Learning', 'شبکه عصبی']
                }
            ];
            
            await KnowledgeItem.deleteMany({}); // پاک کردن داده‌های قبلی
            const result = await KnowledgeItem.insertMany(testItems);
            
            res.json({
                success: true,
                message: 'داده‌های تستی با موفقیت افزوده شدند',
                addedItems: result.length,
                items: result.map(item => item.title)
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'خطا در افزودن داده تستی',
                error: error.message
            });
        }
    });
    
    // Route اصلی
    app.get('/', (req, res) => {
        res.redirect('/health');
    });
    
    console.log('✅ Knowledge Base Routes initialized');
})
.catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    
    // Routes حداقلی وقتی MongoDB در دسترس نیست
    app.get('/health', (req, res) => {
        res.json({
            status: '⚠️ Knowledge Base Server (DB Disconnected)',
            port: PORT,
            timestamp: new Date().toLocaleString('fa-IR'),
            database: 'Disconnected',
            message: 'MongoDB connection failed'
        });
    });
    
    app.get('/', (req, res) => {
        res.redirect('/health');
    });
});

// مدیریت خطاهای全局
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

// راه‌اندازی سرور
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 Complete Knowledge Base Server Started!');
    console.log('📍 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🎉 =================================');
});

// جلوگیری از حلقه بی‌نهایت در مدیریت خطا
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Please use a different port or stop the existing server');
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
    }
});

module.exports = app;
