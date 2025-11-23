const net = require('net');

function findFreePort(startPort = 3000, endPort = 4000) {
    return new Promise((resolve) => {
        const testPort = (port) => {
            const server = net.createServer();
            server.listen(port, '0.0.0.0');
            server.on('listening', () => {
                server.close();
                resolve(port);
            });
            server.on('error', () => {
                testPort(port + 1);
            });
        };
        testPort(startPort);
    });
}

findFreePort(3010).then(port => {
    console.log('✅ Free port found:', port);
});
