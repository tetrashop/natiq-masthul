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
app.use(express.static('.'));

// ✅ روت اصلی - صفحه وب با GET
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح خردمند - بوستان</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; padding: 20px; direction: rtl;
        }
        .container { max-width: 800px; margin: 0 auto; }
        .header { 
            background: rgba(255,255,255,0.95); 
            padding: 20px; border-radius: 15px;
            margin-bottom: 20px; text-align: center;
        }
        .chat-box { 
            background: white; border-radius: 15px;
            padding: 20px; margin-bottom: 20px;
            height: 400px; overflow-y: auto;
        }
        .message { margin-bottom: 15px; padding: 10px; border-radius: 10px; }
        .user { background: #e3f2fd; text-align: left; }
        .bot { background: #f5f5f5; text-align: right; }
        .input-area { display: flex; gap: 10px; }
        input { 
            flex: 1; padding: 12px; 
            border: 2px solid #ddd; border-radius: 10px;
            font-size: 16px;
        }
        button { 
            padding: 12px 24px; background: #667eea;
            color: white; border: none; border-radius: 10px;
            cursor: pointer; font-size: 16px;
        }
        button:hover { background: #5a6fd8; }
        .typing { color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 نطق مصطلح خردمند</h1>
            <p>سیستم هوش مصنوعی شرکت بوستان</p>
        </div>
        
        <div class="chat-box" id="chatBox">
            <div class="message bot">
                <strong>🤖 نطق مصطلح:</strong> درود! سوال خود را بپرسید...
            </div>
        </div>
        
        <div class="input-area">
            <input type="text" id="questionInput" placeholder="سوال خود را اینجا بنویسید..." />
            <button onclick="sendQuestion()">ارسال سوال</button>
        </div>
    </div>

    <script>
        async function sendQuestion() {
            const input = document.getElementById('questionInput');
            const chatBox = document.getElementById('chatBox');
            const question = input.value.trim();
            
            if (!question) return;
            
            // نمایش سوال کاربر
            chatBox.innerHTML += \`
                <div class="message user">
                    <strong>👤 شما:</strong> \${question}
                </div>
            \`;
            
            input.value = '';
            
            // نمایش تایپینگ
            chatBox.innerHTML += \`
                <div class="message bot typing" id="typing">
                    <strong>🤖 نطق مصطلح:</strong> در حال پردازش...
                </div>
            \`;
            
            chatBox.scrollTop = chatBox.scrollHeight;
            
            try {
                // ✅ ارسال درخواست POST
                const response = await fetch('/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: question })
                });
                
                const data = await response.json();
                
                // حذف تایپینگ
                document.getElementById('typing').remove();
                
                if (data.success) {
                    chatBox.innerHTML += \`
                        <div class="message bot">
                            <strong>🤖 نطق مصطلح:</strong> \${data.answer}
                        </div>
                    \`;
                } else {
                    chatBox.innerHTML += \`
                        <div class="message bot">
                            <strong>❌ خطا:</strong> \${data.error}
                        </div>
                    \`;
                }
            } catch (error) {
                document.getElementById('typing').remove();
                chatBox.innerHTML += \`
                    <div class="message bot">
                        <strong>❌ خطا:</strong> مشکل در ارتباط با سرور
                    </div>
                \`;
            }
            
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        
        // امکان ارسال با Enter
        document.getElementById('questionInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendQuestion();
            }
        });
    </script>
</body>
</html>
  `);
});

// ✅ API برای درخواست‌های POST
app.post('/ask', async (req, res) => {
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
      efficiencyScore: result.finalResponse.scores.efficiencyScore
    });
    
  } catch (error) {
    console.error('❌ خطا:', error);
    res.json({
      success: false,
      error: 'خطا در پردازش سوال: ' + error.message
    });
  }
});

// ✅ API برای وضعیت سیستم با GET
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

// ✅ راه‌اندازی سرور
app.listen(PORT, () => {
  console.log('🚀 سرور نطق مصطلح راه‌اندازی شد!');
  console.log(`📱 آدرس: http://localhost:${PORT}`);
  console.log(`🔧 وضعیت: http://localhost:${PORT}/status`);
  console.log(`💡 از آدرس بالا در مرورگر استفاده کنید`);
});
