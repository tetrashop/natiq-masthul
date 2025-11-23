const express = require('express');
const GmailProcessor = require('./gmail-processor');
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
                message: '🧠 سیستم یکپارچه Gmail و پایگاه دانش',
                status: 'فعال',
                endpoints: [
                    'GET /auth/url - دریافت URL احراز هویت',
                    'POST /auth/token - ذخیره توکن',
                    'GET /emails - دریافت ایمیل‌ها',
                    'POST /process - پردازش ایمیل‌ها',
                    'GET /knowledge - دریافت آیتم‌های دانش',
                    'POST /knowledge/approve/:id - تأیید آیتم دانش',
                    'POST /knowledge/reject/:id - رد آیتم دانش'
                ]
            });
        });

        // دریافت URL احراز هویت
        this.app.get('/auth/url', (req, res) => {
            const authUrl = this.gmailProcessor.getAuthUrl();
            res.json({ authUrl });
        });

        // ذخیره توکن
        this.app.post('/auth/token', async (req, res) => {
            const { code } = req.body;
            if (!code) {
                return res.status(400).json({ error: 'کد احراز هویت الزامی است' });
            }

            const success = await this.gmailProcessor.saveToken(code);
            if (success) {
                res.json({ message: 'احراز هویت با موفقیت انجام شد' });
            } else {
                res.status(500).json({ error: 'خطا در احراز هویت' });
            }
        });

        // دریافت ایمیل‌ها
        this.app.get('/emails', async (req, res) => {
            try {
                const emails = await this.gmailProcessor.getEmails(10);
                res.json({
                    success: true,
                    count: emails.length,
                    emails: emails.map(email => ({
                        id: email.id,
                        subject: email.subject,
                        from: email.from,
                        date: email.date
                    }))
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // پردازش ایمیل‌ها
        this.app.post('/process', async (req, res) => {
            try {
                const { batchSize = 5 } = req.body;
                const knowledgeItems = await this.gmailProcessor.processBatchEmails(batchSize);
                
                // ذخیره آیتم‌های در انتظار تأیید
                knowledgeItems.forEach(item => {
                    const exists = this.knowledgeBase.find(k => k.id === item.id);
                    if (!exists) {
                        this.knowledgeBase.push(item);
                    }
                });

                this.saveKnowledgeBase();

                res.json({
                    success: true,
                    processed: knowledgeItems.length,
                    items: knowledgeItems
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // دریافت آیتم‌های دانش
        this.app.get('/knowledge', (req, res) => {
            const { status, category } = req.query;
            let items = this.knowledgeBase;

            if (status) {
                items = items.filter(item => item.status === status);
            }

            if (category) {
                items = items.filter(item => item.category === category);
            }

            res.json({
                success: true,
                count: items.length,
                items: items
            });
        });

        // تأیید آیتم دانش
        this.app.post('/knowledge/approve/:id', async (req, res) => {
            try {
                const item = this.knowledgeBase.find(k => k.id === req.params.id);
                if (!item) {
                    return res.status(404).json({ error: 'آیتم یافت نشد' });
                }

                item.status = 'approved';
                item.approvedAt = new Date();
                
                // ارسال ایمیل تأیید
                await this.gmailProcessor.sendConfirmationEmail(item, 'approve');
                
                this.saveKnowledgeBase();

                res.json({
                    success: true,
                    message: 'آیتم دانش تأیید شد',
                    item: item
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // رد آیتم دانش
        this.app.post('/knowledge/reject/:id', async (req, res) => {
            try {
                const item = this.knowledgeBase.find(k => k.id === req.params.id);
                if (!item) {
                    return res.status(404).json({ error: 'آیتم یافت نشد' });
                }

                item.status = 'rejected';
                item.rejectedAt = new Date();
                
                // ارسال ایمیل رد
                await this.gmailProcessor.sendConfirmationEmail(item, 'reject');
                
                this.saveKnowledgeBase();

                res.json({
                    success: true,
                    message: 'آیتم دانش رد شد',
                    item: item
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    // بارگذاری پایگاه دانش از فایل
    loadKnowledgeBase() {
        try {
            const data = fs.readFileSync('./knowledge-base.json', 'utf8');
            this.knowledgeBase = JSON.parse(data);
            console.log('✅ پایگاه دانش بارگذاری شد');
        } catch (error) {
            console.log('ℹ️ پایگاه دانش جدید ایجاد شد');
            this.knowledgeBase = [];
        }
    }

    // ذخیره پایگاه دانش در فایل
    saveKnowledgeBase() {
        try {
            fs.writeFileSync('./knowledge-base.json', JSON.stringify(this.knowledgeBase, null, 2));
            console.log('✅ پایگاه دانش ذخیره شد');
        } catch (error) {
            console.error('❌ خطا در ذخیره پایگاه دانش:', error);
        }
    }

    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log('🎉 =================================');
            console.log('📧 سیستم یکپارچه Gmail و دانش راه‌اندازی شد!');
            console.log('📍 پورت:', this.port);
            console.log('🌐 آدرس: http://localhost:' + this.port);
            console.log('🎉 =================================');
        });
    }
}

// ایجاد فایل credentials نمونه اگر وجود نداشته باشد
try {
    fs.accessSync('./gmail-credentials.json');
} catch (error) {
    const sampleCredentials = {
        "installed": {
            "client_id": "client_id_here",
            "project_id": "project_id_here",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": "client_secret_here",
            "redirect_uris": ["http://localhost"]
        }
    };
    
    fs.writeFileSync('./gmail-credentials.json', JSON.stringify(sampleCredentials, null, 2));
    console.log('📝 فایل gmail-credentials.json ایجاد شد. لطفاً اطلاعات Gmail API خود را در آن وارد کنید.');
}

const server = new GmailKnowledgeServer();
server.start();

module.exports = GmailKnowledgeServer;
