/**
 * نطق مصطلح - نسخه ۲ با قابلیت‌های پیشرفته‌تر
 */

const KnowledgeCore = require('./knowledge-server/knowledge-core');
const NeuralSearchEngine = require('./deep-search/neural-search-engine');
const ServerKnowledgeIntegration = require('./knowledge-server/server-integration');
const KnowledgeManager = require('./knowledge-server/knowledge-manager');

class NatiqAIEnhanced {
    constructor() {
        console.log('🚀 راه‌اندازی نطق مصطلح - نسخه پیشرفته');
        
        this.knowledgeCore = new KnowledgeCore();
        this.searchEngine = new NeuralSearchEngine(this.knowledgeCore);
        this.serverIntegration = new ServerKnowledgeIntegration(this.knowledgeCore);
        this.knowledgeManager = new KnowledgeManager(this.knowledgeCore);
        
        this.systemReady = false;
        this.initSystem();
    }

    async initSystem() {
        console.log('🧠 راه‌اندازی سیستم هوش مصنوعی...');
        
        await this.searchEngine.trainOnInteractionHistory();
        const serverConnected = await this.serverIntegration.initializeServerConnection('your-api-key-here');
        
        // تحلیل و توسعه خودکار دانش
        const expansionResult = this.knowledgeManager.analyzeAndExpandKnowledge();
        console.log(`✅ توسعه دانش: ${expansionResult.domainsCreated} حوزه جدید`);
        
        this.systemReady = true;
        console.log(`✅ سیستم آماده است! ${serverConnected ? 'حالت آنلاین' : 'حالت آفلاین'}`);
        
        // نمایش گزارش اولیه
        const report = this.knowledgeManager.getComprehensiveReport();
        console.log('📊 گزارش سیستم:', JSON.stringify(report, null, 2));
    }

    async processEnhancedQuestion(question) {
        if (!this.systemReady) {
            throw new Error('سیستم در حال راه‌اندازی است...');
        }

        console.log(`\n🤔 سوال پردازش پیشرفته: "${question}"`);
        
        // استفاده از جستجوی هوشمند
        const intelligentResults = await this.knowledgeManager.intelligentSearch(question, {
            maxDomains: 5,
            useSemantic: true
        });
        
        const hybridResults = await this.serverIntegration.hybridSearch(question);
        const enhancedResponse = this.generateEnhancedResponse(question, intelligentResults, hybridResults);
        
        const learningRecord = this.knowledgeCore.learnFromInteraction(
            question, 
            enhancedResponse, 
            this.calculateResponseConfidence(intelligentResults.results),
            intelligentResults.domainsSearched
        );

        this.searchEngine.updateNeuralWeights({
            domainsUsed: learningRecord.domainsUsed,
            confidence: learningRecord.confidence
        });

        return {
            question,
            response: enhancedResponse,
            searchResults: {
                intelligent: intelligentResults,
                hybrid: hybridResults
            },
            learning: learningRecord,
            systemStats: this.getSystemStats()
        };
    }

    generateEnhancedResponse(question, intelligentResults, hybridResults) {
        const relevantConcepts = intelligentResults.results.slice(0, 5);
        
        if (relevantConcepts.length === 0) {
            return `🔍 سوال شما در حوزه‌های دانش فعلی من یافت نشد. 
در حال یادگیری از این سوال جدید هستم...

💡 پیشنهاد: می‌توانید از طریق دستور manualLearn مفاهیم جدید را آموزش دهید.`;
        }

        let response = `🎯 پاسخ هوشمند بر اساس ${relevantConcepts.length} مفهوم از ${intelligentResults.domainsSearched.length} حوزه:\n\n`;
        
        relevantConcepts.forEach((concept, index) => {
            response += `${index + 1}. **${concept.concept}** (${concept.domain}) - اعتماد: ${(concept.relevance * 100).toFixed(1)}%\n`;
        });

        if (hybridResults.serverResults.length > 0) {
            response += `\n🌐 **دانش ابری:** ${hybridResults.serverResults.length} مفهوم جدید`;
        }

        response += `\n\n💡 سیستم از ${this.knowledgeCore.getLearningStats().totalConcepts} مفهوم در ${this.knowledgeCore.getLearningStats().totalDomains} حوزه تخصصی استفاده می‌کند.`;

        return response;
    }

    calculateResponseConfidence(searchResults) {
        if (searchResults.length === 0) return 0.3;
        
        const topResultRelevance = searchResults[0]?.relevance || 0;
        const averageRelevance = searchResults.reduce((sum, r) => sum + r.relevance, 0) / searchResults.length;
        
        return Math.min(0.95, (topResultRelevance * 0.7) + (averageRelevance * 0.3));
    }

    getSystemStats() {
        const knowledgeStats = this.knowledgeCore.getLearningStats();
        const modelStats = this.searchEngine.getModelPerformance();
        const serverStats = this.serverIntegration.getSystemStats();
        const managerReport = this.knowledgeManager.getComprehensiveReport();

        return {
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
        const connectionHealth = modelStats.modelDensity * 100;
        const efficiencyHealth = managerReport.learningEfficiency;
        
        const overallHealth = (learningHealth * 0.3) + (modelHealth * 0.3) + 
                            (connectionHealth * 0.2) + (efficiencyHealth * 0.2);
        
        return {
            score: overallHealth,
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

    // ابزارهای مدیریتی پیشرفته
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

    // دریافت گزارش کامل
    getComprehensiveReport() {
        return this.knowledgeManager.getComprehensiveReport();
    }

    // توسعه حوزه جدید
    createNewDomain(domainId, domainName, initialConcepts = []) {
        this.knowledgeCore.addDomain(domainId, {
            name: domainName,
            concepts: initialConcepts,
            confidence: 0.7
        });
        
        console.log(`✅ حوزه جدید "${domainName}" ایجاد شد`);
        return true;
    }
}

// تست سیستم پیشرفته
async function testEnhancedSystem() {
    const system = new NatiqAIEnhanced();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const testQuestions = [
        "بهینه‌سازی الگوریتم برای کاهش مصرف حافظه",
        "شبکه عصبی برای پردازش زبان طبیعی چگونه کار می‌کند؟",
        "یادگیری عمیق در هوش مصنوعی چیست؟",
        "روانشناسی مشتریان برای بازگشت به سرویس"
    ];

    console.log('\n🧪 تست سیستم پیشرفته هوش مصنوعی\n');

    for (const question of testQuestions) {
        try {
            const result = await system.processEnhancedQuestion(question);
            
            console.log(`\n📝 سوال: ${question}`);
            console.log(`💬 پاسخ: ${result.response.substring(0, 150)}...`);
            console.log(`📊 حوزه‌های جستجو شده: ${result.searchResults.intelligent.domainsSearched.join(', ')}`);
            console.log(`🎯 اعتماد: ${(result.learning.confidence * 100).toFixed(1)}%`);
            console.log('─'.repeat(60));
            
        } catch (error) {
            console.error(`❌ خطا در پردازش: ${error.message}`);
        }
    }

    // نمایش آمار نهایی
    const finalStats = system.getSystemStats();
    console.log('\n📈 آمار نهایی سیستم پیشرفته:');
    console.log(JSON.stringify(finalStats, null, 2));

    // آموزش دستی یک مفهوم جدید
    await system.manualLearn('transformer', 'neural_networks', 'معماری پیشرفته برای پردازش زبان طبیعی');
    console.log('\n✅ آموزش دستی انجام شد');
}

if (require.main === module) {
    testEnhancedSystem().catch(console.error);
}

module.exports = NatiqAIEnhanced;
