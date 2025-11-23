const GmailService = require('../services/GmailService');
const NLPService = require('../services/NLPService');
const KnowledgeService = require('../services/KnowledgeService');
const logger = require('../utils/logger');

class MainController {
  async getAuthUrl(req, res) {
    try {
      const authUrl = GmailService.generateAuthUrl();
      res.json({
        success: true,
        authUrl,
        message: 'برای احراز هویت Gmail از این لینک استفاده کنید'
      });
    } catch (error) {
      logger.error('Failed to generate auth URL:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در تولید لینک احراز هویت'
      });
    }
  }

  async handleAuthCallback(req, res) {
    try {
      const { code } = req.query;
      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'کد احراز هویت ارائه نشده است'
        });
      }

      await GmailService.getToken(code);
      
      res.json({
        success: true,
        message: 'احراز هویت با موفقیت انجام شد',
        redirect: '/dashboard'
      });
    } catch (error) {
      logger.error('Auth callback failed:', error);
      res.status(500).json({
        success: false,
        error: `خطا در احراز هویت: ${error.message}`
      });
    }
  }

  async processEmails(req, res) {
    try {
      const { maxEmails = 10 } = req.body;
      
      // بررسی احراز هویت
      if (!GmailService.gmail) {
        return res.status(401).json({
          success: false,
          error: 'لطفاً ابتدا احراز هویت Gmail را انجام دهید'
        });
      }

      const emails = await GmailService.getEmailList(maxEmails);
      const processedEmails = [];

      for (const email of emails) {
        try {
          const emailContent = await GmailService.getEmailContent(email.id);
          const analysis = await NLPService.analyzeText(
            emailContent.body || emailContent.snippet
          );
          
          const knowledgeItem = await KnowledgeService.addItem({
            source: 'email',
            content: emailContent,
            analysis,
            metadata: {
              gmailId: email.id,
              processedAt: new Date().toISOString()
            }
          });

          processedEmails.push(knowledgeItem);
        } catch (emailError) {
          logger.warn(`Failed to process email ${email.id}:`, emailError);
        }
      }

      res.json({
        success: true,
        processed: processedEmails.length,
        items: processedEmails,
        message: `پردازش ${processedEmails.length} ایمیل با موفقیت انجام شد`
      });
    } catch (error) {
      logger.error('Email processing failed:', error);
      res.status(500).json({
        success: false,
        error: `خطا در پردازش ایمیل‌ها: ${error.message}`
      });
    }
  }

  async getKnowledge(req, res) {
    try {
      const { category, limit = 50, offset = 0 } = req.query;
      const knowledge = await KnowledgeService.getItems({
        category,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        count: knowledge.length,
        knowledge
      });
    } catch (error) {
      logger.error('Failed to fetch knowledge:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در دریافت دانش'
      });
    }
  }

  async getSystemStatus(req, res) {
    try {
      const gmailStatus = !!GmailService.gmail;
      const nlpStatus = await this.checkNLPStatus();
      
      res.json({
        success: true,
        status: {
          gmail: gmailStatus ? 'connected' : 'disconnected',
          nlp: nlpStatus ? 'active' : 'inactive',
          knowledge: {
            total: await KnowledgeService.getCount(),
            categories: await KnowledgeService.getCategories()
          },
          server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            env: process.env.NODE_ENV
          }
        }
      });
    } catch (error) {
      logger.error('Status check failed:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در بررسی وضعیت سیستم'
      });
    }
  }

  async checkNLPStatus() {
    try {
      await NLPService.analyzeText('تست اتصال');
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new MainController();
