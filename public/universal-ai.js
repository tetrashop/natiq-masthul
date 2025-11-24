// موتور پردازش جهانی برای رابط کاربری - نسخه اصلاح شده
class UniversalAICore {
    constructor() {
        this.baseURL = window.location.origin;
        this.endpoints = {
            ask: '/api/universal/ask',
            health: '/health',
            system: '/system'
        };
    }

    async askQuestion(question) {
        try {
            console.log('📤 ارسال سوال:', question);
            
            const response = await fetch(this.endpoints.ask, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question })
            });

            if (!response.ok) {
                throw new Error(`خطای سرور: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.status === 'error') {
                throw new Error(data.message || 'خطا در پردازش سوال');
            }
            
            console.log('✅ پاسخ دریافت شد:', data);
            return data;

        } catch (error) {
            console.error('❌ خطا در ارسال سوال:', error);
            
            // پیام خطای کاربرپسند
            if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
                throw new Error('خطا در ارتباط با سرور. لطفاً اتصال شبکه را بررسی کنید.');
            } else if (error.message.includes('404')) {
                throw new Error('آدرس سرور یافت نشد. لطفاً از فعال بودن سرور اطمینان حاصل کنید.');
            } else {
                throw new Error('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
            }
        }
    }

    async checkHealth() {
        try {
            const response = await fetch(this.endpoints.health);
            return await response.json();
        } catch (error) {
            console.error('خطا در بررسی سلامت:', error);
            return { status: 'error', message: 'سرور در دسترس نیست' };
        }
    }
}

// راه‌اندازی وقتی صفحه بارگذاری شد
function initializeUniversalAI() {
    // ایجاد المان response-area اگر وجود ندارد
    if (!document.getElementById('responseArea')) {
        const responseArea = document.createElement('div');
        responseArea.id = 'responseArea';
        responseArea.className = 'response-area';
        responseArea.style.minHeight = '100px';
        responseArea.style.background = 'white';
        responseArea.style.padding = '20px';
        responseArea.style.borderRadius = '10px';
        responseArea.style.border = '2px solid #e9ecef';
        responseArea.style.marginTop = '20px';
        
        const chatArea = document.querySelector('.chat-area');
        if (chatArea) {
            chatArea.appendChild(responseArea);
        }
    }

    const aiCore = new UniversalAICore();
    const questionInput = document.getElementById('questionInput');
    const sendButton = document.getElementById('sendButton');
    const responseArea = document.getElementById('responseArea');

    console.log('✅ سیستم UI جهانی با موفقیت راه‌اندازی شد');

    // بررسی سلامت سرور
    aiCore.checkHealth().then(health => {
        console.log('🩺 سلامت سرور:', health);
    });

    // عملکرد دکمه ارسال
    if (sendButton && questionInput) {
        sendButton.addEventListener('click', async function() {
            const question = questionInput.value.trim();
            if (!question) {
                responseArea.innerHTML = `
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-right: 4px solid #ffc107;">
                        <strong>⚠️ هشدار:</strong>
                        <p style="margin: 10px 0;">لطفاً سوال خود را وارد کنید.</p>
                    </div>
                `;
                return;
            }

            // نمایش حالت لودینگ
            const originalText = sendButton.textContent;
            sendButton.disabled = true;
            sendButton.textContent = 'در حال پردازش...';
            
            if (responseArea) {
                responseArea.innerHTML = `
                    <div style="text-align: center; padding: 30px;">
                        <div style="font-size: 48px; margin-bottom: 10px;">⏳</div>
                        <div>در حال پردازش سوال...</div>
                        <div style="font-size: 12px; color: #666; margin-top: 10px;">سیستم نطق مصطلح در حال تحلیل سوال شماست</div>
                    </div>
                `;
            }

            try {
                const result = await aiCore.askQuestion(question);
                
                if (responseArea) {
                    responseArea.innerHTML = `
                        <div style="background: #d4edda; padding: 20px; border-radius: 10px; border-right: 4px solid #28a745;">
                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                <span style="font-size: 24px; margin-left: 10px;">🧠</span>
                                <strong>پاسخ هوشمند:</strong>
                            </div>
                            <div style="margin: 15px 0; font-size: 16px; line-height: 1.6; white-space: pre-line;">${result.answer}</div>
                            <div style="color: #666; font-size: 14px; border-top: 1px solid #b8dacc; padding-top: 10px;">
                                🔍 اعتماد: ${(result.confidence * 100).toFixed(1)}% | 
                                📁 حوزه: ${result.domain?.type || 'عمومی'} | 
                                ⏰ زمان: ${new Date(result.timestamp).toLocaleTimeString('fa-IR')}
                            </div>
                        </div>
                    `;
                }

            } catch (error) {
                console.error('❌ خطا:', error);
                if (responseArea) {
                    responseArea.innerHTML = `
                        <div style="background: #f8d7da; padding: 20px; border-radius: 10px; border-right: 4px solid #dc3545;">
                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                <span style="font-size: 24px; margin-left: 10px;">⚠️</span>
                                <strong>خطا:</strong>
                            </div>
                            <p style="margin: 15px 0; font-size: 16px;">${error.message}</p>
                            <div style="color: #666; font-size: 14px;">
                                💡 راهنمایی: لطفاً از فعال بودن سرور اطمینان حاصل کنید و دوباره تلاش کنید.
                            </div>
                        </div>
                    `;
                }
            } finally {
                // بازگشت به حالت عادی
                sendButton.disabled = false;
                sendButton.textContent = originalText;
            }
        });
    }

    // عملکرد دکمه‌های تخصصی
    const specialtyButtons = document.querySelectorAll('.specialty-btn');
    if (specialtyButtons.length > 0 && questionInput && sendButton) {
        specialtyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const question = this.getAttribute('data-question');
                if (question && questionInput) {
                    questionInput.value = question;
                    sendButton.click();
                }
            });
        });
    } else {
        console.warn('⚠️ دکمه‌های تخصصی یافت نشدند');
    }

    // عملکرد Enter برای ارسال
    if (questionInput && sendButton) {
        questionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });
    }

    console.log('🎯 سیستم رابط کاربری کاملاً راه‌اندازی شد');
}

// راه‌اندازی وقتی DOM آماده شد
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUniversalAI);
} else {
    initializeUniversalAI();
}

// اضافه کردن به window برای دسترسی از کنسول
window.UniversalAICore = UniversalAICore;
window.initializeUniversalAI = initializeUniversalAI;
