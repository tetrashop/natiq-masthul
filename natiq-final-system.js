/**
 * سیستم نهایی نطق مصطلح با تمام بهبودها
 */

const EnhancedKnowledgeCore = require('./knowledge-server/enhanced-knowledge-core');
const NeuralSearchEngine = require('./deep-search/neural-search-engine');
const ServerKnowledgeIntegration = require('./knowledge-server/server-integration');
const KnowledgeManager = require('./knowledge-server/knowledge-manager');

class NatiqFinalSystem {
    constructor() {
        console.log('🚀 راه‌اندازی سیستم نهایی نطق مصطلح');
        
        this.knowledgeCore = new EnhancedKnowledgeCore();
        this.searchEngine = new NeuralSearchEngine(this.knowledgeCore);
        this.serverIntegration = new ServerKnowledgeIntegration(this.knowledgeCore);
        this.knowledgeManager = new KnowledgeManager(this.knowledgeCore);
        
        this.systemReady = false;
        this.performanceStats = {
            totalQuestions: 0,
            successfulAnswers: 0,
            averageConfidence: 0,
            learningRate: 0
        };
    }

    async initialize() {
        console.log('🧠 راه‌اندازی سیستم هوش مصنوعی...');
        
        try {
            await this.searchEngine.trainOnInteractionHistory();
            const serverConnected = await this.serverIntegration.initializeServerConnection('your-api-key-here');
            
            // توسعه خودکار دانش
            const expansionResult = this.knowledgeManager.analyzeAndExpandKnowledge();
            if (expansionResult.domainsCreated > 0) {
                console.log(`✅ توسعه دانش: ${expansionResult.domainsCreated} حوزه جدید ایجاد شد`);
            }
            
            this.systemReady = true;
            console.log(`✅ سیستم نهایی آماده است! ${serverConnected ? 'حالت آنلاین' : 'حالت آفلاین'}`);
            
            // نمایش گزارش سلامت
            this.showSystemHealth();
            
            return true;
        } catch (error) {
            console.error('❌ خطا در راه‌اندازی سیستم:', error.message);
            return false;
        }
    }

    async processQuestion(question) {
        if (!this.systemReady) {
            throw new Error('لطفاً اول سیستم را با ()initialize. راه‌اندازی کنید');
        }

        this.performanceStats.totalQuestions++;
        console.log(`\n🤔 سوال ${this.performanceStats.totalQuestions}: "${question}"`);
        
        const startTime = Date.now();
        
        try {
            // جستجوی هوشمند
            const intelligentResults = await this.knowledgeManager.intelligentSearch(question, {
                maxDomains: 5,
                useSemantic: true
            });
            
            // جستجوی ترکیبی
            const hybridResults = await this.serverIntegration.hybridSearch(question);
            
            // تولید پاسخ
            const enhancedResponse = this.generateResponse(question, intelligentResults, hybridResults);
            
            // یادگیری از تعامل
            const learningRecord = this.knowledgeCore.learnFromInteraction(
                question, 
                enhancedResponse, 
                this.calculateResponseConfidence(intelligentResults.results),
                intelligentResults.domainsSearched
            );

            // به‌روزرسانی مدل عصبی
            this.searchEngine.updateNeuralWeights({
                domainsUsed: learningRecord.domainsUsed,
                confidence: learningRecord.confidence
            });

            // به‌روزرسانی آمار عملکرد
            this.updatePerformanceStats(learningRecord.confidence);
            
            const processingTime = Date.now() - startTime;
            
            return {
                question,
                response: enhancedResponse,
                processingTime: `${processingTime}ms`,
                searchResults: {
                    intelligent: intelligentResults,
                    hybrid: hybridResults
                },
                learning: learningRecord,
                systemStats: this.getSystemStats()
            };
            
        } catch (error) {
            console.error(`❌ خطا در پردازش سوال: ${error.message}`);
            this.performanceStats.totalQuestions--;
            throw error;
        }
    }

    generateResponse(question, intelligentResults, hybridResults) {
        const relevantConcepts = intelligentResults.results.slice(0, 5);
        
        if (relevantConcepts.length === 0) {
            return `🔍 سوال شما در حوزه‌های دانش فعلی من یافت نشد. 
در حال یادگیری از این سوال جدید هستم...

💡 سیستم در حال توسعه دانش خود است. لطفاً سوال خود را با جزییات بیشتری مطرح کنید.`;
        }

        let response = `🎯 پاسخ هوشمند بر اساس ${relevantConcepts.length} مفهوم از ${intelligentResults.domainsSearched.length} حوزه:\n\n`;
        
        relevantConcepts.forEach((concept, index) => {
            const domainName = this.getDomainName(concept.domain);
            response += `${index + 1}. **${concept.concept}** (${domainName}) - اعتماد: ${(concept.relevance * 100).toFixed(1)}%\n`;
        });

        if (hybridResults.serverResults.length > 0) {
            response += `\n🌐 **دانش ابری:** ${hybridResults.serverResults.length} مفهوم جدید`;
        }

        const stats = this.knowledgeCore.getLearningStats();
        response += `\n\n💡 سیستم از ${stats.totalConcepts} مفهوم در ${stats.totalDomains} حوزه تخصصی استفاده می‌کند.`;

        return response;
    }

    getDomainName(domainId) {
        const domain = this.knowledgeCore.domains.get(domainId);
        return domain ? domain.name : domainId;
    }

    calculateResponseConfidence(searchResults) {
        if (searchResults.length === 0) return 0.3;
        
        const topResultRelevance = searchResults[0]?.relevance || 0;
        const averageRelevance = searchResults.reduce((sum, r) => sum + r.relevance, 0) / searchResults.length;
        
        let confidence = (topResultRelevance * 0.7) + (averageRelevance * 0.3);
        
        // افزایش اعتماد بر اساس تعداد نتایج
        if (searchResults.length >= 3) confidence += 0.1;
        if (searchResults.length >= 5) confidence += 0.05;
        
        return Math.min(0.95, confidence);
    }

    updatePerformanceStats(confidence) {
        this.performanceStats.successfulAnswers++;
        this.performanceStats.averageConfidence = 
            (this.performanceStats.averageConfidence * (this.performanceStats.successfulAnswers - 1) + confidence) / 
            this.performanceStats.successfulAnswers;
        
        this.performanceStats.learningRate = this.knowledgeCore.getLearningStats().learningRate;
    }

    getSystemStats() {
        const knowledgeStats = this.knowledgeCore.getLearningStats();
        const modelStats = this.searchEngine.getModelPerformance();
        const serverStats = this.serverIntegration.getSystemStats();
        const managerReport = this.knowledgeManager.getComprehensiveReport();

        return {
            performance: this.performanceStats,
            knowledge: knowledgeStats,
            neuralModel: modelStats,
            server: serverStats,
            knowledgeManager: managerReport,
            overallHealth: this.calculateSystemHealth(knowledgeStats, modelStats, managerReport)
        };
    }

    calculateSystemHealth(knowledgeStats, modelStats, managerReport) {
        const learningHealth = knowledgeStats.learningRate * 100;
        const modelHealth = modelStats.averageWeight * 100;
        const connectionHealth = Math.min(modelStats.modelDensity * 100, 100);
        const efficiencyHealth = managerReport.learningEfficiency;
        
        const overallHealth = (learningHealth * 0.3) + (modelHealth * 0.3) + 
                            (connectionHealth * 0.2) + (efficiencyHealth * 0.2);
        
        return {
            score: Math.min(overallHealth, 100),
            status: overallHealth >= 80 ? 'عالی' : overallHealth >= 60 ? 'خوب' : 
                   overallHealth >= 40 ? 'متوسط' : 'نیاز به توجه',
            components: {
                learning: learningHealth,
                model: modelHealth,
                connections: connectionHealth,
                efficiency: efficiencyHealth
            }
        };
    }

    showSystemHealth() {
        const stats = this.getSystemStats();
        console.log('\n📊 سلامت سیستم:');
        console.log(`🏆 امتیاز کلی: ${stats.overallHealth.score.toFixed(1)}% - وضعیت: ${stats.overallHealth.status}`);
        console.log(`📚 حوزه‌های دانش: ${stats.knowledge.totalDomains}`);
        console.log(`🎯 مفاهیم: ${stats.knowledge.totalConcepts}`);
        console.log(`🧠 نرخ یادگیری: ${(stats.knowledge.learningRate * 100).toFixed(1)}%`);
        console.log(`🌐 وضعیت سرور: ${stats.server.syncStatus}`);
    }

    // ابزارهای مدیریتی
    async manualLearn(concept, domain, description = '') {
        if (!this.knowledgeCore.domains.has(domain)) {
            this.knowledgeCore.addDomain(domain, {
                name: domain,
                concepts: [],
                principles: description ? [description] : []
            });
        }

        const domainData = this.knowledgeCore.domains.get(domain);
        if (!domainData.concepts.includes(concept)) {
            domainData.concepts.push(concept);
            console.log(`✅ مفهوم "${concept}" به حوزه "${domain}" افزوده شد`);
        }

        await this.serverIntegration.syncWithServer();
        return true;
    }

    createNewDomain(domainId, domainName, initialConcepts = []) {
        this.knowledgeCore.addDomain(domainId, {
            name: domainName,
            concepts: initialConcepts,
            confidence: 0.7
        });
        
        console.log(`✅ حوزه جدید "${domainName}" ایجاد شد`);
        return true;
    }

    getPerformanceReport() {
        return {
            ...this.performanceStats,
            successRate: this.performanceStats.totalQuestions > 0 ? 
                (this.performanceStats.successfulAnswers / this.performanceStats.totalQuestions * 100).toFixed(1) + '%' : '0%'
        };
    }
}

// تست سیستم نهایی
async function testFinalSystem() {
    const system = new NatiqFinalSystem();
    const initialized = await system.initialize();
    
    if (!initialized) {
        console.log('❌ سیستم راه‌اندازی نشد');
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testQuestions = [
        "بهینه‌سازی الگوریتم برای کاهش مصرف حافظه",
        "شبکه عصبی برای پردازش زبان طبیعی چگونه کار می‌کند؟",
        "یادگیری عمیق در هوش مصنوعی چیست؟",
        "روانشناسی مشتریان برای بازگشت به سرویس",
        "مدل transformer در پردازش زبان طبیعی چه مزایایی دارد؟"
    ];

    console.log('\n🧪 تست سیستم نهایی هوش مصنوعی\n');

    for (const question of testQuestions) {
        try {
            const result = await system.processQuestion(question);
            
            console.log(`\n📝 سوال: ${question}`);
            console.log(`⏱️  زمان پردازش: ${result.processingTime}`);
            console.log(`💬 پاسخ: ${result.response.substring(0, 120)}...`);
            console.log(`📊 حوزه‌های جستجو شده: ${result.searchResults.intelligent.domainsSearched.join(', ')}`);
            console.log(`🎯 اعتماد سیستم: ${(result.learning.confidence * 100).toFixed(1)}%`);
            console.log('─'.repeat(70));
            
            // مکث کوتاه بین سوالات
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`❌ خطا در پردازش: ${error.message}`);
        }
    }

    // نمایش آمار نهایی
    console.log('\n📈 گزارش نهایی عملکرد:');
    const finalStats = system.getSystemStats();
    console.log(JSON.stringify(finalStats, null, 2));

    // آموزش مفاهیم پیشرفته
    console.log('\n🔧 آموزش مفاهیم پیشرفته...');
    await system.manualLearn('attention mechanism', 'neural_networks', 'مکانیزم توجه در مدل‌های transformer');
    await system.manualLearn('transfer learning', 'neural_networks', 'یادگیری انتقالی در شبکه‌های عصبی');
    await system.createNewDomain('nlp_advanced', 'پردازش زبان طبیعی پیشرفته', [
        'transformer', 'attention', 'bert', 'gpt', 'tokenization'
    ]);

    console.log('\n✅ تست سیستم نهایی با موفقیت کامل شد');
}

// اجرای تست
if (require.main === module) {
    testFinalSystem().catch(console.error);
}

module.exports = NatiqFinalSystem;
