// موتور پردازش هوشمند برای رابط کاربری - نسخه اصلاح شده
class AICore {
    constructor() {
        this.baseURL = window.location.origin;
        this.endpoints = {
            ask: '/api/nlp/ask-ai',  // استفاده از endpoint جدید
            stats: '/api/nlp/stats',
            health: '/health-detailed'
        };
    }

    async askQuestion(question) {
        try {
            console.log('📝 ارسال سوال به سرور:', question);
            
            const response = await fetch(this.endpoints.ask, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question })
            });

            if (!response.ok) {
                throw new Error(`خطای سرور: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ پاسخ دریافت شد:', data);
            return data;

        } catch (error) {
            console.error('❌ خطا در ارسال سوال:', error);
            throw new Error('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
        }
    }

    async getStats() {
        try {
            const response = await fetch(this.endpoints.stats);
            return await response.json();
        } catch (error) {
            console.error('خطا در دریافت آمار:', error);
            return { nlp: { totalPosts: 166, systemStatus: 'فعال' } };
        }
    }

    async getHealth() {
        try {
            const response = await fetch(this.endpoints.health);
            return await response.json();
        } catch (error) {
            console.error('خطا در دریافت سلامت:', error);
            return { status: 'error', message: 'خطا در ارتباط با سرور' };
        }
    }
}

// راه‌اندازی و اتصال به رابط کاربری
document.addEventListener('DOMContentLoaded', function() {
    window.aiCore = new AICore();
    
    // اتصال دکمه ارسال سوال
    const sendButton = document.querySelector('button[type="submit"], .send-button');
    const questionInput = document.querySelector('input[type="text"], textarea');
    const responseDiv = document.querySelector('.response-area, #response, .chat-messages');
    
    if (sendButton && questionInput) {
        sendButton.addEventListener('click', async function(e) {
            e.preventDefault();
            const question = questionInput.value.trim();
            
            if (!question) return;
            
            // نمایش حالت لودینگ
            sendButton.disabled = true;
            sendButton.textContent = 'در حال پردازش...';
            
            try {
                const result = await window.aiCore.askQuestion(question);
                
                // نمایش پاسخ
                if (responseDiv) {
                    responseDiv.innerHTML = `
                        <div class="response-success">
                            <strong>🧠 پاسخ هوشمند:</strong>
                            <p>${result.answer}</p>
                            <small>اعتماد: ${(result.confidence * 100).toFixed(1)}% | پست‌های NLP: ${result.postsCount}</small>
                        </div>
                    `;
                } else {
                    alert(result.answer);
                }
                
            } catch (error) {
                if (responseDiv) {
                    responseDiv.innerHTML = `
                        <div class="response-error">
                            <strong>⚠️ خطا:</strong>
                            <p>${error.message}</p>
                        </div>
                    `;
                } else {
                    alert(error.message);
                }
            } finally {
                // بازگشت به حالت عادی
                sendButton.disabled = false;
                sendButton.textContent = 'ارسال سوال حرفه‌ای';
                questionInput.value = '';
            }
        });
    }

    // اتصال دکمه‌های تخصصی
    const specialtyButtons = document.querySelectorAll('.specialty-btn, .category-btn');
    specialtyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const category = this.textContent.trim();
            const questions = {
                'سوابق تحصیلی': 'تحصیلات و مدارک رامین اجلال چیست؟',
                'دستاوردها': 'دستاوردهای مهم رامین اجلال چیست؟',
                'تخصص‌های فنی': 'تخصص‌های فنی رامین اجلال در چیست؟',
                'سوابق کاری': 'سوابق کاری و تجربیات رامین اجلال چیست؟',
                'تحقیقات': 'پروژه‌های تحقیقاتی رامین اجلال چیست؟'
            };
            
            const question = questions[category] || category;
            if (questionInput) questionInput.value = question;
            
            // شبیه‌سازی کلیک روی دکمه ارسال
            if (sendButton) sendButton.click();
        });
    });

    // بارگذاری آنالیتیکس
    async function loadAnalytics() {
        try {
            const stats = await window.aiCore.getStats();
            const analyticsDiv = document.querySelector('.analytics, #analytics');
            
            if (analyticsDiv) {
                analyticsDiv.innerHTML = `
                    <div class="analytics-content">
                        <h4>📊 آمار زنده سیستم</h4>
                        <div>پست‌های NLP: <strong>${stats.nlp.totalPosts}</strong></div>
                        <div>وضعیت: <strong style="color: green;">${stats.nlp.systemStatus}</strong></div>
                        <div>دقت: <strong>${stats.nlp.accuracy}</strong></div>
                        <div>نرخ پردازش: <strong>${stats.nlp.processingRate}</strong></div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('خطا در بارگذاری آنالیتیکس:', error);
        }
    }

    // بارگذاری اولیه آنالیتیکس
    loadAnalytics();
    setInterval(loadAnalytics, 30000); // به‌روزرسانی هر 30 ثانیه

    console.log('✅ موتور AI با موفقیت راه‌اندازی شد');
});
