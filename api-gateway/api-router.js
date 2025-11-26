const http = require('http');
const url = require('url');
const querystring = require('querystring');

class ApiRouter {
    constructor() {
        this.routes = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
        this.middlewares = [];
    }

    // ثبت مسیر GET
    get(path, handler) {
        this.routes.GET[path] = handler;
    }

    // ثبت مسیر POST
    post(path, handler) {
        this.routes.POST[path] = handler;
    }

    // ثبت میان‌افزار
    use(middleware) {
        this.middlewares.push(middleware);
    }

    // پردازش درخواست
    async handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;
        const method = req.method;
        const query = parsedUrl.query;

        // اجرای میان‌افزارها
        for (const middleware of this.middlewares) {
            if (!await middleware(req, res)) {
                return;
            }
        }

        // تنظیم هدرهای CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // مدیریت OPTIONS برای CORS
        if (method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // یافتن هندلر مناسب
        const handler = this.routes[method] && this.routes[method][path];

        if (handler) {
            try {
                await handler(req, res, query);
            } catch (error) {
                this.sendError(res, 500, `Internal Server Error: ${error.message}`);
            }
        } else {
            this.sendError(res, 404, `Route ${method} ${path} not found`);
        }
    }

    // ارسال پاسخ JSON
    sendJson(res, data, statusCode = 200) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            success: true,
            data: data,
            timestamp: new Date().toISOString()
        }, null, 2));
    }

    // ارسال خطا
    sendError(res, statusCode, message) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            success: false,
            error: message,
            timestamp: new Date().toISOString()
        }, null, 2));
    }

    // تجزیه بدنه درخواست
    parseBody(req) {
        return new Promise((resolve, reject) => {
            if (req.method !== 'POST' && req.method !== 'PUT') {
                resolve({});
                return;
            }

            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    if (req.headers['content-type'] === 'application/json') {
                        resolve(JSON.parse(body));
                    } else {
                        resolve(querystring.parse(body));
                    }
                } catch (error) {
                    reject(new Error('Invalid JSON body'));
                }
            });

            req.on('error', reject);
        });
    }
}

// میان‌افزار لاگینگ
const loggingMiddleware = (req, res) => {
    const startTime = Date.now();
    const { method, url } = req;

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} - ${duration}ms`);
    });

    return true;
};

// میان‌افزار محدودیت نرخ
const createRateLimitMiddleware = (maxRequests = 100, windowMs = 60000) => {
    const requests = new Map();

    setInterval(() => {
        requests.clear();
    }, windowMs);

    return (req, res) => {
        const clientIP = req.socket.remoteAddress;
        const currentRequests = requests.get(clientIP) || 0;

        if (currentRequests >= maxRequests) {
            res.writeHead(429, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Too many requests'
            }));
            return false;
        }

        requests.set(clientIP, currentRequests + 1);
        return true;
    };
};

module.exports = { ApiRouter, loggingMiddleware, createRateLimitMiddleware };
