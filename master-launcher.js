/**
 * 🎯 راه‌انداز اصلی نطق مصطلح
 * استفاده از تمام فایل‌های الگوریتمی ایجاد شده
 */

console.log(`
🌈 نطق مصطلح - استفاده بهینه از تمام منابع
📅 فایل‌های ایجاد شده امروز:
`);

const fs = require('fs');
const path = require('path');

// لیست تمام فایل‌های الگوریتمی
const algorithmFiles = [
    'NAtiQ-ENHANCED.js',
    'free-api-server.js', 
    'simple-free-server.js',
    'web-interface-simple.js',
    'free-version.js',
    'natiq-unified-system.js'
];

// بررسی وجود فایل‌ها
algorithmFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🚀 گزینه‌های راه‌اندازی:');
console.log('1. node natiq-unified-system.js    (همه چیز در یک سیستم)');
console.log('2. node free-api-server.js         (فقط API رایگان)');
console.log('3. node simple-free-server.js      (ساده و سریع)');
console.log('4. node master-launcher.js --web   (رابط وب پیشرفته)');

// راه‌اندازی بر اساس آرگومان
const args = process.argv.slice(2);

if (args.includes('--unified')) {
    require('./natiq-unified-system.js');
} else if (args.includes('--web')) {
    require('./web-interface-simple.js');
} else if (args.includes('--simple')) {
    require('./simple-free-server.js');
} else {
    // راه‌اندازی پیشفرض - سیستم یکپارچه
    console.log('\n🎯 راه‌اندازی سیستم یکپارچه...');
    require('./natiq-unified-system.js');
}
