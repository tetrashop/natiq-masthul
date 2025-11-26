import EnhancedNatiq from '../wisdom-system/enhanced-natiq.js';

export default {
    async fetch(request, env, ctx) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json; charset=utf-8'
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        
        // صفحه اصلی ارتقا یافته
        if (request.method === 'GET' && url.pathname === '/') {
            const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>نطق مصطلح پیشرفته - نسخه ۲.۰</title>
    <style>
        body { font-family: system-ui; max-width: 900px; margin: 0 auto; padding: 20px; background: #f8f9fa; direction: rtl; }
        .container { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        h1 { color: #2c5aa0; text-align: center; margin-bottom: 10px; }
        .version { text-align: center; color: #666; margin-bottom: 30px; }
        .chat-box { border: 2px solid #e9ecef; padding: 20px; border-radius: 10px; margin: 20px 0; min-height: 200px; background: #f8f9fa; }
        .input-area { display: flex; gap: 10px; margin: 20px 0; }
        input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; }
        button { padding: 12px 25px; background: #2c5aa0; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; }
        button:hover { background: #1e3a8a; }
        .analysis-badge { background: #fff3cd; padding: 5px 10px; border-radius: 15px; font-size: 0.8em; margin-left: 10px; }
        .message { margin: 10px 0; padding: 15px; border-radius: 10px; }
        .user { background: #e3f2fd; border-right: 4px solid #2196f3; }
        .bot { background: #f0fff4; border-right: 4px solid #4caf50; }
        .feature-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .feature { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 نطق مصطلح پیشرفته</h1>
        <div class="version">نسخه ۲.۰ - سیستم تحلیل مفهومی هوشمند</div>
        
        <div class="feature-list">
            <div class="feature">🔍 تحلیل مفهومی پیشرفته</div>
            <div class="feature">🌐 تشخیص زبان خودکار</div>
            <div class="feature">💡 پاسخ‌های چندلایه</div>
            <div class="feature">🎯 پشتیبانی از سوالات پیچیده</div>
        </div>

        <div class="chat-box" id="chatBox">
            <div class="bot message">
                <strong>سیستم پیشرفته فعال! 🚀</strong><br>
                اکنون می‌توانید سوالات پیچیده‌تر و چندزبانه بپرسید.
            </div>
        </div>

        <div class="input-area">
            <input type="text" id="questionInput" placeholder="سوال پیچیده یا چندزبانه خود را بپرسید...">
            <button onclick="sendQuestion()">ارسال سوال پیشرفته</button>
        </div>

        <div style="text-align: center; margin-top: 20px;">
            <button onclick="askSample('تکنولوژی و تعادل انسانی')" style="background: #667eea;">🔄 تکنولوژی</button>
            <button onclick="askSample('رهبری و مدیریت')" style="background: #ed8936;">👑 رهبری</button>
            <button onclick="askSample('مدیریت استرس')" style="background: #9f7aea;">🧘 آرامش</button>
            <button onclick="askSample('میراث معنادار')" style="background: #48bb78;">🌱 میراث</button>
        </div>
    </div>

    <script>
        async function sendQuestion() {
            const question = document.getElementById('questionInput').value;
            if (!question) return;
            await askQuestion(question);
        }

        function askSample(type) {
            const questions = {
                'تکنولوژی و تعادل انسانی': 'در عصر دیجیتال، چگونه بین پیشرفت تکنولوژی و حفظ ارزش‌های انسانی تعادل ایجاد کنم؟',
                'رهبری و مدیریت': 'به عنوان مدیر یک تیم، چگونه می‌توانم بین اقتدار لازم و همدلی با اعضای تیم تعادل برقرار کنم؟',
                'مدیریت استرس': 'در شرایط پراسترس کاری، چه راهکارهای عملی برای حفظ آرامش ذهنی و تمرکز پیشنهاد می‌کنید؟',
                'میراث معنادار': 'چگونه می‌توانم در زندگی حرفه‌ای و شخصی میراث معناداری از خود به جای بگذارم؟'
            };
            document.getElementById('questionInput').value = questions[type];
            sendQuestion();
        }

        async function askQuestion(question) {
            const chatBox = document.getElementById('chatBox');
            
            // نمایش سوال کاربر
            chatBox.innerHTML += '<div class="user message"><strong>شما:</strong> ' + question + '</div>';
            
            // نمایش وضعیت پردازش
            const processingMsg = '<div class="bot message">🔍 در حال تحلیل پیشرفته سوال...</div>';
            chatBox.innerHTML += processingMsg;
            
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({question: question})
                });
                
                const data = await response.json();
                
                // حذف پیام پردازش
                chatBox.removeChild(chatBox.lastChild);
                
                if (data.success) {
                    let analysisBadge = '';
                    if (data.analysis) {
                        analysisBadge = '<span class="analysis-badge">🎯 ' + data.analysis.primaryConcept + ' | 💡 عمق: ' + data.analysis.depthLevel + '/5</span>';
                    }
                    
                    chatBox.innerHTML += '<div class="bot message"><strong>نطق مصطلح پیشرفته:</strong><br>' + 
                                         data.response.replace(/\n/g, '<br>') + analysisBadge + '</div>';
                } else {
                    chatBox.innerHTML += '<div class="bot message" style="background: #fed7d7; color: #c53030;"><strong>خطا:</strong> ' + data.error + '</div>';
                }
            } catch (error) {
                chatBox.removeChild(chatBox.lastChild);
                chatBox.innerHTML += '<div class="bot message" style="background: #fed7d7; color: #c53030;"><strong>خطا:</strong> مشکل در ارتباط با سرور</div>';
            }
            
            // اسکرول به پایین
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // ارسال با Enter
        document.getElementById('questionInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendQuestion();
        });
    </script>
</body>
</html>`;
            
            return new Response(html, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // API ارتقا یافته
        if (request.method === 'POST') {
            try {
                const { question } = await request.json();
                
                if (!question) {
                    return new Response(JSON.stringify({
                        error: 'سوال ارائه نشده است'
                    }), { 
                        status: 400,
                        headers: corsHeaders
                    });
                }

                console.log('🤔 پردازش پیشرفته:', question);
                const result = await EnhancedNatiq.ask(question);
                
                return new Response(JSON.stringify(result), {
                    headers: corsHeaders
                });

            } catch (error) {
                console.error('❌ خطا:', error);
                return new Response(JSON.stringify({
                    success: false,
                    error: 'خطا در پردازش سوال پیشرفته'
                }), { 
                    status: 500,
                    headers: corsHeaders
                });
            }
        }

        return new Response(JSON.stringify({
            error: 'روش درخواست پشتیبانی نمی‌شود'
        }), { 
            status: 405,
            headers: corsHeaders
        });
    }
};
