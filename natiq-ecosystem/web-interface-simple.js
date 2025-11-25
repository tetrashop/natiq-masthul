const http = require('http');
const { ask, getStatus, clearCache } = require('./NAtiQ-ENHANCED.js');

class SimpleNatiqWebInterface {
    constructor(port = 3001) {
        this.port = port;
        this.server = null;
    }

    start() {
        this.server = http.createServer(this.handleRequest.bind(this));
        this.server.listen(this.port, () => {
            console.log('🖥️ رابط وب ساده در حال اجرا روی پورت ' + this.port);
            console.log('دسترسی: http://localhost:' + this.port);
        });
    }

    async handleRequest(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        const parsedUrl = require('url').parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        if (pathname === '/' && method === 'GET') {
            return this.serveHomePage(req, res);
        }

        if (pathname === '/api/ask' && method === 'POST') {
            return await this.handleAskAPI(req, res);
        }

        if (pathname === '/api/status' && method === 'GET') {
            return this.handleStatusAPI(req, res);
        }

        this.sendResponse(res, 404, { error: 'مسیر یافت نشد' });
    }

    serveHomePage(req, res) {
        const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح - رابط ساده</title>
    <style>
        body { font-family: Tahoma; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        textarea { width: 100%; height: 100px; padding: 10px; margin: 10px 0; }
        button { padding: 10px 20px; margin: 5px; background: #3498db; color: white; border: none; border-radius: 5px; }
        .response { background: #f8f9fa; padding: 15px; margin-top: 10px; border-radius: 5px; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="container">
        <h1>نطق مصطلح - رابط ساده</h1>
        <textarea id="question" placeholder="سوال خود را بنویسید..."></textarea>
        <div>
            <button onclick="askQuestion()">پرسش سوال</button>
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
</html>`;
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    }

    async handleAskAPI(req, res) {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const { question } = JSON.parse(body);
                const result = await ask(question);
                this.sendResponse(res, 200, result);
            } catch (error) {
                this.sendResponse(res, 500, {
                    success: false,
                    response: 'خطای سرور'
                });
            }
        });
    }

    handleStatusAPI(req, res) {
        const status = getStatus();
        this.sendResponse(res, 200, status);
    }

    sendResponse(res, statusCode, data) {
        res.writeHead(statusCode, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data, null, 2));
    }

    stop() {
        if (this.server) {
            this.server.close();
        }
    }
}

if (require.main === module) {
    const interface = new SimpleNatiqWebInterface(3001);
    interface.start();
}

module.exports = SimpleNatiqWebInterface;
