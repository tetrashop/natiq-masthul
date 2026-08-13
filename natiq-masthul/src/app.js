const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config');
const routes = require('./api/routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// ==========================================
// Security Middleware
// ==========================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// ==========================================
// CORS Configuration
// ==========================================
app.use(cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
}));

// ==========================================
// Rate Limiting
// ==========================================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// ==========================================
// Logging & Compression
// ==========================================
app.use(morgan('combined', { stream: logger.stream }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// Static Files
// ==========================================
app.use('/static', express.static('public', {
    maxAge: '1y',
    etag: true,
    lastModified: true,
}));

// ==========================================
// API Routes
// ==========================================
app.use('/api/v1', routes);

// ==========================================
// Health Check
// ==========================================
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0',
    });
});

// ==========================================
// API Documentation
// ==========================================
app.get('/api-docs', (req, res) => {
    res.json({
        name: process.env.npm_package_name || 'TetraShop API',
        version: process.env.npm_package_version || '1.0.0',
        endpoints: {
            '/api/v1': 'API endpoints',
            '/health': 'Health check',
            '/api-docs': 'This documentation',
        },
    });
});

// ==========================================
// 404 Handler
// ==========================================
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`,
    });
});

// ==========================================
// Error Handler
// ==========================================
app.use(errorHandler);

module.exports = app;
