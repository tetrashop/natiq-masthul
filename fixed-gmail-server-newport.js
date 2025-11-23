const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const port = 3021; // تغییر پورت به 3021

// تنظیمات OAuth2
const oauth2Client = new google.auth.OAuth2(
    '1085618464424-3fabimbjb5ps75vjepqle234usb6lr1p.apps.googleusercontent.com',
    'REDACTED',
    'http://localhost:3021/oauth2callback' // تغییر پورت در redirect_uri
);

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
];

app.use(express.json());

// Route اصلی
app.get('/', (req, res) => {
    res.json({
        message: '🧠 سیستم Gmail - نسخه پورت 3021',
        status: 'فعال',
        endpoints: [
            'GET /auth/url - دریافت URL احراز هویت',
            'GET /oauth2callback - دریافت کد',
            'GET /auth/status - وضعیت احراز هویت'
        ]
    });
});

// دریافت URL احراز هویت
app.get('/auth/url', (req, res) => {
    try {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent'
        });
        
        res.json({
            success: true,
            authUrl: authUrl,
            message: 'این URL را در مرورگر باز کنید'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت کد احراز هویت
app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.status(400).json({
            success: false,
            error: 'کد احراز هویت دریافت نشد'
        });
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        
        // ذخیره توکن
        fs.writeFileSync('gmail-token.json', JSON.stringify(tokens));
        
        res.json({
            success: true,
            message: 'احراز هویت با موفقیت انجام شد',
            hasRefreshToken: !!tokens.refresh_token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// وضعیت احراز هویت
app.get('/auth/status', (req, res) => {
    const hasToken = fs.existsSync('gmail-token.json');
    const isAuthenticated = oauth2Client.credentials && oauth2Client.credentials.access_token;
    
    res.json({
        authenticated: !!isAuthenticated,
        hasToken: hasToken,
        hasCredentials: fs.existsSync('gmail-credentials.json')
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('📧 سرور Gmail روی پورت 3021 راه‌اندازی شد');
    console.log('📍 پورت:', port);
    console.log('🌐 آدرس: http://localhost:' + port);
    console.log('🎉 =================================');
});
