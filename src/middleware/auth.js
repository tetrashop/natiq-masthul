const UserModel = require('../models/User');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'دسترسی غیرمجاز. توکن ارائه نشده است.'
      });
    }

    const user = await UserModel.validateSession(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'توکن نامعتبر یا منقضی شده است.'
      });
    }

    // بررسی اعتبار کاربر
    if (!UserModel.hasSufficientCredits(user.id, 1)) {
      return res.status(402).json({
        success: false,
        error: 'اعتبار شما کافی نیست. لطفاً حساب خود را شارژ کنید.',
        code: 'INSUFFICIENT_CREDITS'
      });
    }

    req.user = user;
    req.sessionToken = token;
    next();
  } catch (error) {
    logger.error('خطا در احراز هویت:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در احراز هویت'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const user = await UserModel.validateSession(token);
      if (user) {
        req.user = user;
        req.sessionToken = token;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};
