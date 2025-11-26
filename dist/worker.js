export default {
    async fetch(request, env, ctx) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        
        if (request.method === 'GET' && url.pathname === '/') {
            return new Response(JSON.stringify({
                status: "فعال",
                message: "سیستم نطق مصطلح - نسخه ساده",
                timestamp: new Date().toISOString(),
                instructions: "از POST با JSON استفاده کنید: {question: 'سوال شما'}"
            }), {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    ...corsHeaders
                }
            });
        }

        if (request.method === 'POST') {
            try {
                const { question } = await request.json();
                
                const response = {
                    success: true,
                    question: question,
                    response: "🧠 سیستم نطق مصطلح فعال است! این پاسخ مستقیم از Worker است.",
                    analysis: {
                        primaryConcept: "فعالیت سیستم",
                        depth: "سطح تست"
                    },
                    metadata: {
                        system: "نطق مصطلح ساده",
                        version: "1.0",
                        timestamp: new Date().toISOString()
                    }
                };
                
                return new Response(JSON.stringify(response), {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        ...corsHeaders
                    }
                });
                
            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "خطا در پردازش درخواست"
                }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        ...corsHeaders
                    }
                });
            }
        }

        return new Response(JSON.stringify({
            error: 'متد پشتیبانی نمی‌شود'
        }), { 
            status: 405,
            headers: corsHeaders
        });
    }
};
