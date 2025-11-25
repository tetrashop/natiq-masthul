/**
 * تولیدکننده پیشرفته پاسخ‌های محتوایی - نسخه نطق مصطلح
 */

class EnhancedResponseBuilder {
    constructor() {
        this.templates = new Map();
        this.domainStrategies = new Map();
        this.initTemplates();
    }

    initTemplates() {
        // قالب‌های پاسخ برای حوزه‌های مختلف
        this.domainStrategies.set('customer_recovery', {
            name: 'استراتژی بازگرداندن مشتری',
            structure: [
                'تحلیل روانشناختی مشتری',
                'ارزش‌آفرینی مستقیم',
                'برنامه ارتباطی مؤثر',
                'معیارهای سنجش موفقیت'
            ],
            principles: [
                'مشتری حریص با ارزش محسوس بازمی‌گردد',
                'شفافیت کامل اعتماد می‌سازد',
                'ارتباط مستقیم مدیریتی تأثیرگذار است'
            ]
        });

        this.domainStrategies.set('psychology', {
            name: 'روانشناسی مشتری',
            structure: [
                'درک انگیزه‌های اصلی',
                'تحلیل رفتار گذشته',
                'شناسایی نقاط درد',
                'ارائه راه‌حل احساسی'
            ]
        });

        this.domainStrategies.set('business_strategy', {
            name: 'استراتژی کسب‌وکار',
            structure: [
                'تحلیل بازگشت سرمایه',
                'ارزش مالی ملموس',
                'برنامه اجرایی',
                'سنجش نتایج'
            ]
        });

        this.domainStrategies.set('software_business', {
            name: 'کسب‌وکار نرم‌افزاری',
            structure: [
                'بهبود تجربه کاربری',
                'ارزش‌های فنی ملموس',
                'پشتیبانی استثنایی',
                'بروزرسانی مستمر'
            ]
        });

        this.domainStrategies.set('communication', {
            name: 'ارتباط مؤثر',
            structure: [
                'برنامه ارتباطی شخصی‌شده',
                'کانال‌های ارتباطی چندگانه',
                'زمان‌بندی هوشمند',
                'پیگیری مستمر'
            ]
        });

        this.domainStrategies.set('value_proposition', {
            name: 'ارزش‌آفرینی',
            structure: [
                'شناسایی نیازهای اصلی',
                'ارائه راه‌حل ملموس',
                'مزیت رقابتی مشخص',
                'سنجش ارزش ارائه شده'
            ]
        });
    }

    buildComprehensiveResponse(question, analysisResults, activeNodes) {
        console.log('🏗️ ساخت پاسخ جامع...');
        
        const response = {
            header: this.generateHeader(question),
            analysis: this.generateAnalysisSection(analysisResults),
            strategicPlan: this.generateStrategicPlan(activeNodes),
            actionableSteps: this.generateActionableSteps(activeNodes),
            metrics: this.generateSuccessMetrics(activeNodes),
            conclusion: this.generateConclusion(analysisResults.finalConfidence)
        };

        return this.formatResponse(response);
    }

    generateHeader(question) {
        return `🧠 **پاسخ تخصصی سیستم نطق مصطلح به سوال: "${question}"**`;
    }

    generateAnalysisSection(analysisResults) {
        const sections = [];
        
        sections.push('## 🔍 تحلیل عمیق سوال');
        sections.push('سیستم با استفاده از الگوریتم‌های پیشرفته، سوال شما را به صورت چندلایه تحلیل کرده است:');
        
        analysisResults.results.forEach(result => {
            sections.push(`\n### ${this.getAlgorithmName(result.algorithm)}`);
            sections.push(`• **اعتماد تحلیل**: ${(result.confidence * 100).toFixed(1)}%`);
            
            if (result.matchedDomains) {
                sections.push(`• **حوزه‌های مرتبط**: ${result.matchedDomains.join('، ')}`);
            }
            
            if (result.inferenceChain && result.inferenceChain.length > 0) {
                sections.push(`• **استنتاج‌های منطقی**: ${result.inferenceChain.length} مورد`);
            }
        });

        return sections.join('\n');
    }

    generateStrategicPlan(activeNodes) {
        const sections = ['\n## 🎯 برنامه استراتژیک یکپارچه'];
        
        activeNodes.forEach(node => {
            const strategy = this.domainStrategies.get(node.id);
            if (strategy) {
                sections.push(`\n### ${strategy.name} (فعالیت: ${(node.activation * 100).toFixed(1)}%)`);
                
                if (node.principles) {
                    sections.push('**اصول پایه:**');
                    node.principles.slice(0, 3).forEach(principle => {
                        sections.push(`• ${principle}`);
                    });
                }
                
                sections.push('**مراحل اجرایی:**');
                strategy.structure.forEach((step, index) => {
                    sections.push(`${index + 1}. ${step}`);
                });
            }
        });

        return sections.join('\n');
    }

    generateActionableSteps(activeNodes) {
        const steps = ['\n## 📋 راهکارهای عملی فوری'];
        let stepNumber = 1;

        // راهکارهای مبتنی بر حوزه‌های فعال
        activeNodes.forEach(node => {
            const actionable = this.getDomainActions(node.id);
            actionable.forEach(action => {
                steps.push(`${stepNumber}. ${action}`);
                stepNumber++;
            });
        });

        return steps.join('\n');
    }

    generateSuccessMetrics(activeNodes) {
        const metrics = ['\n## 📊 معیارهای سنجش موفقیت'];
        
        metrics.push('### شاخص‌های کلیدی عملکرد:');
        metrics.push('• **نرخ بازگشت مشتری**: هدف 30-40% در ۳ ماه اول');
        metrics.push('• **رضایت مشتری**: هدف 80%+ در نظرسنجی‌ها');
        metrics.push('• **بازگشت سرمایه**: محاسبه ROI در ۶ ماه');
        
        if (activeNodes.some(node => node.id === 'software_business')) {
            metrics.push('\n### معیارهای تخصصی نرم‌افزار:');
            metrics.push('• **کاهش نرخ لغو اشتراک**: هدف 25% کاهش');
            metrics.push('• **افزایش استفاده از ویژگی‌ها**: هدف 40% بهبود');
            metrics.push('• **رضایت کاربران فعال**: هدف 85%+');
        }

        return metrics.join('\n');
    }

    generateConclusion(confidence) {
        return `\n## 💫 جمع‌بندی نهایی\n**اعتماد سیستم به این پاسخ: ${(confidence * 100).toFixed(1)}%**\n\nاین تحلیل با ترکیب هوشمندانه‌ای از الگوریتم‌های پیشرفته تولید شده و می‌تواند به عنوان نقشه راه جامع مورد استفاده قرار گیرد.`;
    }

    getDomainActions(domainId) {
        const actions = {
            'customer_recovery': [
                'تماس مستقیم مدیریت ارشد با مشتریان کلیدی',
                'ارزش پیشنهادی ویژه و محدود به زمان',
                'برنامه وفاداری با پاداش‌های ملموس',
                'نظارت مستمر بر رضایت و واکنش سریع'
            ],
            'psychology': [
                'تحلیل انگیزه‌های اصلی ترک مشتری',
                'شناسایی نقاط درد احساسی و منطقی',
                'طراحی کمپین بر اساس روانشناسی رفتاری',
                'ایجاد حس تعلق و ارزش‌گذاری'
            ],
            'business_strategy': [
                'محاسبه دقیق ارزش عمر مشتری (LTV)',
                'تحلیل هزینه-فایده بازگرداندن هر مشتری',
                'تعیین بودجه و منابع اختصاصی',
                'برنامه ریزی برای بازگشت سرمایه ۳-۶ ماهه'
            ],
            'software_business': [
                'ارائه آپگرید رایگان برای مدت محدود',
                'دسترسی به ویژگی‌های پریمیوم آزمایشی',
                'برنامه بهبود مستمر بر اساس فیدبک کاربران',
                'پشتیبانی اختصاصی برای کاربران بازگشته'
            ],
            'communication': [
                'پیام‌رسانی شخصی‌شده و مرتبط',
                'کانال‌های ارتباطی چندگانه و یکپارچه',
                'زمان‌بندی هوشمند برای تماس‌ها',
                'محتواهای آموزشی و ارزش‌آفرین'
            ],
            'value_proposition': [
                'برجسته‌سازی مزایای مستقیم و ملموس',
                'مقایسه ارزش فعلی با جایگزین‌ها',
                'ارائه گواهی‌های موفقیت مشتریان مشابه',
                'تضمین نتایج قابل اندازه‌گیری'
            ]
        };

        return actions[domainId] || ['تمرکز بر ارزش‌آفرینی مستقیم و ملموس'];
    }

    getAlgorithmName(algoId) {
        const names = {
            'pattern_analysis': 'تحلیل الگوی سوال',
            'logical_inference': 'استنتاج منطقی',
            'knowledge_fusion': 'ترکیب دانش',
            'response_optimization': 'بهینه‌سازی پاسخ'
        };
        return names[algoId] || algoId;
    }

    formatResponse(response) {
        const sections = [
            response.header,
            response.analysis,
            response.strategicPlan,
            response.actionableSteps,
            response.metrics,
            response.conclusion
        ];

        return sections.join('\n\n');
    }
}

module.exports = EnhancedResponseBuilder;
