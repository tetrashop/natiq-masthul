const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');

console.log('🔐 شروع فرآیند احراز هویت Gmail...\\n');

const oauth2Client = new google.auth.OAuth2(
    '1085618464424-3fabimbjb5ps75vjepqle234usb6lr1p.apps.googleusercontent.com',
    'REDACTED',
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

// دریافت URL احراز هویت
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
});

console.log('🌐 **مرحله ۱:** این لینک را در مرورگر باز کنید:');
console.log('----------------------------------------');
console.log(authUrl);
console.log('----------------------------------------\\n');

console.log('📝 **مرحله ۲:** پس از باز کردن لینک:');
console.log('   - با حساب Google خود وارد شوید');
console.log('   - دسترسی‌ها را تأیید کنید');
console.log('   - در صفحه بعد، کدی که نمایش داده می‌شود را کپی کنید\\n');

console.log('⚠️  **توجه:** اگر خطای "برنامه در مرحله آزمایش است" دیدید:');
console.log('   باید در Google Cloud Console کاربر تست اضافه کنید\\n');

rl.question('🔑 **مرحله ۳:** کدی که کپی کردید را اینجا پیست کنید: ', (code) => {
    // حذف فاصله‌های اضافی
    code = code.trim();
    
    if (!code) {
        console.log('❌ کد وارد نشد! لطفاً دوباره تلاش کنید.');
        rl.close();
        return;
    }

    console.log('\\n🔄 در حال دریافت توکن...\\n');

    oauth2Client.getToken(code, async (err, tokens) => {
        if (err) {
            console.error('❌ خطا در دریافت توکن:', err.response?.data || err.message);
            console.log('\\n🔧 راه‌حل‌های ممکن:');
            console.log('   - مطمئن شوید کد را صحیح کپی کرده‌اید');
            console.log('   - کاربر تست در Google Cloud Console اضافه شده باشد');
            console.log('   - ۱۰ دقیقه پس از تغییرات در کنسول صبر کنید');
            rl.close();
            return;
        }

        oauth2Client.setCredentials(tokens);
        
        // ذخیره توکن
        try {
            fs.writeFileSync('gmail-token-improved.json', JSON.stringify(tokens, null, 2));
            console.log('✅ توکن با موفقیت ذخیره شد: gmail-token-improved.json');
        } catch (writeErr) {
            console.error('❌ خطا در ذخیره توکن:', writeErr.message);
            rl.close();
            return;
        }

        console.log('✅ احراز هویت موفق!\\n');
        
        // تست اتصال به Gmail
        try {
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
            const response = await gmail.users.getProfile({ userId: 'me' });
            console.log(`📧 اتصال موفق به Gmail:`);
            console.log(`   - آدرس: ${response.data.emailAddress}`);
            console.log(`   - تاریخ انقضا: ${tokens.expiry_date ? new Date(tokens.expiry_date).toLocaleString('fa-IR') : 'نامشخص'}`);
        } catch (gmailErr) {
            console.log('⚠️  توکن ذخیره شد اما خطا در تست Gmail:', gmailErr.message);
        }

        console.log('\\n🎉 سیستم آماده استفاده است!');
        rl.close();
    });
});
