import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ask, getStatus } from './wisdom-system/master-natiq.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// میدلورها
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// روت اصلی - صفحه وب
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API برای درخواست‌های POST
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.json({
        success: false,
        error: 'لطفاً سوال خود را وارد کنید'
      });
    }

    console.log('🤔 پردازش سوال:', question);
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
    console.error('❌ خطا:', error);
    res.json({
      success: false,
      error: 'خطا در پردازش سوال: ' + error.message
    });
  }
});

// API برای وضعیت سیستم
app.get('/api/status', async (req, res) => {
  try {
    const status = getStatus();
    res.json({
      success: true,
      system: status.system,
      performance: status.performance,
      uptime: process.uptime()
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log('🚀 سرور نطق مصطلح با واسط کاربری راه‌اندازی شد!');
  console.log(`📱 آدرس: http://localhost:${PORT}`);
  console.log(`💡 از آدرس بالا در مرورگر استفاده کنید`);
});
