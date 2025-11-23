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
        const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
        this.oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        
        // تلاش برای بارگذاری توکن ذخیره شده
        try {
            const token = fs.readFileSync(this.tokenPath);
            this.oauth2Client.setCredentials(JSON.parse(token));
            this.initializeGmail();
            console.log('✅ احراز هویت Gmail با موفقیت انجام شد');
        } catch (error) {
            this.getAuthUrl();
        }
    }

    // دریافت URL احراز هویت
    getAuthUrl() {
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
        
        console.log('🔗 لطفاً این URL را در مرورگر باز کنید و احراز هویت انجام دهید:');
        console.log(authUrl);
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
    }

    // مقداردهی transporter برای ارسال ایمیل
    initializeTransporter() {
        this.transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: this.oauth2Client._clientId,
                clientId: this.oauth2Client._clientId,
                clientSecret: this.oauth2Client._clientSecret,
                refreshToken: this.oauth2Client.credentials.refresh_token,
                accessToken: this.oauth2Client.credentials.access_token
            }
        });
    }

    // دریافت لیست ایمیل‌ها
    async getEmails(maxResults = 10, label = 'INBOX') {
        try {
            const response = await this.gmail.users.messages.list({
                userId: 'me',
                maxResults: maxResults,
                labelIds: [label]
            });

            const messages = response.data.messages || [];
            const emails = [];

            for (const message of messages) {
                const email = await this.getMessage(message.id);
                if (email) {
                    emails.push(email);
                }
            }

            return emails;
        } catch (error) {
            console.error('❌ خطا در دریافت ایمیل‌ها:', error);
            return [];
        }
    }

    // دریافت محتوای یک ایمیل خاص
    async getMessage(messageId) {
        try {
            const response = await this.gmail.users.messages.get({
                userId: 'me',
                id: messageId,
                format: 'raw'
            });

            const email = await simpleParser(Buffer.from(response.data.raw, 'base64'));
            
            return {
                id: messageId,
                subject: email.subject,
                from: email.from,
                date: email.date,
                text: email.text,
                html: email.html,
                attachments: email.attachments
            };
        } catch (error) {
            console.error('❌ خطا در دریافت ایمیل:', error);
            return null;
        }
    }

    // پردازش و استخراج دانش از ایمیل
    async processEmailForKnowledge(email) {
        const emailHash = crypto.createHash('md5').update(email.id).digest('hex');
        
        // بررسی تکراری نبودن ایمیل
        if (this.processedEmails.has(emailHash)) {
            return null;
        }

        const content = email.text || email.html || '';
        
        // آنالیز محتوا
        const analysis = this.analyzeContent(content);
        
        // طبقه‌بندی محتوا
        const category = this.classifier.classify(content);
        
        // استخراج موجودیت‌ها
        const entities = this.extractEntities(content);
        
        // محاسبه امتیاز مرتبط بودن
        const relevanceScore = this.calculateRelevanceScore(content, analysis);
        
        const knowledgeItem = {
            id: emailHash,
            source: 'gmail',
            sourceId: email.id,
            title: email.subject || 'بدون عنوان',
            content: content.substring(0, 1000), // محدود کردن محتوا
            originalContent: content,
            category: category,
            tags: entities.tags,
            keywords: analysis.keywords,
            entities: entities.entities,
            relevanceScore: relevanceScore,
            confidence: analysis.confidence,
            metadata: {
                from: email.from,
                date: email.date,
                wordCount: analysis.wordCount,
                language: analysis.language,
                hasAttachments: email.attachments && email.attachments.length > 0
            },
            status: 'pending', // pending, approved, rejected
            createdAt: new Date(),
            processedAt: new Date()
        };

        this.processedEmails.add(emailHash);
        return knowledgeItem;
    }

    // آنالیز محتوای متن
    analyzeContent(content) {
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(content);
        const wordCount = tokens.length;
        
        // استخراج کلمات کلیدی (ساده)
        const freq = {};
        tokens.forEach(token => {
            if (token.length > 3) { // حذف کلمات کوتاه
                freq[token] = (freq[token] || 0) + 1;
            }
        });
        
        const keywords = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
        
        // تشخیص زبان (ساده)
        const language = this.detectLanguage(content);
        
        // محاسبه اطمینان
        const confidence = Math.min(0.8 + (wordCount / 1000), 0.95);
        
        return {
            wordCount,
            keywords,
            language,
            confidence
        };
    }

    // تشخیص زبان متن
    detectLanguage(text) {
        const persianRegex = /[\u0600-\u06FF]/;
        const englishRegex = /[a-zA-Z]/;
        
        const persianCount = (text.match(persianRegex) || []).length;
        const englishCount = (text.match(englishRegex) || []).length;
        
        return persianCount > englishCount ? 'fa' : 'en';
    }

    // استخراج موجودیت‌ها
    extractEntities(content) {
        const entities = [];
        const tags = [];
        
        // استخراج ایمیل‌ها
        const emails = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        entities.push(...emails.map(email => ({ type: 'email', value: email })));
        
        // استخراج URLها
        const urls = content.match(/https?:\/\/[^\s]+/g) || [];
        entities.push(...urls.map(url => ({ type: 'url', value: url })));
        
        // استخراج کلمات کلیدی تخصصی
        const technicalTerms = [
            'یادگیری ماشین', 'هوش مصنوعی', 'شبکه عصبی', 'پردازش زبان طبیعی',
            'داده کاوی', 'یادگیری عمیق', 'NLP', 'AI', 'ML', 'Deep Learning',
            'تجزیه و تحلیل', 'الگوریتم', 'مدل سازی', 'پیش بینی'
        ];
        
        technicalTerms.forEach(term => {
            if (content.includes(term)) {
                tags.push(term);
            }
        });
        
        return { entities, tags };
    }

    // محاسبه امتیاز مرتبط بودن
    calculateRelevanceScore(content, analysis) {
        let score = 0;
        
        // امتیاز بر اساس طول محتوا
        score += Math.min(analysis.wordCount / 50, 0.3);
        
        // امتیاز بر اساس کلمات کلیدی تخصصی
        const technicalKeywords = analysis.keywords.filter(keyword => 
            ['یادگیری', 'ماشین', 'هوش', 'مصنوعی', 'داده', 'تحلیل', 'الگوریتم'].includes(keyword)
        );
        score += technicalKeywords.length * 0.1;
        
        // امتیاز بر اساس زبان فارسی
        if (analysis.language === 'fa') {
            score += 0.2;
        }
        
        return Math.min(score, 1.0);
    }

    // ارسال ایمیل تأیید
    async sendConfirmationEmail(knowledgeItem, action) {
        try {
            const subject = action === 'approve' 
                ? '✅ آیتم دانش تأیید شد' 
                : '❌ آیتم دانش رد شد';
            
            const text = action === 'approve'
                ? `آیتم دانش "${knowledgeItem.title}" با موفقیت تأیید و به پایگاه دانش اضافه شد.`
                : `آیتم دانش "${knowledgeItem.title}" به دلیل عدم ارتباط کافی رد شد.`;
            
            await this.transporter.sendMail({
                from: this.oauth2Client._clientId,
                to: knowledgeItem.metadata.from,
                subject: subject,
                text: text
            });
            
            console.log(`✅ ایمیل تأیید برای ${knowledgeItem.title} ارسال شد`);
        } catch (error) {
            console.error('❌ خطا در ارسال ایمیل تأیید:', error);
        }
    }

    // پردازش دسته‌ای ایمیل‌ها
    async processBatchEmails(batchSize = 5) {
        console.log('🔄 شروع پردازش ایمیل‌ها...');
        
        const emails = await this.getEmails(batchSize);
        const knowledgeItems = [];
        
        for (const email of emails) {
            const knowledgeItem = await this.processEmailForKnowledge(email);
            if (knowledgeItem && knowledgeItem.relevanceScore > 0.3) {
                knowledgeItems.push(knowledgeItem);
                console.log(`📧 ایمیل پردازش شد: ${knowledgeItem.title} (امتیاز: ${knowledgeItem.relevanceScore.toFixed(2)})`);
            }
        }
        
        console.log(`✅ ${knowledgeItems.length} آیتم دانش استخراج شد`);
        return knowledgeItems;
    }
}

module.exports = GmailProcessor;
