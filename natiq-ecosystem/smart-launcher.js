const { exec } = require('child_process');

console.log('🎯 راه‌انداز هوشمند نطق مصطلح\n');

// بررسی اینکه کدام سرویس‌ها نیاز به راه‌اندازی دارند
exec('node health-check.js', (error, stdout, stderr) => {
    console.log(stdout);
    
    if (stdout.includes('❌ غیرفعال') || stdout.includes('⏰ timeout')) {
        console.log('\n🔧 راه‌اندازی سرویس‌های غیرفعال...');
        
        // راه‌اندازی سرویس‌های ضروری
        const servicesToStart = [];
        
        if (stdout.includes('3000 ❌')) {
            servicesToStart.push('node free-api-server.js');
        }
        
        if (stdout.includes('3001 ❌')) {
            servicesToStart.push('node web-interface-simple.js');
        }
        
        if (stdout.includes('3002 ❌')) {
            servicesToStart.push('node simple-free-server.js');
        }
        
        if (servicesToStart.length > 0) {
            console.log('🚀 در حال راه‌اندازی:', servicesToStart.join(', '));
            
            servicesToStart.forEach(service => {
                exec(service, { cwd: __dirname }, (err, out, errOut) => {
                    if (err) {
                        console.log(`❌ خطا در ${service}:`, err.message);
                    }
                });
            });
            
            console.log('\n⏳ صبر کنید 3 ثانیه...');
            setTimeout(() => {
                console.log('\n🔍 بررسی مجدد وضعیت...');
                exec('node health-check.js', (e, out, err) => {
                    console.log(out);
                });
            }, 3000);
        }
    } else {
        console.log('\n🎉 تمام سرویس‌ها فعال هستند!');
        console.log('📱 می‌توانید از سیستم استفاده کنید:');
        console.log('   • API: http://localhost:3000/api/free/ask');
        console.log('   • وب: http://localhost:3001');
        console.log('   • ساده: http://localhost:3002');
    }
});
