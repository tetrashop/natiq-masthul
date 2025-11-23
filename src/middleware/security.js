const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('../utils/logger');

// محدودیت نرخ درخواست
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: 'محدودیت نرخ درخواست',
      message
    },
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent')
      });
      res.status(429).json({
        success: false,
        error: 'محدودیت نرخ درخواست',
        message
      });
    }
  });
};

// میدلور امنیتی
const securityMiddleware = [
  // Helmet for security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    },
    crossOriginEmbedderPolicy: false
  }),

  // CORS configuration
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://natiq-masthul.vercel.app', 'https://*.vercel.app']
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }),

  // Rate limiting for different endpoints
  (req, res, next) => {
    if (req.path.startsWith('/auth')) {
      return createRateLimit(15 * 60 * 1000, 5, 'تعداد درخواست‌های احراز هویت بیش از حد مجاز است')(req, res, next);
    } else if (req.path.startsWith('/process')) {
      return createRateLimit(60 * 1000, 10, 'تعداد درخواست‌های پردازش بیش از حد مجاز است')(req, res, next);
    } else {
      return createRateLimit(60 * 1000, 100, 'تعداد درخواست‌ها بیش از حد مجاز است')(req, res, next);
    }
  }
];

// میدلور لاگینگ درخواست‌ها
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

// میدلور اعتبارسنجی ورودی
const inputValidation = (req, res, next) => {
  // اعتبارسنجی عمومی برای تمام درخواست‌ها
  const sanitize = (input) => {
    if (typeof input === 'string') {
      return input.replace(/[<>]/g, '').trim();
    }
    return input;
  };

  // سانیتایز body
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitize(req.body[key]);
    });
  }

  // سانیتایز query parameters
  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitize(req.query[key]);
    });
  }

  next();
};

module.exports = {
  securityMiddleware,
  requestLogger,
  inputValidation,
  createRateLimit
};
