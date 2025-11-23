const express = require('express');
const app = express();
const port = 3020;

app.get('/', (req, res) => {
    res.json({ 
        message: 'سرور تست فعال است',
        status: 'کار می‌کند',
        timestamp: new Date().toISOString()
    });
});

app.get('/auth/url', (req, res) => {
    res.json({
        success: true,
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly&response_type=code&client_id=1085618464424-3fabimbjb5ps75vjepqle234usb6lr1p.apps.googleusercontent.com&redirect_uri=http://localhost:3020/oauth2callback",
        message: "از این URL برای احراز هویت استفاده کنید"
    });
});

app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;
    if (code) {
        res.json({
            success: true,
            message: 'کد دریافت شد',
            code: code
        });
    } else {
        res.status(400).json({
            success: false,
            error: 'کد دریافت نشد'
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 سرور تست روی پورت ${port} راه‌اندازی شد`);
    console.log(`🌐 آدرس: http://localhost:${port}`);
});
