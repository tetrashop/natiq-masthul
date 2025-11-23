const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');

console.log('🧠 راه‌اندازی نهایی پروژه نطق مصطلح...\n');

// استفاده از Desktop App credentials
const oauth2Client = new google.auth.OAuth2(
    'CLIENT_ID_DESKTOP_APP', // جایگزین کنید با Client ID جدید
    'CLIENT_SECRET_DESKTOP_APP', // جایگزین کنید
    'urn:ietf:wg:oauth:2.0:oob'
);

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
});

console.log('🌐 این لینک را در مرورگر باز کنید:');
console.log(authUrl);
console.log('\n');

rl.question('🔑 کد دریافتی را پیست کنید: ', (code) => {
    code = code.trim();
    
    oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
            console.error('❌ خطا:', err.response?.data?.error_description || err.message);
            return;
        }
        
        oauth2Client.setCredentials(tokens);
        fs.writeFileSync('natiq-gmail-token.json', JSON.stringify(tokens, null, 2));
        
        console.log('✅ احراز هویت موفق! پروژه نطق مصطلح آماده است.');
        console.log('🚀 حالا می‌توانید سیستم را کامل راه‌اندازی کنید.');
        
        rl.close();
    });
});
