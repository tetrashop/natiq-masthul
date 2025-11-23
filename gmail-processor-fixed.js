const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const simpleParser = require('mailparser').simpleParser;
const natural = require('natural');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class GmailProcessor {
    constructor() {
        this.oauth2Client = null;
        this.gmail = null;
        this.transporter = null;
        this.tokenPath = path.join(__dirname, 'gmail-token.json');
        this.credentialsPath = path.join(__dirname, 'gmail-credentials.json');
        this.processedEmails = new Set();
        this.classifier = new natural.BayesClassifier();
        this.initializeClassifier();
        this.loadCredentials();
    }

    // بارگذاری credentials
    loadCredentials() {
        try {
            if (fs.existsSync(this.credentialsPath)) {
                const credentials = JSON.parse(fs.readFileSync(this.credentialsPath, 'utf8'));
                this.setAuthCredentials(credentials);
                console.log('✅ Credentials بارگذاری شد');
            } else {
                console.log('❌ فایل credentials یافت نشد');
            }
        } catch (error) {
            console.error('❌ خطا در بارگذاری credentials:', error.message);
        }
    }

    // مقداردهی اولیه کلاسیفایر
    initializeClassifier() {
        // داده‌های آموزشی اولیه برای دسته‌بندی ایمیل‌ها
        this.classifier.addDocument('دانش فنی یادگیری ماشین', 'technical');
        this.classifier.addDocument('مقاله هوش مصنوعی', 'technical');
        this.classifier.addDocument('کد برنامه نویسی', 'technical');
        this.classifier.addDocument('اخبار فناوری', 'news');
        this.classifier.addDocument('رویداد تکنولوژی', 'news');
        this.classifier.addDocument('تبلیغات محصول', 'commercial');
        this.classifier.addDocument('پیشنهاد ویژه', 'commercial');
        this.classifier.train();
    }

    // تنظیم اعتبارسنجی OAuth2
    setAuthCredentials(credentials) {
        const { client_secret, client_id, redirect_uris } = credentials.web || credentials.installed;
        
        if (!client_id || !client_secret) {
            console.error('❌ client_id یا client_secret یافت نشد');
            return;
        }

        this.oauth2Client = new google.auth.OAuth2(
            client_id, 
            client_secret, 
            redirect_uris ? redirect_uris[0] : 'http://localhost'
        );
        
        // تلاش برای بارگذاری توکن ذخیره شده
        try {
            if (fs.existsSync(this.tokenPath)) {
                const token = fs.readFileSync(this.tokenPath, 'utf8');
                this.oauth2Client.setCredentials(JSON.parse(token));
                this.initializeGmail();
                console.log('✅ احراز هویت Gmail با موفقیت انجام شد');
            }
        } catch (error) {
            console.log('ℹ️ توکن ذخیره شده یافت نشد، نیاز به احراز هویت جدید');
        }
    }

    // دریافت URL احراز هویت
    getAuthUrl() {
        if (!this.oauth2Client) {
            throw new Error('OAuth2 client مقداردهی نشده است');
        }

        const SCOPES = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.labels'
        ];
        
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent'
        });
        
        console.log('✅ URL احراز هویت تولید شد');
        return authUrl;
    }

    // ذخیره توکن
    async saveToken(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            fs.writeFileSync(this.tokenPath, JSON.stringify(tokens));
            this.initializeGmail();
            console.log('✅ توکن با موفقیت ذخیره شد');
            return true;
        } catch (error) {
            console.error('❌ خطا در ذخیره توکن:', error);
            return false;
        }
    }

    // مقداردهی Gmail API
    initializeGmail() {
        this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
        this.initializeTransporter();
        console.log('✅ Gmail API مقداردهی شد');
    }

    // بقیه متدها مانند قبل...
    // [کدهای باقیمانده مانند فایل قبلی]
}

module.exports = GmailProcessor;
