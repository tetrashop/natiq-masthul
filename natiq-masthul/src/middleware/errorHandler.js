const logger = require('../utils/logger');

class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`[${statusCode}] ${message}: ${err.stack}`);

    res.status(statusCode).json({
        error: message,
        status: statusCode,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
module.exports.AppError = AppError;
