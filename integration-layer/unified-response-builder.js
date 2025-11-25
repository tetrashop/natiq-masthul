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
    }

    buildUnifiedResponse(question, algorithmResults, activeNodes, finalMetrics) {
        const selectedTemplate = this.templates.get('strategy_question');
        
        const responseComponents = this.generateResponseComponents(
            algorithmResults, 
            activeNodes, 
            selectedTemplate
        );

        const unifiedResponse = this.integrateComponents(
            responseComponents, 
            finalMetrics
        );

        return {
            response: unifiedResponse,
            metadata: {
                templateUsed: selectedTemplate.name,
                componentCount: responseComponents.length,
                integrationStrength: this.calculateIntegrationStrength(responseComponents)
            }
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
                weight: patternAnalysis.confidence
            });
        }

        // کامپوننت بر اساس استنتاج منطقی
        const logicalInference = algorithmResults.find(r => r.algorithm === 'logical_inference');
        if (logicalInference) {
            components.push({
                type: 'logical_framework',
                content: this.buildLogicalFramework(logicalInference),
                weight: logicalInference.confidence
            });
        }

        return components.sort((a, b) => b.weight - a.weight);
    }

    integrateComponents(components, metrics) {
        let integratedResponse = "🧠 **پاسخ یکپارچه سیستم نطق مصطلح**\n\n";
        
        integratedResponse += "🔍 **تحلیل یکپارچه سوال:**\n";
        integratedResponse += "سیستم با استفاده از الگوریتم‌های پیشرفته، سوال شما را تحلیل کرده و پاسخ زیر را تولید می‌کند.\n\n";

        // افزودن کامپوننت‌ها
        components.forEach(component => {
            if (component.weight > 0.5) {
                integratedResponse += `${component.content}\n\n`;
            }
        });

        integratedResponse += this.buildIntegrationSummary(components, metrics);

        return integratedResponse;
    }

    buildDomainAnalysis(patternAnalysis, activeNodes) {
        let analysis = `📊 **تحلیل حوزه‌های دانش:**\n`;
        
        activeNodes.forEach(node => {
            analysis += `• ${node.id} (فعالیت: ${(node.activation * 100).toFixed(1)}%)\n`;
        });

        analysis += `\n**الگوهای تشخیص داده شده:** ${patternAnalysis.patternsFound.join(', ')}\n`;
        analysis += `**دقت تحلیل الگو:** ${(patternAnalysis.confidence * 100).toFixed(1)}%`;

        return analysis;
    }

    buildLogicalFramework(logicalInference) {
        let framework = `🔍 **زنجیره استنتاج منطقی:**\n`;
        
        logicalInference.inferenceChain.forEach(chain => {
            framework += `\n**${chain.node}:**\n`;
            chain.application.forEach(app => {
                if (app.relevance > 0.3) {
                    framework += `✓ ${app.application}\n`;
                }
            });
        });

        return framework;
    }

    buildIntegrationSummary(components, metrics) {
        let summary = "🎯 **خلاصه یکپارچه‌سازی:**\n";
        
        summary += `**اعتماد کلی سیستم:** ${(metrics.finalConfidence * 100).toFixed(1)}%\n`;
        summary += `**تعداد کامپوننت‌ها:** ${components.length}\n\n`;
        
        summary += "💫 **این پاسخ با ترکیب هوشمندانه‌ای از الگوریتم‌های مختلف تولید شده است.**";

        return summary;
    }

    calculateIntegrationStrength(components) {
        if (components.length === 0) return 0;
        
        const totalWeight = components.reduce((sum, comp) => sum + comp.weight, 0);
        return totalWeight / components.length;
    }
}

module.exports = UnifiedResponseBuilder;
