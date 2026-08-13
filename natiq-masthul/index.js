const app = require('./src/app');
const config = require('./src/config');
const logger = require('./src/utils/logger');

const server = app.listen(config.port, () => {
    logger.info(`🚀 Server is running on port ${config.port}`);
    logger.info(`📊 Environment: ${config.env}`);
    logger.info(`📚 API Docs: http://localhost:${config.port}/api-docs`);
    logger.info(`❤️  Health: http://localhost:${config.port}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

module.exports = server;
