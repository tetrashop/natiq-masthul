const CoreKnowledgeGraph = require('./knowledge-graph/core-knowledge');
const MultiAlgorithmProcessor = require('./reasoning-engine/multi-algorithm-processor');
const EnhancedResponseBuilder = require('./response-generator/enhanced-response-builder');
const PerformanceMonitor = require('./monitoring/performance-monitor');

class NatiqMasthulFinalSystem {
    constructor() {
        this.knowledgeGraph = new CoreKnowledgeGraph();
        this.processor = new MultiAlgorithmProcessor();
        this.responseBuilder = new EnhancedResponseBuilder();
        this.performanceMonitor = new PerformanceMonitor();
        this.questionCount = 0;
        this.systemVersion = "1.0.0";
    }

    async processQuestion(question) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`🧠 سیستم نطق مصطلح v${this.systemVersion} - سوال ${++this.questionCount}`);
        console.log(`${'='.repeat(80)}`);
        console.log(`📝 سوال: ${question}`);
        console.log(`${'-'.repeat(80)}`);

        const startTime = Date.now();
        
        try {
            // استخراج الگوها از سوال
            const questionPatterns = this.extractQuestionPatterns(question);
            
            // فعال‌سازی گراف دانش
            const activeNodes = this.knowledgeGraph.activateNodes(questionPatterns);
            
            // پردازش چندالگوریتمی
            const analysisResults = await this.processor.processQuestion(question, activeNodes);
            
            // تولید پاسخ پیشرفته
            const response = this.responseBuilder.buildComprehensiveResponse(
                question, 
                analysisResults, 
                activeNodes
            );

            const processingTime = Date.now() - startTime;

            // ثبت عملکرد
            this.performanceMonitor.recordQuestion(
                question,
                analysisResults.finalConfidence,
                activeNodes.length
            );

            // نمایش خلاصه عملکرد
            this.displayPerformanceSummary(analysisResults, activeNodes, processingTime);

            return {
                question,
                response,
                analysisResults,
                performance: this.performanceMonitor.getPerformanceSummary(),
                metadata: {
                    activeDomains: activeNodes.map(n => n.id),
                    algorithmsUsed: analysisResults.results.map(r => r.algorithm),
                    processingTime: processingTime,
                    systemVersion: this.systemVersion
                }
            };

        } catch (error) {
            console.error('❌ خطا در پردازش سوال:', error);
            return this.generateErrorResponse(question, error);
        }
    }

    displayPerformanceSummary(analysisResults, activeNodes, processingTime) {
        console.log(`\n📊 خلاصه عملکرد:`);
        console.log(`⏱️  زمان پردازش: ${processingTime}ms`);
        console.log(`🎯 اعتماد نهایی: ${(analysisResults.finalConfidence * 100).toFixed(1)}%`);
        console.log(`🔗 حوزه‌های فعال: ${activeNodes.map(n => n.id).join(', ')}`);
        console.log(`🧠 الگوریتم‌ها: ${analysisResults.results.map(r => r.algorithm).join(', ')}`);
        console.log(`${'-'.repeat(80)}`);
    }

    extractQuestionPatterns(question) {
        const patterns = [];
        const words = question.toLowerCase().split(/\s+/);
        
        const keyPatterns = [
            'بازگرداندن', 'مشتری', 'ناراضی', 'جذب', 'مجدد', 'حریص',
            'روانشناسی', 'استراتژی', 'ارتباط', 'ارزش', 'سرمایه',
            'نرم‌افزار', 'برنامه', 'اپلیکیشن', 'سیستم', 'کنار گذاشته',
            'ترک کرده', 'لغو اشتراک', 'عودت', 'بازگشت', 'سود', 'منفعت',
            'کسب‌وکار', 'ارزش مالی', 'سرمایه‌گذاری', 'راهکار', 'عملی',
            'مدیریت', 'فروش', 'بازاریابی', 'توسعه', 'پروژه'
        ];

        keyPatterns.forEach(pattern => {
            if (question.includes(pattern)) {
                patterns.push(pattern);
            }
        });

        patterns.push(...words.filter(word => 
            word.length > 2 && 
            !['های', 'ترین', 'ها', 'چه', 'که', 'را', 'برای', 'آنها'].includes(word)
        ));

        return [...new Set(patterns)];
    }

    generateErrorResponse(question, error) {
        return {
            question,
            response: `❌ خطا در پردازش سوال: ${error.message}\n\nلطفاً سوال خود را به صورت واضح‌تر مطرح کنید.`,
            analysisResults: null,
            performance: this.performanceMonitor.getPerformanceSummary(),
            metadata: {
                error: error.message,
                systemVersion: this.systemVersion
            }
        };
    }

    getSystemStatus() {
        return this.performanceMonitor.getSystemStatus();
    }

    getDetailedStatistics() {
        const performance = this.performanceMonitor.getPerformanceSummary();
        return {
            system: {
                version: this.systemVersion,
                uptime: this.performanceMonitor.getSystemUptime(),
                totalQuestions: performance.totalQuestionsProcessed,
                health: performance.systemHealth
            },
            knowledgeGraph: {
                totalNodes: this.knowledgeGraph.nodes.size,
                totalEdges: this.knowledgeGraph.edges.size
            },
            algorithms: {
                total: this.processor.algorithms.size,
                list: Array.from(this.processor.algorithms.keys())
            }
        };
    }

    // متد برای ذخیره وضعیت سیستم
    exportSystemState() {
        const state = {
            timestamp: Date.now(),
            version: this.systemVersion,
            performance: this.performanceMonitor.getPerformanceSummary(),
            statistics: this.getDetailedStatistics(),
            questionCount: this.questionCount
        };
        
        return JSON.stringify(state, null, 2);
    }
}

// تست سیستم نهایی
async function testFinalSystem() {
    const system = new NatiqMasthulFinalSystem();
    
    const testQuestions = [
        "چگونه مشتری حریصی که نرم‌افزار ما را کنار گذاشته بازگردانیم؟",
        "استراتژی بازگشت سرمایه برای جذب مجدد مشتریان ناراضی چیست؟",
        "روانشناسی مشتری حریص و راهکارهای عملی برای بازگرداندن آنها",
        "چگونه با ارتباط مؤثر مشتریان از دست رفته را بازگردانیم؟",
        "ارزش‌آفرینی برای مشتریان ناراضی در کسب‌وکار نرم‌افزاری چگونه است؟"
    ];

    console.log('🚀 سیستم نطق مصطلح - نسخه نهایی');
    console.log('📊 تست جامع عملکرد\n');

    const results = [];

    for (let i = 0; i < testQuestions.length; i++) {
        const question = testQuestions[i];
        console.log(`\n${'🔷'.repeat(20)}`);
        console.log(`سوال ${i + 1}/${testQuestions.length}`);
        
        const result = await system.processQuestion(question);
        results.push(result);
        
        console.log('\n💬 پاسخ سیستم:');
        console.log(result.response);
        
        if (i < testQuestions.length - 1) {
            console.log('\n⏳ آماده‌سازی برای سوال بعدی...');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // نمایش آمار نهایی
    console.log(`\n${'🎯'.repeat(30)}`);
    console.log('نتایج نهایی تست سیستم');
    console.log(`${'🎯'.repeat(30)}\n`);

    const avgConfidence = results.reduce((sum, r) => sum + (r.analysisResults?.finalConfidence || 0), 0) / results.length;
    
    console.log(`📈 میانگین اعتماد سیستم: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`📊 تعداد سوالات پردازش شده: ${results.length}`);
    console.log(`🕒 زمان فعالیت سیستم: ${system.performanceMonitor.getSystemUptime()}ms`);
    
    const status = system.getSystemStatus();
    console.log(`🏥 وضعیت سلامت: ${status.health.status}`);
    console.log(`⭐ امتیاز سیستم: ${(status.health.score * 100).toFixed(1)}%`);

    // نمایش آمار تفصیلی
    const detailedStats = system.getDetailedStatistics();
    console.log('\n📋 آمار تفصیلی سیستم:');
    console.log(JSON.stringify(detailedStats, null, 2));

    return { system, results };
}

// اجرای تست
if (require.main === module) {
    testFinalSystem().catch(console.error);
}

module.exports = NatiqMasthulFinalSystem;
