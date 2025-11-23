const http = require('http');
const { URL } = require('url');

const KNOWLEDGE_BASE_URL = 'http://localhost:3018';
const NLP_SERVER_URL = 'http://localhost:3004';

function fetchJSON(url, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        
        const reqOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const req = http.request(reqOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        
        req.end();
    });
}

const server = http.createServer(async (req, res) => {
    // تنظیم هدرهای CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    try {
        let result;
        
        // Route برای سلامت پایگاه دانش
        if (pathname === '/api/knowledge/health' && req.method === 'GET') {
            result = await fetchJSON(`${KNOWLEDGE_BASE_URL}/health`);
        }
        // Route برای آیتم‌های دانش
        else if (pathname === '/api/knowledge/items' && req.method === 'GET') {
            const page = url.searchParams.get('page') || '1';
            const limit = url.searchParams.get('limit') || '10';
            result = await fetchJSON(`${KNOWLEDGE_BASE_URL}/api/items?page=${page}&limit=${limit}`);
        }
        // Route برای جستجو
        else if (pathname === '/api/knowledge/search' && req.method === 'GET') {
            const query = url.searchParams.get('q') || '';
            result = await fetchJSON(`${KNOWLEDGE_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
        }
        // Route برای افزودن آیتم
        else if (pathname === '/api/knowledge/items' && req.method === 'POST') {
            const body = await getRequestBody(req);
            result = await fetchJSON(`${KNOWLEDGE_BASE_URL}/api/items`, {
                method: 'POST',
                body: body
            });
        }
        // Route برای آنالیتیکس
        else if (pathname === '/api/knowledge/analytics' && req.method === 'GET') {
            result = await fetchJSON(`${KNOWLEDGE_BASE_URL}/api/analytics`);
        }
        // Route برای سلامت NLP
        else if (pathname === '/api/nlp/health' && req.method === 'GET') {
            result = await fetchJSON(`${NLP_SERVER_URL}/health`);
        }
        // Route برای تولید پست‌های نمونه
        else if (pathname === '/api/nlp/generate-samples' && req.method === 'POST') {
            result = await fetchJSON(`${NLP_SERVER_URL}/api/nlp/generate-samples`, {
                method: 'POST'
            });
        }
        // Route برای دریافت پست‌ها
        else if (pathname === '/api/nlp/posts' && req.method === 'GET') {
            const page = url.searchParams.get('page') || '1';
            const limit = url.searchParams.get('limit') || '20';
            result = await fetchJSON(`${NLP_SERVER_URL}/api/nlp/posts?page=${page}&limit=${limit}`);
        }
        // Route اصلی
        else if (pathname === '/' && req.method === 'GET') {
            result = {
                message: '🧠 Knowledge Base & NLP API Gateway',
                timestamp: new Date().toISOString(),
                endpoints: {
                    knowledge: [
                        'GET /api/knowledge/health',
                        'GET /api/knowledge/items?page=1&limit=10',
                        'GET /api/knowledge/search?q=query',
                        'POST /api/knowledge/items',
                        'GET /api/knowledge/analytics'
                    ],
                    nlp: [
                        'GET /api/nlp/health',
                        'POST /api/nlp/generate-samples',
                        'GET /api/nlp/posts?page=1&limit=20'
                    ]
                }
            };
        }
        // Route not found
        else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Endpoint not found'
            }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
        
    } catch (error) {
        console.error('Gateway error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Internal server error',
            error: error.message
        }));
    }
});

function getRequestBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                resolve({});
            }
        });
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🚀 SIMPLE API Gateway Started!');
    console.log('📍 Port:', PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🔗 Knowledge Base: http://localhost:3018');
    console.log('🔗 NLP Server: http://localhost:3004');
    console.log('🎉 =================================');
});
