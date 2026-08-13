require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
    },
    database: {
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/tetrashop',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
};
