const natural = require('natural');
const KnowledgeItem = require('../models/KnowledgeItem');

class KnowledgeService {
    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.tfidf = new natural.TfIdf();
        console.log('🧠 Knowledge Base Service Initialized');
    }

    // تولید embeddings ساده برای متن
    async generateEmbeddings(text) {
        const tokens = this.tokenizer.tokenize(text);
        const embedding = new Array(50).fill(0);
        
        tokens.forEach((token, index) => {
            if (index < 50) {
                embedding[index] = token.length / 10;
            }
        });
        
        return embedding;
    }

    // استخراج موجودیت‌ها از متن
    extractEntities(text) {
        const entities = [];
        const patterns = {
            TECH: [/پردازش|زبان|طبیعی|یادگیری|ماشین|هوش|مصنوعی/g],
            MEDICAL: [/پزشکی|درمان|بیماری|سلامت|بالینی/g]
        };

        for (const [label, regex] of Object.entries(patterns)) {
            let match;
            while ((match = regex.exec(text)) !== null) {
                entities.push({
                    text: match[0],
                    label: label,
                    confidence: 0.7
                });
            }
        }

        return entities;
    }

    // استخراج روابط
    extractRelations(text, entities) {
        const relations = [];
        entities.forEach((entity, index) => {
            if (index < entities.length - 1) {
                relations.push({
                    source: entity.text,
                    target: entities[index + 1]?.text,
                    relation: 'related_to',
                    confidence: 0.6
                });
            }
        });
        return relations;
    }

    // تحلیل محتوا
    async analyzeContent(content) {
        try {
            const embeddings = await this.generateEmbeddings(content);
            const entities = this.extractEntities(content);
            const relations = this.extractRelations(content, entities);
            const keywords = this.extractKeywords(content);
            
            return {
                embeddings,
                entities,
                relations,
                keywords,
                wordCount: content.split(' ').length,
                readTime: Math.ceil(content.split(' ').length / 200)
            };
        } catch (error) {
            console.error('Error in content analysis:', error);
            return {
                embeddings: [],
                entities: [],
                relations: [],
                keywords: [],
                wordCount: 0,
                readTime: 0
            };
        }
    }

    // استخراج کلمات کلیدی
    extractKeywords(text, maxKeywords = 10) {
        const tokens = this.tokenizer.tokenize(text);
        const freqMap = {};
        
        tokens.forEach(token => {
            if (token && token.length > 2) {
                freqMap[token] = (freqMap[token] || 0) + 1;
            }
        });
        
        return Object.entries(freqMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxKeywords)
            .map(([word]) => word);
    }

    // افزودن آیتم دانش
    async addKnowledgeItem(itemData) {
        try {
            const analysis = await this.analyzeContent(itemData.content);
            
            const knowledgeItem = new KnowledgeItem({
                ...itemData,
                embeddings: analysis.embeddings,
                entities: analysis.entities,
                relations: analysis.relations,
                keywords: analysis.keywords,
                metadata: {
                    wordCount: analysis.wordCount,
                    readTime: analysis.readTime,
                    language: 'fa'
                }
            });

            await knowledgeItem.save();
            this.tfidf.addDocument(itemData.content);
            
            console.log('✅ Knowledge item added:', itemData.title);
            return knowledgeItem;
            
        } catch (error) {
            console.error('❌ Error adding knowledge item:', error);
            throw error;
        }
    }

    // جستجوی معنایی ساده
    async semanticSearch(query, limit = 10) {
        try {
            const results = await KnowledgeItem.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } },
                    { tags: { $in: [new RegExp(query, 'i')] } }
                ]
            })
            .sort({ confidence: -1 })
            .limit(limit);

            await this.updateUsageStats(results.map(r => r._id));
            return results;
            
        } catch (error) {
            console.error('❌ Semantic search error:', error);
            return [];
        }
    }

    // جستجوی کلیدواژه
    async keywordSearch(query, filters = {}) {
        const searchConditions = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } },
                { keywords: { $in: [new RegExp(query, 'i')] } }
            ]
        };

        if (filters.category) {
            searchConditions.category = filters.category;
        }

        const results = await KnowledgeItem.find(searchConditions)
            .sort({ confidence: -1 })
            .limit(filters.limit || 20);

        await this.updateUsageStats(results.map(r => r._id));
        return results;
    }

    // به روزرسانی آمار
    async updateUsageStats(itemIds) {
        try {
            await KnowledgeItem.updateMany(
                { _id: { $in: itemIds } },
                { 
                    $inc: { 'usageStats.searches': 1 },
                    $set: { 'usageStats.lastAccessed': new Date() }
                }
            );
        } catch (error) {
            console.error('Error updating usage stats:', error);
        }
    }

    // دریافت محتوای مرتبط
    async getRelatedContent(itemId, limit = 5) {
        const item = await KnowledgeItem.findById(itemId);
        if (!item) return [];
        return this.semanticSearch(item.content, limit);
    }

    // تحلیل پایگاه دانش
    async analyzeKnowledgeBase() {
        const stats = {
            totalItems: await KnowledgeItem.countDocuments(),
            categories: await KnowledgeItem.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            usageStats: await KnowledgeItem.aggregate([
                {
                    $group: {
                        _id: null,
                        totalViews: { $sum: '$usageStats.views' },
                        totalSearches: { $sum: '$usageStats.searches' }
                    }
                }
            ])
        };

        return stats;
    }
}

module.exports = new KnowledgeService();
