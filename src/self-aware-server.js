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
}

const aiSystem = new SelfAwareAISystem();

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // 🔥 راه حل: اگر مسیر اصلی است، صفحه وب برگردان
        if (request.method === 'GET' && url.pathname === '/') {
            const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح خردمند</title>
    <style>
        body { 
            font-family: system-ui, sans-serif; 
            max-width: 800px; margin: 100px auto; padding: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white; text-align: center; direction: rtl;
        }
        .container { 
            background: rgba(255,255,255,0.1); 
            padding: 40px; border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5rem; margin-bottom: 20px; }
        .chat-box { 
            background: white; color: #333; 
            padding: 20px; border-radius: 15px; 
            margin: 20px 0; min-height: 200px;
            text-align: right;
        }
        input, button { 
            padding: 15px; margin: 5px; 
            border: none; border-radius: 10px; font-size: 16px;
        }
        input { width: 300px; background: #f5f5f5; }
        button { background: #48bb78; color: white; cursor: pointer; }
        button:hover { background: #38a169; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 نطق مصطلح خردمند</h1>
        <p>سیستم هوش مصنوعی شرکت بوستان</p>
        
        <div class="chat-box" id="chatBox">
            درود! سوال خود را بپرسید...
        </div>
        
        <div>
            <input type="text" id="questionInput" placeholder="سوال خود را بنویسید...">
            <button onclick="askQuestion()">ارسال سوال</button>
        </div>
        
        <div style="margin-top: 20px;">
            <button onclick="askQuick('تعادل زندگی')" style="background: #667eea;">⚖️ تعادل</button>
            <button onclick="askQuick('بهره‌وری')" style="background: #ed8936;">📈 بهره‌وری</button>
            <button onclick="askQuick('تصمیم اخلاقی')" style="background: #9f7aea;">🔍 اخلاق</button>
        </div>
    </div>

    <script>
        async function askQuestion() {
            const question = document.getElementById('questionInput').value;
            if (!question) return;
            await sendQuestion(question);
        }
        
        function askQuick(type) {
            const questions = {
                'تعادل زندگی': 'چگونه در زندگی تعادل ایجاد کنم؟',
                'بهره‌وری': 'راههای افزایش بهره‌وری چیست؟',
                'تصمیم اخلاقی': 'برای تصمیم‌گیری اخلاقی چه معیارهایی داشته باشم؟'
            };
            document.getElementById('questionInput').value = questions[type];
            askQuestion();
        }
        
        async function sendQuestion(question) {
            const chatBox = document.getElementById('chatBox');
            
            // نمایش سوال کاربر
            chatBox.innerHTML = '<div style=\"background: #e3f2fd; padding: 10px; margin: 5px; border-radius: 10px;\"><strong>شما:</strong> ' + question + '</div>';
            
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({question: question})
                });
                
                const data = await response.json();
                
                if (data.success) {
                    chatBox.innerHTML += '<div style=\"background: #f0fff4; padding: 10px; margin: 5px; border-radius: 10px;\"><strong>نطق مصطلح:</strong> ' + data.response + '</div>';
                } else {
                    chatBox.innerHTML += '<div style=\"background: #fed7d7; padding: 10px; margin: 5px; border-radius: 10px; color: #c53030;\"><strong>خطا:</strong> ' + data.error + '</div>';
                }
            } catch (error) {
                chatBox.innerHTML += '<div style=\"background: #fed7d7; padding: 10px; margin: 5px; border-radius: 10px; color: #c53030;\"><strong>خطا:</strong> مشکل در ارتباط با سرور</div>';
            }
        }
        
        // ارسال با Enter
        document.getElementById('questionInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') askQuestion();
        });
    </script>
</body>
</html>`;
            
            return new Response(html, {
                headers: { 
                    'Content-Type': 'text/html; charset=utf-8',
                }
            });
        }

        // 🔥 پردازش درخواست‌های POST برای API
        if (request.method === 'POST') {
            try {
                const { question } = await request.json();
                
                if (!question) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'سوال ارائه نشده است'
                    }), { 
                        status: 400,
                        headers: { 'Content-Type': 'application/json; charset=utf-8' }
                    });
                }

                const result = await aiSystem.processQuestion(question);
                
                return new Response(JSON.stringify(result), {
                    headers: { 
                        'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                    }
                });

            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'خطا در پردازش درخواست'
                }), { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                });
            }
        }

        // برای سایر موارد
        return new Response(JSON.stringify({
            error: 'متد غیرمجاز. فقط GET و POST پذیرفته می‌شوند.'
        }), {
            status: 405,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    }
};
