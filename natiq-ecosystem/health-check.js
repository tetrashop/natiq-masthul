const http = require('http');

console.log('🏥 بررسی سلامت سرویس‌های نطق مصطلح...\n');

const ports = [
    { port: 3000, name: 'API رایگان' },
    { port: 3001, name: 'رابط وب' },
    { port: 3002, name: 'نسخه ساده' }
];

async function checkPort(portInfo) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: portInfo.port,
            path: '/',
            method: 'GET',
            timeout: 3000
        }, (res) => {
            resolve({ ...portInfo, status: '✅ فعال', code: res.statusCode });
        });

        req.on('error', () => {
            resolve({ ...portInfo, status: '❌ غیرفعال', code: 'ERROR' });
        });

        req.on('timeout', () => {
            resolve({ ...portInfo, status: '⏰ timeout', code: 'TIMEOUT' });
        });

        req.end();
    });
}

async function checkAllPorts() {
    const results = [];
    
    for (const portInfo of ports) {
        const result = await checkPort(portInfo);
        results.push(result);
        console.log(`${result.status} - ${result.name} (پورت ${result.port})`);
    }

    console.log('\n🎯 وضعیت کلی:');
    const activeServices = results.filter(r => r.status === '✅ فعال').length;
    console.log(`سرویس‌های فعال: ${activeServices} از ${ports.length}`);
    
    if (activeServices === ports.length) {
        console.log('🎉 تمام سرویس‌ها سالم هستند!');
    } else {
        console.log('🔧 برخی سرویس‌ها نیاز به راه‌اندازی دارند');
    }
}

checkAllPorts();
