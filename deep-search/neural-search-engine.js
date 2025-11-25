/**
 * موتور جستجو و یادگیری عمیق برای نطق مصطلح
 * قابلیت: جستجوی معنایی، یادگیری عمق و شبکه عصبی
 */

class NeuralSearchEngine {
    constructor(knowledgeCore) {
        this.knowledgeCore = knowledgeCore;
        this.searchDepth = 3;
        this.semanticThreshold = 0.7;
        this.neuralWeights = new Map();
        this.initNeuralNetwork();
    }

    initNeuralNetwork() {
        // وزن‌های اولیه برای ارتباطات معنایی
        this.neuralWeights.set('algorithm_optimization', {
            'customer_psychology': 0.3,
            'business_strategy': 0.6,
            'software_development': 0.8
        });

        this.neuralWeights.set('customer_psychology', {
            'business_strategy': 0.7,
            'communication': 0.9,
            'algorithm_optimization': 0.3
        });
    }

    // جستجوی عمقی با درنظرگرفتن ارتباطات معنایی
    async deepSemanticSearch(query, currentDepth = 0, visited = new Set()) {
        if (currentDepth >= this.searchDepth) {
            return [];
        }

        const results = [];
        const queryConcepts = this.extractConcepts(query);

        for (const concept of queryConcepts) {
            if (visited.has(concept)) continue;
            visited.add(concept);

            // جستجوی مستقیم
            const directResults = this.knowledgeCore.deepKnowledgeSearch(concept, 1);
            results.push(...directResults.directMatches);

            // جستجوی ارتباطات وزندار
            const weightedResults = await this.findWeightedAssociations(concept, visited);
            results.push(...weightedResults);

            // جستجوی عمقی بازگشتی
            for (const result of directResults.relatedConcepts) {
                const deepResults = await this.deepSemanticSearch(
                    result.concept, 
                    currentDepth + 1, 
                    new Set(visited)
                );
                results.push(...deepResults);
            }
        }

        // حذف موارد تکراری و مرتب‌سازی بر اساس ارتباط
        return this.rankAndDeduplicate(results);
    }

    extractConcepts(text) {
        const words = text.toLowerCase().split(' ');
        return words.filter(word => 
            word.length > 3 && 
            !this.isStopWord(word)
        );
    }

    isStopWord(word) {
        const stopWords = ['های', 'ترین', 'هایی', 'چگونه', 'چرا', 'چه'];
        return stopWords.includes(word);
    }

    async findWeightedAssociations(concept, visited) {
        const associations = [];
        
        for (const [domain, weights] of this.neuralWeights) {
            for (const [relatedDomain, weight] of Object.entries(weights)) {
                if (weight >= this.semanticThreshold && !visited.has(relatedDomain)) {
                    const domainConcepts = this.knowledgeCore.domains.get(relatedDomain)?.concepts || [];
                    
                    domainConcepts.forEach(relatedConcept => {
                        associations.push({
                            domain: relatedDomain,
                            concept: relatedConcept,
                            relevance: weight,
                            source: 'neural_association',
                            semanticWeight: weight
                        });
                    });
                }
            }
        }

        return associations;
    }

    rankAndDeduplicate(results) {
        const seen = new Set();
        const uniqueResults = [];

        results.forEach(result => {
            const key = `${result.domain}_${result.concept}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueResults.push(result);
            }
        });

        // مرتب‌سازی بر اساس ارتباط
        return uniqueResults.sort((a, b) => {
            const relevanceA = a.relevance * (a.semanticWeight || 1);
            const relevanceB = b.relevance * (b.semanticWeight || 1);
            return relevanceB - relevanceA;
        });
    }

    // به‌روزرسانی وزن‌های شبکه عصبی بر اساس تعاملات موفق
    updateNeuralWeights(successfulInteraction) {
        const { domainsUsed, confidence } = successfulInteraction;
        
        domainsUsed.forEach((domain, index) => {
            if (!this.neuralWeights.has(domain)) {
                this.neuralWeights.set(domain, {});
            }

            const domainWeights = this.neuralWeights.get(domain);
            
            domainsUsed.forEach((relatedDomain, relatedIndex) => {
                if (domain !== relatedDomain) {
                    const currentWeight = domainWeights[relatedDomain] || 0;
                    const learningBonus = confidence * 0.1;
                    domainWeights[relatedDomain] = Math.min(1, currentWeight + learningBonus);
                }
            });

            this.neuralWeights.set(domain, domainWeights);
        });
    }

    // آموزش مدل بر اساس تاریخچه تعاملات
    async trainOnInteractionHistory() {
        const stats = this.knowledgeCore.getLearningStats();
        const learningInteractions = this.knowledgeCore.interactionHistory
            .filter(i => i.learned);

        console.log(`🧠 آموزش مدل بر روی ${learningInteractions.length} تعامل یادگیری...`);

        learningInteractions.forEach(interaction => {
            this.updateNeuralWeights({
                domainsUsed: interaction.domainsUsed,
                confidence: interaction.confidence || 0.5
            });
        });

        console.log('✅ آموزش مدل کامل شد');
        return this.getModelPerformance();
    }

    getModelPerformance() {
        let totalConnections = 0;
        let averageWeight = 0;

        for (const [domain, weights] of this.neuralWeights) {
            const domainWeights = Object.values(weights);
            totalConnections += domainWeights.length;
            averageWeight += domainWeights.reduce((sum, w) => sum + w, 0);
        }

        averageWeight = totalConnections > 0 ? averageWeight / totalConnections : 0;

        return {
            totalDomains: this.neuralWeights.size,
            totalConnections,
            averageWeight,
            modelDensity: totalConnections / Math.max(1, this.neuralWeights.size * (this.neuralWeights.size - 1))
        };
    }
}

module.exports = NeuralSearchEngine;
