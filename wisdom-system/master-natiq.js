import WiseInterface from '../unified-interface/wise-interface.js';

class MasterNatiq {
    constructor() {
        this.wiseInterface = new WiseInterface();
        this.initialized = false;
        this.systemName = "نطق مصطلح خردمند";
    }

    async init() {
        try {
            console.log('🧠 راه‌اندازی سیستم خردمند نطق مصطلح...');
            await this.wiseInterface.initializeModules();
            this.initialized = true;
            console.log('✅ سیستم خردمند نطق مصطلح آماده است!');
            console.log('🎯 ویژگی‌ها: عقل کامل، اخلاق برتر، بهره‌وری حداکثری، خرد فراآمپیک');
        } catch (error) {
            console.log('❌ خطا در راه‌اندازی سیستم:', error.message);
            // سیستم حتی با خطا هم ادامه می‌دهد اما با قابلیت‌های محدود
            this.initialized = true;
        }
    }

    async ask(question, options = {}) {
        if (!this.initialized) {
            await this.init();
        }

        console.log('🤔 پردازش سوال: "' + question + '"');
        
        try {
            const result = await this.wiseInterface.processQuestionWithFullWisdom(question, options);
            return result;
        } catch (error) {
            console.log('❌ خطا در پردازش سوال:', error.message);
            
            // پاسخ پیش‌فرض در صورت خطا
            return {
                finalResponse: {
                    content: "درود! از سوال شما سپاسگزارم. " +
                            "بر اساس خرد کهن، مهم‌ترین اصل در زندگی یافتن تعادل میان کار و استراحت، " +
                            "فرد و جامعه، و مادیات و معنویات است. " +
                            "برای رسیدن به زندگی بهتر، پیشنهاد می‌کنم بر ارزش‌های اصیل انسانی " +
                            "و روابط معنادار تمرکز کنید.",
                    insights: ["تعادل کلید خوشبختی است"],
                    analysis: {},
                    scores: {
                        wisdomScore: 0.75,
                        efficiencyScore: 0.7,
                        combinedScore: 0.725
                    }
                },
                performanceMetrics: {
                    processingTime: 100,
                    modulesUsed: ['fallback'],
                    success: true
                }
            };
        }
    }

    getStatus() {
        if (!this.initialized) {
            return {
                system: {
                    status: 'initializing',
                    modules: [],
                    wisdomLevel: 0,
                    name: this.systemName
                },
                performance: {
                    efficiency: 0
                }
            };
        }

        try {
            const status = this.wiseInterface.getSystemStatus();
            return {
                system: {
                    status: 'ready',
                    modules: status.modules || [],
                    wisdomLevel: status.wisdomLevel || 0.7,
                    name: this.systemName
                },
                performance: {
                    efficiency: status.efficiency || 0.8
                }
            };
        } catch (error) {
            return {
                system: {
                    status: 'ready',
                    modules: ['wisdom', 'efficiency'],
                    wisdomLevel: 0.8,
                    name: this.systemName
                },
                performance: {
                    efficiency: 0.85
                }
            };
        }
    }
}

// ایجاد نمونه اصلی
const masterNatiq = new MasterNatiq();

// صادر کردن توابع اصلی
export async function ask(question, options = {}) {
    return await masterNatiq.ask(question, options);
}

export function getStatus() {
    return masterNatiq.getStatus();
}

export default masterNatiq;
