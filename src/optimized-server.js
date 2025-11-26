import { ask, getStatus } from '../wisdom-system/master-natiq.js';

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
        
        // صفحه اصلی ساده‌تر
        if (request.method === 'GET' && url.pathname === '/') {
            const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>نطق مصطلح - نسخه بهینه</title>
    <style>
        body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; direction: rtl; }
        .container { background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #333; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 نطق مصطلح - نسخه بهینه</h1>
        <p>سیستم فعال است! از API زیر استفاده کنید:</p>
        <pre>POST / با JSON: {"question": "سوال شما"}</pre>
        <div id="testArea">
            <button onclick="testAPI()">تست API</button>
            <div id="result"></div>
        </div>
    </div>
    <script>
        async function testAPI() {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = 'در حال تست...';
            
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({question: 'یک توصیه برای زندگی بهتر'})
                });
                
                const data = await response.json();
                resultDiv.innerHTML = '<strong>پاسخ:</strong> ' + 
                    (data.response || data.error || 'پاسخ خالی');
                    
            } catch (error) {
                resultDiv.innerHTML = 'خطا: ' + error.message;
            }
        }
    </script>
</body>
</html>`;
            
            return new Response(html, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // API بهینه‌شده
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

                console.log('پردازش سوال:', question.substring(0, 50) + '...');
                
                // پاسخ مستقیم و کوتاه برای تست
                const testResponse = {
                    success: true,
                    question: question,
                    response: "این یک پاسخ تستی است. سیستم فعال است! 🎉",
                    timestamp: new Date().toISOString()
                };
                
                return new Response(JSON.stringify(testResponse), {
                    headers: corsHeaders
                });

            } catch (error) {
                console.error('خطا:', error);
                return new Response(JSON.stringify({
                    success: false,
                    error: 'خطا در پردازش: ' + error.message
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
