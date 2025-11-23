const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

class GmailService {
  constructor() {
    this.oauth2Client = null;
    this.gmail = null;
    this.tokenPath = path.join(__dirname, '../../data/tokens.json');
    this.initializeClient();
  }

  initializeClient() {
    try {
      this.oauth2Client = new google.auth.OAuth2(
        config.gmail.clientId,
        config.gmail.clientSecret,
        config.gmail.redirectUri
      );
      logger.info('Gmail client initialized');
    } catch (error) {
      logger.error('Failed to initialize Gmail client:', error);
      throw error;
    }
  }

  async loadTokens() {
    try {
      const tokenData = await fs.readFile(this.tokenPath, 'utf8');
      const tokens = JSON.parse(tokenData);
      this.oauth2Client.setCredentials(tokens);
      this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      logger.info('Gmail tokens loaded successfully');
      return true;
    } catch (error) {
      logger.warn('No existing tokens found or invalid tokens');
      return false;
    }
  }

  async saveTokens(tokens) {
    try {
      await fs.mkdir(path.dirname(this.tokenPath), { recursive: true });
      await fs.writeFile(this.tokenPath, JSON.stringify(tokens, null, 2));
      this.oauth2Client.setCredentials(tokens);
      this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      logger.info('Gmail tokens saved successfully');
      return true;
    } catch (error) {
      logger.error('Failed to save tokens:', error);
      throw error;
    }
  }

  generateAuthUrl() {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized');
    }

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.gmail.scopes,
      prompt: 'consent'
    });
  }

  async getToken(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      await this.saveTokens(tokens);
      return tokens;
    } catch (error) {
      logger.error('Failed to get tokens:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async getEmailList(maxResults = 20) {
    try {
      if (!this.gmail) {
        throw new Error('Gmail not authenticated');
      }

      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults,
        q: 'is:unread OR label:important'
      });

      return response.data.messages || [];
    } catch (error) {
      logger.error('Failed to fetch email list:', error);
      throw error;
    }
  }

  async getEmailContent(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      return this.parseEmail(response.data);
    } catch (error) {
      logger.error(`Failed to fetch email ${messageId}:`, error);
      throw error;
    }
  }

  parseEmail(message) {
    const headers = message.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
    const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
    const date = headers.find(h => h.name === 'Date')?.value;

    let body = '';
    if (message.payload.parts) {
      const textPart = message.payload.parts.find(part => 
        part.mimeType === 'text/plain'
      );
      if (textPart && textPart.body.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf8');
      }
    } else if (message.payload.body && message.payload.body.data) {
      body = Buffer.from(message.payload.body.data, 'base64').toString('utf8');
    }

    return {
      id: message.id,
      subject,
      from,
      date,
      body: body.substring(0, 1000), // محدودیت برای پردازش بهتر
      snippet: message.snippet
    };
  }
}

module.exports = new GmailService();
