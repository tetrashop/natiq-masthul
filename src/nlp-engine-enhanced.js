const EnhancedKnowledgeBase = require('./enhanced-knowledge-base');

class NLPEngineFinal {
    constructor() {
        this.knowledgeBase = new EnhancedKnowledgeBase();
        this.conversationHistory = new Map();
    }

    processQuestion(question, userId = 'default') {
        try {
            const analysis = this.knowledgeBase.deepAnalysis(question);
            const response = this.knowledgeBase.generateResponse(analysis);
            
            this.updateHistory(userId, analysis, response);
            
            // تشخیص intent به صورت صحیح
            const detectedIntent = analysis.intent || this.fallbackIntentDetection(analysis);
            
            return {
                success: true,
                question: question,
                answer: response,
                analysis: {
                    normalized_question: analysis.normalized,
                    detected_intent: detectedIntent,
                    entities_found: analysis.entities,
                    response_strategy: analysis.response_strategy,
                    knowledge_available: this.hasRelevantKnowledge(analysis),
                    confidence: this.calculateConfidence(analysis, detectedIntent)
                },
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            return {
                success: false,
                question: question,
                answer: "⚠️ خطا در پردازش سوال. لطفاً دوباره تلاش کنید.",
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    fallbackIntentDetection(analysis) {
        const { entities, normalized } = analysis;
        
        if (entities.persons.includes("رامین اجلال")) {
            if (normalized.includes("دستاورد") || normalized.includes("کار") || normalized.includes("پروژه")) {
                return "person_achievements";
            }
            if (normalized.includes("تخصص") || normalized.includes("حوزه") || normalized.includes("زمینه")) {
                return "person_expertise";
            }
            if (normalized.includes("همسر") || normalized.includes("ازدواج") || normalized.includes("خانواده")) {
                return "personal_life_inquiry";
            }
            return "person_identity";
        }
        
        return "general_inquiry";
    }

    hasRelevantKnowledge(analysis) {
        if (analysis.entities.persons.includes("رامین اجلال")) {
            return true;
        }
        return false;
    }

    calculateConfidence(analysis, detectedIntent) {
        let confidence = 0.8; // پایه بالا
        
        if (analysis.entities.persons.includes("رامین اجلال")) confidence += 0.1;
        if (detectedIntent !== "general_inquiry") confidence += 0.05;
        if (this.hasRelevantKnowledge(analysis)) confidence += 0.05;
        
        return Math.min(confidence, 0.95).toFixed(2);
    }

    updateHistory(userId, analysis, response) {
        if (!this.conversationHistory.has(userId)) {
            this.conversationHistory.set(userId, []);
        }
        
        const history = this.conversationHistory.get(userId);
        history.push({
            question: analysis.original,
            analysis: analysis,
            response: response,
            timestamp: new Date()
        });
        
        if (history.length > 10) history.shift();
    }

    getConversationHistory(userId) {
        return this.conversationHistory.get(userId) || [];
    }
}

module.exports = NLPEngineFinal;
