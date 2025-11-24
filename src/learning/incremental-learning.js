class IncrementalLearning {
    constructor() {
        this.interactionHistory = new Map();
        this.knowledgeUpdates = new Map();
        this.performanceMetrics = {
            responseAccuracy: 0.8,
            userSatisfaction: 0.7,
            knowledgeCoverage: 0.6
        };
    }

    // ثبت تعامل کاربر
    recordInteraction(userId, question, response, feedback = null) {
        if (!this.interactionHistory.has(userId)) {
            this.interactionHistory.set(userId, []);
        }

        const interaction = {
            timestamp: new Date(),
            question: question,
            response: response,
            feedback: feedback,
            confidence: this.calculateResponseConfidence(response)
        };

        this.interactionHistory.get(userId).push(interaction);
        
        // یادگیری از تعامل
        if (feedback !== null) {
            this.learnFromFeedback(interaction);
        }

        // به‌روزرسانی معیارهای عملکرد
        this.updatePerformanceMetrics(interaction);
    }

    calculateResponseConfidence(response) {
        // محاسبه اعتماد بر اساس طول و ساختار پاسخ
        const lengthScore = Math.min(response.length / 500, 1);
        const structureScore = response.includes('**') ? 0.8 : 0.5;
        return (lengthScore + structureScore) / 2;
    }

    learnFromFeedback(interaction) {
        const { question, response, feedback } = interaction;
        
        if (feedback.positive) {
            // تقویت دانش مرتبط
            this.reinforceKnowledge(question, response);
        } else {
            // شناسایی شکاف دانش
            this.identifyKnowledgeGap(question, response, feedback);
        }
    }

    reinforceKnowledge(question, response) {
        const key = this.generateKnowledgeKey(question);
        const currentStrength = this.knowledgeUpdates.get(key) || 0;
        this.knowledgeUpdates.set(key, currentStrength + 1);
    }

    identifyKnowledgeGap(question, response, feedback) {
        const gap = {
            question: question,
            expectedResponse: feedback.expected,
            actualResponse: response,
            timestamp: new Date(),
            gapType: this.classifyGapType(question, response, feedback)
        };

        // ذخیره شکاف شناسایی شده
        if (!this.knowledgeUpdates.has('knowledge_gaps')) {
            this.knowledgeUpdates.set('knowledge_gaps', []);
        }
        this.knowledgeUpdates.get('knowledge_gaps').push(gap);
    }

    classifyGapType(question, response, feedback) {
        if (response.includes('نمی‌دانم') || response.includes('اطلاعات')) {
            return 'missing_knowledge';
        } else if (response !== feedback.expected) {
            return 'inaccurate_knowledge';
        } else {
            return 'context_misunderstanding';
        }
    }

    updatePerformanceMetrics(interaction) {
        // به‌روزرسانی معیارهای عملکرد بر اساس تعامل
        if (interaction.feedback) {
            this.performanceMetrics.userSatisfaction = 
                this.performanceMetrics.userSatisfaction * 0.9 + 
                (interaction.feedback.positive ? 0.1 : 0);
        }

        this.performanceMetrics.responseAccuracy = 
            this.performanceMetrics.responseAccuracy * 0.95 + 
            interaction.confidence * 0.05;

        // به‌روزرسانی پوشش دانش
        this.performanceMetrics.knowledgeCoverage = 
            this.calculateKnowledgeCoverage();
    }

    calculateKnowledgeCoverage() {
        const totalInteractions = Array.from(this.interactionHistory.values())
            .reduce((sum, history) => sum + history.length, 0);
        
        const gaps = this.knowledgeUpdates.get('knowledge_gaps') || [];
        const gapRatio = gaps.length / Math.max(totalInteractions, 1);
        
        return Math.max(0, 1 - gapRatio);
    }

    generateKnowledgeKey(question) {
        // تولید کلید یکتا برای دانش
        return question.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^\w\u0600-\u06FF]/g, '')
            .substring(0, 50);
    }

    // تولید گزارش یادگیری
    generateLearningReport() {
        return {
            timestamp: new Date(),
            totalUsers: this.interactionHistory.size,
            totalInteractions: Array.from(this.interactionHistory.values())
                .reduce((sum, history) => sum + history.length, 0),
            performanceMetrics: this.performanceMetrics,
            knowledgeGaps: this.knowledgeUpdates.get('knowledge_gaps') || [],
            topStrengths: this.getTopKnowledgeStrengths(5)
        };
    }

    getTopKnowledgeStrengths(limit = 5) {
        const strengths = Array.from(this.knowledgeUpdates.entries())
            .filter(([key, strength]) => key !== 'knowledge_gaps')
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit);
        
        return strengths.map(([key, strength]) => ({ key, strength }));
    }

    // بهینه‌سازی بر اساس یادگیری
    optimizeBasedOnLearning() {
        const report = this.generateLearningReport();
        
        return {
            recommendations: this.generateOptimizationRecommendations(report),
            priority: this.calculateOptimizationPriority(report),
            estimatedImpact: this.estimateOptimizationImpact(report)
        };
    }

    generateOptimizationRecommendations(report) {
        const recommendations = [];
        
        if (report.performanceMetrics.knowledgeCoverage < 0.7) {
            recommendations.push({
                type: 'knowledge_expansion',
                description: 'افزایش پوشش دانش در حوزه‌های دارای شکاف',
                priority: 'high'
            });
        }
        
        if (report.performanceMetrics.userSatisfaction < 0.8) {
            recommendations.push({
                type: 'response_quality',
                description: 'بهبود کیفیت پاسخ‌ها بر اساس بازخورد کاربران',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }

    calculateOptimizationPriority(report) {
        const metrics = report.performanceMetrics;
        return (1 - metrics.knowledgeCoverage) * 0.4 + 
               (1 - metrics.userSatisfaction) * 0.3 + 
               (1 - metrics.responseAccuracy) * 0.3;
    }

    estimateOptimizationImpact(report) {
        const currentScore = Object.values(report.performanceMetrics)
            .reduce((sum, metric) => sum + metric, 0) / 3;
        
        const potentialImprovement = 0.2; // 20% improvement potential
        return Math.min(1, currentScore + potentialImprovement);
    }
}

module.exports = IncrementalLearning;
