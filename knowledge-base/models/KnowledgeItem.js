const mongoose = require('mongoose');

const knowledgeItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    tags: [{
        type: String,
        index: true
    }],
    embeddings: [Number],
    keywords: [String],
    entities: [{
        type: String,
        label: String
    }],
    relations: [{
        source: String,
        target: String,
        relation: String
    }],
    confidence: {
        type: Number,
        default: 0.8
    },
    source: {
        type: String,
        default: 'system'
    },
    metadata: {
        wordCount: Number,
        readTime: Number,
        language: {
            type: String,
            default: 'fa'
        }
    },
    usageStats: {
        views: { type: Number, default: 0 },
        searches: { type: Number, default: 0 },
        lastAccessed: Date
    },
    version: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

knowledgeItemSchema.index({ title: 'text', content: 'text', tags: 'text' });
knowledgeItemSchema.index({ category: 1, confidence: -1 });

module.exports = mongoose.model('KnowledgeItem', knowledgeItemSchema);
