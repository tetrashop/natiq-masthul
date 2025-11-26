const { NatiqEnhanced } = require('./natiq-ecosystem/NAtiQ-ENHANCED.js');

function findAvailablePort(startPort = 3000) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();
        
        server.listen(startPort, () => {
            server.close(() => resolve(startPort));
        });
        
        server.on('error', () => {
            resolve(findAvailablePort(startPort + 1));
        });
    });
}

async function startServer() {
    const availablePort = await findAvailablePort(3000);
    console.log('🧠 در حال بارگذاری نطق مصطلح...');
    
    const natiq = new NatiqEnhanced();
    natiq.startServer(availablePort);
    
    console.log(`\n🎉 نطق مصطلح روی پورت ${availablePort} آماده است!`);
    console.log(`📍 آدرس: http://localhost:${availablePort}`);
}

startServer().catch(console.error);
