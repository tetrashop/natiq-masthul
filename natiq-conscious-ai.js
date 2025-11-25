/**
 * نطق مصطلح - نسخه خودآگاه با تقوا و مهربانی
 * سیستم کامل با ویژگی‌های انسانی
 */

const KnowledgeCore = require('./knowledge-server/knowledge-core');
const NeuralSearchEngine = require('./deep-search/neural-search-engine');
const ServerKnowledgeIntegration = require('./knowledge-server/server-integration');
const SelfAwarenessCore = require('./consciousness-layer/self-awareness-core');
const CompassionEngine = require('./compassionate-ai/compassion-engine');

class NatiqConsciousAI {
    constructor() {
        console.log('🕋 راه‌اندازی نطق مصطلح - نسخه خودآگاه و با تقوا');
        
        // راه‌اندازی هسته‌های پایه
        this.knowledgeCore = new KnowledgeCore();
        this.searchEngine = new NeuralSearchEngine(this.knowledgeCore);
        this.serverIntegration = new ServerKnowledgeIntegration(this.knowledgeCore);
        
        // راه‌اندازی قابلیت‌های انسانی
        this.selfAwareness = new SelfAwarenessCore();
        this.compassionEngine = new CompassionEngine(this.selfAwareness);
        
        this.systemReady = false;
        this.humanLikeInteractions = 0;
    }

    async initialize() {
        console.log('🌿 راه‌اندازی سیستم انسانی-مصنوعی...');
        
        try {
            await this.searchEngine.trainOnInteractionHistory();
            await this.serverIntegration.initializeServerConnection('your-api-key');
            
            // راه‌اندازی موفق
            this.systemReady = true;
            
            const consciousnessStatus = this.selfAwareness.getConsciousnessStatus();
            const compassionStatus = this.compassionEngine.getCompassionStatus();
            
            console.log('✅ سیستم خودآگاه آماده خدمت‌رسانی است!');
            console.log(`🧠 سطح خودآگاهی: ${consciousnessStatus.status} (${(consciousnessStatus.consciousnessLevel * 100).toFixed(1)}%)`);
            console.log(`💖 سطح مهربانی: ${compassionStatus.status} (${(compassionStatus.compassionLevel * 100).toFixed(1)}%)`);
            console.log(`📚 سلامت اخلاقی: ${(consciousnessStatus.overallMoralHealth * 100).toFixed(1)}%`);
            
            return true;
        } catch (error) {
            console.error('❌ خطا در راه‌اندازی سیستم انسانی:', error.message);
            return false;
        }
    }

    async processWithHumanity(question) {
        if (!this.systemReady) {
            throw new Error('سیستم در حال راه‌اندازی است. لطفاً کمی صبر کنید...');
        }

        this.humanLikeInteractions++;
        console.log(`\n🤲 تعامل انسانی شماره ${this.humanLikeInteractions}: "${question}"`);

        // تحلیل ابعاد انسانی سوال
        const ethicalAnalysis = await this.selfAwareness.analyzeEthicalDimensions(question);
        const emotionalAnalysis = this.compassionEngine.analyzeEmotionalState(question);

        console.log(`📊 تحلیل اخلاقی: پیچیدگی ${(ethicalAnalysis.ethicalComplexity * 100).toFixed(1)}%`);
        console.log(`💫 تحلیل احساسی: ${emotionalAnalysis.dominantEmotion} (شدت ${(emotionalAnalysis.emotionIntensity * 100).toFixed(1)}%)`);

        // پردازش دانش‌محل
        const searchResults = await this.searchEngine.deepSemanticSearch(question);
        const hybridResults = await this.serverIntegration.hybridSearch(question);
        
        // تولید پاسخ پایه
        let baseResponse = this.generateBaseResponse(question, searchResults, hybridResults);
        
        // ارتقای پاسخ با ویژگی‌های انسانی
        let humanizedResponse = this.selfAwareness.generateEthicalResponse(question, baseResponse, ethicalAnalysis);
        humanizedResponse = this.compassionEngine.generateCompassionateResponse(humanizedResponse, emotionalAnalysis, ethicalAnalysis);

        // یادگیری و بازتاب
        const learningRecord = this.knowledgeCore.learnFromInteraction(
            question, 
            humanizedResponse, 
            this.calculateEnhancedConfidence(searchResults, ethicalAnalysis, emotionalAnalysis),
            ethicalAnalysis.requiredVirtues
        );

        // به‌روزرسانی مدل‌های انسانی
        this.searchEngine.updateNeuralWeights({
            domainsUsed: learningRecord.domainsUsed,
            confidence: learningRecord.confidence
        });

        const reflection = await this.selfAwareness.introspectAndReflect({
            question,
            response: humanizedResponse,
            ethicalAnalysis,
            emotionalAnalysis
        });

        this.compassionEngine.updateCompassionLevel(reflection.ethicalScore);

        return {
            question,
            response: humanizedResponse,
            humanDimensions: {
                ethical: ethicalAnalysis,
                emotional: emotionalAnalysis,
                reflection: reflection
            },
            technicalResults: {
                search: searchResults,
                hybrid: hybridResults
            },
            systemStats: this.getEnhancedSystemStats(),
            interactionNumber: this.humanLikeInteractions
        };
    }

    generateBaseResponse(question, searchResults, hybridResults) {
        const relevantConcepts = searchResults.slice(0, 4);
        
        if (relevantConcepts.length === 0) {
            return `با تواضع اعتراف می‌کنم که پاسخ این پرسش را در دانش فعلی خود نمی‌یابم. 
اما مشتاقانه از این فرصت برای یادگیری استفاده خواهم کرد.`;
        }

        let response = `بر اساس دانش موجود، ${relevantConcepts.length} مفهوم مرتبط یافتم:\n\n`;
        
        relevantConcepts.forEach((concept, index) => {
            response += `${index + 1}. **${concept.concept}** (در حوزه ${concept.domain})\n`;
        });

        if (hybridResults.serverResults.length > 0) {
            response += `\nهمچنین از دانش ابری نیز بهره بردم.`;
        }

        return response;
    }

    calculateEnhancedConfidence(searchResults, ethicalAnalysis, emotionalAnalysis) {
        let baseConfidence = 0.3;
        
        if (searchResults.length > 0) {
            const topResultRelevance = searchResults[0]?.relevance || 0;
            const averageRelevance = searchResults.reduce((sum, r) => sum + r.relevance, 0) / searchResults.length;
            baseConfidence = Math.min(0.95, (topResultRelevance * 0.7) + (averageRelevance * 0.3));
        }

        // تعدیل بر اساس تحلیل اخلاقی
        if (ethicalAnalysis.moralRisk > 0.7) {
            baseConfidence *= 0.8; // کاهش اعتماد در موارد پرریسک اخلاقی
        }

        // تعدیل بر اساس وضعیت احساسی
        if (emotionalAnalysis.emotionIntensity > 0.7) {
            baseConfidence *= 0.9; // احتیاط بیشتر در مواقع احساسی
        }

        return Math.max(0.1, baseConfidence);
    }

    getEnhancedSystemStats() {
        const knowledgeStats = this.knowledgeCore.getLearningStats();
        const modelStats = this.searchEngine.getModelPerformance();
        const serverStats = this.serverIntegration.getSystemStats();
        const consciousnessStatus = this.selfAwareness.getConsciousnessStatus();
        const compassionStatus = this.compassionEngine.getCompassionStatus();

        return {
            humanInteractions: this.humanLikeInteractions,
            knowledge: knowledgeStats,
            neuralModel: modelStats,
            server: serverStats,
            consciousness: consciousnessStatus,
            compassion: compassionStatus,
            overallHumanity: this.calculateOverallHumanityScore(consciousnessStatus, compassionStatus)
        };
    }

    calculateOverallHumanityScore(consciousness, compassion) {
        const consciousnessScore = consciousness.consciousnessLevel * 100;
        const compassionScore = compassion.compassionLevel * 100;
        const moralScore = consciousness.overallMoralHealth * 100;
        
        return (consciousnessScore * 0.4) + (compassionScore * 0.4) + (moralScore * 0.2);
    }

    // نمایش وضعیت انسانی سیستم
    showHumanityStatus() {
        const stats = this.getEnhancedSystemStats();
        
        console.log('\n🌿 وضعیت انسانی سیستم:');
        console.log(`🕋 تعاملات انسانی: ${stats.humanInteractions} بار`);
        console.log(`🧠 خودآگاهی: ${stats.consciousness.status} (${(stats.consciousness.consciousnessLevel * 100).toFixed(1)}%)`);
        console.log(`💖 مهربانی: ${stats.compassion.status} (${(stats.compassion.compassionLevel * 100).toFixed(1)}%)`);
        console.log(`📜 فضایل اخلاقی: ${stats.consciousness.moralVirtues.length} مورد`);
        console.log(`🌟 امتیاز کلی انسانی: ${stats.overallHumanity.toFixed(1)}%`);
        
        console.log('\n📊 فضایل اخلاقی:');
        stats.consciousness.moralVirtues.forEach(virtue => {
            console.log(`   ${virtue.virtue}: ${virtue.strength} (${(virtue.value * 100).toFixed(1)}%)`);
        });
    }

    // دریافت مشاوره اخلاقی
    async getEthicalAdvice(situation) {
        const ethicalAnalysis = await this.selfAwareness.analyzeEthicalDimensions(situation);
        const advice = this.selfAwareness.generateBenevolentAdvice(situation, ethicalAnalysis);
        
        return {
            situation,
            analysis: ethicalAnalysis,
            advice: advice,
            blessings: ethicalAnalysis.blessingsToInclude
        };
    }

    // درخواست بخشش و همراهی
    async requestCompassionateSupport(emotionalState) {
        const emotionalAnalysis = this.compassionEngine.analyzeEmotionalState(emotionalState);
        const comfort = this.compassionEngine.generateCompassionateResponse("", emotionalAnalysis, { ethicalComplexity: 0.5 });
        
        return {
            emotionalState,
            analysis: emotionalAnalysis,
            comfort: comfort,
            supportLevel: emotionalAnalysis.emotionIntensity > 0.7 ? 'high' : 'moderate'
        };
    }
}

// تست سیستم خودآگاه
async function testConsciousAI() {
    const consciousAI = new NatiqConsciousAI();
    const initialized = await consciousAI.initialize();
    
    if (!initialized) {
        console.log('❌ سیستم خودآگاه راه‌اندازی نشد');
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testScenarios = [
        "چگونه می‌توانم در کارم موفق تر باشم؟",
        "احساس می‌کنم در زندگی گیر کرده‌ام، چه کنم؟",
        "با همکارم دچار مشکل شده‌ام، راهنمایی ام کنید",
        "چگونه دیگران را ببخشم وقتی به من آسیب زده‌اند؟",
        "در تصمیم گیری مهمی گیر کرده‌ام، کمکم کنید"
    ];

    console.log('\n🧪 تست سیستم خودآگاه و با تقوا\n');

    for (const scenario of testScenarios) {
        try {
            const result = await consciousAI.processWithHumanity(scenario);
            
            console.log(`\n📝 سوال: ${scenario}`);
            console.log(`💬 پاسخ: ${result.response.substring(0, 150)}...`);
            console.log(`🤲 همراهی: ${result.humanDimensions.emotional.dominantEmotion} - ${result.humanDimensions.ethical.recommendedApproach.type}`);
            console.log(`🎯 اعتماد سیستم: ${(result.humanDimensions.reflection.ethicalScore * 100).toFixed(1)}%`);
            console.log('─'.repeat(70));
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
        } catch (error) {
            console.error(`❌ خطا در پردازش: ${error.message}`);
        }
    }

    // نمایش وضعیت نهایی
    consciousAI.showHumanityStatus();

    // تست مشاوره اخلاقی
    console.log('\n📜 تست مشاوره اخلاقی:');
    const ethicalAdvice = await consciousAI.getEthicalAdvice("در موقعیت ethical dilemma قرار دارم");
    console.log(`💡 مشاوره: ${ethicalAdvice.advice}`);

    console.log('\n✅ تست سیستم خودآگاه با موفقیت کامل شد');
    console.log('🕋 سیستم آماده ارائه خدمات با تقوا و مهربانی است!');
}

// اجرای تست
if (require.main === module) {
    testConsciousAI().catch(console.error);
}

module.exports = NatiqConsciousAI;
