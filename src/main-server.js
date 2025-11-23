const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const MainController = require('./controllers/MainController');
const logger = require('./utils/logger');

class NatiqMasthulServer {
  constructor() {
    this.app = express();
    this.port = config.server.port;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // امنیت پایه
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));
    
    // محدودیت نرخ درخواست
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    });
    this.app.use(limiter);
  }

  setupRoutes() {
    // Routes اصلی
    this.app.get('/', (req, res) => {
      res.json({
        message: '🧠 نطق مصطلح - سیستم هوشمند پردازش دانش',
        version: '2.0.0',
        status: 'فعال',
        endpoints: {
          auth: '/auth/url',
          callback: '/auth/callback',
          process: '/process/emails',
          knowledge: '/knowledge',
          status: '/status'
        }
      });
    });

    // احراز هویت
    this.app.get('/auth/url', MainController.getAuthUrl.bind(MainController));
    this.app.get('/auth/callback', MainController.handleAuthCallback.bind(MainController));
    
    // پردازش
    this.app.post('/process/emails', MainController.processEmails.bind(MainController));
    this.app.get('/knowledge', MainController.getKnowledge.bind(MainController));
    this.app.get('/status', MainController.getSystemStatus.bind(MainController));

    // مدیریت دانش
    this.app.get('/knowledge/search', MainController.searchKnowledge.bind(MainController));
    this.app.delete('/knowledge/:id', MainController.deleteKnowledgeItem.bind(MainController));
  }

  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      logger.error('Server error:', err);
      res.status(500).json({
        success: false,
        error: 'خطای داخلی سرور',
        message: err.message
      });
    });

    // Route not found
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'مسیر یافت نشد'
      });
    });
  }

  async start() {
    // راه‌اندازی سرویس‌ها
    try {
      await require('./services/KnowledgeService').initialize();
      logger.info('Knowledge service initialized');
    } catch (error) {
      logger.error('Failed to initialize knowledge service:', error);
    }

    this.app.listen(this.port, '0.0.0.0', () => {
      logger.info(`🚀 سرور نطق مصطلف روی پورت ${this.port} راه‌اندازی شد`);
      logger.info(`🌐 محیط: ${config.server.env}`);
      logger.info(`📧 سرویس Gmail: ${config.gmail.clientId ? 'تنظیم شده' : 'نیاز به تنظیم'}`);
      console.log('\n🎉 =================================');
      console.log('🧠 نطق مصطلح - سیستم هوشمند پردازش دانش');
      console.log('📍 پورت:', this.port);
      console.log('🌐 آدرس:', `http://localhost:${this.port}`);
      console.log('🚀 آماده استقرار روی ورسل');
      console.log('🎉 =================================\n');
    });
  }
}

// راه‌اندازی سرور
const server = new NatiqMasthulServer();
server.start();

module.exports = server;
