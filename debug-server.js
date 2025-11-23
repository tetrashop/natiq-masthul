const http = require('http');
const fs = require('fs');

console.log('🟡 شروع راه‌اندازی سرور...');

const PORT = 3006;
let requestCount = 0;

const server = http.createServer((req, res) => {
    requestCount++;
    console.log(`📨 درخواست ${requestCount}: ${req.method} ${req.url}`);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/health') {
        res.end(JSON.stringify({
            status: 'active',
            port: PORT,
            requests: requestCount,
            time: new Date().toISOString()
        }));
    } else if (req.url === '/nlp/posts') {
        res.end(JSON.stringify([
            { id: 1, title: 'پست تست ۱', content: 'این یک پست تست است' }
        ]));
    } else {
        res.end(JSON.stringify({ 
            message: 'سرور فعال است',
            endpoints: ['/health', '/nlp/posts']
        }));
    }
});

// هندل خطاهای سرور
server.on('error', (error) => {
    console.log('❌ خطای سرور:', error.message);
    if (error.code === 'EADDRINUSE') {
        console.log('⚠️ پورت ' + PORT + ' در حال استفاده است');
    }
});

// شروع سرور
server.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('✅ سرور با موفقیت راه‌اندازی شد!');
    console.log('📍 پورت: ' + PORT);
    console.log('🌐 آدرس‌های دسترسی:');
    console.log('   http://localhost:' + PORT + '/health');
    console.log('   http://127.0.0.1:' + PORT + '/health');
    console.log('   http://0.0.0.0:' + PORT + '/health');
    console.log('🎉 =================================');
});

console.log('🟢 اسکریپت سرور بارگذاری شد');
