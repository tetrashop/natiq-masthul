const http = require('http');
const { ask, getStatus } = require('./NAtiQ-ENHANCED.js');

console.log('🌐 راه‌اندازی نسخه رایگان نطق مصطلح...\n');

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const url = req.url;
    const method = req.method;

    // API رایگان عمومی
    if (url === '/api/free/ask' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const { question } = JSON.parse(body);
                
                if (!question) {
                    return res.end(JSON.stringify({
                        success: false,
                        response: 'لطفاً سوال خود را وارد کنید'
                    }));
                }

                console.log(`🆓 درخواست رایگان: "${question.substring(0, 30)}..."`);
                
                const result = await ask(question);
                
                // افزودن اطلاعات نسخه رایگان
                result.free_tier = {
                    message: "این پاسخ از نسخه رایگان نطق مصطلح ارائه شده است",
                    upgrade_url: "https://natiq.ir/upgrade",
                    limitations: "۵۰ درخواست رایگان در روز"
                };

                res.end(JSON.stringify(result));

            } catch (error) {
                res.end(JSON.stringify({
                    success: false,
                    response: 'خطا در پردازش سوال'
                }));
            }
        });
        return;
    }

    // وضعیت سیستم رایگان
    if (url === '/api/free/status' && method === 'GET') {
        const status = getStatus();
        res.end(JSON.stringify({
            ...status,
            free_tier: {
                daily_limit: 50,
                message: "سیستم رایگان نطق مصطلح فعال است"
            }
        }));
        return;
    }

    // صفحه اصلی ساده‌تر
    if (url === '/' && method === 'GET') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح - نسخه رایگان</title>
    <style>
        body {
            font-family: Tahoma, sans-serif;
            background: #f5f5f5;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: #27ae60;
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 20px;
        }
        textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin: 10px 0;
        }
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        .response {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
            white-space: pre-wrap;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>نطق مصطلح 🧠 - نسخه رایگان</h1>
            <p>هوش مصنوعی پیشرفته فارسی - کاملاً رایگان</p>
        </div>
        
        <div>
            <h3>سوال خود را بپرسید:</h3>
            <textarea id="questionInput" placeholder="سوال خود را اینجا بنویسید..."></textarea>
            <div>
                <button onclick="askQuestion()">ارسال سوال</button>
            </div>
        </div>

        <div id="responseArea" class="response">
            پاسخ شما اینجا نمایش داده می‌شود...
        </div>

        <div class="footer">
            <p>امروز کاملاً رایگان - فردا با قابلیت‌های بیشتر</p>
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

            responseArea.innerHTML = 'در حال پردازش...';
            
            try {
                const response = await fetch('/api/free/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ question: question })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    responseArea.innerHTML = data.response + 
                        '\\n\\n---\\n🎯 ' + data.free_tier.message;
                } else {
                    responseArea.innerHTML = 'خطا: ' + data.response;
                }
            } catch (error) {
                responseArea.innerHTML = 'خطا در اتصال: ' + error.message;
            }
        }
    </script>
</body>
</html>
`;
        res.end(html);
        return;
    }
    
    // مسیرهای دیگر
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'مسیر یافت نشد' }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('✅ سرور رایگان راه‌اندازی شد!');
    console.log(`📱 دسترسی: http://localhost:${PORT}`);
    console.log('🚀 سیستم آماده دریافت درخواست‌های رایگان');
});

// مدیریت خاتمه
process.on('SIGINT', () => {
    console.log('\n🛑 سرور متوقف شد');
    process.exit(0);
});
