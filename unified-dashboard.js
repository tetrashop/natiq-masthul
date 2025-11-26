const http = require('http');
const { ask, getStatus, clearCache } = require('./natiq-ecosystem/NAtiQ-ENHANCED.js');

console.log('🚀 ایجاد داشبورد یکپارچه نطق مصطلح...');

class UnifiedDashboard {
    constructor(port = 3000) {
        this.port = port;
    }

    start() {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(this.port, () => {
            console.log('🎉 داشبورد یکپارچه راه‌اندازی شد!');
            console.log(`📍 آدرس: http://localhost:${this.port}`);
            console.log('📊 تمام قابلیت‌ها در دسترس هستند');
        });
    }

    async handleRequest(req, res) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');

        const url = req.url;
        const method = req.method;

        try {
            if (url === '/api/ask' && method === 'POST') {
                await this.handleAskAPI(req, res);
            } else if (url === '/api/status' && method === 'GET') {
                this.handleStatusAPI(req, res);
            } else if (url === '/api/cache/clear' && method === 'POST') {
                this.handleClearCache(req, res);
            } else {
                this.serveDashboard(req, res);
            }
        } catch (error) {
            this.sendError(res, error.message);
        }
    }

    serveDashboard(req, res) {
        const status = getStatus();
        const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح - داشبورد یکپارچه</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Tahoma, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f3f4;
        }
        
        .header h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 25px 0;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-left: 4px solid #3498db;
        }
        
        .stat-card .value {
            font-size: 2em;
            font-weight: bold;
            color: #2c3e50;
            margin: 10px 0;
        }
        
        .input-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
        }
        
        textarea {
            width: 100%;
            height: 120px;
            padding: 15px;
            border: 2px solid #e1e8ed;
            border-radius: 10px;
            font-size: 16px;
            margin: 10px 0;
            resize: vertical;
        }
        
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin: 5px;
            transition: all 0.3s;
        }
        
        button:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        .response {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 15px 0;
            border-right: 4px solid #3498db;
            white-space: pre-wrap;
            line-height: 1.6;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 نطق مصطلح - داشبورد یکپارچه</h1>
            <p>سیستم هوش مصنوعی پیشرفته فارسی - تمام قابلیت‌ها در یک رابط واحد</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <h3>عملکرد سیستم</h3>
                <div class="value" id="performance">%</div>
                <p>بهینه‌ترین حالت</p>
            </div>
            <div class="stat-card">
                <h3>تعداد تعاملات</h3>
                <div class="value" id="interactions">0</div>
                <p>پرسش‌های پاسخ داده شده</p>
            </div>
            <div class="stat-card">
                <h3>اندازه کش</h3>
                <div class="value" id="cacheSize">0</div>
                <p>آیتم‌های ذخیره شده</p>
            </div>
        </div>

        <div class="input-section">
            <h2>💬 پرسش از سیستم هوش مصنوعی</h2>
            <textarea id="questionInput" placeholder="سوال خود را اینجا بنویسید..."></textarea>
            <div style="text-align: center;">
                <button onclick="askQuestion()">🚀 ارسال سوال</button>
                <button onclick="clearCache()" style="background: #e74c3c;">🗑️ پاک‌سازی کش</button>
            </div>
        </div>

        <div id="responseArea" class="response">
            پاسخ سیستم اینجا نمایش داده می‌شود...
        </div>

        <div class="footer">
            <p>نطق مصطلح - توسعه یافته با ❤️ برای جامعه فارسی‌زبان</p>
            <p>نسخه: ۳.۰.۰ | وضعیت: فعال ✅</p>
        </div>
    </div>

    <script>
        async function askQuestion() {
            const question = document.getElementById('questionInput').value.trim();
            const responseArea = document.getElementById('responseArea');
            
            if (!question) {
                alert('لطفاً سوال خود را وارد کنید');
                return;
            }

            responseArea.innerHTML = '⏳ در حال پردازش...';
            
            try {
                const response = await fetch('/api/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    responseArea.innerHTML = data.response;
                } else {
                    responseArea.innerHTML = '❌ خطا: ' + data.response;
                }
            } catch (error) {
                responseArea.innerHTML = '💥 خطای شبکه: ' + error.message;
            }
            
            loadStats();
        }

        async function clearCache() {
            if (confirm('آیا از پاک‌سازی کش سیستم اطمینان دارید؟')) {
                try {
                    const response = await fetch('/api/cache/clear', { method: 'POST' });
                    const data = await response.json();
                    alert(data.message || 'کش پاک‌سازی شد');
                    loadStats();
                } catch (error) {
                    alert('خطا در پاک‌سازی کش');
                }
            }
        }

        async function loadStats() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                
                document.getElementById('performance').textContent = (data.performance * 100).toFixed(1) + '%';
                document.getElementById('interactions').textContent = data.interactionCount;
                document.getElementById('cacheSize').textContent = 
                    data.cacheSizes.analysis + data.cacheSizes.validation;
            } catch (error) {
                console.error('خطا در بارگذاری آمار:', error);
            }
        }

        // بارگذاری اولیه آمار
        document.addEventListener('DOMContentLoaded', function() {
            loadStats();
        });
    </script>
</body>
</html>
        `;
        res.end(html);
    }

    async handleAskAPI(req, res) {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const { question } = JSON.parse(body);
                console.log('🤔 دریافت سوال:', question);
                
                const result = await ask(question);
                res.end(JSON.stringify(result));
            } catch (error) {
                res.end(JSON.stringify({
                    success: false,
                    response: 'خطا در پردازش سوال: ' + error.message
                }));
            }
        });
    }

    handleStatusAPI(req, res) {
        const status = getStatus();
        res.end(JSON.stringify(status));
    }

    handleClearCache(req, res) {
        const result = clearCache();
        res.end(JSON.stringify(result));
    }

    sendError(res, message) {
        res.end(JSON.stringify({
            success: false,
            error: message
        }));
    }
}

// راه‌اندازی خودکار
const dashboard = new UnifiedDashboard(3000);
dashboard.start();
