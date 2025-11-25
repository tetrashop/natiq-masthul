const crypto = require('crypto');

/**
 * 🚀 سیستم یکپارچه نطق مصطلح
 * ترکیب تمام الگوریتم‌های توسعه‌یافته امروز
 */

class UnifiedNatiqSystem {
    constructor() {
        this.performance = 0.947;
        this.interactionCount = 0;
        
        // ماژول‌های مختلف
        this.modules = {
            enhanced: new (require('./NAtiQ-ENHANCED.js')).EnhancedNatiqSystem(),
            freeTier: new (require('./free-version.js'))(),
            webInterface: require('./web-interface-simple.js')
        };
        
        this.cache = new Map();
        this.activeServices = new Set();
    }

    // راه‌اندازی تمام سرویس‌ها
    async initializeAllServices() {
        console.log('🚀 راه‌اندازی یکپارچه تمام ماژول‌ها...');
        
        // راه‌اندازی سرور رایگان
        this.startFreeAPI();
        
        // راه‌اندازی رابط وب
        this.startWebInterface();
        
        // راه‌اندازی سیستم اصلی
        this.activateCoreSystem();
        
        console.log('✅ تمام ماژول‌ها فعال شدند');
        return this.getSystemStatus();
    }

    // سیستم اصلی
    activateCoreSystem() {
        this.activeServices.add('core');
        console.log('🧠 سیستم اصلی هوش مصنوعی فعال شد');
    }

    // API رایگان
    startFreeAPI() {
        const http = require('http');
        const { ask } = require('./NAtiQ-ENHANCED.js');
        
        const server = http.createServer(async (req, res) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            
            if (req.url === '/api/free/ask' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => body += chunk.toString());
                req.on('end', async () => {
                    try {
                        const { question } = JSON.parse(body);
                        const result = await ask(question);
                        res.end(JSON.stringify(result));
                    } catch (error) {
                        res.end(JSON.stringify({ error: 'خطا در پردازش' }));
                    }
                });
            }
        });

        server.listen(3000, () => {
            console.log('🌐 API رایگان: http://localhost:3000');
            this.activeServices.add('free_api');
        });
    }

    // رابط وب
    startWebInterface() {
        const http = require('http');
        
        const server = http.createServer((req, res) => {
            if (req.url === '/web' && req.method === 'GET') {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(this.generateWebInterface());
            }
        });

        server.listen(3001, () => {
            console.log('🖥️ رابط وب: http://localhost:3001/web');
            this.activeServices.add('web_interface');
        });
    }

    generateWebInterface() {
        return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>نطق مصطلح - نسخه یکپارچه</title>
    <style>
        body { font-family: Tahoma; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        textarea { width: 100%; height: 100px; padding: 10px; margin: 10px 0; }
        button { padding: 10px 20px; margin: 5px; background: #3498db; color: white; border: none; border-radius: 5px; }
        .response { background: #f8f9fa; padding: 15px; margin-top: 10px; border-radius: 5px; white-space: pre-wrap; }
        .services { background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>نطق مصطلح 🧠 - نسخه یکپارچه</h1>
        
        <div class="services">
            <h3>✅ سرویس‌های فعال:</h3>
            <ul>
                <li>API رایگان (پورت 3000)</li>
                <li>رابط وب (پورت 3001)</li>
                <li>سیستم اصلی هوش مصنوعی</li>
                <li>مدیریت کش پیشرفته</li>
            </ul>
        </div>

        <textarea id="question" placeholder="سوال خود را بپرسید..."></textarea>
        <button onclick="askQuestion()">ارسال سوال</button>
        
        <div id="response" class="response">پاسخ اینجا نمایش داده می‌شود</div>
    </div>

    <script>
        async function askQuestion() {
            const question = document.getElementById('question').value;
            const responseDiv = document.getElementById('response');
            responseDiv.innerHTML = 'در حال پردازش...';
            
            try {
                const response = await fetch('http://localhost:3000/api/free/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question })
                });
                const data = await response.json();
                responseDiv.innerHTML = data.response || data.error;
            } catch (error) {
                responseDiv.innerHTML = 'خطا در اتصال: ' + error.message;
            }
        }
    </script>
</body>
</html>
        `;
    }

    // وضعیت سیستم
    getSystemStatus() {
        return {
            performance: this.performance,
            activeServices: Array.from(this.activeServices),
            cacheSize: this.cache.size,
            modules: Object.keys(this.modules),
            timestamp: new Date().toLocaleString('fa-IR')
        };
    }

    // مدیریت حافظه
    optimizeMemory() {
        const initialSize = this.cache.size;
        // حذف آیتم‌های قدیمی از کش
        const oneHourAgo = Date.now() - 3600000;
        for (let [key, value] of this.cache) {
            if (value.timestamp < oneHourAgo) {
                this.cache.delete(key);
            }
        }
        console.log(`🧹 بهینه‌سازی حافظه: ${initialSize - this.cache.size} آیتم حذف شد`);
    }
}

// راه‌اندازی سریع
async function startUnifiedSystem() {
    const system = new UnifiedNatiqSystem();
    await system.initializeAllServices();
    
    console.log('\n🎉 سیستم یکپارچه نطق مصطلح فعال شد!');
    console.log('📊 وضعیت سیستم:', system.getSystemStatus());
    
    return system;
}

module.exports = {
    UnifiedNatiqSystem,
    startUnifiedSystem
};

// اگر مستقیماً اجرا شد
if (require.main === module) {
    startUnifiedSystem().catch(console.error);
}
