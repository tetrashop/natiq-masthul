const fs = require('fs');

class EnhancedKnowledgeCore {
    constructor() {
        this.dataFile = './knowledge-data.json';
        this.domains = new Map();
        this.interactionHistory = [];
        this.learningRate = 0.85;
        this.loadFromFile();
        this.initCoreDomains();
    }

    loadFromFile() {
        try {
            if (fs.existsSync(this.dataFile)) {
                const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
                this.domains = new Map(data.domains);
                this.interactionHistory = data.interactionHistory || [];
                console.log('📂 دانش قبلی بارگذاری شد');
            }
        } catch (error) {
            console.log('ℹ️ ایجاد پایگاه دانش جدید');
        }
    }

    saveToFile() {
        const data = {
            domains: Array.from(this.domains.entries()),
            interactionHistory: this.interactionHistory
        };
        fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    }

    initCoreDomains() {
        const coreDomains = {
            'algorithm_optimization': {
                name: 'بهینه‌سازی الگوریتم',
                concepts: [
                    'الگوریتم', 'بهینه‌سازی', 'حافظه', 'پردازش', 'کارایی',
                    'اسراف', 'کاهش', 'پیچیدگی', 'زمان', 'محاسبات'
                ],
                principles: [
                    'الگوریتم باید حداقل محاسبات ضروری را انجام دهد',
                    'استفاده از کش برای داده‌های پرتکرار'
                ],
                confidence: 0.9
            },
            'customer_psychology': {
                name: 'روانشناسی مشتری',
                concepts: [
                    'مشتری', 'روانشناسی', 'بازگشت', 'انگیزه', 'ارزش',
                    'رضایت', 'وفاداری', 'رفتار', 'نیاز', 'انتظار'
                ],
                confidence: 0.8
            },
            'neural_networks': {
                name: 'شبکه‌های عصبی',
                concepts: [
                    'شبکه', 'عصبی', 'یادگیری', 'عمیق', 'پردازش',
                    'زبان', 'طبیعی', 'هوش', 'مصنوعی', 'مدل'
                ],
                confidence: 0.7
            }
        };

        Object.entries(coreDomains).forEach(([id, data]) => {
            this.addDomain(id, data);
        });
    }

    addDomain(domainId, domainData) {
        this.domains.set(domainId, {
            ...domainData,
            interactions: 0,
            lastUsed: Date.now(),
            learnedConcepts: []
        });
        this.saveToFile();
    }

    // الگوریتم پیشرفته‌تر برای استخراج مفاهیم
    extractNewConcepts(question, response) {
        const newConcepts = [];
        
        // حذف علائم نگارشی و تبدیل به حروف کوچک
        const cleanQuestion = question.replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g, '')
                                    .toLowerCase();
        
        // تجزیه به کلمات و فیلتر کردن کلمات کوتاه و بی‌معنی
        const words = cleanQuestion.split(' ')
            .filter(word => word.length > 2 && !this.isStopWord(word));
        
        const existingConcepts = Array.from(this.domains.values())
            .flatMap(domain => domain.concepts);
        
        // استخراج عبارات چندکلمه‌ای و کلمات کلیدی
        const phrases = this.extractPhrases(cleanQuestion);
        const meaningfulWords = this.filterMeaningfulWords(words);
        
        // ترکیب عبارات و کلمات معنادار
        const allPotentialConcepts = [...phrases, ...meaningfulWords];
        
        allPotentialConcepts.forEach(concept => {
            if (!existingConcepts.includes(concept) && 
                concept.length >= 3 && 
                !this.isCommonWord(concept)) {
                newConcepts.push(concept);
            }
        });

        return [...new Set(newConcepts)];
    }

    extractPhrases(text) {
        const phrases = [];
        const words = text.split(' ');
        
        // استخراج عبارات ۲ و ۳ کلمه‌ای
        for (let i = 0; i < words.length - 1; i++) {
            const twoWordPhrase = words.slice(i, i + 2).join(' ');
            if (this.isMeaningfulPhrase(twoWordPhrase)) {
                phrases.push(twoWordPhrase);
            }
            
            if (i < words.length - 2) {
                const threeWordPhrase = words.slice(i, i + 3).join(' ');
                if (this.isMeaningfulPhrase(threeWordPhrase)) {
                    phrases.push(threeWordPhrase);
                }
            }
        }
        
        return phrases;
    }

    isMeaningfulPhrase(phrase) {
        const meaninglessPhrases = [
            'برای کاهش', 'در هوش', ' چگونه', 'می‌کند', ' چیست',
            'برای پردازش', 'در این', 'به سرویس'
        ];
        
        return !meaninglessPhrases.some(meaningless => phrase.includes(meaningless));
    }

    filterMeaningfulWords(words) {
        const meaningfulWords = [];
        const commonSuffixes = ['ها', 'های', 'ترین', 'تر', 'ی', 'ان', 'ات', 'مان'];
        
        words.forEach(word => {
            let baseWord = word;
            
            // حذف پسوندهای رایج
            for (let suffix of commonSuffixes) {
                if (baseWord.endsWith(suffix)) {
                    baseWord = baseWord.slice(0, -suffix.length);
                    break;
                }
            }
            
            if (baseWord.length >= 3 && !this.isCommonWord(baseWord)) {
                meaningfulWords.push(baseWord);
            }
        });
        
        return meaningfulWords;
    }

    isCommonWord(word) {
        const commonWords = [
            'این', 'آن', 'برای', 'چگونه', 'چرا', 'چه', 'است', 'بود', 'شد',
            'گیری', 'دهی', 'سازی', 'ندگی', 'بندی', 'ریزی', 'شناسی'
        ];
        return commonWords.includes(word);
    }

    isStopWord(word) {
        const stopWords = [
            'های', 'ترین', 'هایی', 'چگونه', 'چرا', 'چه', 'برای', 
            'این', 'آن', 'را', 'با', 'به', 'از', 'که', 'در'
        ];
        return stopWords.includes(word);
    }

    updateDomainKnowledge(domainsUsed, newConcepts) {
        domainsUsed.forEach(domain => {
            if (this.domains.has(domain)) {
                const domainData = this.domains.get(domain);
                
                // فقط مفاهیم معنادار اضافه شوند
                const meaningfulConcepts = newConcepts.filter(concept => 
                    concept.length >= 3 && !this.isCommonWord(concept)
                );
                
                if (meaningfulConcepts.length > 0) {
                    domainData.concepts = [...new Set([...domainData.concepts, ...meaningfulConcepts])];
                    domainData.interactions++;
                    domainData.lastUsed = Date.now();
                    this.domains.set(domain, domainData);
                }
            }
        });
        this.saveToFile();
    }

    learnFromInteraction(question, response, confidence, domainsUsed) {
        const learningRecord = {
            timestamp: Date.now(),
            question,
            response,
            confidence,
            domainsUsed,
            learned: false
        };

        const newConcepts = this.extractNewConcepts(question, response);
        
        if (newConcepts.length > 0) {
            learningRecord.learned = true;
            learningRecord.newConcepts = newConcepts;
            this.updateDomainKnowledge(domainsUsed, newConcepts);
        }

        this.interactionHistory.push(learningRecord);
        
        if (this.interactionHistory.length > 1000) {
            this.interactionHistory = this.interactionHistory.slice(-1000);
        }

        this.saveToFile();
        return learningRecord;
    }

    // جستجوی پیشرفته‌تر با تطابق بهتر
    deepKnowledgeSearch(query, maxDepth = 3) {
        const results = {
            directMatches: [],
            relatedConcepts: [],
            inferredKnowledge: []
        };

        const cleanQuery = query.toLowerCase();
        const queryWords = cleanQuery.split(' ')
            .filter(word => word.length > 2 && !this.isStopWord(word));
        
        for (const [domainId, domainData] of this.domains) {
            domainData.concepts.forEach(concept => {
                const cleanConcept = concept.toLowerCase();
                
                // تطابق مستقیم
                if (cleanQuery.includes(cleanConcept) || cleanConcept.includes(cleanQuery)) {
                    results.directMatches.push({
                        domain: domainId,
                        concept,
                        relevance: 0.9,
                        source: 'direct'
                    });
                }
                
                // تطابق کلمات کلیدی
                queryWords.forEach(queryWord => {
                    if (cleanConcept.includes(queryWord) || queryWord.includes(cleanConcept)) {
                        results.directMatches.push({
                            domain: domainId,
                            concept,
                            relevance: 0.7,
                            source: 'keyword'
                        });
                    }
                });
            });
        }

        // حذف موارد تکراری
        results.directMatches = results.directMatches.filter((v, i, a) => 
            a.findIndex(t => (t.domain === v.domain && t.concept === v.concept)) === i
        );

        // جستجوی مرتبط
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
                            relevance: 0.7 - (0.1 * depth),
                            source: `inferred_depth_${depth}`
                        });
                    }
                });
            }
        }
        return related;
    }

    getLearningStats() {
        const totalInteractions = this.interactionHistory.length;
        const learningInteractions = this.interactionHistory.filter(i => i.learned).length;
        const totalConcepts = Array.from(this.domains.values())
            .reduce((sum, domain) => sum + domain.concepts.length, 0);

        let mostActiveDomain = '';
        let maxInteractions = 0;
        
        for (const [domainId, domainData] of this.domains) {
            if (domainData.interactions > maxInteractions) {
                maxInteractions = domainData.interactions;
                mostActiveDomain = domainId;
            }
        }

        return {
            totalInteractions,
            learningInteractions,
            learningRate: learningInteractions / Math.max(1, totalInteractions),
            totalDomains: this.domains.size,
            totalConcepts,
            mostActiveDomain,
            domainHealth: this.calculateDomainHealth()
        };
    }

    calculateDomainHealth() {
        const health = {};
        for (const [domainId, domainData] of this.domains) {
            const interactionScore = Math.min(domainData.interactions / 10, 1);
            const conceptScore = Math.min(domainData.concepts.length / 20, 1);
            const recencyScore = Date.now() - domainData.lastUsed < 86400000 ? 1 : 0.5; // 24 hours
            
            health[domainId] = {
                score: (interactionScore * 0.4) + (conceptScore * 0.4) + (recencyScore * 0.2),
                status: interactionScore > 0.7 ? 'عالی' : interactionScore > 0.3 ? 'خوب' : 'نیاز به توجه'
            };
        }
        return health;
    }
}

module.exports = EnhancedKnowledgeCore;
