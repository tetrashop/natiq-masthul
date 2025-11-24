// موتور پردازش هوشمند برای رابط کاربری - نسخه نهایی
class AICore {
    constructor() {
        this.baseURL = window.location.origin;
        this.endpoints = {
            ask: '/api/nlp/ask-ai',
            stats: '/api/nlp/stats',
            health: '/health'
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
}

// راه‌اندازی و اتصال به رابط کاربری
function initializeAICore() {
    window.aiCore = new AICore();
    console.log('✅ موتور AI با موفقیت راه‌اندازی شد');
    
    // اتصال دکمه ارسال سوال
    const sendButton = document.querySelector('button[type="submit"]');
    const questionInput = document.querySelector('input[type="text"]');
    
    if (sendButton && questionInput) {
        sendButton.addEventListener('click', async function(e) {
            e.preventDefault();
            const question = questionInput.value.trim();
            
            if (!question) return;
            
            // نمایش حالت لودینگ
            const originalText = sendButton.textContent;
            sendButton.disabled = true;
            sendButton.textContent = 'در حال پردازش...';
            
            try {
                const result = await window.aiCore.askQuestion(question);
                
                // نمایش پاسخ - پیدا کردن المان مناسب برای نمایش پاسخ
                let responseArea = document.querySelector('.response-area');
                if (!responseArea) {
                    // اگر المان وجود ندارد، ایجاد می‌کنیم
                    responseArea = document.createElement('div');
                    responseArea.className = 'response-area';
                    questionInput.parentNode.appendChild(responseArea);
                }
                
                responseArea.innerHTML = `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px; border-right: 4px solid #28a745;">
                        <strong>🧠 پاسخ هوشمند:</strong>
                        <p style="margin: 10px 0; color: #333;">${result.answer}</p>
                        <small style="color: #666;">اعتماد: ${(result.confidence * 100).toFixed(1)}% | پست‌های NLP: ${result.postsCount}</small>
                    </div>
                `;
                
            } catch (error) {
                let responseArea = document.querySelector('.response-area');
                if (!responseArea) {
                    responseArea = document.createElement('div');
                    responseArea.className = 'response-area';
                    questionInput.parentNode.appendChild(responseArea);
                }
                
                responseArea.innerHTML = `
                    <div style="background: #ffe6e6; padding: 15px; border-radius: 8px; margin-top: 15px; border-right: 4px solid #dc3545;">
                        <strong>⚠️ خطا:</strong>
                        <p style="margin: 10px 0; color: #333;">${error.message}</p>
                    </div>
                `;
            } finally {
                // بازگشت به حالت عادی
                sendButton.disabled = false;
                sendButton.textContent = originalText;
            }
        });
    }

    // اتصال دکمه‌های تخصصی
    const specialtyButtons = document.querySelectorAll('.specialty-btn, .category-btn, .btn');
    specialtyButtons.forEach(button => {
        if (button.textContent.includes('سوابق') || 
            button.textContent.includes('دستاورد') || 
            button.textContent.includes('تخصص') || 
            button.textContent.includes('کاری') || 
            button.textContent.includes('تحقیق')) {
            
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
        }
    });

    // بارگذاری آنالیتیکس
    async function loadAnalytics() {
        try {
            const stats = await window.aiCore.getStats();
            const analyticsDiv = document.querySelector('.analytics-content');
            
            if (analyticsDiv) {
                analyticsDiv.innerHTML = `
                    <h4>📊 آمار زنده سیستم</h4>
                    <div>پست‌های NLP: <strong>${stats.nlp.totalPosts}</strong></div>
                    <div>وضعیت: <strong style="color: green;">${stats.nlp.systemStatus}</strong></div>
                    <div>دقت: <strong>${stats.nlp.accuracy}</strong></div>
                    <div>نرخ پردازش: <strong>${stats.nlp.processingRate}</strong></div>
                `;
            }
        } catch (error) {
            console.error('خطا در بارگذاری آنالیتیکس:', error);
        }
    }

    // بارگذاری اولیه آنالیتیکس
    setTimeout(loadAnalytics, 1000);
}

// راه‌اندازی وقتی DOM آماده شد
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAICore);
} else {
    initializeAICore();
}
