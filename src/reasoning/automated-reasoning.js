class AutomatedReasoning {
    constructor() {
        this.rules = new Map();
        this.facts = new Set();
        this.initializeReasoningRules();
    }

    initializeReasoningRules() {
        // قواعد استنتاجی
        this.rules.set('person_expertise', {
            conditions: ['person_mentioned', 'expertise_question'],
            action: 'provide_expertise_list',
            confidence: 0.9
        });

        this.rules.set('achievement_inquiry', {
            conditions: ['person_mentioned', 'achievement_keywords'],
            action: 'list_achievements', 
            confidence: 0.85
        });

        this.rules.set('article_request', {
            conditions: ['article_keywords', 'topic_mentioned'],
            action: 'generate_article',
            confidence: 0.8
        });

        this.rules.set('technical_explanation', {
            conditions: ['technical_terms', 'explanation_request'],
            action: 'provide_technical_explanation',
            confidence: 0.75
        });
    }

    // استنتاج بر اساس قواعد
    infer(evidence) {
        const triggeredRules = [];
        
        for (const [ruleName, rule] of this.rules.entries()) {
            if (this.checkConditions(rule.conditions, evidence)) {
                triggeredRules.push({
                    rule: ruleName,
                    action: rule.action,
                    confidence: rule.confidence * this.calculateEvidenceConfidence(evidence),
                    evidence: evidence
                });
            }
        }

        // انتخاب بهترین قاعده
        return this.selectBestRule(triggeredRules);
    }

    checkConditions(conditions, evidence) {
        return conditions.every(condition => 
            this.evaluateCondition(condition, evidence)
        );
    }

    evaluateCondition(condition, evidence) {
        const conditionHandlers = {
            'person_mentioned': () => evidence.entities.person !== undefined,
            'expertise_question': () => evidence.intent === 'expertise_inquiry',
            'achievement_keywords': () => 
                evidence.text.includes('دستاورد') || evidence.text.includes('کار'),
            'article_keywords': () => 
                evidence.text.includes('مقاله') || evidence.text.includes('بنویس'),
            'topic_mentioned': () => evidence.entities.topic !== undefined,
            'technical_terms': () => 
                evidence.text.includes('هوش مصنوعی') || evidence.text.includes('NLP'),
            'explanation_request': () => 
                evidence.text.includes('چیست') || evidence.text.includes('چگونه')
        };

        return conditionHandlers[condition] ? conditionHandlers[condition]() : false;
    }

    calculateEvidenceConfidence(evidence) {
        let confidence = 0.5;
        
        if (evidence.entities.person) confidence += 0.2;
        if (evidence.entities.topic) confidence += 0.15;
        if (evidence.intent !== 'general_inquiry') confidence += 0.15;
        
        return Math.min(confidence, 1.0);
    }

    selectBestRule(triggeredRules) {
        if (triggeredRules.length === 0) return null;
        
        return triggeredRules.reduce((best, current) => 
            current.confidence > best.confidence ? current : best
        );
    }

    // استدلال چندمرحله‌ای
    multiStepReasoning(initialEvidence, maxSteps = 3) {
        const reasoningPath = [];
        let currentEvidence = initialEvidence;
        
        for (let step = 0; step < maxSteps; step++) {
            const inference = this.infer(currentEvidence);
            
            if (!inference) break;
            
            reasoningPath.push({
                step: step + 1,
                rule: inference.rule,
                action: inference.action,
                confidence: inference.confidence
            });
            
            // به‌روزرسانی شواهد برای مرحله بعد
            currentEvidence = this.updateEvidence(currentEvidence, inference);
        }
        
        return reasoningPath;
    }

    updateEvidence(evidence, inference) {
        // افزودن نتایج استنتاج به شواهد
        return {
            ...evidence,
            previous_inferences: [
                ...(evidence.previous_inferences || []),
                inference
            ],
            confidence: inference.confidence
        };
    }
}

module.exports = AutomatedReasoning;
