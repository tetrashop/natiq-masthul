import { ask, getStatus } from '../wisdom-system/master-natiq.js';

export default {
    async fetch(request, env, ctx) {
        // اضافه کردن CORS برای دیباگ
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
        
        // صفحه اصلی
        if (request.method === 'GET' && url.pathname === '/') {
            const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>نطق مصطلح - نسخه دیباگ</title>
    <style>
        body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; direction: rtl; }
        .container { background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #333; text-align: center; }
        .debug-info { background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐞 نسخه دیباگ - نطق مصطلح</h1>
        <div class="debug-info">
            <strong>وضعیت سیستم:</strong> فعال 🟢<br>
            <strong>آخرین بروزرسانی:</strong> ${new Date().toLocaleString('fa-IR')}
        </div>
        <p>برای تست API از دستور زیر استفاده کنید:</p>
        <pre>curl -X POST "https://natiq-masthul.ramin-edjlal1359.workers.dev/" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "سوال شما"}'</pre>
    </div>
</body>
</html>`;
            
            return new Response(html, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // API
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

                console.log('🤔 پردازش سوال:', question);
                const result = await ask(question);
                
                // محدود کردن طول پاسخ برای جلوگیری از قطع شدن
                const limitedResponse = result.response.length > 2000 
                    ? result.response.substring(0, 2000) + "..."
                    : result.response;
                
                const responseData = {
                    success: true,
                    question: question,
                    response: limitedResponse,
                    analysis: result.analysis,
                    metadata: {
                        ...result.metadata,
                        responseLength: result.response.length,
                        timestamp: new Date().toISOString()
                    },
                    scores: result.scores
                };

                console.log('✅ پاسخ تولید شد، طول:', result.response.length);
                
                return new Response(JSON.stringify(responseData), {
                    headers: corsHeaders
                });

            } catch (error) {
                console.error('❌ خطا در پردازش:', error);
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message,
                    stack: error.stack
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
