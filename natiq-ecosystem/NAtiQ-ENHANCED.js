const http = require('http');
const net = require('net');
const NatiqCore = require('../natiq-core/core-engine');
const PersianNLP = require('../nlp-engine/persian-nlp');
const SmartCache = require('../memory-cache/smart-cache');
const { ApiRouter, loggingMiddleware, createRateLimitMiddleware } = require('../api-gateway/api-router');
const config = require('../config/main-config');

class NatiqEnhanced {
    constructor() {
        console.log('🧠 راه‌اندازی سیستم نطق مصطلح...');
        
        // راه‌اندازی کامپوننت‌ها
        this.core = new NatiqCore();
        this.nlp = new PersianNLP();
        this.cache = new SmartCache(config.cache);
        this.router = new ApiRouter();
        
        // راه‌اندازی میان‌افزارها
        this.setupMiddlewares();
        
        // ثبت مسیرها
        this.setupRoutes();
        
        console.log('✅ سیستم نطق مصطلح با موفقیت راه‌اندازی شد!');
    }

    setupMiddlewares() {
        this.router.use(loggingMiddleware);
        this.router.use(createRateLimitMiddleware(100, 60000));
    }

    setupRoutes() {
        // مسیر اصلی سلامتی
        this.router.get('/health', (req, res) => {
            this.router.sendJson(res, {
                status: 'healthy',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                version: '3.0.0'
            });
        });

        // مسیر پرسش و پاسخ
        this.router.post('/ask', async (req, res) => {
            const body = await this.router.parseBody(req);
            const { question, context = {} } = body;

            if (!question) {
                return this.router.sendError(res, 400, 'Question is required');
            }

            try {
                const result = await this.ask(question, context);
                this.router.sendJson(res, result);
            } catch (error) {
                this.router.sendError(res, 500, error.message);
            }
        });

        // مسیر آمار سیستم
        this.router.get('/status', (req, res) => {
            const status = this.getStatus();
            this.router.sendJson(res, status);
        });

        // مسیر پاک‌سازی کش
        this.router.post('/cache/clear', (req, res) => {
            const result = this.clearCache();
            this.router.sendJson(res, result);
        });

        // مسیر تحلیل NLP
        this.router.post('/analyze', async (req, res) => {
            const body = await this.router.parseBody(req);
            const { text } = body;

            if (!text) {
                return this.router.sendError(res, 400, 'Text is required for analysis');
            }

            try {
                const analysis = this.nlp.processText(text);
                this.router.sendJson(res, analysis);
            } catch (error) {
                this.router.sendError(res, 500, error.message);
            }
        });

        // مسیر داشبورد
        this.router.get('/dashboard', (req, res) => {
            this.serveDashboard(req, res);
        });
    }

    // تابع پیدا کردن پورت آزاد
    findAvailablePort(startPort = 3000, maxAttempts = 50) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            
            function tryPort(port) {
                if (attempts >= maxAttempts) {
                    reject(new Error(`نتوانستم پورت آزاد پیدا کنم بعد از ${maxAttempts} تلاش`));
                    return;
                }

                const server = net.createServer();
                
                server.listen(port, '127.0.0.1', () => {
                    server.close(() => {
                        resolve(port);
                    });
                });
                
                server.on('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        attempts++;
                        console.log(`⏳ پورت ${port} مشغول است، در حال بررسی پورت ${port + 1}...`);
                        tryPort(port + 1);
                    } else {
                        reject(err);
                    }
                });
            }
            
            tryPort(startPort);
        });
    }

    // تابع اصلی پرسش و پاسخ
    async ask(question, context = {}) {
        const cacheKey = `ask:${Buffer.from(question).toString('base64')}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached) {
            return {
                ...cached,
                cached: true,
                cacheHit: true
            };
        }

        const analysis = this.core.analyzeQuestion(question);
        const nlpAnalysis = this.nlp.processText(question);
        const response = this.core.generateResponse(analysis, {
            ...context,
            nlp: nlpAnalysis
        });

        this.cache.set(cacheKey, {
            ...response,
            cached: false,
            cacheHit: false
        });

        return response;
    }

    // دریافت وضعیت سیستم
    getStatus() {
        const coreStats = this.core.getPerformanceStats();
        const cacheStats = this.cache.getStats();
        
        return {
            system: {
                name: 'Natiq Masthul',
                version: '3.0.0',
                uptime: coreStats.uptime,
                status: 'operational'
            },
            performance: coreStats.successRate / 100,
            interactionCount: coreStats.interactionCount,
            cacheSizes: {
                analysis: cacheStats.currentSize,
                validation: Math.floor(cacheStats.utilization)
            },
            nlp: {
                maxSequenceLength: config.nlp.maxSequenceLength,
                currentLoad: coreStats.totalRequests
            },
            cache: cacheStats
        };
    }

    // پاک‌سازی کش
    clearCache() {
        const clearedCount = this.cache.clear();
        
        return {
            success: true,
            message: `کش با موفقیت پاک شد`,
            clearedEntries: clearedCount,
            timestamp: new Date().toISOString()
        };
    }

    // سرویس دهی داشبورد
    serveDashboard(req, res) {
        const status = this.getStatus();
        const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح - داشبورد</title>
    <style>
        body { 
            font-family: Tahoma; 
            background: linear-gradient(135deg, #667eea, #764ba2);
            margin: 0; 
            padding: 20px;
            color: #333;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin: 20px auto;
            max-width: 800px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .status-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 10px 0;
            border-right: 4px solid #3498db;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 نطق مصطلح - فعال</h1>
        <div class="status-card">
            <h3>وضعیت سیستم: ✅ فعال</h3>
            <p>پورت: ${this.currentPort || 'در حال راه‌اندازی'}</p>
            <p>تعاملات: ${status.interactionCount}</p>
            <p>کارایی: ${(status.performance * 100).toFixed(1)}%</p>
        </div>
    </div>
</body>
</html>
        `;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);
    }

    // راه‌اندازی سرور با پیدا کردن پورت آزاد
    async startServer(desiredPort = 3000) {
        try {
            const availablePort = await this.findAvailablePort(desiredPort);
            this.currentPort = availablePort;
            
            const server = http.createServer((req, res) => {
                this.router.handleRequest(req, res);
            });

            server.listen(availablePort, config.server.host, () => {
                console.log(`🚀 سرور نطق مصطلح روی پورت ${availablePort} راه‌اندازی شد!`);
                console.log(`📍 آدرس: http://${config.server.host}:${availablePort}`);
                console.log(`📊 داشبورد: http://${config.server.host}:${availablePort}/dashboard`);
                console.log(`🔧 وضعیت: http://${config.server.host}:${availablePort}/health`);
                console.log(`🧠 NLP Max Sequence: ${config.nlp.maxSequenceLength}`);
            });

            return server;
        } catch (error) {
            console.error('❌ خطا در راه‌اندازی سرور:', error.message);
            throw error;
        }
    }
}

// توابع مستقیم برای سازگاری
function ask(question, context = {}) {
    const natiq = new NatiqEnhanced();
    return natiq.ask(question, context);
}

function getStatus() {
    const natiq = new NatiqEnhanced();
    return natiq.getStatus();
}

function clearCache() {
    const natiq = new NatiqEnhanced();
    return natiq.clearCache();
}

module.exports = {
    NatiqEnhanced,
    ask,
    getStatus,
    clearCache
};
