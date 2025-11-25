/**
 * پردازنده چندالگوریتمی برای استدلال یکپارچه - نسخه بهبود یافته
 */

class MultiAlgorithmProcessor {
    constructor() {
        this.algorithms = new Map();
        this.algorithmWeights = new Map();
        this.initAlgorithms();
    }

    initAlgorithms() {
        // الگوریتم تحلیل الگو - وزن افزایش یافته
        this.addAlgorithm('pattern_analysis', {
            name: 'تحلیل الگوی سوال',
            weight: 0.95,
            function: this.patternAnalysis.bind(this),
            description: 'تشخیص الگوهای سوال و تطابق با دانش موجود'
        });

        // الگوریتم استنتاج منطقی - بهبود یافته
        this.addAlgorithm('logical_inference', {
            name: 'استنتاج منطقی',
            weight: 0.9,
            function: this.logicalInference.bind(this),
            description: 'استنتاج بر اساس قواعد منطقی و روابط علّی'
        });

        // الگوریتم ترکیب دانش - بهبود یافته
        this.addAlgorithm('knowledge_fusion', {
            name: 'ترکیب دانش',
            weight: 0.85,
            function: this.knowledgeFusion.bind(this),
            description: 'ترکیب اطلاعات از حوزه‌های مختلف برای پاسخ یکپارچه'
        });

        // الگوریتم بهینه‌سازی پاسخ
        this.addAlgorithm('response_optimization', {
            name: 'بهینه‌سازی پاسخ',
            weight: 0.8,
            function: this.responseOptimization.bind(this),
            description: 'بهبود ساختار و محتوای پاسخ برای بهره‌وری بیشتر'
        });
    }

    addAlgorithm(id, config) {
        this.algorithms.set(id, config);
        this.algorithmWeights.set(id, config.weight);
    }

    async processQuestion(question, activeNodes) {
        console.log('🧠 شروع پردازش چندالگوریتمی...');
        const results = new Map();
        let combinedScore = 0;

        // اجرای تمام الگوریتم‌ها
        for (const [id, algo] of this.algorithms) {
            console.log(`\n🔧 اجرای الگوریتم: ${algo.name}`);
            const result = await algo.function(question, activeNodes);
            results.set(id, {
                ...result,
                algorithm: id,
                weight: algo.weight
            });
            
            combinedScore += result.confidence * algo.weight;
            console.log(`✅ ${algo.name}: امتیاز ${(result.confidence * 100).toFixed(1)}%`);
        }

        // محاسبه امتیاز نهایی
        const totalWeight = Array.from(this.algorithmWeights.values())
            .reduce((sum, weight) => sum + weight, 0);
        
        const finalConfidence = combinedScore / totalWeight;
        console.log(`\n🎯 اعتماد نهایی سیستم: ${(finalConfidence * 100).toFixed(1)}%`);

        return {
            results: Array.from(results.values()),
            finalConfidence,
            algorithmMetrics: this.calculateAlgorithmMetrics(results)
        };
    }

    patternAnalysis(question, activeNodes) {
        console.log('🔍 تحلیل الگوهای سوال...');
        const patterns = this.extractPatterns(question);
        let confidence = 0;
        let matchedDomains = [];

        console.log('📝 الگوهای استخراج شده:', patterns);

        for (const node of activeNodes) {
            let nodeScore = 0;
            for (const pattern of node.patterns) {
                for (const qp of patterns) {
                    if (qp.includes(pattern) || pattern.includes(qp)) {
                        nodeScore += node.weight * 0.6; // افزایش ضریب
                        console.log(`✅ تطابق "${pattern}" با "${qp}": +${node.weight * 0.6}`);
                        break;
                    }
                }
            }
            
            if (nodeScore > 0) {
                confidence += nodeScore * node.activation;
                matchedDomains.push(node.id);
                console.log(`🎯 امتیاز گره ${node.id}: ${(nodeScore * node.activation).toFixed(3)}`);
            }
        }

        confidence = Math.min(1, confidence);
        console.log(`📊 اعتماد تحلیل الگو: ${(confidence * 100).toFixed(1)}%`);

        return Promise.resolve({
            confidence: confidence,
            matchedDomains,
            patternsFound: patterns,
            analysis: 'تحلیل پیشرفته الگوهای سوال با تطابق دقیق'
        });
    }

    logicalInference(question, activeNodes) {
        console.log('🔍 استنتاج منطقی...');
        let inferenceChain = [];
        let logicalConfidence = 0;

        // ایجاد زنجیره استنتاج منطقی پیشرفته
        for (const node of activeNodes) {
            if (node.principles) {
                const applications = this.applyPrinciplesToQuestion(question, node.principles);
                const relevantApplications = applications.filter(app => app.relevance > 0.2);
                
                if (relevantApplications.length > 0) {
                    inferenceChain.push({
                        node: node.id,
                        principles: node.principles,
                        application: relevantApplications,
                        relevanceScore: relevantApplications.reduce((sum, app) => sum + app.relevance, 0) / relevantApplications.length
                    });
                    logicalConfidence += node.activation * 0.4 * relevantApplications.length;
                    console.log(`✅ استنتاج از ${node.id}: ${relevantApplications.length} اصل مرتبط`);
                }
            }
        }

        logicalConfidence = Math.min(1, logicalConfidence);
        console.log(`📊 اعتماد استنتاج منطقی: ${(logicalConfidence * 100).toFixed(1)}%`);

        return Promise.resolve({
            confidence: logicalConfidence,
            inferenceChain,
            logicalConclusions: this.generateLogicalConclusions(inferenceChain),
            analysis: 'استنتاج منطقی پیشرفته بر اساس اصول و قواعد'
        });
    }

    knowledgeFusion(question, activeNodes) {
        console.log('🔗 ترکیب دانش...');
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
                if (fusionResult.score > 0.3) {
                    fusedKnowledge.domains.push(`${nodeA.id}_${nodeB.id}`);
                    fusedKnowledge.integratedPrinciples.push(...fusionResult.principles);
                    fusedKnowledge.combinedStrategies.push(...fusionResult.strategies);
                    fusedKnowledge.crossDomainInsights.push(...fusionResult.insights);
                    
                    fusionScore += fusionResult.score;
                    console.log(`✅ ترکیب ${nodeA.id} و ${nodeB.id}: امتیاز ${fusionResult.score.toFixed(2)}`);
                }
            }
        }

        const confidence = Math.min(1, fusionScore / Math.max(1, activeNodes.length));
        console.log(`📊 اعتماد ترکیب دانش: ${(confidence * 100).toFixed(1)}%`);

        return Promise.resolve({
            confidence: confidence,
            fusedKnowledge,
            fusionStrength: fusionScore,
            analysis: 'ترکیب پیشرفته دانش از حوزه‌های مختلف برای بینش یکپارچه'
        });
    }

    responseOptimization(question, activeNodes) {
        console.log('⚡ بهینه‌سازی پاسخ...');
        const optimizationMetrics = {
            clarity: 0.8,
            completeness: 0.75,
            actionability: 0.9,
            structure: 0.85,
            relevance: 0.8
        };

        // بهینه‌سازی بر اساس حوزه‌های فعال
        activeNodes.forEach(node => {
            if (node.type === 'strategy_domain') {
                optimizationMetrics.actionability += 0.15;
                optimizationMetrics.relevance += 0.1;
            }
            if (node.principles && node.principles.length > 0) {
                optimizationMetrics.completeness += 0.2;
            }
            if (node.techniques) {
                optimizationMetrics.actionability += 0.1;
            }
        });

        const overallOptimization = Object.values(optimizationMetrics)
            .reduce((sum, metric) => sum + metric, 0) / Object.keys(optimizationMetrics).length;

        console.log(`📊 معیارهای بهینه‌سازی:`, optimizationMetrics);
        console.log(`🎯 امتیاز کلی بهینه‌سازی: ${(overallOptimization * 100).toFixed(1)}%`);

        return Promise.resolve({
            confidence: overallOptimization,
            optimizationMetrics,
            suggestedStructure: this.generateOptimalStructure(activeNodes),
            improvementAreas: this.identifyImprovementAreas(optimizationMetrics),
            analysis: 'بهینه‌سازی پیشرفته ساختار و محتوای پاسخ'
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
            fusionResults.score += 0.4;
        }

        // بینش‌های ترکیبی پیشرفته
        const domainCombinations = {
            'psychology_business_strategy': {
                insight: 'ترکیب روانشناسی مشتری با استراتژی کسب‌وکار: درک انگیزه‌های مشتری و تبدیل آن به ارزش مالی ملموس',
                score: 0.5
            },
            'communication_psychology': {
                insight: 'ترکیب مهارت‌های ارتباطی با روانشناسی: ارتباط مؤثر بر اساس درک عمیق از نیازهای روانشناختی مشتری',
                score: 0.4
            },
            'value_proposition_business_strategy': {
                insight: 'ترکیب ارزش‌آفرینی با استراتژی کسب‌وکار: ارائه ارزش‌های ملموس که مستقیماً به اهداف تجاری مرتبط هستند',
                score: 0.45
            },
            'customer_recovery_software_business': {
                insight: 'ترکیب بازگرداندن مشتری با کسب‌وکار نرم‌افزاری: راهکارهای تخصصی برای بازگرداندن کاربران نرم‌افزار',
                score: 0.6
            }
        };

        const combinationKey = `${nodeA.id}_${nodeB.id}`;
        const reverseKey = `${nodeB.id}_${nodeA.id}`;
        
        if (domainCombinations[combinationKey]) {
            fusionResults.insights.push(domainCombinations[combinationKey].insight);
            fusionResults.score += domainCombinations[combinationKey].score;
        } else if (domainCombinations[reverseKey]) {
            fusionResults.insights.push(domainCombinations[reverseKey].insight);
            fusionResults.score += domainCombinations[reverseKey].score;
        }

        return fusionResults;
    }

    extractPatterns(question) {
        const patterns = [];
        const words = question.toLowerCase().split(/\s+/);
        
        // الگوهای کلیدی گسترش یافته
        const keyPatterns = [
            'بازگرداندن', 'مشتری', 'ناراضی', 'جذب', 'مجدد', 'حریص',
            'روانشناسی', 'استراتژی', 'ارتباط', 'ارزش', 'سرمایه',
            'نرم‌افزار', 'برنامه', 'اپلیکیشن', 'سیستم', 'کنار گذاشته',
            'ترک کرده', 'لغو اشتراک', 'عودت', 'بازگشت', 'سود', 'منفعت',
            'کسب‌وکار', 'ارزش مالی', 'سرمایه‌گذاری'
        ];

        keyPatterns.forEach(pattern => {
            if (question.includes(pattern)) {
                patterns.push(pattern);
            }
        });

        // افزودن کلمات تک‌کلمه‌ای با فیلتر بهتر
        patterns.push(...words.filter(word => 
            word.length > 2 && 
            !['های', 'ترین', 'ها', 'چه', 'که', 'را'].includes(word)
        ));

        return [...new Set(patterns)];
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

    applyPrinciplesToQuestion(question, principles) {
        return principles.map(principle => ({
            principle,
            relevance: this.calculatePrincipleRelevance(question, principle),
            application: this.generatePrincipleApplication(principle, question)
        }));
    }

    generateLogicalConclusions(inferenceChain) {
        return inferenceChain.map(chain => ({
            domain: chain.node,
            conclusion: this.generateDomainConclusion(chain.node, chain.principles),
            supportingPrinciples: chain.principles.slice(0, 3),
            relevanceScore: chain.relevanceScore
        }));
    }

    generateOptimalStructure(activeNodes) {
        const structure = [
            'تحلیل عمیق سوال و تشخیص حوزه‌های مرتبط',
            'استنتاج منطقی بر اساس اصول پایه و تخصصی',
            'ترکیب دانش از حوزه‌های مختلف برای بینش یکپارچه',
            'ارائه راهکارهای عملی و قابل اجرا',
            'برنامه‌ریزی استراتژیک مرحله‌ای',
            'معیارهای سنجش موفقیت و پیگیری'
        ];

        // سفارشی‌سازی ساختار بر اساس حوزه‌های فعال
        if (activeNodes.some(node => node.id === 'software_business')) {
            structure.splice(3, 0, 'راهکارهای تخصصی نرم‌افزاری');
        }

        if (activeNodes.some(node => node.id === 'customer_recovery')) {
            structure.splice(2, 0, 'استراتژی بازگرداندن مشتری');
        }

        return structure;
    }

    identifyImprovementAreas(metrics) {
        const improvements = [];
        const thresholds = {
            clarity: 0.8,
            completeness: 0.8,
            actionability: 0.85,
            relevance: 0.8
        };

        Object.entries(metrics).forEach(([metric, value]) => {
            if (thresholds[metric] && value < thresholds[metric]) {
                improvements.push(`افزایش ${this.getMetricName(metric)} از ${(value * 100).toFixed(1)}% به ${(thresholds[metric] * 100).toFixed(1)}%`);
            }
        });

        return improvements;
    }

    calculatePrincipleRelevance(question, principle) {
        const questionWords = new Set(question.toLowerCase().split(/\s+/));
        const principleWords = principle.toLowerCase().split(/\s+/);
        
        let matches = 0;
        principleWords.forEach(pWord => {
            if (pWord.length > 2) { // فقط کلمات معنادار
                for (const qWord of questionWords) {
                    if (qWord.includes(pWord) || pWord.includes(qWord)) {
                        matches++;
                        break;
                    }
                }
            }
        });
        
        return matches / Math.max(1, principleWords.length);
    }

    generatePrincipleApplication(principle, question) {
        const applications = {
            'مشتری حریص با ارزش محسوس بازمی‌گردد': 'تمرکز بر ارائه ارزش مالی ملموس و قابل اندازه‌گیری',
            'اعتماد با شفافیت ساخته می‌شود': 'شفافیت کامل در ارتباطات و ارائه خدمات',
            'تمرکز بر ارزش مالی قابل اندازه‌گیری': 'محاسبه و نمایش دقیق بازگشت سرمایه',
            'ارزش واضح و ملموس ارائه دهید': 'برجسته‌سازی مزایای مستقیم و قابل لمس'
        };

        return applications[principle] || `اعمال اصل "${principle}" در پاسخ به سوال`;
    }

    generateDomainConclusion(domain, principles) {
        const conclusions = {
            'customer_recovery': 'با ترکیب روانشناسی، استراتژی کسب‌وکار و ارتباط مؤثر می‌توان مشتریان از دست رفته را بازگرداند',
            'psychology': 'درک عمیق انگیزه‌ها و نیازهای روانشناختی مشتری کلید موفقیت است',
            'business_strategy': 'ارزش مالی واضح و بازگشت سرمایه سریع مشتریان را متقاعد می‌کند',
            'software_business': 'بهبود مستمر محصول و پشتیبانی عالی تفاوت ایجاد می‌کند'
        };

        return conclusions[domain] || `بر اساس اصول ${domain} می‌توان به نتایج ارزشمندی رسید`;
    }

    getMetricName(metric) {
        const names = {
            clarity: 'وضوح',
            completeness: 'کامل بودن',
            actionability: 'قابلیت اجرا',
            relevance: 'مرتبط بودن',
            structure: 'ساختار'
        };
        return names[metric] || metric;
    }
}

module.exports = MultiAlgorithmProcessor;
