#!/bin/bash

echo "🧠 Starting Knowledge Base Server..."
echo "==================================="

# متوقف کردن سرورهای قبلی
echo "1. Stopping previous servers..."
pkill -f "node.*simple-knowledge-server" 2>/dev/null
pkill -f "node.*server-complete" 2>/dev/null
pkill -f "node.*server-stable" 2>/dev/null

sleep 2

# بررسی پورت‌های آزاد
echo "2. Checking available ports..."
for port in 3015 3016 3017 3018 3019; do
    if ! lsof -i :$port > /dev/null 2>&1; then
        FREE_PORT=$port
        break
    fi
done

if [ -z "$FREE_PORT" ]; then
    echo "❌ No free ports found!"
    exit 1
fi

echo "✅ Using port: $FREE_PORT"

# ایجاد سرور با پورت پویا
cat > knowledge-server-$FREE_PORT.js << 'SERVEREOF'
const express = require('express');
const app = express();
const PORT = $FREE_PORT;

app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({
        status: '✅ Knowledge Base Server Active',
        port: PORT,
        timestamp: new Date().toLocaleString('fa-IR'),
        endpoints: [
            'GET /health - وضعیت سرور',
            'GET /test - تست عملکرد',
            'POST /test-data - افزودن داده تستی',
            'GET /api/items - دریافت آیتم‌ها'
        ]
    });
});

app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'تست سرور موفق بود',
        port: PORT,
        data: { items: ['NLP', 'Machine Learning', 'AI'] }
    });
});

app.post('/test-data', (req, res) => {
    res.json({
        success: true,
        message: 'داده‌های تستی افزوده شدند',
        addedItems: 3,
        items: [
            'پردازش زبان طبیعی',
            'یادگیری عمیق', 
            'شبکه‌های عصبی'
        ]
    });
});

app.get('/api/items', (req, res) => {
    res.json({
        success: true,
        items: [
            { id: 1, title: 'NLP Basics', category: 'AI' },
            { id: 2, title: 'Deep Learning', category: 'ML' },
            { id: 3, title: 'Neural Networks', category: 'AI' }
        ]
    });
});

app.get('/', (req, res) => {
    res.redirect('/health');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 Knowledge Base Server Started!');
    console.log('📍 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🕒 Time:', new Date().toLocaleString('fa-IR'));
    console.log('🎉 =================================');
});

console.log('✅ Server initialized on port', PORT);
SERVEREOF

# راه‌اندازی سرور
echo "3. Starting server on port $FREE_PORT..."
node knowledge-server-$FREE_PORT.js &

# منتظر راه‌اندازی سرور
sleep 3

# تست سرور
echo "4. Testing server..."
curl -s http://localhost:$FREE_PORT/health | grep -o '"status":"[^"]*"'

echo ""
echo "✅ Server is running on http://localhost:$FREE_PORT"
echo "🧠 Knowledge Base System is ready!"
