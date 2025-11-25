const fs = require('fs');
const path = require('path');

console.log('🔍 تأیید یکپارچه‌سازی...\n');

const essentialFiles = [
    'NAtiQ-ENHANCED.js',
    'free-api-server.js', 
    'package.json',
    'system-showcase.js',
    'master-launcher.js'
];

let allGood = true;

essentialFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allGood = false;
});

console.log('\n📁 ساختار فعلی:');
const files = fs.readdirSync(process.cwd())
    .filter(f => f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.md'))
    .slice(0, 10); // نمایش 10 فایل اول

files.forEach(f => console.log(`   📄 ${f}`));

if (allGood) {
    console.log('\n🎉 یکپارچه‌سازی با موفقیت انجام شد!');
    console.log('🚀 اکنون می‌توانید تغییرات را به GitHub منتشر کنید.');
} else {
    console.log('\n⚠️ برخی فایل‌ها گم شده‌اند. لطفاً بررسی کنید.');
}
