const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');

const oauth2Client = new google.auth.OAuth2(
    '1085618464424-3fabimbjb5ps75vjepqle234usb6lr1p.apps.googleusercontent.com',
    'REDACTED',
    'urn:ietf:wg:oauth:2.0:oob'
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// دریافت URL احراز هویت
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

console.log('🌐 این لینک را در مرورگر باز کنید:');
console.log(authUrl);
console.log('\n');

rl.question('🔑 کدی که دریافت کردید را اینجا پیست کنید: ', (code) => {
    rl.close();

    oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
            console.error('❌ خطا در دریافت توکن:', err);
            return;
        }
        
        oauth2Client.setCredentials(tokens);
        
        // ذخیره توکن
        fs.writeFileSync('simple-token.json', JSON.stringify(tokens));
        
        console.log('✅ احراز هویت موفق! توکن ذخیره شد.');
        console.log('📧 حالا می‌توانید از Gmail API استفاده کنید.');
        
        // تست دریافت ایمیل‌ها
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        gmail.users.messages.list({
            userId: 'me',
            maxResults: 5
        }, (err, res) => {
            if (err) {
                console.error('❌ خطا در دریافت ایمیل‌ها:', err);
                return;
            }
            console.log(`✅ ${res.data.messages ? res.data.messages.length : 0} ایمیل دریافت شد.`);
        });
    });
});
