const fs = require('fs');
const path = require('path');

console.log('🔍 مقایسه natiq-masthul و natiq-ecosystem...\n');

const mainDir = process.cwd();
const ecosystemDir = path.join(mainDir, 'natiq-ecosystem');

// بررسی وجود پوشه ecosystem
if (!fs.existsSync(ecosystemDir)) {
    console.log('❌ پوشه natiq-ecosystem یافت نشد!');
    process.exit(1);
}

// فایل‌های اصلی
const mainFiles = fs.readdirSync(mainDir).filter(f => 
    f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.md')
);
const ecosystemFiles = fs.readdirSync(ecosystemDir).filter(f => 
    f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.md')
);

console.log('📁 فایل‌های اصلی در natiq-masthul:');
mainFiles.forEach(f => console.log('   📄', f));

console.log('\n📁 فایل‌های اصلی در natiq-ecosystem:');
ecosystemFiles.forEach(f => console.log('   📄', f));

// بررسی تکراری بودن
const duplicates = mainFiles.filter(f => ecosystemFiles.includes(f));
if (duplicates.length > 0) {
    console.log('\n⚠️  فایل‌های تکراری:');
    duplicates.forEach(f => console.log('   🔄', f));
} else {
    console.log('\n✅ هیچ فایل تکراری وجود ندارد');
}

// بررسی فایل‌های ضروری
const essentialFiles = ['NAtiQ-ENHANCED.js', 'free-api-server.js', 'package.json'];
const missingInMain = essentialFiles.filter(f => !mainFiles.includes(f));
const missingInEco = essentialFiles.filter(f => !ecosystemFiles.includes(f));

console.log('\n🎯 فایل‌های ضروری:');
console.log('   در natiq-masthul:', missingInMain.length === 0 ? '✅ کامل' : '❌ کمبود: ' + missingInMain.join(', '));
console.log('   در natiq-ecosystem:', missingInEco.length === 0 ? '✅ کامل' : '❌ کمبود: ' + missingInEco.join(', '));

console.log('\n💡 پیشنهاد:');
if (duplicates.length > 0 || missingInMain.length > 0) {
    console.log('   نیاز به یکپارچه‌سازی دارید!');
} else {
    console.log('   ساختار مناسب است.');
}
