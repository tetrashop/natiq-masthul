/**
 * نطق مصطلح - نسخه تقویت شده با هوش مصنوعی
 */

const KnowledgeCore = require('./knowledge-server/knowledge-core');
const NeuralSearchEngine = require('./deep-search/neural-search-engine');
const ServerKnowledgeIntegration = require('./knowledge-server/server-integration');

class NatiqAIEnhanced {
    constructor() {
        console.log('🚀 راه‌اندازی نطق مصطلح - نسخه هوش مصنوعی تقویت شده');
        
        this.knowledgeCore = new KnowledgeCore();
        this.searchEngine = new NeuralSearchEngine(this.knowledgeCore);
        this.serverIntegration = new ServerKnowledgeIntegration(this.knowledgeCore);
        
        this.systemReady = false;
        this.initSystem();
    }

    async initSystem() {
        console.log('🧠 راه‌اندازی سیستم هوش مصنوعی...');
        await this.searchEngine.trainOnInteractionHistory();
        const serverConnected = await this.serverIntegration.initializeServerConnection('your-api-key-here');
        
        this.systemReady = true;
        console.log(`✅ سیستم آماده است! ${serverConnected ? 'حالت آنلاین' : 'حالت آفلاین'}`);
    }

    async processEnhancedQuestion(question) {
        if (!this.systemReady) {
            throw new Error('سیستم در حال راه‌اندازی است...');
        }

        console.log(`\n🤔 سوال پردازش پیشرفته: "${question}"`);
        
        const searchResults = await this.searchEngine.deepSemanticSearch(question);
        const hybridResults = await this.serverIntegration.hybridSearch(question);
        const enhancedResponse = this.generateEnhancedResponse(question, searchResults, hybridResults);
        
        const learningRecord = this.knowledgeCore.learnFromInteraction(
            question, 
            enhancedResponse, 
            this.calculateResponseConfidence(searchResults),
            this.extractDomainsFromResults(searchResults)
        );

        this.searchEngine.updateNeuralWeights({
            domainsUsed: learningRecord.domainsUsed,
            confidence: learningRecord.confidence
        });

        return {
            question,
            response: enhancedResponse,
            searchResults: {
                semantic: searchResults,
                hybrid: hybridResults
            },
            learning: learningRecord,
            systemStats: this.getSystemStats()
        };
    }

    generateEnhancedResponse(question, semanticResults, hybridResults) {
        const relevantConcepts = semanticResults.slice(0, 5);
        
        if (relevantConcepts.length === 0) {
            return `🔍 سوال شما در حوزه‌های دانش فعلی من یافت نشد. در حال یادگیری از این سوال جدید هستم...`;
        }

        let response = `🎯 پاسخ پیشرفته بر اساس ${relevantConcepts.length} مفهوم مرتبط:\n\n`;
        
        relevantConcepts.forEach((concept, index) => {
            response += `${index + 1}. **${concept.concept}** (حوزه: ${concept.domain}) - ارتباط: ${(concept.relevance * 100).toFixed(1)}%\n`;
        });

        if (hybridResults.serverResults.length > 0) {
            response += `\n🌐 **نتایج از سرور ابری:** ${hybridResults.serverResults.length} مفهوم جدید`;
        }

        response += `\n\n💡 این پاسخ با استفاده از جستجوی عمقی در پایگاه دانش و شبکه عصبی تولید شده است.`;

        return response;
    }

    calculateResponseConfidence(searchResults) {
        if (searchResults.length === 0) return 0.3;
        
        const topResultRelevance = searchResults[0]?.relevance || 0;
        const averageRelevance = searchResults.reduce((sum, r) => sum + r.relevance, 0) / searchResults.length;
        
        return Math.min(0.95, (topResultRelevance * 0.7) + (averageRelevance * 0.3));
    }

    extractDomainsFromResults(searchResults) {
        const domains = new Set();
        searchResults.forEach(result => domains.add(result.domain));
        return Array.from(domains);
    }

    getSystemStats() {
        const knowledgeStats = this.knowledgeCore.getLearningStats();
        const modelStats = this.searchEngine.getModelPerformance();
        const serverStats = this.serverIntegration.getSystemStats();

        return {
            knowledge: knowledgeStats,
            neuralModel: modelStats,
            server: serverStats,
            overallHealth: this.calculateSystemHealth(knowledgeStats, modelStats)
        };
    }

    calculateSystemHealth(knowledgeStats, modelStats) {
        const learningHealth = knowledgeStats.learningRate * 100;
        const modelHealth = modelStats.averageWeight * 100;
        const connectionHealth = modelStats.modelDensity * 100;
        
        const overallHealth = (learningHealth * 0.4) + (modelHealth * 0.4) + (connectionHealth * 0.2);
        
        return {
            score: overallHealth,
            status: overallHealth >= 70 ? 'عالی' : overallHealth >= 50 ? 'خوب' : 'نیاز به توجه',
            components: {
                learning: learningHealth,
                model: modelHealth,
                connections: connectionHealth
            }
        };
    }

    async manualLearn(concept, domain, description) {
        if (!this.knowledgeCore.domains.has(domain)) {
            this.knowledgeCore.addDomain(domain, {
                name: domain,
                concepts: [],
                principles: []
            });
        }

        const domainData = this.knowledgeCore.domains.get(domain);
        domainData.concepts.push(concept);
        
        console.log(`✅ مفهوم "${concept}" به حوزه "${domain}" افزوده شد`);
        await this.serverIntegration.syncWithServer();
        
        return true;
    }
}

// تست سیستم
async function testEnhancedSystem() {
    const system = new NatiqAIEnhanced();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testQuestions = [
        "بهینه‌سازی الگوریتم برای کاهش مصرف حافظه",
        "روانشناسی مشتریان برای بازگشت به سرویس",
        "شبکه عصبی برای پردازش زبان طبیعی"
    ];

    console.log('\n🧪 تست سیستم پیشرفته هوش مصنوعی\n');

    for (const question of testQuestions) {
        try {
            const result = await system.processEnhancedQuestion(question);
            
            console.log(`\n📝 سوال: ${question}`);
            console.log(`💬 پاسخ: ${result.response.substring(0, 200)}...`);
            console.log(`📊 آمار: ${result.searchResults.semantic.length} مفهوم مرتبط پیدا شد`);
            console.log(`🎯 اعتماد: ${(result.learning.confidence * 100).toFixed(1)}%`);
            console.log('─'.repeat(50));
            
        } catch (error) {
            console.error(`❌ خطا در پردازش: ${error.message}`);
        }
    }

    const finalStats = system.getSystemStats();
    console.log('\n📈 آمار نهایی سیستم:');
    console.log(JSON.stringify(finalStats, null, 2));
}

if (require.main === module) {
    testEnhancedSystem().catch(console.error);
}

module.exports = NatiqAIEnhanced;
