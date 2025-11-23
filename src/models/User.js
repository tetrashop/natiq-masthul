const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class UserModel {
  constructor() {
    this.usersFile = './data/users.json';
    this.sessionsFile = './data/sessions.json';
    this.users = [];
    this.sessions = [];
    this.initialize();
  }

  async initialize() {
    try {
      await fs.mkdir(path.dirname(this.usersFile), { recursive: true });
      
      if (await this.fileExists(this.usersFile)) {
        const data = await fs.readFile(this.usersFile, 'utf8');
        this.users = JSON.parse(data);
      }
      
      if (await this.fileExists(this.sessionsFile)) {
        const data = await fs.readFile(this.sessionsFile, 'utf8');
        this.sessions = JSON.parse(data);
      }
    } catch (error) {
      logger.error('خطا در راه‌اندازی مدل کاربر:', error);
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async createUser(userData) {
    const user = {
      id: crypto.randomUUID(),
      email: userData.email,
      password: this.hashPassword(userData.password),
      gmailConfig: {
        clientId: userData.clientId,
        clientSecret: userData.clientSecret,
        redirectUri: userData.redirectUri,
        connected: false
      },
      subscription: {
        plan: 'free', // free, basic, premium
        credits: 100, // اعتبار اولیه
        usedCredits: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 روز
      },
      usage: {
        emailsProcessed: 0,
        knowledgeItems: 0,
        lastActive: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(user);
    await this.saveUsers();
    
    logger.info(`کاربر جدید ایجاد شد: ${user.email}`);
    return user;
  }

  async updateUserGmailConfig(userId, gmailConfig) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.gmailConfig = {
        ...user.gmailConfig,
        ...gmailConfig,
        connected: true
      };
      user.updatedAt = new Date().toISOString();
      await this.saveUsers();
      return user;
    }
    return null;
  }

  async findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findUserById(id) {
    return this.users.find(user => user.id === id);
  }

  async validateUser(email, password) {
    const user = await this.findUserByEmail(email);
    if (user && user.password === this.hashPassword(password)) {
      return user;
    }
    return null;
  }

  hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async createSession(userId) {
    const session = {
      id: crypto.randomUUID(),
      userId,
      token: crypto.randomBytes(32).toString('hex'),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 ساعت
      createdAt: new Date().toISOString()
    };

    this.sessions.push(session);
    await this.saveSessions();
    
    return session;
  }

  async validateSession(token) {
    const session = this.sessions.find(s => s.token === token);
    if (session && new Date(session.expiresAt) > new Date()) {
      const user = await this.findUserById(session.userId);
      return user;
    }
    return null;
  }

  async updateUserUsage(userId, action) {
    const user = await this.findUserById(userId);
    if (user) {
      user.usage.lastActive = new Date().toISOString();
      
      if (action === 'email_processed') {
        user.usage.emailsProcessed += 1;
        user.subscription.usedCredits += 1;
      } else if (action === 'knowledge_created') {
        user.usage.knowledgeItems += 1;
      }
      
      user.updatedAt = new Date().toISOString();
      await this.saveUsers();
      return user;
    }
    return null;
  }

  async hasSufficientCredits(userId, cost = 1) {
    const user = await this.findUserById(userId);
    return user && (user.subscription.credits - user.subscription.usedCredits) >= cost;
  }

  async saveUsers() {
    try {
      await fs.writeFile(this.usersFile, JSON.stringify(this.users, null, 2));
    } catch (error) {
      logger.error('خطا در ذخیره کاربران:', error);
    }
  }

  async saveSessions() {
    try {
      await fs.writeFile(this.sessionsFile, JSON.stringify(this.sessions, null, 2));
    } catch (error) {
      logger.error('خطا در ذخیره سشن‌ها:', error);
    }
  }
}

module.exports = new UserModel();
