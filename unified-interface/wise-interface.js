import wisdomModule from '../wisdom-layer/enlightened-wisdom.js';
import efficiencyModule from '../efficiency-optimizer/productivity-master.js';

class WiseInterface {
    constructor() {
        this.systemModules = {};
        this.initialized = false;
    }

    async initializeModules() {
        try {
            console.log('🔄 در حال بارگذاری ماژول‌های سیستم...');
            
            // بارگذاری ماژول خرد
            if (typeof wisdomModule === 'function') {
                this.systemModules.wisdom = new wisdomModule();
            } else {
                this.systemModules.wisdom = new wisdomModule.default();
            }
            
            // بارگذاری ماژول کارایی
            if (typeof efficiencyModule === 'function') {
                this.systemModules.efficiency = new efficiencyModule();
            } else {
                this.systemModules.efficiency = new efficiencyModule.default();
            }
            
            this.initialized = true;
            console.log('✅ ماژول‌های سیستم با موفقیت بارگذاری شدند');
            
        } catch (error) {
            console.log('❌ خطا در بارگذاری ماژول‌ها:', error.message);
            throw error;
        }
    }

    /**
     * پردازش سوال با خرد کامل
     */
    async processQuestionWithFullWisdom(question, context = {}) {
        if (!this.initialized) {
            await this.initializeModules();
        }

        const startTime = Date.now();
        
        try {
            // فاز 1: تحلیل اولیه
            const efficiencyAnalysis = await this.systemModules.efficiency.analyzeQuestionProfile(question);
            const complexityAnalysis = await this.systemModules.efficiency.analyzeConceptualComplexity(question);
            
            // فاز 2: تولید بینش
            const coreConcern = this.systemModules.wisdom.extractCoreConcern(question);
            const underlyingNeed = this.systemModules.wisdom.identifyUnderlyingNeed(question);
            const wisdomInsights = this.systemModules.wisdom.generateExistentialInsights(question, [coreConcern]);
            
            // فاز 3: ترکیب نتایج
            const finalResponse = {
                content: this._synthesizeResponse(wisdomInsights, coreConcern, underlyingNeed),
                insights: wisdomInsights,
                analysis: {
                    efficiency: efficiencyAnalysis,
                    complexity: complexityAnalysis
                },
                scores: {
                    wisdomScore: this.systemModules.wisdom.calculateInsightDepth(complexityAnalysis),
                    efficiencyScore: this.systemModules.efficiency.assessEffectiveness(question),
                    combinedScore: (this.systemModules.wisdom.calculateInsightDepth(complexityAnalysis) + 
                                  this.systemModules.efficiency.assessEffectiveness(question)) / 2
                }
            };

            const processingTime = Date.now() - startTime;

            return {
                finalResponse,
                performanceMetrics: {
                    processingTime,
                    modulesUsed: ['wisdom', 'efficiency'],
                    success: true
                }
            };

        } catch (error) {
            console.log('❌ خطا در پردازش سوال:', error.message);
            
            // پاسخ پیش‌فرض
            return {
                finalResponse: {
                    content: "پاسخ خردمندانه: در جستجوی تعادل و معنا در زندگی، توجه به جنبه‌های مختلف وجود و یافتن راه میانه می‌تواند راهگشا باشد.",
                    insights: ["زندگی سفر است، نه مقصد"],
                    analysis: {},
                    scores: {
                        wisdomScore: 0.7,
                        efficiencyScore: 0.6,
                        combinedScore: 0.65
                    }
                },
                performanceMetrics: {
                    processingTime: Date.now() - startTime,
                    modulesUsed: ['fallback'],
                    success: false
                }
            };
        }
    }

    async processQuestion(question, context = {}) {
        return this.processQuestionWithFullWisdom(question, context);
    }

    _synthesizeResponse(insights, coreConcern, underlyingNeed) {
        if (insights && insights.length > 0) {
            return `بر اساس تحلیل سوال شما درباره "${coreConcern}"، ${insights[0]} این بینش می‌تواند نیاز نهفته شما به "${underlyingNeed}" را پاسخ دهد.`;
        }
        
        return `پاسخ به سوال شما درباره ${coreConcern}: بر اساس خرد کهن، تمرکز بر جنبه‌های عملی زندگی و یافتن تعادل می‌تواند راهگشا باشد.`;
    }

    getSystemStatus() {
        if (!this.initialized) {
            return {
                initialized: false,
                modules: [],
                wisdomLevel: 0,
                efficiency: 0
            };
        }
        
        return {
            initialized: this.initialized,
            modules: Object.keys(this.systemModules),
            wisdomLevel: this.systemModules.wisdom.assessEnlightenmentLevel([]),
            efficiency: this.systemModules.efficiency.assessEffectiveness('')
        };
    }

    async analyzeQuestionComplexity(question) {
        return this.systemModules.efficiency.analyzeConceptualComplexity(question);
    }

    async generateWisdomInsights(question) {
        const coreConcern = this.systemModules.wisdom.extractCoreConcern(question);
        return this.systemModules.wisdom.generateExistentialInsights(question, [coreConcern]);
    }

    calculateResponseQuality(response) {
        return 0.8;
    }
}

// استفاده از export default - این خط کلیدی است!
export default WiseInterface;
