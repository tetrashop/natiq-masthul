import KnowledgeBoundary from './knowledge-boundary.js';

class SelfAwareAISystem {
    constructor() {
        this.boundary = new KnowledgeBoundary();
        this.name = "نطق مصطلح خردمند";
        this.version = "1.0.0";
    }

    async processQuestion(question) {
        // اعتبارسنجی سوال
        const validation = this.boundary.validateQuestion(question);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.reason,
                response: "متأسفانه نمی‌توانم به این سوال پاسخ دهم."
            };
        }

        // پردازش سوال
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
        // پاسخ‌های پایه بر اساس سوال
        const responses = {
            'تعادل': "برای ایجاد تعادل در زندگی، پیشنهاد می‌کنم زمان خود را به سه بخش کار، خانواده و خودسازی تقسیم کنید.",
            'بهره‌وری': "برای افزایش بهره‌وری، اولویت‌بندی Aufgaben و حذف عوامل حواس‌پرتی مؤثر است.",
            'اخلاق': "در تصمیم‌گیری اخلاقی، تأثیر تصمیم بر خود، دیگران و جامعه را در نظر بگیرید.",
            'default': "بر اساس خرد کهن، جستجوی تعادل و معنویت در زندگی می‌تواند راهگشا باشد."
        };

        for (const [key, response] of Object.entries(responses)) {
            if (question.includes(key)) {
                return response;
            }
        }

        return responses.default;
    }

    getSystemInfo() {
        return {
            name: this.name,
            version: this.version,
            capabilities: this.boundary.getSystemCapabilities(),
            boundaries: this.boundary.boundaries
        };
    }
}

// ایجاد نمونه و export
const aiSystem = new SelfAwareAISystem();

export default {
    async fetch(request, env, ctx) {
        // فقط درخواست‌های POST پردازش شوند
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({
                error: 'فقط درخواست‌های POST پذیرفته می‌شوند'
            }), { 
                status: 405,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        try {
            const { question } = await request.json();
            
            if (!question) {
                return new Response(JSON.stringify({
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
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });

        } catch (error) {
            return new Response(JSON.stringify({
                error: 'خطا در پردازش درخواست',
                details: error.message
            }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
        }
    }
};
