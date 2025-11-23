const UserModel = require('../models/User');
const LicenseService = require('../services/LicenseService');
const logger = require('../utils/logger');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, clientId, clientSecret, redirectUri, affiliateCode } = req.body;

      // اعتبارسنجی ورودی‌ها
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'ایمیل و رمز عبور الزامی هستند'
        });
      }

      // بررسی وجود کاربر
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'این ایمیل قبلاً ثبت شده است'
        });
      }

      // ایجاد کاربر جدید
      const user = await UserModel.createUser({
        email,
        password,
        clientId,
        clientSecret,
        redirectUri
      });

      // ایجاد سشن
      const session = await UserModel.createSession(user.id);

      // پردازش کد معرف (اختیاری)
      if (affiliateCode) {
        await this.processAffiliate(affiliateCode, user.id);
      }

      res.json({
        success: true,
        message: 'ثبت‌نام با موفقیت انجام شد',
        user: {
          id: user.id,
          email: user.email,
          plan: user.subscription.plan
        },
        session: {
          token: session.token,
          expiresAt: session.expiresAt
        }
      });

    } catch (error) {
      logger.error('خطا در ثبت‌نام:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در ثبت‌نام'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.validateUser(email, password);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'ایمیل یا رمز عبور نادرست است'
        });
      }

      const session = await UserModel.createSession(user.id);

      res.json({
        success: true,
        message: 'ورود موفقیت‌آمیز',
        user: {
          id: user.id,
          email: user.email,
          plan: user.subscription.plan
        },
        session: {
          token: session.token,
          expiresAt: session.expiresAt
        }
      });

    } catch (error) {
      logger.error('خطا در ورود:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در ورود'
      });
    }
  }

  async updateGmailConfig(req, res) {
    try {
      const userId = req.user.id;
      const { clientId, clientSecret, redirectUri } = req.body;

      if (!clientId || !clientSecret) {
        return res.status(400).json({
          success: false,
          error: 'Client ID و Client Secret الزامی هستند'
        });
      }

      const user = await UserModel.updateUserGmailConfig(userId, {
        clientId,
        clientSecret,
        redirectUri
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'کاربر یافت نشد'
        });
      }

      res.json({
        success: true,
        message: 'تنظیمات Gmail با موفقیت به‌روزرسانی شد',
        connected: user.gmailConfig.connected
      });

    } catch (error) {
      logger.error('خطا در به‌روزرسانی تنظیمات:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در به‌روزرسانی تنظیمات'
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserModel.findUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'کاربر یافت نشد'
        });
      }

      const usageStats = LicenseService.getUsageStatistics(userId);

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          gmailConfig: {
            connected: user.gmailConfig.connected
          },
          subscription: user.subscription,
          usage: usageStats
        }
      });

    } catch (error) {
      logger.error('خطا در دریافت پروفایل:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در دریافت پروفایل'
      });
    }
  }

  async processAffiliate(affiliateCode, newUserId) {
    // پردازش سیستم بازاریابی مشارکتی
    logger.info(`پردازش کد معرف: ${affiliateCode} برای کاربر: ${newUserId}`);
    // پیاده‌سازی منطق پرداخت پورسانت
  }
}

module.exports = new AuthController();
