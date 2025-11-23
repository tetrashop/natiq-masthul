const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3012; // استفاده از پورت جدید

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// اتصال به MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge_base';

console.log('🧠 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes پایه
app.get('/health', (req, res) => {
    res.json({
        status: '✅ Knowledge Base Server Active',
        port: PORT,
        timestamp: new Date().toLocaleString('fa-IR'),
        message: 'سرور پایدار راه‌اندازی شد'
    });
});

app.get('/', (req, res) => {
    res.redirect('/health');
});

// راه‌اندازی سرور
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 Stable Knowledge Base Server Started!');
    console.log('📍 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🎉 =================================');
});

// مدیریت graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

module.exports = app;
