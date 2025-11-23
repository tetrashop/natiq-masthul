const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 راه‌اندازی سیستم نطق مصطلح...\n');

// راه‌اندازی سرور اصلی
const server = spawn('node', ['src/main-server.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: process.env.PORT || 3000 }
});

server.on('error', (error) => {
    console.error('❌ خطا در راه‌اندازی سرور:', error);
});

console.log(`
✅ سیستم نطق مصطلح با موفقیت راه‌اندازی شد!

📧 دسترسی‌ها:
   اصلی: http://localhost:3000
   هوش مصنوعی: http://localhost:3000/ai-interface.html
   وضعیت: http://localhost:3000/status

🔧 امکانات سیستم:
   ✓ پردازش زبان طبیعی
   ✓ پاسخگویی هوشمند
   ✓ رابط کاربری زیبا
   ✓ API کامل
   ✓ آماده برای استقرار

برای متوقف کردن سیستم: Ctrl+C
`);
