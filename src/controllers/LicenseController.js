const LicenseService = require('../services/LicenseService');
const UserModel = require('../models/User');
const logger = require('../utils/logger');

class LicenseController {
  async getPlans(req, res) {
    try {
      const plans = LicenseService.plans;
      const user = req.user;
      
      let userStats = null;
      if (user) {
        userStats = LicenseService.getUsageStatistics(user.id);
      }

      res.json({
        success: true,
        plans,
        currentPlan: user?.subscription?.plan || 'free',
        userStats
      });
    } catch (error) {
      logger.error('خطا در دریافت طرح‌ها:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در دریافت طرح‌ها'
      });
    }
  }

  async upgradePlan(req, res) {
    try {
      const userId = req.user.id;
      const { plan, months = 1 } = req.body;

      if (!LicenseService.plans[plan]) {
        return res.status(400).json({
          success: false,
          error: 'طرح اشتراک نامعتبر است'
        });
      }

      const paymentLink = LicenseService.generatePaymentLink(userId, plan, months);

      res.json({
        success: true,
        message: 'لینک پرداخت ایجاد شد',
        payment: paymentLink,
        nextSteps: [
          'پرداخت را از طریق لینک فوق انجام دهید',
          'پس از پرداخت، اشتراک شما به طور خودکار فعال می‌شود',
          'اعتبار جدید به حساب شما اضافه خواهد شد'
        ]
      });

    } catch (error) {
      logger.error('خطا در ارتقای اشتراک:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در ارتقای اشتراک'
      });
    }
  }

  async createPayment(req, res) {
    try {
      const userId = req.user.id;
      const { plan, months, amount } = req.body;

      // اعتبارسنجی مقدار پرداخت
      const calculatedAmount = LicenseService.calculatePrice(plan, months);
      if (amount !== calculatedAmount) {
        return res.status(400).json({
          success: false,
          error: 'مبلغ پرداخت نامعتبر است'
        });
      }

      const paymentLink = LicenseService.generatePaymentLink(userId, plan, months);

      res.json({
        success: true,
        payment: {
          ...paymentLink,
          description: `ارتقا به طرح ${LicenseService.plans[plan].name} برای ${months} ماه`
        }
      });

    } catch (error) {
      logger.error('خطا در ایجاد پرداخت:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در ایجاد پرداخت'
      });
    }
  }

  async verifyPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const { success = true } = req.query;

      const paymentResult = await LicenseService.processPayment(paymentId, success === 'true');

      if (paymentResult.success) {
        // در واقعیت باید plan و months را از دیتابیس بخوانید
        const user = await LicenseService.upgradeUserPlan('user-id', 'basic', 1);
        
        res.json({
          success: true,
          message: 'پرداخت با موفقیت تأیید شد و اشتراک شما فعال گردید',
          transaction: paymentResult.transactionId,
          user: {
            plan: user.subscription.plan,
            credits: user.subscription.credits
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'پرداخت ناموفق بود'
        });
      }

    } catch (error) {
      logger.error('خطا در تأیید پرداخت:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در تأیید پرداخت'
      });
    }
  }

  async getUsage(req, res) {
    try {
      const userId = req.user.id;
      const usageStats = LicenseService.getUsageStatistics(userId);

      if (!usageStats) {
        return res.status(404).json({
          success: false,
          error: 'اطلاعات استفاده یافت نشد'
        });
      }

      res.json({
        success: true,
        usage: usageStats,
        recommendations: this.getUsageRecommendations(usageStats)
      });

    } catch (error) {
      logger.error('خطا در دریافت اطلاعات استفاده:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در دریافت اطلاعات استفاده'
      });
    }
  }

  getUsageRecommendations(usageStats) {
    const recommendations = [];
    const remainingPercentage = 100 - usageStats.usage.percentage;

    if (remainingPercentage < 20) {
      recommendations.push({
        type: 'warning',
        message: 'اعتبار شما در حال اتمام است',
        action: 'شارژ حساب',
        priority: 'high'
      });
    }

    if (usageStats.usage.emailsProcessed > 500 && usageStats.plan === 'free') {
      recommendations.push({
        type: 'suggestion',
        message: 'برای پردازش ایمیل‌های بیشتر، طرح پایه را بررسی کنید',
        action: 'ارتقای اشتراک',
        priority: 'medium'
      });
    }

    return recommendations;
  }
}

module.exports = new LicenseController();
