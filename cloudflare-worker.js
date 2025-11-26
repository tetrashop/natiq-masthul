// Cloudflare Worker برای نطق مصطلح
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Import modules
      const { NatiqCore } = await import('./natiq-ecosystem/natiq-core.js');
      const { PersianNLP } = await import('./natiq-ecosystem/nlp-engine.js');

      const natiq = new NatiqCore();
      const nlp = new PersianNLP();

      // Route handling
      if (path === '/api/health' || path === '/health') {
        const status = natiq.getPerformanceStats();
        return new Response(JSON.stringify({
          status: 'healthy',
          ...status,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (path === '/api/ask' && request.method === 'POST') {
        const body = await request.json();
        const { question, context = {} } = body;
        
        if (!question) {
          return new Response(JSON.stringify({
            error: 'Question is required',
            success: false
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const analysis = natiq.analyzeQuestion(question);
        const nlpAnalysis = nlp.processText(question);
        const response = natiq.generateResponse(analysis, { 
          ...context, 
          nlp: nlpAnalysis 
        });

        return new Response(JSON.stringify({
          success: true,
          ...response
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (path === '/api/analyze' && request.method === 'POST') {
        const body = await request.json();
        const { text } = body;
        
        if (!text) {
          return new Response(JSON.stringify({
            error: 'Text is required',
            success: false
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const analysis = nlp.processText(text);
        return new Response(JSON.stringify({
          success: true,
          analysis
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Serve dashboard for root path
      if (path === '/' || path === '/dashboard') {
        return serveDashboard();
      }

      // 404 for unknown routes
      return new Response(JSON.stringify({
        error: 'Endpoint not found',
        success: false
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
}

function serveDashboard() {
  const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح - Cloudflare</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Tahoma, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f3f4;
        }
        
        .header h1 {
            color: #2c3e50;
            font-size: 2.2em;
            margin-bottom: 10px;
        }
        
        .status-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 25px 0;
        }
        
        .status-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-left: 4px solid #3498db;
        }
        
        .input-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
        }
        
        textarea {
            width: 100%;
            height: 120px;
            padding: 15px;
            border: 2px solid #e1e8ed;
            border-radius: 10px;
            font-size: 16px;
            margin: 10px 0;
            resize: vertical;
        }
        
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin: 5px;
            transition: all 0.3s;
        }
        
        button:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        .response {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 15px 0;
            border-right: 4px solid #3498db;
            white-space: pre-wrap;
            line-height: 1.6;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 نطق مصطلح - Cloudflare</h1>
            <p>سیستم هوش مصنوعی فارسی - مستقر شده روی Cloudflare Workers</p>
        </div>

        <div class="status-cards">
            <div class="status-card">
                <h3>وضعیت سیستم</h3>
                <div class="value" id="systemStatus">در حال بررسی...</div>
                <p>Cloudflare Worker</p>
            </div>
            <div class="status-card">
                <h3>مقدار سوالات</h3>
                <div class="value" id="questionCount">0</div>
                <p>پردازش شده</p>
            </div>
        </div>

        <div class="input-section">
            <h2>💬 پرسش از سیستم هوش مصنوعی</h2>
            <textarea id="questionInput" placeholder="سوال خود را اینجا بنویسید..."></textarea>
            <div style="text-align: center;">
                <button onclick="askQuestion()">🚀 ارسال سوال</button>
                <button onclick="analyzeText()" style="background: #9b59b6;">📊 تحلیل متن</button>
            </div>
        </div>

        <div id="responseArea" class="response">
            پاسخ سیستم اینجا نمایش داده می‌شود...
        </div>

        <div class="footer">
            <p>نطق مصطلح - توسعه یافته با ❤️ برای جامعه فارسی‌زبان</p>
            <p>نسخه: ۴.۰.۰ | میزبان: Cloudflare Workers</p>
        </div>
    </div>

    <script>
        async function askQuestion() {
            const question = document.getElementById('questionInput').value.trim();
            const responseArea = document.getElementById('responseArea');
            
            if (!question) {
                alert('لطفاً سوال خود را وارد کنید');
                return;
            }

            responseArea.innerHTML = '⏳ در حال پردازش...';
            
            try {
                const response = await fetch('/api/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    responseArea.innerHTML = '🤖 پاسخ سیستم:\n\n' + data.response;
                } else {
                    responseArea.innerHTML = '❌ خطا: ' + (data.error || data.message);
                }
            } catch (error) {
                responseArea.innerHTML = '💥 خطای شبکه: ' + error.message;
            }
        }

        async function analyzeText() {
            const text = document.getElementById('questionInput').value.trim();
            const responseArea = document.getElementById('responseArea');
            
            if (!text) {
                alert('لطفاً متن خود را وارد کنید');
                return;
            }

            responseArea.innerHTML = '⏳ در حال تحلیل متن...';
            
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    const analysis = data.analysis;
                    responseArea.innerHTML = '📊 تحلیل متن:\n\n' +
                        '✅ احساس: ' + analysis.sentiment + '\n' +
                        '📝 تعداد کلمات: ' + analysis.statistics.wordCount + '\n' +
                        '🔄 کلمات منحصر بفرد: ' + analysis.statistics.uniqueWords + '\n' +
                        '🧠 پیچیدگی: ' + (analysis.statistics.complexity * 100).toFixed(1) + '%';
                } else {
                    responseArea.innerHTML = '❌ خطا در تحلیل: ' + (data.error || data.message);
                }
            } catch (error) {
                responseArea.innerHTML = '💥 خطای شبکه: ' + error.message;
            }
        }

        // بارگذاری وضعیت سیستم
        async function loadStatus() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                
                document.getElementById('systemStatus').textContent = 'فعال ✅';
                document.getElementById('questionCount').textContent = data.interactionCount;
            } catch (error) {
                document.getElementById('systemStatus').textContent = 'خطا ❌';
            }
        }

        // بارگذاری اولیه
        document.addEventListener('DOMContentLoaded', function() {
            loadStatus();
        });
    </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
