import PersonalQAManager from './enhanced-personal-qa.js';

// سیستم پیشرفته نطق مصطلح - نسخه ۲.۱
class AdvancedNatiq {
    static analyzeQuestion(question) {
        // اولویت ۱: تحلیل سوالات شخصی
        const personalAnalysis = PersonalQAManager.analyzePersonalQuestion(question);
        if (personalAnalysis) return personalAnalysis;
        
        // اولویت ۲: تحلیل دانش عمومی
        const knowledgeAnalysis = PersonalQAManager.analyzeGeneralKnowledge(question);
        if (knowledgeAnalysis) return knowledgeAnalysis;
        
        // اولویت ۳: تحلیل موضوعی معمول
        const questionLower = question.toLowerCase();
        
        if (questionLower.includes('مقاله') || questionLower.includes('سخنرانی') || questionLower.includes('دست آورد')) {
            return {
                concept: 'نگارش مقاله و سخنرانی',
                response: "برای نوشتن مقاله درباره دستاوردهایتان:\n\n📝 **ساختار پیشنهادی:**\n۱. مقدمه جذاب: با داستان کوتاهی از چالش شروع کنید\n۲. دستاوردهای کلیدی: ۳-۴ مورد اصلی را برجسته کنید\n۳. داده و اثبات: از اعداد و نتایج قابل اندازه‌گیری استفاده کنید\n۴. درس‌های آموخته: تجربیات ارزشمند را به اشتراک بگذارید\n۵. نتیجه‌گیری الهام‌بخش: بینش نهایی و چشم‌انداز آینده\n\n💡 **نکات طلایی:**\n• مخاطب خود را بشناسید و متناسب با آنها بنویسید\n• از مثال‌های عینی و داستان‌های شخصی استفاده کنید\n• پایان قوی داشته باشید که در ذهن بماند\n• تمرین کنید تا طبیعی به نظر برسید",
                depth: 5
            };
        }
        else if (questionLower.includes('تکنولوژی') || questionLower.includes('نوآوری')) {
            return {
                concept: 'تعادل تکنولوژی و انسانیت',
                response: "در دنیای پرسرعت تکنولوژی:\n\n۱. **آموزش مستمر**: هفته‌ای چند ساعت به یادگیری مهارت‌های جدید اختصاص دهید\n۲. **مرزبندی دیجیتال**: زمان‌های بدون دستگاه تعیین کنید\n۳. **تمرکز بر ارزش‌ها**: از تکنولوژی برای تقویت ارتباطات انسانی استفاده کنید\n۴. **تفکر انتقادی**: همیشه تأثیر تکنولوژی بر زندگی‌تان را ارزیابی کنید",
                depth: 4
            };
        }
        else if (questionLower.includes('بهره') || questionLower.includes('productive')) {
            return {
                concept: 'افزایش بهره‌وری',
                response: "برای افزایش بهره‌وری:\n\n🎯 **راهکارهای عملی:**\n• قانون ۲۰/۸۰: روی ۲۰٪ کارهای impactful تمرکز کنید\n• تکنیک پومودورو: ۲۵ دقیقه کار، ۵ دقیقه استراحت\n• اولویت‌بندی ماتریس آیزنهاور\n• حذف عوامل حواس‌پرتی دیجیتال\n\n🔄 **عادات موثر:**\n• برنامه‌ریزی روزانه\n• تعیین اهداف SMART\n• بازنگری هفتگی\n• استراحت منظم و کافی",
                depth: 4
            };
        }
        else {
            return {
                concept: 'خرد عملی',
                response: "سوال جالبی پرسیدید! 🤔\n\nبرای پاسخ دقیق‌تر، لطفاً سوال خود را با جزئیات بیشتر مطرح کنید یا در یکی از این زمینه‌ها بپرسید:\n\n🎯 **حوزه‌های تخصصی سیستم:**\n• رشد شخصی و خودسازی\n• مهارت‌های حرفه‌ای و کاری\n• مدیریت زمان و بهره‌وری\n• روابط و ارتباطات\n• تصمیم‌گیری و حل مسئله\n• تعادل زندگی و کار\n\n💡 **مثال سوالات بهتر:**\n• \"چگونه مهارت مدیریت زمان خود را بهبود دهم؟\"\n• \"برای مصاحبه شغلی چطور آماده شوم؟\"\n• \"راه‌های کاهش استرس در محیط کار چیست؟\"",
                depth: 3
            };
        }
    }
}

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
        
        // صفحه اصلی
        if (request.method === 'GET' && url.pathname === '/') {
            const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>نطق مصطلح پیشرفته - نسخه ۲.۱</title>
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
        .privacy-note { background: #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 5px; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 نطق مصطلح پیشرفته - نسخه ۲.۱</h1>
        <div class="privacy-note">
            <strong>📢 توجه:</strong> این سیستم از حریم شخصی محافظت می‌کند و اطلاعات شخصی ارائه نمی‌دهد.
        </div>
        <div class="chat-box" id="chatBox">
            <div class="bot"><strong>سیستم پیشرفته فعال! 🚀</strong><br>اکنون از مدیریت هوشمند سوالات استفاده می‌کند.</div>
        </div>
        <div class="input-area">
            <input type="text" id="questionInput" placeholder="سوال خود را در زمینه‌های تخصصی بپرسید...">
            <button onclick="sendQuestion()">ارسال سوال</button>
        </div>
        <div style="text-align: center; margin-top: 15px; font-size: 0.9em; color: #666;">
            💡 پیشنهاد: سوالات در زمینه رشد شخصی، حرفه‌ای، مدیریتی و فلسفی
        </div>
    </div>
    <script>
        async function sendQuestion() {
            const question = document.getElementById('questionInput').value;
            if (!question) return;
            
            const chatBox = document.getElementById('chatBox');
            chatBox.innerHTML += '<div class="user"><strong>شما:</strong> ' + question + '</div>';
            chatBox.innerHTML += '<div class="bot">در حال تحلیل هوشمند...</div>';
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
                    const analysis = data.analysis ? '<div class="analysis">🎯 ' + data.analysis.primaryConcept + ' | 💡 عمق: ' + data.analysis.depthLevel + '/5</div>' : '';
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
                const analysis = AdvancedNatiq.analyzeQuestion(question);
                
                const result = {
                    success: true,
                    question: question,
                    response: analysis.response,
                    analysis: {
                        primaryConcept: analysis.concept,
                        depthLevel: analysis.depth,
                        category: analysis.category || 'general',
                        complexity: question.length > 50 ? 'high' : 'medium'
                    },
                    metadata: {
                        system: "نطق مصطلح پیشرفته - نسخه ۲.۱",
                        version: "2.1.0",
                        timestamp: new Date().toISOString(),
                        privacyProtected: true
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
