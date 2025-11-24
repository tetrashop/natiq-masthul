import SelfAwareAISystem from './knowledge-boundary.js';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Route سلامت
        if (pathname === '/health' || pathname === '/api/health') {
            const healthData = {
                status: 'success',
                message: 'سیستم خودآگاه نطق مصطلح فعال است',
                version: '4.1.0-self-aware',
                features: [
                    'تشخیص مرزهای دانش',
                    'خودآگاهی در پاسخ‌دهی',
                    'رد هوشمند سوالات نامرتبط',
                    'تحلیل کیفیت سوالات'
                ],
                timestamp: new Date().toISOString()
            };
            return Response.json(healthData, { headers: corsHeaders });
        }

        // Route اصلی با خودآگاهی
        if (pathname === '/api/ask' || pathname === '/api/aware/ask') {
            if (request.method === 'POST') {
                try {
                    const { question } = await request.json();
                    
                    if (!question || question.trim().length < 2) {
                        return Response.json(
                            {
                                status: 'error',
                                message: 'سوال بسیار کوتاه است',
                                suggestion: 'لطفاً سوال کامل‌تری مطرح کنید'
                            },
                            { status: 400, headers: corsHeaders }
                        );
                    }

                    const aiSystem = new SelfAwareAISystem();
                    const response = await aiSystem.processQuestion(question);

                    return Response.json({
                        ...response,
                        timestamp: new Date().toISOString(),
                        version: '4.1.0-self-aware'
                    }, { headers: corsHeaders });

                } catch (error) {
                    return Response.json(
                        {
                            status: 'error',
                            message: 'خطا در پردازش سوال',
                            error: error.message
                        },
                        { status: 500, headers: corsHeaders }
                    );
                }
            }
        }

        // Route اصلی
        if (pathname === '/' || pathname === '/aware.html') {
            const html = this.generateSelfAwareInterface();
            return new Response(html, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    ...corsHeaders
                }
            });
        }

        return Response.json(
            { status: 'error', message: 'مسیر یافت نشد' },
            { status: 404, headers: corsHeaders }
        );
    },

    generateSelfAwareInterface() {
        return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح - نسخه خودآگاه</title>
    <style>
        body {
            font-family: Tahoma, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: #333;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .question-input {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .question-input input {
            flex: 1;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 16px;
        }
        .question-input button {
            padding: 15px 25px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
        }
        .response-area {
            min-height: 200px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #e9ecef;
        }
        .awareness-badge {
            background: #17a2b8;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 نطق مصطلح - نسخه خودآگاه</h1>
            <p>سیستمی که مرزهای دانش خود را می‌شناسد</p>
            <div class="awareness-badge">
                ✅ سیستم خودآگاه - می‌دانم چه نمی‌دانم
            </div>
        </div>
        
        <div class="content">
            <div class="question-input">
                <input type="text" id="questionInput" 
                       placeholder="سوال خود را اینجا بپرسید... (من فقط در مورد رامین اجلال و خودم اطلاعات دارم)"
                       autocomplete="off">
                <button type="button" id="sendButton">↵ ارسال سوال</button>
            </div>
            
            <div id="responseArea" class="response-area">
                <div style="text-align: center; color: #666; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🔍</div>
                    <div>سیستم خودآگاه آماده پاسخگویی است</div>
                    <div style="font-size: 12px; margin-top: 10px;">
                        من صادقانه می‌دانم چه می‌دانم و چه نمی‌دانم
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        class SelfAwareClient {
            constructor() {
                this.endpoint = '/api/aware/ask';
            }

            async askQuestion(question) {
                const response = await fetch(this.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question })
                });
                return await response.json();
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            const client = new SelfAwareClient();
            const questionInput = document.getElementById('questionInput');
            const sendButton = document.getElementById('sendButton');
            const responseArea = document.getElementById('responseArea');

            sendButton.addEventListener('click', async function() {
                const question = questionInput.value.trim();
                if (!question) return;

                sendButton.disabled = true;
                sendButton.textContent = 'در حال تحلیل...';
                
                responseArea.innerHTML = '<div style="text-align: center; padding: 30px;">در حال بررسی سوال و مرزهای دانش...</div>';

                try {
                    const result = await client.askQuestion(question);
                    
                    let html = '';
                    if (result.status === 'out_of_scope') {
                        html = \`
                            <div style="background: #fff3cd; padding: 25px; border-radius: 10px; border-right: 4px solid #ffc107;">
                                <div style="font-size: 24px; margin-bottom: 15px;">🤔</div>
                                \${result.answer.replace(/\\n/g, '<br>')}
                                \${result.suggestion ? \`<div style="margin-top: 15px; padding: 10px; background: #e2e3e5; border-radius: 5px;"><small>\${result.suggestion}</small></div>\` : ''}
                            </div>
                        \`;
                    } else if (result.status === 'error') {
                        html = \`
                            <div style="background: #f8d7da; padding: 25px; border-radius: 10px; border-right: 4px solid #dc3545;">
                                <div style="font-size: 24px; margin-bottom: 15px;">❌</div>
                                \${result.answer}
                            </div>
                        \`;
                    } else {
                        html = \`
                            <div style="background: #d4edda; padding: 25px; border-radius: 10px; border-right: 4px solid #28a745;">
                                <div style="font-size: 24px; margin-bottom: 15px;">✅</div>
                                \${result.answer.replace(/\\n/g, '<br>')}
                            </div>
                        \`;
                    }
                    
                    responseArea.innerHTML = html;
                    
                } catch (error) {
                    responseArea.innerHTML = \`
                        <div style="background: #f8d7da; padding: 25px; border-radius: 10px;">
                            خطا در ارتباط با سرور
                        </div>
                    \`;
                } finally {
                    sendButton.disabled = false;
                    sendButton.textContent = '↵ ارسال سوال';
                    questionInput.value = '';
                }
            });

            questionInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendButton.click();
                }
            });
        });
    </script>
</body>
</html>`;
    }
};
