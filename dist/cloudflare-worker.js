// سیستم نطق مصطلح پیشرفته - نسخه مستقیم
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
        
        // تحلیل سوال و تولید پاسخ هوشمند
        function analyzeQuestion(question) {
            const q = question.toLowerCase();
            
            if (q.includes('مقاله') || q.includes('سخنرانی') || q.includes('دست آورد') || q.includes('دستاورد')) {
                return {
                    concept: 'نگارش مقاله و سخنرانی',
                    response: "برای نوشتن مقاله درباره دستاوردهایتان:\n\n📝 **ساختار پیشنهادی:**\n۱. مقدمه جذاب: با داستان کوتاهی از چالش شروع کنید\n۲. دستاوردهای کلیدی: ۳-۴ مورد اصلی را برجسته کنید\n۳. داده و اثبات: از اعداد و نتایج قابل اندازه‌گیری استفاده کنید\n۴. درس‌های آموخته: تجربیات ارزشمند را به اشتراک بگذارید\n۵. نتیجه‌گیری الهام‌بخش: بینش نهایی و چشم‌انداز آینده\n\n💡 **نکات طلایی:**\n• مخاطب خود را بشناسید و متناسب با آنها بنویسید\n• از مثال‌های عینی و داستان‌های شخصی استفاده کنید\n• پایان قوی داشته باشید که در ذهن بماند\n• تمرین کنید تا طبیعی به نظر برسید",
                    depth: 5
                };
            }
            else if (q.includes('تکنولوژی') || q.includes('نوآوری') || q.includes('همگام')) {
                return {
                    concept: 'تعادل تکنولوژی و انسانیت', 
                    response: "در دنیای پرسرعت تکنولوژی:\n\n۱. **آموزش مستمر**: هفته‌ای چند ساعت به یادگیری مهارت‌های جدید اختصاص دهید\n۲. **مرزبندی دیجیتال**: زمان‌های بدون دستگاه تعیین کنید\n۳. **تمرکز بر ارزش‌ها**: از تکنولوژی برای تقویت ارتباطات انسانی استفاده کنید\n۴. **تفکر انتقادی**: همیشه تأثیر تکنولوژی بر زندگی‌تان را ارزیابی کنید",
                    depth: 4
                };
            }
            else if (q.includes('بهره') || q.includes('productive')) {
                return {
                    concept: 'افزایش بهره‌وری',
                    response: "برای افزایش بهره‌وری:\n\n🎯 **راهکارهای عملی:**\n• قانون ۲۰/۸۰: روی ۲۰٪ کارهای impactful تمرکز کنید\n• تکنیک پومودورو: ۲۵ دقیقه کار، ۵ دقیقه استراحت\n• اولویت‌بندی ماتریس آیزنهاور\n• حذف عوامل حواس‌پرتی دیجیتال\n\n🔄 **عادات موثر:**\n• برنامه‌ریزی روزانه\n• تعیین اهداف SMART\n• بازنگری هفتگی\n• استراحت منظم و کافی",
                    depth: 4
                };
            }
            else if (q.includes('تعادل') || q.includes('زندگی')) {
                return {
                    concept: 'تعادل زندگی',
                    response: "برای ایجاد تعادل در زندگی:\n\n⚖️ **چهار بعد اصلی:**\n۱. **کاری**: اهداف شغلی و توسعه مهارت\n۲. **خانوادگی**: زمان کیفیت با عزیزان\n۳. **شخصی**: سلامتی، علایق، رشد فردی\n۴. **اجتماعی**: روابط و مشارکت جامعه\n\n📊 **نکات کاربردی:**\n• زمان‌بندی هفتگی برای هر حوزه\n• یادگیری نه گفتن\n• تفویض اختیار\n• مراقبت از سلامت جسم و روان",
                    depth: 5
                };
            }
            else {
                return {
                    concept: 'خرد عملی',
                    response: "بر اساس خرد کهن، پیشنهاد می‌کنم:\n\n• تعادل را در همه جنبه‌های زندگی جستجو کنید\n• به ندای درون خود اعتماد کنید\n• ارزش‌های اصیل را راهنمای خود قرار دهید\n• در خدمت به دیگران معنای عمیق بیابید\n• همواره در حال یادگیری و رشد باشید",
                    depth: 3
                };
            }
        }

        // صفحه اصلی
        if (request.method === 'GET' && url.pathname === '/') {
            const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>نطق مصطلح پیشرفته - نسخه ۲.۰</title>
    <style>
        body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; direction: rtl; }
        .container { background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #333; text-align: center; }
        .chat-box { border: 1px solid #ddd; padding: 20px; height: 400px; overflow-y: auto; margin: 20px 0; }
        .input-area { display: flex; gap: 10px; }
        input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        button { padding: 10px 20px; background: #007acc; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .user { background: #e3f2fd; padding: 10px; margin: 5px 0; border-radius: 5px; }
        .bot { background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 5px; }
        .analysis { background: #fff3cd; padding: 8px; margin: 5px 0; border-radius: 5px; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 نطق مصطلح پیشرفته - نسخه ۲.۰</h1>
        <div class="chat-box" id="chatBox">
            <div class="bot"><strong>سیستم پیشرفته فعال! 🚀</strong><br>اکنون از تحلیل مفهومی هوشمند استفاده می‌کند.</div>
        </div>
        <div class="input-area">
            <input type="text" id="questionInput" placeholder="سوال خود را بپرسید...">
            <button onclick="sendQuestion()">ارسال سوال</button>
        </div>
    </div>
    <script>
        async function sendQuestion() {
            const question = document.getElementById('questionInput').value;
            if (!question) return;
            
            const chatBox = document.getElementById('chatBox');
            chatBox.innerHTML += '<div class="user"><strong>شما:</strong> ' + question + '</div>';
            chatBox.innerHTML += '<div class="bot">در حال تحلیل پیشرفته...</div>';
            chatBox.scrollTop = chatBox.scrollHeight;
            
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({question: question})
                });
                const data = await response.json();
                
                chatBox.removeChild(chatBox.lastChild);
                
                if (data.success) {
                    const analysis = data.analysis ? '<div class="analysis">🎯 تحلیل: ' + data.analysis.primaryConcept + ' | 💡 عمق: ' + data.analysis.depthLevel + '/5</div>' : '';
                    chatBox.innerHTML += '<div class="bot"><strong>نطق مصطلح:</strong> ' + data.response.replace(/\\n/g, '<br>') + analysis + '</div>';
                } else {
                    chatBox.innerHTML += '<div class="bot" style="color: red;">خطا: ' + data.error + '</div>';
                }
            } catch (error) {
                chatBox.removeChild(chatBox.lastChild);
                chatBox.innerHTML += '<div class="bot" style="color: red;">خطا در ارتباط با سرور</div>';
            }
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        
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

                console.log('🤔 پردازش پیشرفته:', question);
                const analysis = analyzeQuestion(question);
                
                const result = {
                    success: true,
                    question: question,
                    response: analysis.response,
                    analysis: {
                        primaryConcept: analysis.concept,
                        depthLevel: analysis.depth,
                        complexity: question.length > 50 ? 'high' : 'medium'
                    },
                    metadata: {
                        system: "نطق مصطلح پیشرفته - نسخه مستقیم",
                        version: "2.0.0",
                        timestamp: new Date().toISOString()
                    }
                };
                
                return new Response(JSON.stringify(result), {
                    headers: corsHeaders
                });

            } catch (error) {
                console.error('❌ خطا:', error);
                return new Response(JSON.stringify({
                    success: false,
                    error: 'خطا در پردازش سوال'
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
