import KnowledgeBoundary from './knowledge-boundary.js';

class SelfAwareAISystem {
    constructor() {
        this.boundary = new KnowledgeBoundary();
        this.name = "نطق مصطلح خردمند";
        this.version = "1.0.0";
    }

    async processQuestion(question) {
        const validation = this.boundary.validateQuestion(question);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.reason,
                response: "متأسفانه نمی‌توانم به این سوال پاسخ دهم."
            };
        }

        try {
            const response = await this.generateWisdomResponse(question);
            return {
                success: true,
                response: response,
                metadata: {
                    system: this.name,
                    version: this.version,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: "خطا در پردازش سوال",
                response: "خطایی در سیستم رخ داده است. لطفاً مجدداً تلاش کنید."
            };
        }
    }

    async generateWisdomResponse(question) {
        const responses = {
            'تعادل': "برای ایجاد تعادل در زندگی، پیشنهاد می‌کنم زمان خود را به سه بخش کار، خانواده و خودسازی تقسیم کنید. هر بخش را به اندازه‌ای اهمیت دهید که دیگر بخش‌ها آسیب نبینند.",
            'بهره‌وری': "برای افزایش بهره‌وری، اولویت‌بندی Aufgaben و حذف عوامل حواس‌پرتی مؤثر است. همچنین استراحت منظم را فراموش نکنید.",
            'اخلاق': "در تصمیم‌گیری اخلاقی، تأثیر تصمیم بر خود، دیگران و جامعه را در نظر بگیرید. عدالت و مهربانی را همواره مدنظر داشته باشید.",
            'موفقیت': "موفقیت واقعی در تعادل میان دستاوردهای مادی و آرامش درونی است. هدف‌های کوچک و قابل اندازه‌گیری تعیین کنید.",
            'خوشحالی': "خوشحالی واقعی در قدردانی از داشته‌ها و تمرکز بر روابط معنادار است. مقایسه خود با دیگران را کنار بگذارید.",
            'default': "بر اساس خرد کهن، جستجوی تعادل و معنویت در زندگی می‌تواند راهگشا باشد. به ندای درون خود گوش دهید و بر ارزش‌های اصیل تمرکز کنید."
        };

        for (const [key, response] of Object.entries(responses)) {
            if (question.includes(key)) {
                return response;
            }
        }

        return responses.default;
    }

    getSystemInfo() {
        return {
            name: this.name,
            version: this.version,
            capabilities: this.boundary.getSystemCapabilities(),
            boundaries: this.boundary.boundaries
        };
    }
}

const aiSystem = new SelfAwareAISystem();

// HTML صفحه وب زیبا
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح خردمند - شرکت بوستان</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            direction: rtl;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        .header h1 {
            color: #2d3748;
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .header p {
            color: #718096;
            font-size: 1.2rem;
        }
        .chat-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .chat-messages {
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            background: #f7fafc;
            border-radius: 15px;
            border: 1px solid #e2e8f0;
        }
        .message {
            margin-bottom: 15px;
            padding: 15px;
            border-radius: 12px;
            animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .user-message {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            margin-left: 50px;
        }
        .bot-message {
            background: white;
            border: 1px solid #e2e8f0;
            margin-right: 50px;
        }
        .input-area {
            display: flex;
            gap: 10px;
        }
        #questionInput {
            flex: 1;
            padding: 15px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        #questionInput:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        button {
            padding: 15px 25px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .quick-questions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .quick-btn {
            padding: 10px 15px;
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .quick-btn:hover {
            background: rgba(102, 126, 234, 0.2);
        }
        .typing {
            color: #666;
            font-style: italic;
        }
        .status {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            background: #48bb78;
            color: white;
            border-radius: 10px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 نطق مصطلح خردمند</h1>
            <p>سیستم هوش مصنوعی شرکت بوستان - راهنمای تعادل و خرد</p>
        </div>
        
        <div class="chat-container">
            <div class="chat-messages" id="chatMessages">
                <div class="message bot-message">
                    <strong>🤖 نطق مصطلح:</strong> درود! من آماده پاسخگویی به سوالات شما در زمینه‌های زیر هستم:<br>
                    • ایجاد تعادل در زندگی و کار<br>
                    • افزایش بهره‌وری و مدیریت زمان<br>
                    • تصمیم‌گیری اخلاقی<br>
                    • موفقیت و خوشحالی
                </div>
            </div>
            
            <div class="input-area">
                <input type="text" id="questionInput" placeholder="سوال خود را اینجا بنویسید..." />
                <button onclick="sendQuestion()">ارسال سوال</button>
            </div>
            
            <div class="quick-questions">
                <button class="quick-btn" onclick="askQuickQuestion('چگونه در زندگی تعادل ایجاد کنم؟')">⚖️ تعادل زندگی</button>
                <button class="quick-btn" onclick="askQuickQuestion('راههای افزایش بهره‌وری چیست؟')">📈 بهره‌وری</button>
                <button class="quick-btn" onclick="askQuickQuestion('برای تصمیم‌گیری اخلاقی چه کنم؟')">🔍 تصمیم اخلاقی</button>
                <button class="quick-btn" onclick="askQuickQuestion('چطور همزمان موفق و خوشحال باشم؟')">🎯 موفقیت شاد</button>
            </div>
            
            <div class="status" id="status">
                ✅ سیستم آماده - از طریق مرورگر
            </div>
        </div>
    </div>

    <script>
        async function sendQuestion() {
            const input = document.getElementById('questionInput');
            const chatBox = document.getElementById('chatMessages');
            const question = input.value.trim();
            
            if (!question) return;
            
            // نمایش سوال کاربر
            chatBox.innerHTML += \`
                <div class="message user-message">
                    <strong>👤 شما:</strong> \${question}
                </div>
            \`;
            
            input.value = '';
            
            // نمایش در حال پردازش
            chatBox.innerHTML += \`
                <div class="message bot-message typing" id="typing">
                    <strong>🤖 نطق مصطلح:</strong> در حال پردازش...
                </div>
            \`;
            
            chatBox.scrollTop = chatBox.scrollHeight;
            
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    },
                    body: JSON.stringify({ question: question })
                });
                
                const data = await response.json();
                
                // حذف پیام در حال پردازش
                document.getElementById('typing').remove();
                
                if (data.success) {
                    chatBox.innerHTML += \`
                        <div class="message bot-message">
                            <strong>🤖 نطق مصطلح:</strong> \${data.response}
                        </div>
                    \`;
                } else {
                    chatBox.innerHTML += \`
                        <div class="message bot-message" style="background: #fed7d7; color: #c53030;">
                            <strong>❌ خطا:</strong> \${data.error}
                        </div>
                    \`;
                }
            } catch (error) {
                document.getElementById('typing').remove();
                chatBox.innerHTML += \`
                    <div class="message bot-message" style="background: #fed7d7; color: #c53030;">
                        <strong>❌ خطا:</strong> مشکل در ارتباط با سرور. لطفاً دوباره تلاش کنید.
                    </div>
                \`;
            }
            
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        
        function askQuickQuestion(question) {
            document.getElementById('questionInput').value = question;
            sendQuestion();
        }
        
        // ارسال با Enter
        document.getElementById('questionInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendQuestion();
            }
        });
        
        // فوکوس روی اینپوت
        document.getElementById('questionInput').focus();
    </script>
</body>
</html>
`;

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // 🔧 پشتیبانی از GET برای صفحه اصلی
        if (request.method === 'GET') {
            return new Response(HTML_PAGE, {
                headers: { 
                    'Content-Type': 'text/html; charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 🔧 پشتیبانی از POST برای API
        if (request.method === 'POST') {
            try {
                const { question } = await request.json();
                
                if (!question) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'سوال ارائه نشده است'
                    }), { 
                        status: 400,
                        headers: { 
                            'Content-Type': 'application/json; charset=utf-8',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }

                const result = await aiSystem.processQuestion(question);
                
                return new Response(JSON.stringify(result), {
                    headers: { 
                        'Content-Type': 'application/json; charset=utf-8',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    }
                });

            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'خطا در پردازش درخواست: ' + error.message
                }), { 
                    status: 500,
                    headers: { 
                        'Content-Type': 'application/json; charset=utf-8',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
        }

        // برای سایر متدها
        return new Response(JSON.stringify({
            error: 'متد غیرمجاز. فقط GET و POST پذیرفته می‌شوند.'
        }), {
            status: 405,
            headers: { 
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};
