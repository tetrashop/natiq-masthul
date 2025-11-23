const MultiTenantServer = require('./src/multi-tenant-server');
const logger = require('./src/utils/logger');

// راه‌اندازی سرور
const server = new MultiTenantServer();
const PORT = process.env.PORT || 3000;

server.start(PORT);

// مدیریت graceful shutdown
process.on('SIGTERM', () => {
  logger.info('دریافت SIGTERM، خروج گراسیفول...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('دریافت SIGINT، خروج گراسیفول...');
  process.exit(0);
});
