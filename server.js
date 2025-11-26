import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ask, getStatus } from './wisdom-system/master-natiq.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.json({
        success: false,
        error: 'لطفاً سوال خود را وارد کنید'
      });
    }

    console.log('🤔 پردازش پیشرفته سوال:', question);
    const result = await ask(question);
    
    res.json({
      success: true,
      question: question,
      response: result.response,
      analysis: result.analysis,
      metadata: result.metadata,
      scores: result.scores
    });
    
  } catch (error) {
    console.error('❌ خطا:', error);
    res.json({
      success: false,
      error: 'خطا در پردازش سوال: ' + error.message
    });
  }
});

app.get('/status', async (req, res) => {
  try {
    const status = getStatus();
    res.json({
      success: true,
      system: status.system,
      performance: status.performance
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log('🚀 سرور نطق مصطلح پیشرفته راه‌اندازی شد!');
  console.log(`📱 آدرس: http://localhost:${PORT}`);
  console.log(`💡 سیستم پیشرفته با تحلیل مفهومی فعال است`);
});
