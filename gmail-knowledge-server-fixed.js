const express = require('express');
const GmailProcessor = require('./gmail-processor-fixed');
const fs = require('fs');
const path = require('path');

class GmailKnowledgeServer {
    constructor() {
        this.app = express();
        this.port = 3020;
        this.gmailProcessor = new GmailProcessor();
        this.knowledgeBase = [];
        this.setupRoutes();
        this.loadKnowledgeBase();
    }

    setupRoutes() {
        this.app.use(express.json());

        // Route اصلی
        this.app.get('/', (req, res) => {
            res.json({
                message: '🧠 سیستم یکپارچه Gmail و پایگاه دانش - نسخه اصلاح شده',
                status: 'فعال',
                endpoints: [
                    'GET /auth/url - دریافت URL احراز هویت',
                    'POST /auth/token - ذخیره توکن',
                    'GET /auth/status - وضعیت احراز هویت',
                    'GET /emails - دریافت ایمیل‌ها',
                    'POST /process - پردازش ایمیل‌ها',
                    'GET /knowledge - دریافت آیتم‌های دانش'
                ]
            });
        });

        // وضعیت احراز هویت
        this.app.get('/auth/status', (req, res) => {
            const isAuthenticated = this.gmailProcessor.oauth2Client && 
                                  this.gmailProcessor.oauth2Client.credentials;
            res.json({
                authenticated: isAuthenticated,
                hasCredentials: fs.existsSync('./gmail-credentials.json'),
                hasToken: fs.existsSync('./gmail-token.json')
            });
        });

        // دریافت URL احراز هویت
        this.app.get('/auth/url', (req, res) => {
            try {
                const authUrl = this.gmailProcessor.getAuthUrl();
                res.json({ 
                    success: true,
                    authUrl,
                    message: 'لطفاً این URL را در مرورگر باز کنید و احراز هویت انجام دهید'
                });
            } catch (error) {
                res.status(400).json({ 
                    success: false,
                    error: error.message,
                    message: 'ابتدا مطمئن شوید فایل gmail-credentials.json با اطلاعات صحیح ایجاد شده است'
                });
            }
        });

        // ذخیره توکن
        this.app.post('/auth/token', async (req, res) => {
            const { code } = req.body;
            if (!code) {
                return res.status(400).json({ 
                    success: false,
                    error: 'کد احراز هویت الزامی است' 
                });
            }

            try {
                const success = await this.gmailProcessor.saveToken(code);
                if (success) {
                    res.json({ 
                        success: true,
                        message: 'احراز هویت با موفقیت انجام شد' 
                    });
                } else {
                    res.status(500).json({ 
                        success: false,
                        error: 'خطا در احراز هویت' 
                    });
                }
            } catch (error) {
                res.status(500).json({ 
                    success: false,
                    error: error.message 
                });
            }
        });

        // Route تست ساده
        this.app.get('/test', (req, res) => {
            res.json({
                success: true,
                message: 'سرور فعال است',
                timestamp: new Date().toISOString()
            });
        });

        // مدیریت خطا
        this.app.use((err, req, res, next) => {
            console.error('❌ خطای سرور:', err);
            res.status(500).json({
                success: false,
                error: err.message,
                message: 'خطای داخلی سرور'
            });
        });
    }

    loadKnowledgeBase() {
        try {
            if (fs.existsSync('./knowledge-base.json')) {
                const data = fs.readFileSync('./knowledge-base.json', 'utf8');
                this.knowledgeBase = JSON.parse(data);
                console.log('✅ پایگاه دانش بارگذاری شد');
            } else {
                console.log('ℹ️ پایگاه دانش جدید ایجاد شد');
                this.knowledgeBase = [];
            }
        } catch (error) {
            console.error('❌ خطا در بارگذاری پایگاه دانش:', error);
            this.knowledgeBase = [];
        }
    }

    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log('🎉 =================================');
            console.log('📧 سیستم یکپارچه Gmail و دانش راه‌اندازی شد!');
            console.log('📍 پورت:', this.port);
            console.log('🌐 آدرس: http://localhost:' + this.port);
            console.log('🎉 =================================');
            
            // بررسی وضعیت credentials
            if (!fs.existsSync('./gmail-credentials.json')) {
                console.log('❌ فایل gmail-credentials.json یافت نشد');
                console.log('📝 لطفاً فایل credentials را از Google Cloud Console دریافت کنید');
            } else {
                console.log('✅ فایل credentials موجود است');
            }
        });
    }
}

const server = new GmailKnowledgeServer();
server.start();
