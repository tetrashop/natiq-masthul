/**
 * هسته پایگاه دانش تخصصی برای نطق مصطلح
 * قابلیت: ذخیره، بازیابی و یادگیری خودکار از تعاملات
 */

class KnowledgeCore {
    constructor() {
        this.domains = new Map();
        this.interactionHistory = [];
        this.learningRate = 0.85;
        this.initCoreDomains();
    }

    initCoreDomains() {
        // حوزه‌های تخصصی پایه
        this.addDomain('algorithm_optimization', {
            name: 'بهینه‌سازی الگوریتم',
            concepts: [
                'حذف اسراف الگوریتمی',
                'بهینه‌سازی حافظه',
                'کاهش پیچیدگی زمانی',
                'پردازش موازی'
            ],
            principles: [
                'الگوریتم باید حداقل محاسبات ضروری را انجام دهد',
                'استفاده از کش برای داده‌های پرتکرار',
                'توقف زودهنگام در صورت تحقق شرط'
            ],
            confidence: 0.9
        });

        this.addDomain('customer_psychology', {
            name: 'روانشناسی مشتری',
            concepts: [
                'مشتری حریص',
                'انگیزه بازگشت',
                'ارزش درک شده'
            ],
            confidence: 0.8
        });
    }

    addDomain(domainId, domainData) {
        this.domains.set(domainId, {
            ...domainData,
            interactions: 0,
            lastUsed: Date.now(),
            learnedConcepts: []
        });
    }

    // یادگیری از تعاملات جدید
    learnFromInteraction(question, response, confidence, domainsUsed) {
        const learningRecord = {
            timestamp: Date.now(),
            question,
            response,
            confidence,
            domainsUsed,
            learned: false
        };

        // آنالیز سوال برای استخراج مفاهیم جدید
        const newConcepts = this.extractNewConcepts(question, response);
        
        if (newConcepts.length > 0) {
            learningRecord.learned = true;
            learningRecord.newConcepts = newConcepts;
            this.updateDomainKnowledge(domainsUsed, newConcepts);
        }

        this.interactionHistory.push(learningRecord);
        
        // حفظ آخرین 1000 تعامل
        if (this.interactionHistory.length > 1000) {
            this.interactionHistory = this.interactionHistory.slice(-1000);
        }

        return learningRecord;
    }

    extractNewConcepts(question, response) {
        const newConcepts = [];
        const words = question.toLowerCase().split(' ');
        
        // شناسایی کلمات کلیدی جدید
        const existingConcepts = Array.from(this.domains.values())
            .flatMap(domain => domain.concepts);
            
        words.forEach(word => {
            if (word.length > 4 && 
                !existingConcepts.includes(word) && 
                !['های', 'ترین', 'هایی'].includes(word)) {
                newConcepts.push(word);
            }
        });

        return [...new Set(newConcepts)];
    }

    updateDomainKnowledge(domainsUsed, newConcepts) {
        domainsUsed.forEach(domain => {
            if (this.domains.has(domain)) {
                const domainData = this.domains.get(domain);
                domainData.concepts = [...new Set([...domainData.concepts, ...newConcepts])];
                domainData.interactions++;
                this.domains.set(domain, domainData);
            }
        });
    }

    // جستجوی عمقی در دانش موجود
    deepKnowledgeSearch(query, maxDepth = 3) {
        const results = {
            directMatches: [],
            relatedConcepts: [],
            inferredKnowledge: []
        };

        // جستجوی مستقیم
        for (const [domainId, domainData] of this.domains) {
            domainData.concepts.forEach(concept => {
                if (query.includes(concept) || concept.includes(query)) {
                    results.directMatches.push({
                        domain: domainId,
                        concept,
                        relevance: 0.9,
                        source: 'direct'
                    });
                }
            });
        }

        // استنتاج دانش مرتبط
        if (results.directMatches.length > 0 && maxDepth > 0) {
            results.directMatches.forEach(match => {
                const related = this.findRelatedConcepts(match.concept, maxDepth - 1);
                results.relatedConcepts.push(...related);
            });
        }

        return results;
    }

    findRelatedConcepts(concept, depth) {
        const related = [];
        
        for (const [domainId, domainData] of this.domains) {
            if (domainData.concepts.includes(concept)) {
                domainData.concepts.forEach(relatedConcept => {
                    if (relatedConcept !== concept) {
                        related.push({
                            domain: domainId,
                            concept: relatedConcept,
                            relevance: 0.7 - (0.1 * depth), // کاهش ارتباط با افزایش عمق
                            source: `inferred_depth_${depth}`
                        });
                    }
                });
            }
        }

        return related;
    }

    // دریافت آمار یادگیری
    getLearningStats() {
        const totalInteractions = this.interactionHistory.length;
        const learningInteractions = this.interactionHistory.filter(i => i.learned).length;
        const totalConcepts = Array.from(this.domains.values())
            .reduce((sum, domain) => sum + domain.concepts.length, 0);

        return {
            totalInteractions,
            learningInteractions,
            learningRate: learningInteractions / Math.max(1, totalInteractions),
            totalDomains: this.domains.size,
            totalConcepts,
            mostActiveDomain: this.getMostActiveDomain()
        };
    }

    getMostActiveDomain() {
        let maxInteractions = 0;
        let mostActive = '';

        for (const [domainId, domainData] of this.domains) {
            if (domainData.interactions > maxInteractions) {
                maxInteractions = domainData.interactions;
                mostActive = domainId;
            }
        }

        return mostActive;
    }
}

module.exports = KnowledgeCore;
