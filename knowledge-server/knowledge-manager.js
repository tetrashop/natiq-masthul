/**
 * مدیریت پیشرفته پایگاه دانش برای نطق مصطلح
 */

class KnowledgeManager {
    constructor(knowledgeCore) {
        this.core = knowledgeCore;
        this.domainRelations = new Map();
        this.initDomainRelations();
    }

    initDomainRelations() {
        // تعریف ارتباطات بین حوزه‌های دانش
        this.domainRelations.set('algorithm_optimization', [
            'software_development',
            'data_science', 
            'neural_networks'
        ]);
        
        this.domainRelations.set('neural_networks', [
            'algorithm_optimization',
            'data_science',
            'nlp'
        ]);

        this.domainRelations.set('customer_psychology', [
            'business_strategy',
            'communication'
        ]);
    }

    // جستجوی هوشمند در چند حوزه مرتبط
    async intelligentSearch(query, options = {}) {
        const { maxDomains = 3, useSemantic = true } = options;
        
        console.log(`🔍 جستجوی هوشمند برای: "${query}"`);
        
        // شناسایی حوزه‌های مرتبط با query
        const relevantDomains = this.findRelevantDomains(query);
        
        let allResults = [];
        
        // جستجو در هر حوزه مرتبط
        for (const domain of relevantDomains.slice(0, maxDomains)) {
            const domainResults = this.core.deepKnowledgeSearch(query);
            domainResults.directMatches.forEach(match => {
                match.domainRelevance = this.calculateDomainRelevance(domain, match.domain);
                allResults.push(match);
            });
        }

        // مرتب‌سازی بر اساس ارتباط
        allResults.sort((a, b) => {
            const scoreA = a.relevance * (a.domainRelevance || 1);
            const scoreB = b.relevance * (b.domainRelevance || 1);
            return scoreB - scoreA;
        });

        return {
            query,
            domainsSearched: relevantDomains.slice(0, maxDomains),
            results: allResults.slice(0, 10), // 10 نتیجه برتر
            totalMatches: allResults.length
        };
    }

    findRelevantDomains(query) {
        const domainScores = new Map();
        const queryWords = query.split(' ');

        for (const [domainId, domainData] of this.core.domains) {
            let score = 0;
            
            // محاسبه امتیاز بر اساس تطابق مفاهیم
            domainData.concepts.forEach(concept => {
                queryWords.forEach(word => {
                    if (concept.includes(word) || word.includes(concept)) {
                        score += 2;
                    }
                });
            });

            // محاسبه امتیاز بر اساس ارتباط با سایر حوزه‌ها
            const relatedDomains = this.domainRelations.get(domainId) || [];
            relatedDomains.forEach(relatedDomain => {
                if (this.core.domains.has(relatedDomain)) {
                    score += 0.5; // امتیاز برای حوزه‌های مرتبط
                }
            });

            domainScores.set(domainId, score);
        }

        // مرتب‌سازی حوزه‌ها بر اساس امتیاز
        return Array.from(domainScores.entries())
            .filter(([_, score]) => score > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([domainId]) => domainId);
    }

    calculateDomainRelevance(sourceDomain, targetDomain) {
        if (sourceDomain === targetDomain) return 1.0;
        
        const relations = this.domainRelations.get(sourceDomain) || [];
        if (relations.includes(targetDomain)) return 0.8;
        
        // بررسی ارتباطات غیرمستقیم
        for (const relatedDomain of relations) {
            const secondaryRelations = this.domainRelations.get(relatedDomain) || [];
            if (secondaryRelations.includes(targetDomain)) {
                return 0.6;
            }
        }
        
        return 0.3; // ارتباط ضعیف
    }

    // تحلیل و توسعه خودکار حوزه‌های دانش
    analyzeAndExpandKnowledge() {
        console.log('🧠 تحلیل و توسعه پایگاه دانش...');
        
        const stats = this.core.getLearningStats();
        const newDomains = [];

        // شناسایی الگوهای جدید برای ایجاد حوزه‌های تخصصی
        const conceptGroups = this.groupConceptsByPattern();
        
        conceptGroups.forEach((concepts, pattern) => {
            if (concepts.length >= 3 && !this.core.domains.has(pattern)) {
                // ایجاد حوزه جدید
                newDomains.push({
                    id: pattern,
                    name: this.generateDomainName(pattern),
                    concepts: concepts
                });
            }
        });

        // افزودن حوزه‌های جدید
        newDomains.forEach(domain => {
            this.core.addDomain(domain.id, {
                name: domain.name,
                concepts: domain.concepts,
                confidence: 0.6
            });
            console.log(`✅ حوزه جدید ایجاد شد: ${domain.name}`);
        });

        return {
            domainsCreated: newDomains.length,
            newDomains: newDomains.map(d => d.name)
        };
    }

    groupConceptsByPattern() {
        const groups = new Map();
        const allConcepts = Array.from(this.core.domains.values())
            .flatMap(domain => domain.concepts);

        allConcepts.forEach(concept => {
            // شناسایی الگوهای ساده
            if (concept.includes('شبکه')) {
                this.addToGroup(groups, 'networks', concept);
            }
            if (concept.includes('یادگیری')) {
                this.addToGroup(groups, 'learning', concept);
            }
            if (concept.includes('داده')) {
                this.addToGroup(groups, 'data', concept);
            }
        });

        return groups;
    }

    addToGroup(groups, groupKey, concept) {
        if (!groups.has(groupKey)) {
            groups.set(groupKey, []);
        }
        groups.get(groupKey).push(concept);
    }

    generateDomainName(pattern) {
        const names = {
            'networks': 'شبکه‌ها و ارتباطات',
            'learning': 'یادگیری و آموزش', 
            'data': 'مدیریت داده‌ها'
        };
        return names[pattern] || `حوزه ${pattern}`;
    }

    // دریافت گزارش کامل
    getComprehensiveReport() {
        const coreStats = this.core.getLearningStats();
        const domainAnalysis = this.analyzeDomainHealth();

        return {
            timestamp: Date.now(),
            knowledgeBase: coreStats,
            domains: {
                total: coreStats.totalDomains,
                healthy: domainAnalysis.healthyDomains,
                needsAttention: domainAnalysis.needsAttention
            },
            learningEfficiency: this.calculateLearningEfficiency(),
            recommendations: this.generateRecommendations()
        };
    }

    analyzeDomainHealth() {
        const healthyDomains = [];
        const needsAttention = [];

        for (const [domainId, domainData] of this.core.domains) {
            const healthScore = domainData.interactions > 10 ? 'healthy' : 'needs_attention';
            
            if (healthScore === 'healthy') {
                healthyDomains.push(domainId);
            } else {
                needsAttention.push(domainId);
            }
        }

        return { healthyDomains, needsAttention };
    }

    calculateLearningEfficiency() {
        const stats = this.core.getLearningStats();
        const efficiency = (stats.learningRate * 100) + 
                         (Math.min(stats.totalConcepts / 100, 1) * 50) + 
                         (Math.min(stats.totalDomains / 10, 1) * 30);
        
        return Math.min(efficiency, 100);
    }

    generateRecommendations() {
        const recommendations = [];
        const stats = this.core.getLearningStats();

        if (stats.learningRate < 0.5) {
            recommendations.push('افزایش تعاملات آموزشی برای بهبود نرخ یادگیری');
        }

        if (stats.totalDomains < 5) {
            recommendations.push('توسعه حوزه‌های تخصصی جدید');
        }

        if (stats.totalConcepts < 50) {
            recommendations.push('افزودن مفاهیم پایه‌ای بیشتر');
        }

        return recommendations;
    }
}

module.exports = KnowledgeManager;
