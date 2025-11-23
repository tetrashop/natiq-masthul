const IntelligentKnowledgeBase = require('./intelligent-knowledge-base');

class AdvancedNLPEnhanced {
    constructor() {
        this.knowledgeBase = new IntelligentKnowledgeBase();
        this.conversationContext = new Map();
    }

    processQuestion(question, userId = 'default') {
        // تحلیل عمیق سوال
        const deepAnalysis = this.knowledgeBase.deepQuestionAnalysis(question);
        
        // مدیریت context مکالمه
        this.updateConversationContext(userId, deepAnalysis);
        
        // تولید پاسخ هوشمند
        const response = this.knowledgeBase.generateIntelligentResponse(deepAnalysis);
        
        return {
            ...deepAnalysis,
            response: response,
            context_used: this.getRelevantContext(userId),
            confidence: this.calculateConfidence(deepAnalysis)
        };
    }

    updateConversationContext(userId, analysis) {
        if (!this.conversationContext.has(userId)) {
            this.conversationContext.set(userId, {
                history: [],
                last_interaction: new Date(),
                conversation_topic: null
            });
        }

        const context = this.conversationContext.get(userId);
        context.history.push({
            question: analysis.original_question,
            intent: analysis.true_intent,
            timestamp: new Date()
        });

        // به‌روزرسانی موضوع مکالمه
        if (analysis.entities.persons.length > 0) {
            context.conversation_topic = `بحث درباره ${analysis.entities.persons[0]}`;
        }

        context.last_interaction = new Date();
    }

    getRelevantContext(userId) {
        if (!this.conversationContext.has(userId)) return null;
        
        const context = this.conversationContext.get(userId);
        if (context.history.length < 2) return null;

        const lastTwo = context.history.slice(-2);
        return {
            previous_intent: lastTwo[0].intent,
            current_topic: context.conversation_topic
        };
    }

    calculateConfidence(analysis) {
        let confidence = 0.5; // پایه

        if (analysis.knowledge_status.available) confidence += 0.3;
        if (analysis.true_intent !== "general_inquiry") confidence += 0.1;
        if (analysis.entities.persons.length > 0) confidence += 0.1;

        return Math.min(confidence, 0.95).toFixed(2);
    }
}

module.exports = AdvancedNLPEnhanced;
