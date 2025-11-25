const http = require('http');
const { ask } = require('./NAtiQ-ENHANCED.js');

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/api/ask' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const { question } = JSON.parse(body);
                if (!question) {
                    res.end(JSON.stringify({ error: 'سوال الزامی است' }));
                    return;
                }
                const result = await ask(question);
                res.end(JSON.stringify(result));
            } catch (error) {
                res.end(JSON.stringify({ error: 'خطا در پردازش' }));
            }
        });
    } else {
        res.end(JSON.stringify({ 
            message: 'نطق مصطلح - نسخه ساده',
            usage: 'POST /api/ask با {question: "سوال شما"}'
        }));
    }
});

if (require.main === module) {
    server.listen(3002, () => {
        console.log('🚀 سرور ساده فعال: http://localhost:3002');
    });
}

module.exports = server;
