/**
 * پردازنده چندالگوریتمی برای استدلال یکپارچه
 */

class MultiAlgorithmProcessor {
    constructor() {
        this.algorithms = new Map();
        this.algorithmWeights = new Map();
        this.initAlgorithms();
    }

    initAlgorithms() {
        // الگوریتم تحلیل الگو
        this.addAlgorithm('pattern_analysis', {
            name: 'تحلیل الگوی سوال',
            weight: 0.9,
            function: this.patternAnalysis.bind(this),
            description: 'تشخیص الگوهای سوال و تطابق با دانش موجود'
        });

        // الگوریتم استنتاج منطقی
        this.addAlgorithm('logical_inference', {
            name: 'استنتاج منطقی',
            weight: 0.85,
            function: this.logicalInference.bind(this),
            description: 'استنتاج بر اساس قواعد منطقی و روابط علّی'
        });

        // الگوریتم ترکیب دانش
        this.addAlgorithm('knowledge_fusion', {
            name: 'ترکیب دانش',
            weight: 0.8,
            function: this.knowledgeFusion.bind(this),
            description: 'ترکیب اطلاعات از حوزه‌های مختلف برای پاسخ یکپارچه'
        });

        // الگوریتم بهینه‌سازی پاسخ
        this.addAlgorithm('response_optimization', {
            name: 'بهینه‌سازی پاسخ',
            weight: 0.75,
            function: this.responseOptimization.bind(this),
            description: 'بهبود ساختار و محتوای پاسخ برای بهره‌وری بیشتر'
        });
    }

    addAlgorithm(id, config) {
        this.algorithms.set(id, config);
        this.algorithmWeights.set(id, config.weight);
    }

    async processQuestion(question, activeNodes) {
        const results = new Map();
        let combinedScore = 0;

        // اجرای تمام الگوریتم‌ها به صورت موازی
        const algorithmPromises = Array.from(this.algorithms.entries()).map(([id, algo]) => {
            return algo.function(question, activeNodes).then(result => {
                results.set(id, {
                    ...result,
                    algorithm: id,
                    weight: algo.weight
                });
                
                combinedScore += result.confidence * algo.weight;
                return result;
            });
        });

        await Promise.all(algorithmPromises);

        // محاسبه امتیاز نهایی
        const totalWeight = Array.from(this.algorithmWeights.values())
            .reduce((sum, weight) => sum + weight, 0);
        
        const finalConfidence = combinedScore / totalWeight;

        return {
            results: Array.from(results.values()),
            finalConfidence,
            optimizedResponse: this.optimizeFinalResponse(results, finalConfidence),
            algorithmMetrics: this.calculateAlgorithmMetrics(results)
        };
    }

    patternAnalysis(question, activeNodes) {
        const patterns = this.extractPatterns(question);
        let confidence = 0;
        let matchedDomains = [];

        for (const node of activeNodes) {
            const patternMatch = node.patterns.some(pattern => 
                patterns.some(p => p.includes(pattern))
            );
            
            if (patternMatch) {
                confidence += node.activation * node.weight;
                matchedDomains.push(node.id);
            }
        }

        return Promise.resolve({
            confidence: Math.min(1, confidence),
            matchedDomains,
            patternsFound: patterns,
            analysis: 'تحلیل الگوهای سوال و تطابق با حوزه‌های دانش'
        });
    }

    logicalInference(question, activeNodes) {
        let inferenceChain = [];
        let logicalConfidence = 0;

        // ایجاد زنجیره استنتاج منطقی
        for (const node of activeNodes) {
            if (node.principles) {
                inferenceChain.push({
                    node: node.id,
                    principles: node.principles,
                    application: this.applyPrinciplesToQuestion(question, node.principles)
                });
                logicalConfidence += node.activation * 0.3;
            }
        }

        return Promise.resolve({
            confidence: Math.min(1, logicalConfidence),
            inferenceChain,
            logicalConclusions: this.generateLogicalConclusions(inferenceChain),
            analysis: 'استنتاج منطقی بر اساس اصول و قواعد'
        });
    }

    knowledgeFusion(question, activeNodes) {
        const fusedKnowledge = {
            domains: [],
            integratedPrinciples: [],
            combinedStrategies: [],
            crossDomainInsights: []
        };

        let fusionScore = 0;

        // ترکیب دانش از حوزه‌های مختلف
        for (let i = 0; i < activeNodes.length; i++) {
            for (let j = i + 1; j < activeNodes.length; j++) {
                const nodeA = activeNodes[i];
                const nodeB = activeNodes[j];
                
                const fusionResult = this.fuseDomains(nodeA, nodeB, question);
                if (fusionResult.score > 0.5) {
                    fusedKnowledge.domains.push(`${nodeA.id}_${nodeB.id}`);
                    fusedKnowledge.integratedPrinciples.push(...fusionResult.principles);
                    fusedKnowledge.combinedStrategies.push(...fusionResult.strategies);
                    fusedKnowledge.crossDomainInsights.push(...fusionResult.insights);
                    
                    fusionScore += fusionResult.score;
                }
            }
        }

        return Promise.resolve({
            confidence: Math.min(1, fusionScore / (activeNodes.length * 2)),
            fusedKnowledge,
            fusionStrength: fusionScore,
            analysis: 'ترکیب دانش از حوزه‌های مختلف برای بینش یکپارچه'
        });
    }

    responseOptimization(question, activeNodes) {
        const optimizationMetrics = {
            clarity: 0.8,
            completeness: 0.7,
            actionability: 0.9,
            structure: 0.85
        };

        // بهینه‌سازی بر اساس حوزه‌های فعال
        activeNodes.forEach(node => {
            if (node.type === 'strategy_domain') {
                optimizationMetrics.actionability += 0.1;
            }
            if (node.principles && node.principles.length > 0) {
                optimizationMetrics.completeness += 0.15;
            }
        });

        const overallOptimization = Object.values(optimizationMetrics)
            .reduce((sum, metric) => sum + metric, 0) / 4;

        return Promise.resolve({
            confidence: overallOptimization,
            optimizationMetrics,
            suggestedStructure: this.generateOptimalStructure(activeNodes),
            improvementAreas: this.identifyImprovementAreas(optimizationMetrics),
            analysis: 'بهینه‌سازی ساختار و محتوای پاسخ'
        });
    }

    fuseDomains(nodeA, nodeB, question) {
        const fusionResults = {
            score: 0,
            principles: [],
            strategies: [],
            insights: []
        };

        // ترکیب اصول
        if (nodeA.principles && nodeB.principles) {
            fusionResults.principles = [
                ...nodeA.principles.map(p => `از ${nodeA.id}: ${p}`),
                ...nodeB.principles.map(p => `از ${nodeB.id}: ${p}`)
            ];
            fusionResults.score += 0.3;
        }

        // بینش‌های ترکیبی
        if (nodeA.type === 'psychology' && nodeB.type === 'business_strategy') {
            fusionResults.insights.push(
                'ترکیب روانشناسی مشتری با استراتژی کسب‌وکار: درک انگیزه‌های مشتری و تبدیل آن به ارزش مالی'
            );
            fusionResults.score += 0.4;
        }

        if (nodeA.type === 'communication' && nodeB.type === 'strategy_domain') {
            fusionResults.insights.push(
                'ترکیب مهارت‌های ارتباطی با استراتژی: ارتباط مؤثر برای اجرای موفق استراتژی'
            );
            fusionResults.score += 0.3;
        }

        return fusionResults;
    }

    extractPatterns(question) {
        const patterns = [];
        const words = question.split(' ');
        
        // الگوهای کلیدی
        const keyPatterns = [
            'بازگرداندن', 'مشتری', 'ناراضی', 'جذب', 'مجدد', 
            'روانشناسی', 'استراتژی', 'ارتباط', 'ارزش', 'سرمایه'
        ];

        keyPatterns.forEach(pattern => {
            if (question.includes(pattern)) {
                patterns.push(pattern);
            }
        });

        return patterns;
    }

    optimizeFinalResponse(algorithmResults, confidence) {
        const bestResults = algorithmResults.filter(r => r.confidence > 0.7);
        
        return {
            structure: 'پاسخ یکپارچه چندوجهی',
            components: bestResults.map(r => ({
                algorithm: r.algorithm,
                contribution: r.confidence * r.weight,
                insights: r.analysis
            })),
            overallConfidence: confidence,
            integrationLevel: this.calculateIntegrationLevel(bestResults)
        };
    }

    calculateAlgorithmMetrics(results) {
        const metrics = {};
        
        Array.from(results.values()).forEach(result => {
            metrics[result.algorithm] = {
                confidence: result.confidence,
                effectiveness: result.confidence * result.weight,
                contribution: (result.confidence * result.weight) * 100
            };
        });

        return metrics;
    }

    calculateIntegrationLevel(results) {
        if (results.length === 0) return 0;
        
        const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
        const weightSum = results.reduce((sum, r) => sum + r.weight, 0);
        
        return (avgConfidence * weightSum) / results.length;
    }

    applyPrinciplesToQuestion(question, principles) {
        return principles.map(principle => ({
            principle,
            relevance: this.calculatePrincipleRelevance(question, principle),
            application: `اعمال اصل "${principle}" در پاسخ به سوال`
        }));
    }

    generateLogicalConclusions(inferenceChain) {
        return inferenceChain.map(chain => ({
            domain: chain.node,
            conclusion: `بر اساس اصول ${chain.node}، می‌توان به این نتیجه رسید`,
            supportingPrinciples: chain.principles.slice(0, 2)
        }));
    }

    generateOptimalStructure(activeNodes) {
        const structure = [
            'تحلیل سوال و تشخیص حوزه‌های مرتبط',
            'استنتاج منطقی بر اساس اصول پایه',
            'ترکیب دانش از حوزه‌های مختلف',
            'ارائه راهکارهای عملی و ساختاریافته',
            'پیشنهادهای بهینه‌سازی و بهبود'
        ];

        if (activeNodes.some(node => node.type === 'strategy_domain')) {
            structure.splice(3, 0, 'برنامه‌ریزی استراتژیک مرحله‌ای');
        }

        return structure;
    }

    identifyImprovementAreas(metrics) {
        const improvements = [];
        
        if (metrics.clarity < 0.8) improvements.push('افزایش وضوح و شفافیت پاسخ');
        if (metrics.completeness < 0.8) improvements.push('تکمیل جنبه‌های مختلف پاسخ');
        if (metrics.actionability < 0.9) improvements.push('افزایش قابلیت اجرای راهکارها');
        
        return improvements;
    }

    calculatePrincipleRelevance(question, principle) {
        const questionWords = question.split(' ');
        const principleWords = principle.split(' ');
        
        let matches = 0;
        principleWords.forEach(pWord => {
            if (questionWords.some(qWord => qWord.includes(pWord))) {
                matches++;
            }
        });
        
        return matches / principleWords.length;
    }
}

module.exports = MultiAlgorithmProcessor;
