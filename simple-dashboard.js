const http = require('http');
const { ask, getStatus, clearCache } = require('./NAtiQ-ENHANCED.js');

const PORT = 8080;

// HTML ساده و بدون خطا
const htmlPage = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح - رابط ساده</title>
    <style>
        body { 
            font-family: Tahoma; 
            background: #f5f5f5;
            margin: 0; 
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            margin: 10px 0;
        }
        button {
            padding: 10px 20px;
            margin: 5px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .response {
            background: #f8f9fa;
            padding: 15px;
            margin-top: 10px;
            border-radius: 5px;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>نطق مصطلح - رابط ساده</h1>
        <textarea id="question" placeholder="سوال خود را بنویسید..."></textarea>
        <div>
            <button onclick="askQuestion()">ارسال سوال</button>
        </div>
        <div id="response" class="response">پاسخ اینجا نمایش داده می‌شود</div>
    </div>

    <script>
        async function askQuestion() {
            const question = document.getElementById('question').value;
            const responseDiv = document.getElementById('response');
            responseDiv.innerHTML = 'در حال پردازش...';
            
            try {
                const response = await fetch('/api/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question })
                });
                const data = await response.json();
                responseDiv.innerHTML = data.response || data.error;
            } catch (error) {
                responseDiv.innerHTML = 'خطای شبکه: ' + error.message;
            }
        }
    </script>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/api/ask' && req.method === 'POST') {
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
        return;
    }
    
    // صفحه اصلی
    res.end(htmlPage);
});

server.listen(PORT, () => {
    console.log('🚀 نطق مصطلح - رابط ساده راه‌اندازی شد!');
    console.log('📍 آدرس: http://localhost:' + PORT);
    console.log('✅ سیستم آماده استفاده است');
});
