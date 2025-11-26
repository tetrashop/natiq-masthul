const http = require('http');
const { ask } = require('./NAtiQ-ENHANCED.js');

const server = http.createServer(async (req, res) => {
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
    } else {
        res.end('نطق مصطلح - از POST /api/ask استفاده کنید');
    }
});

server.listen(8080, () => {
    console.log('✅ سیستم در پورت 8080 راه‌اندازی شد');
});
