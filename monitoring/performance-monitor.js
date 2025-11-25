/**
 * سیستم مانیتورینگ عملکرد برای نطق مصطلح
 */

class PerformanceMonitor {
    constructor() {
        this.questions = [];
        this.algorithmMetrics = new Map();
        this.startTime = Date.now();
        this.systemStatus = 'active';
    }

    recordQuestion(question, confidence, domainsCount) {
        const record = {
            question,
            confidence,
            domainsCount,
            timestamp: Date.now(),
            processingTime: Date.now() - this.startTime
        };

        this.questions.push(record);
        
        // حفظ آخرین 100 سوال برای جلوگیری از مصرف حافظه بی‌رویه
        if (this.questions.length > 100) {
            this.questions = this.questions.slice(-100);
        }

        return record;
    }

    recordAlgorithmPerformance(algorithmId, confidence, executionTime) {
        if (!this.algorithmMetrics.has(algorithmId)) {
            this.algorithmMetrics.set(algorithmId, {
                totalUses: 0,
                totalConfidence: 0,
                totalExecutionTime: 0,
                averageConfidence: 0,
                averageExecutionTime: 0
            });
        }

        const metrics = this.algorithmMetrics.get(algorithmId);
        metrics.totalUses++;
        metrics.totalConfidence += confidence;
        metrics.totalExecutionTime += executionTime;
        metrics.averageConfidence = metrics.totalConfidence / metrics.totalUses;
        metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.totalUses;

        this.algorithmMetrics.set(algorithmId, metrics);
    }

    getPerformanceSummary() {
        const totalQuestions = this.questions.length;
        const averageConfidence = totalQuestions > 0 
            ? this.questions.reduce((sum, q) => sum + q.confidence, 0) / totalQuestions
            : 0;

        const algorithmPerformance = {};
        for (const [algoId, metrics] of this.algorithmMetrics) {
            algorithmPerformance[algoId] = {
                totalUses: metrics.totalUses,
                totalConfidence: metrics.totalConfidence,
                averageConfidence: metrics.averageConfidence
            };
        }

        return {
            totalQuestionsProcessed: totalQuestions,
            overallAverageConfidence: averageConfidence,
            algorithmPerformance,
            systemHealth: this.calculateSystemHealth()
        };
    }

    calculateSystemHealth() {
        const totalQuestions = this.questions.length;
        if (totalQuestions === 0) {
            return {
                status: 'جدید',
                score: 0,
                recommendations: ['سیستم در حال راه‌اندازی است']
            };
        }

        const recentQuestions = this.questions.slice(-10);
        const recentAvgConfidence = recentQuestions.reduce((sum, q) => sum + q.confidence, 0) / recentQuestions.length;
        
        let status, score;
        if (recentAvgConfidence >= 0.7) {
            status = 'عالی';
            score = recentAvgConfidence;
        } else if (recentAvgConfidence >= 0.5) {
            status = 'خوب';
            score = recentAvgConfidence;
        } else if (recentAvgConfidence >= 0.3) {
            status = 'نیاز به بهبود';
            score = recentAvgConfidence;
        } else {
            status = 'نیاز به بازبینی';
            score = recentAvgConfidence;
        }

        const recommendations = [];
        if (recentAvgConfidence < 0.6) {
            recommendations.push('افزایش داده‌های آموزشی');
        }
        if (recentAvgConfidence < 0.4) {
            recommendations.push('بهبود الگوریتم استنتاج منطقی');
        }
        if (this.questions.length < 5) {
            recommendations.push('تست بیشتر با سوالات متنوع');
        }

        return {
            status,
            score,
            recommendations: recommendations.length > 0 ? recommendations : ['سیستم در وضعیت مطلوبی قرار دارد']
        };
    }

    getSystemUptime() {
        return Date.now() - this.startTime;
    }

    getSystemStatus() {
        const performance = this.getPerformanceSummary();
        return {
            uptime: this.getSystemUptime(),
            totalQuestions: performance.totalQuestionsProcessed,
            health: performance.systemHealth,
            algorithms: Object.keys(performance.algorithmPerformance).length
        };
    }

    // متد برای ریست کردن آمار (اختیاری)
    reset() {
        this.questions = [];
        this.algorithmMetrics.clear();
        this.startTime = Date.now();
        console.log('✅ آمار عملکرد سیستم ریست شد');
    }
}

module.exports = PerformanceMonitor;
