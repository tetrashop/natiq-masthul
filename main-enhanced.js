const CoreKnowledgeGraph = require('./knowledge-graph/core-knowledge');
const MultiAlgorithmProcessor = require('./reasoning-engine/multi-algorithm-processor');
const EnhancedResponseBuilder = require('./response-generator/enhanced-response-builder');
const PerformanceMonitor = require('./monitoring/performance-monitor');

class NatiqMasthulEnhancedSystem {
    constructor() {
        this.knowledgeGraph = new CoreKnowledgeGraph();
        this.processor = new MultiAlgorithmProcessor();
        this.responseBuilder = new EnhancedResponseBuilder();
        this.performanceMonitor = new PerformanceMonitor();
        this.questionCount = 0;
    }

    async processQuestion(question) {
        console.log(`\n${'='.repeat(70)}`);
        console.log(`🧠 سوال ${++this.questionCount}: ${question}`);
        console.log(`${'='.repeat(70)}`);

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

        // ثبت عملکرد
        this.performanceMonitor.recordQuestion(
            question,
            analysisResults.finalConfidence,
            activeNodes.length
        );

        return {
            question,
            response,
            analysisResults,
            performance: this.performanceMonitor.getPerformanceSummary(),
            metadata: {
                activeDomains: activeNodes.map(n => n.id),
                algorithmsUsed: analysisResults.results.map(r => r.algorithm),
                processingTime: Date.now()
            }
        };
    }

    extractQuestionPatterns(question) {
        const patterns = [];
        const words = question.toLowerCase().split(/\s+/);
        
        const keyPatterns = [
            'بازگرداندن', 'مشتری', 'ناراضی', 'جذب', 'مجدد', 'حریص',
            'روانشناسی', 'استراتژی', 'ارتباط', 'ارزش', 'سرمایه',
            'نرم‌افزار', 'برنامه', 'اپلیکیشن', 'سیستم', 'کنار گذاشته',
            'ترک کرده', 'لغو اشتراک', 'عودت', 'بازگشت', 'سود', 'منفعت',
            'کسب‌وکار', 'ارزش مالی', 'سرمایه‌گذاری', 'راهکار', 'عملی'
        ];

        keyPatterns.forEach(pattern => {
            if (question.includes(pattern)) {
                patterns.push(pattern);
            }
        });

        patterns.push(...words.filter(word => 
            word.length > 2 && 
            !['های', 'ترین', 'ها', 'چه', 'که', 'را', 'برای'].includes(word)
        ));

        return [...new Set(patterns)];
    }

    getSystemStatus() {
        return this.performanceMonitor.getSystemStatus();
    }
}

// تست سیستم پیشرفته
async function testEnhancedSystem() {
    const system = new NatiqMasthulEnhancedSystem();
    
    const testQuestions = [
        "چگونه مشتری حریصی که نرم‌افزار ما را کنار گذاشته بازگردانیم؟",
        "استراتژی بازگشت سرمایه برای جذب مجدد مشتریان ناراضی چیست؟",
        "روانشناسی مشتری حریص و راهکارهای عملی برای بازگرداندن آنها"
    ];

    console.log('🚀 تست سیستم نطق مصطلح - نسخه پیشرفته\n');

    for (const question of testQuestions) {
        try {
            const result = await system.processQuestion(question);
            console.log('\n💬 پاسخ پیشرفته:');
            console.log(result.response);
            console.log('\n📊 آمار عملکرد:');
            console.log(`• اعتماد سیستم: ${(result.performance.overallAverageConfidence * 100).toFixed(1)}%`);
            console.log(`• وضعیت سلامت: ${result.performance.systemHealth.status}`);
            console.log(`• حوزه‌های فعال: ${result.metadata.activeDomains.join(', ')}`);
            console.log('\n' + '─'.repeat(70) + '\n');
        } catch (error) {
            console.error('❌ خطا در پردازش سوال:', error);
        }
    }

    const status = system.getSystemStatus();
    console.log('🎯 وضعیت نهایی سیستم:');
    console.log(JSON.stringify(status, null, 2));
}

// اجرای تست
if (require.main === module) {
    testEnhancedSystem().catch(console.error);
}

module.exports = NatiqMasthulEnhancedSystem;
