const express = require('express');
const { securityMiddleware, requestLogger } = require('./middleware/security');
const { authenticate, optionalAuth } = require('./middleware/auth');
const AuthController = require('./controllers/AuthController');
const MainController = require('./controllers/MainController');
const LicenseController = require('./controllers/LicenseController');
const logger = require('./utils/logger');

class MultiTenantServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(securityMiddleware);
    this.app.use(requestLogger);
    this.app.use(express.json({ limit: '10mb' }));
  }

  setupRoutes() {
    // Routes عمومی
    this.app.get('/', (req, res) => {
      res.json({
        message: '🧠 نطق مصطلح - پلتفرم چندکاربره پردازش دانش',
        version: '3.0.0',
        status: 'فعال',
        features: [
          'سیستم ثبت‌نام آزاد',
          'پیکربندی Gmail شخصی',
          'درگاه پرداخت داخلی',
          'مدیریت اعتبار و اشتراک'
        ]
      });
    });

    // احراز هویت
    this.app.post('/auth/register', AuthController.register.bind(AuthController));
    this.app.post('/auth/login', AuthController.login.bind(AuthController));
    
    // Routes احراز شده
    this.app.get('/auth/profile', authenticate, AuthController.getProfile.bind(AuthController));
    this.app.put('/auth/gmail-config', authenticate, AuthController.updateGmailConfig.bind(AuthController));
    
    // پردازش ایمیل‌ها (نیاز به احراز هویت و اعتبار کافی)
    this.app.post('/process/emails', authenticate, MainController.processEmails.bind(MainController));
    this.app.get('/knowledge', authenticate, MainController.getKnowledge.bind(MainController));
    
    // مدیریت اشتراک و پرداخت
    this.app.get('/subscription/plans', optionalAuth, LicenseController.getPlans.bind(LicenseController));
    this.app.post('/subscription/upgrade', authenticate, LicenseController.upgradePlan.bind(LicenseController));
    this.app.get('/subscription/usage', authenticate, LicenseController.getUsage.bind(LicenseController));
    
    // درگاه پرداخت
    this.app.post('/payment/create', authenticate, LicenseController.createPayment.bind(LicenseController));
    this.app.get('/payment/verify/:paymentId', LicenseController.verifyPayment.bind(LicenseController));
  }

  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      logger.error('Server error:', err);
      
      if (err.code === 'INSUFFICIENT_CREDITS') {
        return res.status(402).json({
          success: false,
          error: 'اعتبار شما کافی نیست',
          solution: 'لطفاً حساب خود را شارژ کنید'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'خطای داخلی سرور'
      });
    });

    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'مسیر یافت نشد'
      });
    });
  }

  start(port = 3000) {
    this.app.listen(port, '0.0.0.0', () => {
      logger.info(`🚀 سرور چندکاربره نطق مصطلح روی پورت ${port} راه‌اندازی شد`);
      console.log('\n🎉 =================================');
      console.log('🧠 نطق مصطلح - پلتفرم چندکاربره');
      console.log('📍 پورت:', port);
      console.log('💰 سیستم درآمدزایی: فعال');
      console.log('👥 حالت: چندکاربره');
      console.log('🎉 =================================\n');
    });
  }
}

module.exports = MultiTenantServer;
