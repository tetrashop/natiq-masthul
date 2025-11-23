const fs = require('fs').promises;
const path = require('path');

class Logger {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    
    this.currentLevel = this.logLevels.INFO;
    this.logFile = path.join(__dirname, '../../logs/natiq-masthul.log');
    this.initialize();
  }

  async initialize() {
    try {
      await fs.mkdir(path.dirname(this.logFile), { recursive: true });
    } catch (error) {
      console.error('Failed to create logs directory:', error);
    }
  }

  async writeLog(level, message, meta = {}) {
    if (this.logLevels[level] > this.currentLevel) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    const logLine = `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}\n`;

    // نمایش در کنسول
    console.log(logLine.trim());

    // ذخیره در فایل
    try {
      await fs.appendFile(this.logFile, logLine, 'utf8');
    } catch (error) {
      console.error('Failed to write log file:', error);
    }
  }

  error(message, meta = {}) {
    this.writeLog('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.writeLog('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.writeLog('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.writeLog('DEBUG', message, meta);
  }

  setLevel(level) {
    if (this.logLevels[level] !== undefined) {
      this.currentLevel = this.logLevels[level];
    }
  }
}

module.exports = new Logger();
