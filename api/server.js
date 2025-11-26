import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ask } from '../wisdom-system/master-natiq.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// میدلورها
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// روت اصلی - صفحه وب
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../templates/index.html'));
});

// API برای دریافت سوالات - GET
app.get('/api/ask', async (req, res) => {
  try {
    const question = req.query.q;
    if (!question) {
      return res.json({
        success: false,
        error: 'لطفاً سوال خود را وارد کنید'
      });
    }

    const result = await ask(question);
    
    res.json({
      success: true,
      question: question,
      answer: result.finalResponse.content,
      wisdomScore: result.finalResponse.scores.wisdomScore,
      efficiencyScore: result.finalResponse.scores.efficiencyScore,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      error: 'خطا در پردازش سوال',
      details: error.message
    });
  }
});

// API برای ارسال سوالات - POST
app.post('/api/ask', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question) {
      return res.json({
        success: false,
        error: 'لطفاً سوال خود را وارد کنید'
      });
    }

    const result = await ask(question, context);
    
    res.json({
      success: true,
      question: question,
      answer: result.finalResponse.content,
      insights: result.finalResponse.insights,
      scores: result.finalResponse.scores,
      performance: result.performanceMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      error: 'خطا در پردازش سوال',
      details: error.message
    });
  }
});

// API برای وضعیت سیستم
app.get('/api/status', (req, res) => {
  const status = getStatus();
  res.json({
    system: status.system,
    performance: status.performance,
    uptime: process.uptime()
  });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`🚀 سرور نطق مصطلح در حال اجرا در پورت ${PORT}`);
  console.log(`📱 آدرس: http://localhost:${PORT}`);
  console.log(`🔧 وضعیت سیستم: http://localhost:${PORT}/api/status`);
});

export default app;
