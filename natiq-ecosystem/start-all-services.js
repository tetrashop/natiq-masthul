const { spawn } = require('child_process');

console.log('🚀 راه‌اندازی تمام سرویس‌های نطق مصطلح...\n');

const services = [
    { name: '🌐 API رایگان (3000)', command: 'node', args: ['free-api-server.js'] },
    { name: '🖥️ رابط وب (3001)', command: 'node', args: ['web-interface-simple.js'] },
    { name: '⚡ نسخه ساده (3002)', command: 'node', args: ['simple-free-server.js'] }
];

services.forEach(service => {
    console.log(`🔧 شروع ${service.name}...`);
    
    const child = spawn(service.command, service.args, {
        stdio: 'inherit',
        cwd: __dirname
    });

    child.on('error', (error) => {
        console.log(`❌ خطا در ${service.name}:`, error.message);
    });

    child.on('exit', (code) => {
        console.log(`⚠️ ${service.name} متوقف شد با کد: ${code}`);
    });
});

console.log('\n✅ تمام سرویس‌ها راه‌اندازی شدند!');
console.log('📊 پورت‌های فعال:');
console.log('   • http://localhost:3000 - API رایگان');
console.log('   • http://localhost:3001 - رابط وب');
console.log('   • http://localhost:3002 - نسخه ساده');
console.log('\n💡 برای متوقف کردن: Ctrl+C');
