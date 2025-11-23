const crypto = require('crypto');
const logger = require('../utils/logger');

class LicenseService {
  constructor() {
    this.plans = {
      free: {
        name: 'رایگان',
        credits: 100,
        price: 0,
        features: [
          'پردازش ۱۰۰ ایمیل رایگان',
          'ذخیره ۵۰۰ آیتم دانش',
          'دسته‌بندی خودکار',
          'پشتیبانی ایمیلی'
        ]
      },
      basic: {
        name: 'پایه',
        credits: 1000,
        price: 29000, // تومان
        features: [
          'پردازش ۱۰۰۰ ایمیل در ماه',
          'ذخیره نامحدود دانش',
          'جستجوی پیشرفته',
          'پشتیبانی تلگرامی'
        ]
      },
      premium: {
        name: 'حرفه‌ای',
        credits: 5000,
        price: 99000, // تومان
        features: [
          'پردازش ۵۰۰۰ ایمیل در ماه',
          'آنالیز پیشرفته احساسات',
          'خروجی Excel',
          'API دسترسی',
          'پشتیبانی تلفنی'
        ]
      }
    };
  }

  calculatePrice(plan, months = 1) {
    const planConfig = this.plans[plan];
    if (!planConfig) throw new Error('طرح اشتراک نامعتبر است');

    let price = planConfig.price * months;
    
    // تخفیف برای اشتراک طولانی‌مدت
    if (months >= 12) {
      price *= 0.7; // 30% تخفیف
    } else if (months >= 6) {
      price *= 0.8; // 20% تخفیف
    } else if (months >= 3) {
      price *= 0.9; // 10% تخفیف
    }

    return Math.round(price);
  }

  generatePaymentLink(userId, plan, months = 1) {
    const amount = this.calculatePrice(plan, months);
    const paymentId = crypto.randomUUID();
    
    // در واقعیت اینجا باید به درگاه پرداخت متصل شوید
    return {
      paymentId,
      amount,
      plan,
      months,
      paymentUrl: `/payment/process/${paymentId}`,
      callbackUrl: `/payment/verify/${paymentId}`
    };
  }

  async processPayment(paymentId, success = true) {
    // در واقعیت اینجا باید با درگاه پرداخت ارتباط برقرار کنید
    if (success) {
      logger.info(`پرداخت موفق برای: ${paymentId}`);
      return {
        success: true,
        transactionId: crypto.randomUUID(),
        message: 'پرداخت با موفقیت انجام شد'
      };
    } else {
      return {
        success: false,
        message: 'پرداخت ناموفق بود'
      };
    }
  }

  async upgradeUserPlan(userId, plan, months = 1) {
    const user = await UserModel.findUserById(userId);
    if (!user) throw new Error('کاربر یافت نشد');

    user.subscription.plan = plan;
    user.subscription.credits += this.plans[plan].credits * months;
    user.subscription.expiresAt = new Date(Date.now() + (30 * months) * 24 * 60 * 60 * 1000);
    user.updatedAt = new Date().toISOString();

    await UserModel.saveUsers();
    
    logger.info(`کاربر ${user.email} به طرح ${plan} ارتقا یافت`);
    return user;
  }

  getUsageStatistics(userId) {
    const user = UserModel.findUserById(userId);
    if (!user) return null;

    const remainingCredits = user.subscription.credits - user.subscription.usedCredits;
    const usagePercentage = (user.subscription.usedCredits / user.subscription.credits) * 100;

    return {
      plan: user.subscription.plan,
      credits: {
        total: user.subscription.credits,
        used: user.subscription.usedCredits,
        remaining: remainingCredits
      },
      usage: {
        emailsProcessed: user.usage.emailsProcessed,
        knowledgeItems: user.usage.knowledgeItems,
        percentage: Math.round(usagePercentage)
      },
      expiresAt: user.subscription.expiresAt
    };
  }

  createAffiliateProgram(userId) {
    // سیستم بازاریابی مشارکتی
    const affiliateCode = crypto.randomBytes(8).toString('hex').toUpperCase();
    
    return {
      affiliateCode,
      referralLink: `https://natiq-masthul.vercel.app/register?ref=${affiliateCode}`,
      commissionRate: 0.2, // 20% کمیسیون
      totalEarnings: 0,
      referredUsers: []
    };
  }
}

module.exports = new LicenseService();
