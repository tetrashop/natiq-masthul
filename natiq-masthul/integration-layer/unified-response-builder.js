/**
 * سازنده پاسخ یکپارچه مبتنی بر خروجی الگوریتم‌ها
 */

class UnifiedResponseBuilder {
    constructor() {
        this.templates = new Map();
        this.integrationRules = new Map();
        this.initTemplatesAndRules();
    }

    initTemplatesAndRules() {
        // الگوهای پاسخ بر اساس نوع سوال
        this.templates.set('strategy_question', {
            name: 'الگوی پاسخ استراتژیک',
            structure: [
                'تحلیل موقعیت',
                'اصول پایه قابل اعمال', 
                'راهکارهای عملی',
                'برنامه اجرایی',
                'معیارهای سنجش موفقیت'
            ],
            weight: 0.9
        });

        this.templates.set('problem_solving', {
            name: 'الگوی حل مسئله',
            structure: [
                'تعریف مسئله',
                'تحلیل ریشه‌ای',
                'راه‌حل‌های جایگزین',
                'راهکار بهینه',
                'پیاده‌سازی و نظارت'
            ],
            weight: 0.85
        });

        // قواعد یکپارچه‌سازی
        this.integrationRules.set('high_confidence', {
            condition: (metrics) => metrics.finalConfidence > 0.8,
            action: 'استفاده از ساختار کامل با جزئیات دقیق',
            priority: 1
        });

        this.integrationRules.set('multiple_domains', {
            condition: (metrics) => metrics.activeNodes.length >= 3,
            action: 'ترکیب بین‌رشته‌ای با رویکرد یکپارچه',
            priority: 2
        });

        this.integrationRules.set('strong_fusion', {
            condition: (metrics) => metrics.algorithmMetrics.knowledge_fusion?.effectiveness > 0.7,
            action: 'تأکید بر بینش‌های ترکیبی و نوآورانه',
            priority: 3
        });
    }

    buildUnifiedResponse(question, algorithmResults, activeNodes, finalMetrics) {
        const selectedTemplate = this.selectBestTemplate(algorithmResults, activeNodes);
        const integrationStrategy = this.determineIntegrationStrategy(finalMetrics);
        
        const responseComponents = this.generateResponseComponents(
            algorithmResults, 
            activeNodes, 
            selectedTemplate
        );

        const unifiedResponse = this.integrateComponents(
            responseComponents, 
            integrationStrategy,
            finalMetrics
        );

        return {
            response: unifiedResponse,
            metadata: {
                templateUsed: selectedTemplate.name,
                integrationStrategy: integrationStrategy,
                componentCount: responseComponents.length,
                integrationStrength: this.calculateIntegrationStrength(responseComponents),
                qualityMetrics: this.calculateResponseQuality(unifiedResponse, finalMetrics)
            }
        };
    }

    selectBestTemplate(algorithmResults, activeNodes) {
        let bestTemplate = null;
        let highestScore = 0;

        for (const [templateId, template] of this.templates) {
            let score = template.weight;
            
            // تطابق با الگوریتم‌ها
            algorithmResults.forEach(result => {
                if (this.doesTemplateMatchAlgorithm(template, result)) {
                    score += result.confidence * 0.2;
                }
            });

            // تطابق با حوزه‌های فعال
            if (this.doesTemplateMatchDomains(template, activeNodes)) {
                score += 0.3;
            }

            if (score > highestScore) {
                highestScore = score;
                bestTemplate = { id: templateId, ...template };
            }
        }

        return bestTemplate || this.templates.get('strategy_question');
    }

    determineIntegrationStrategy(metrics) {
        const applicableRules = Array.from(this.integrationRules.values())
            .filter(rule => rule.condition(metrics))
            .sort((a, b) => b.priority - a.priority);

        return {
            rules: applicableRules,
            primaryApproach: applicableRules[0]?.action || 'پاسخ استاندارد',
            complexity: this.determineComplexityLevel(metrics)
        };
    }

    generateResponseComponents(algorithmResults, activeNodes, template) {
        const components = [];

        // کامپوننت بر اساس الگوریتم تحلیل الگو
        const patternAnalysis = algorithmResults.find(r => r.algorithm === 'pattern_analysis');
        if (patternAnalysis) {
            components.push({
                type: 'domain_analysis',
                content: this.buildDomainAnalysis(patternAnalysis, activeNodes),
                weight: patternAnalysis.confidence,
                source: 'pattern_analysis'
            });
        }

        // کامپوننت بر اساس استنتاج منطقی
        const logicalInference = algorithmResults.find(r => r.algorithm === 'logical_inference');
        if (logicalInference) {
            components.push({
                type: 'logical_framework',
                content: this.buildLogicalFramework(logicalInference),
                weight: logicalInference.confidence,
                source: 'logical_inference'
            });
        }

        // کامپوننت بر اساس ترکیب دانش
        const knowledgeFusion = algorithmResults.find(r => r.algorithm === 'knowledge_fusion');
        if (knowledgeFusion) {
            components.push({
                type: 'integrated_insights',
                content: this.buildIntegratedInsights(knowledgeFusion),
                weight: knowledgeFusion.confidence,
                source: 'knowledge_fusion'
            });
        }

        // کامپوننت بر اساس بهینه‌سازی
        const responseOptimization = algorithmResults.find(r => r.algorithm === 'response_optimization');
        if (responseOptimization) {
            components.push({
                type: 'optimized_structure',
                content: this.buildOptimizedStructure(responseOptimization, template),
                weight: responseOptimization.confidence,
                source: 'response_optimization'
            });
        }

        return components.sort((a, b) => b.weight - a.weight);
    }

    integrateComponents(components, integrationStrategy, metrics) {
        let integratedResponse = "🧠 **پاسخ یکپارچه سیستم نطق مصطلح**\n\n";
        
        integratedResponse += "🔍 **تحلیل یکپارچه سوال:**\n";
        integratedResponse += "سیستم با استفاده از چندین الگوریتم پیشرفته، سوال شما را تحلیل کرده و پاسخ زیر را تولید می‌کند.\n\n";

        // افزودن کامپوننت‌ها بر اساس وزن
        components.forEach(component => {
            if (component.weight > 0.5) {
                integratedResponse += `📊 **${this.getComponentTitle(component.type)}:**\n`;
                integratedResponse += `${component.content}\n\n`;
            }
        });

        // افزودن بخش یکپارچه‌سازی
        integratedResponse += this.buildIntegrationSummary(components, integrationStrategy, metrics);

        return integratedResponse;
    }

    buildDomainAnalysis(patternAnalysis, activeNodes) {
        let analysis = `**حوزه‌های دانش شناسایی شده:**\n`;
        
        activeNodes.forEach(node => {
            analysis += `• ${node.id} (فعالیت: ${(node.activation * 100).toFixed(1)}%)\n`;
        });

        analysis += `\n**الگوهای تشخیص داده شده:** ${patternAnalysis.patternsFound.join(', ')}\n`;
        analysis += `**دقت تحلیل الگو:** ${(patternAnalysis.confidence * 100).toFixed(1)}%`;

        return analysis;
    }

    buildLogicalFramework(logicalInference) {
        let framework = `**زنجیره استنتاج منطقی:**\n`;
        
        logicalInference.inferenceChain.forEach(chain => {
            framework += `\n🏷️ **${chain.node}:**\n`;
            chain.application.forEach(app => {
                if (app.relevance > 0.3) {
                    framework += `✓ ${app.application}\n`;
                }
            });
        });

        framework += `\n**استحکام استنتاج:** ${(logicalInference.confidence * 100).toFixed(1)}%`;

        return framework;
    }

    buildIntegratedInsights(knowledgeFusion) {
        let insights = `**بینش‌های ترکیبی:**\n`;
        
        if (knowledgeFusion.fusedKnowledge.crossDomainInsights.length > 0) {
            knowledgeFusion.fusedKnowledge.crossDomainInsights.forEach(insight => {
                insights += `💡 ${insight}\n`;
            });
        }

        insights += `\n**حوزه‌های ترکیب شده:** ${knowledgeFusion.fusedKnowledge.domains.join(', ')}\n`;
        insights += `**قدرت ترکیب:** ${(knowledgeFusion.confidence * 100).toFixed(1)}%`;

        return insights;
    }

    buildOptimizedStructure(responseOptimization, template) {
        let structure = `**ساختار بهینه پاسخ:**\n`;
        
        structure += `📋 **الگوی انتخابی:** ${template.name}\n\n`;
        structure += `**مراحل پاسخ‌دهی:**\n`;
        
        template.structure.forEach((step, index) => {
            structure += `${index + 1}. ${step}\n`;
        });

        structure += `\n**معیارهای بهینه‌سازی:**\n`;
        Object.entries(responseOptimization.optimizationMetrics).forEach(([metric, value]) => {
            structure += `• ${metric}: ${(value * 100).toFixed(1)}%\n`;
        });

        return structure;
    }

    buildIntegrationSummary(components, integrationStrategy, metrics) {
        let summary = "🎯 **خلاصه یکپارچه‌سازی:**\n";
        
        summary += `**راهبرد یکپارچه‌سازی:** ${integrationStrategy.primaryApproach}\n`;
        summary += `**سطح پیچیدگی:** ${integrationStrategy.complexity}\n`;
        summary += `**تعداد کامپوننت‌ها:** ${components.length}\n`;
        summary += `**اعتماد کلی سیستم:** ${(metrics.finalConfidence * 100).toFixed(1)}%\n\n`;
        
        summary += "💫 **این پاسخ با ترکیب هوشمندانه‌ای از الگوریتم‌های مختلف تولید شده است.**";

        return summary;
    }

    doesTemplateMatchAlgorithm(template, algorithmResult) {
        const algorithmDomains = {
            'pattern_analysis': ['strategy_question', 'problem_solving'],
            'logical_inference': ['strategy_question'],
            'knowledge_fusion': ['strategy_question'],
            'response_optimization': ['strategy_question', 'problem_solving']
        };

        return algorithmDomains[algorithmResult.algorithm]?.includes(template.id) || false;
    }

    doesTemplateMatchDomains(template, activeNodes) {
        if (template.id === 'strategy_question') {
            return activeNodes.some(node => node.type === 'strategy_domain');
        }
        return true;
    }

    determineComplexityLevel(metrics) {
        if (metrics.finalConfidence > 0.9 && metrics.activeNodes.length > 3) {
            return 'پیشرفته';
        } else if (metrics.finalConfidence > 0.7) {
            return 'متوسط';
        } else {
            return 'پایه';
        }
    }

    getComponentTitle(componentType) {
        const titles = {
            'domain_analysis': 'تحلیل حوزه‌های دانش',
            'logical_framework': 'چارچوب منطقی',
            'integrated_insights': 'بینش‌های ترکیبی',
            'optimized_structure': 'ساختار بهینه'
        };
        return titles[componentType] || componentType;
    }

    calculateIntegrationStrength(components) {
        if (components.length === 0) return 0;
        
        const totalWeight = components.reduce((sum, comp) => sum + comp.weight, 0);
        return totalWeight / components.length;
    }

    calculateResponseQuality(response, metrics) {
        const lengthScore = Math.min(1, response.length / 2000);
        const structureScore = (response.split('\n').length > 10) ? 0.8 : 0.5;
        const confidenceScore = metrics.finalConfidence;
        
        return {
            overall: (lengthScore + structureScore + confidenceScore) / 3,
            components: { lengthScore, structureScore, confidenceScore }
        };
    }
}

module.exports = UnifiedResponseBuilder;
