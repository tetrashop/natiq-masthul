/**
 * فایل اصلی سیستم نطق مصطلح - نسخه الگوریتمیک یکپارچه
 */

const CoreKnowledgeGraph = require('./knowledge-graph/core-knowledge');
const MultiAlgorithmProcessor = require('./reasoning-engine/multi-algorithm-processor');
const UnifiedResponseBuilder = require('./integration-layer/unified-response-builder');

class NatiqMasthulIntegratedSystem {
    constructor() {
        this.knowledgeGraph = new CoreKnowledgeGraph();
        this.algorithmProcessor = new MultiAlgorithmProcessor();
        this.responseBuilder = new UnifiedResponseBuilder();
        this.performanceMetrics = {
            totalQuestions: 0,
            averageConfidence: 0,
            algorithmPerformance: new Map()
        };
    }

    async processQuestion(question) {
        this.performanceMetrics.totalQuestions++;
        
        // مرحله ۱: فعال‌سازی گراف دانش
        const questionPatterns = this.extractQuestionPatterns(question);
        const activeNodes = this.knowledgeGraph.activateNodes(questionPatterns);
        
        // مرحله ۲: پردازش چندالگوریتمی
        const algorithmResults = await this.algorithmProcessor.processQuestion(question, activeNodes);
        
        // مرحله ۳: ساخت پاسخ یکپارچه
        const finalResponse = this.responseBuilder.buildUnifiedResponse(
            question,
            algorithmResults.results,
            activeNodes,
            {
                finalConfidence: algorithmResults.finalConfidence,
                activeNodes: activeNodes,
                algorithmMetrics: algorithmResults.algorithmMetrics
            }
        );

        // مرحله ۴: به‌روزرسانی معیارهای عملکرد
        this.updatePerformanceMetrics(algorithmResults);

        return {
            question,
            response: finalResponse.response,
            metadata: {
                ...finalResponse.metadata,
                processingTime: Date.now(),
                activeNodesCount: activeNodes.length,
                algorithmsUsed: algorithmResults.results.map(r => r.algorithm)
            },
            performance: this.getPerformanceSnapshot()
        };
    }

    extractQuestionPatterns(question) {
        const patterns = [];
        const words = question.toLowerCase().split(' ');
        
        // الگوهای کلیدی فارسی
        const keyPatterns = [
            'بازگرداندن', 'مشتری', 'حریص', 'ناراضی', 'جذب', 'مجدد',
            'روانشناسی', 'استراتژی', 'کسب‌وکار', 'ارتباط', 'ارزش',
            'سرمایه', 'بازگشت', 'سود', 'منفعت', 'راهکار', 'راه حل'
        ];

        keyPatterns.forEach(pattern => {
            if (question.includes(pattern)) {
                patterns.push(pattern);
            }
        });

        // افزودن کلمات تک‌کلمه‌ای
        patterns.push(...words.filter(word => word.length > 2));

        return [...new Set(patterns)]; // حذف duplicates
    }

    updatePerformanceMetrics(algorithmResults) {
        // به‌روزرسانی میانگین اعتماد
        this.performanceMetrics.averageConfidence = 
            (this.performanceMetrics.averageConfidence * (this.performanceMetrics.totalQuestions - 1) + 
             algorithmResults.finalConfidence) / this.performanceMetrics.totalQuestions;

        // به‌روزرسانی عملکرد الگوریتم‌ها
        algorithmResults.results.forEach(result => {
            const algoMetrics = this.performanceMetrics.algorithmPerformance.get(result.algorithm) || {
                totalUses: 0,
                totalConfidence: 0,
                averageConfidence: 0
            };

            algoMetrics.totalUses++;
            algoMetrics.totalConfidence += result.confidence;
            algoMetrics.averageConfidence = algoMetrics.totalConfidence / algoMetrics.totalUses;

            this.performanceMetrics.algorithmPerformance.set(result.algorithm, algoMetrics);
        });
    }

    getPerformanceSnapshot() {
        return {
            totalQuestionsProcessed: this.performanceMetrics.totalQuestions,
            overallAverageConfidence: this.performanceMetrics.averageConfidence,
            algorithmPerformance: Object.fromEntries(this.performanceMetrics.algorithmPerformance),
            systemHealth: this.calculateSystemHealth()
        };
    }

    calculateSystemHealth() {
        const algoCount = this.performanceMetrics.algorithmPerformance.size;
        const avgAlgoConfidence = Array.from(this.performanceMetrics.algorithmPerformance.values())
            .reduce((sum, metrics) => sum + metrics.averageConfidence, 0) / algoCount;

        return {
            status: avgAlgoConfidence > 0.7 ? 'عالی' : 'نیاز به بهبود',
            score: avgAlgoConfidence,
            recommendations: this.generateHealthRecommendations(avgAlgoConfidence)
        };
    }

    generateHealthRecommendations(score) {
        if (score > 0.8) {
            return ['سیستم در وضعیت مطلوب قرار دارد'];
        } else if (score > 0.6) {
            return ['افزایش داده‌های آموزشی', 'بهبود الگوریتم استنتاج منطقی'];
        } else {
            return ['بازنگری اساسی در گراف دانش', 'بهبود الگوریتم‌های پایه', 'افزایش دامنه دانش'];
        }
    }

    getSystemStats() {
        return {
            version: '2.0.0-integrated-algorithms',
            components: {
                knowledgeGraph: `گره‌ها: ${this.knowledgeGraph.nodes.size}, یال‌ها: ${this.knowledgeGraph.edges.size}`,
                algorithms: `الگوریتم‌های فعال: ${this.algorithmProcessor.algorithms.size}`,
                responseBuilder: `الگوهای پاسخ: ${this.responseBuilder.templates.size}`
            },
            capabilities: [
                'پردازش چندالگوریتمی همزمان',
                'گراف دانش پویا و خودآموز',
                'یکپارچه‌سازی هوشمند پاسخ‌ها',
                'مانیتورینگ عملکرد实时',
                'بهبود مستمر بر اساس تعاملات'
            ]
        };
    }
}

// نمونه استفاده از سیستم
if (require.main === module) {
    const system = new NatiqMasthulIntegratedSystem();
    
    // تست سیستم
    const testQuestion = "چگونه مشتری حریصی که نرم‌افزار ما را کنار گذاشته بازگردانیم؟";
    
    system.processQuestion(testQuestion)
        .then(result => {
            console.log('🧠 سیستم نطق مصطلح - نسخه الگوریتمیک یکپارچه');
            console.log('=' .repeat(50));
            console.log(`سوال: ${result.question}`);
            console.log('\n' + result.response);
            console.log('\n' + '=' .repeat(50));
            console.log('📊 آمار سیستم:');
            console.log(JSON.stringify(result.performance, null, 2));
        })
        .catch(console.error);
}

module.exports = NatiqMasthulIntegratedSystem;
