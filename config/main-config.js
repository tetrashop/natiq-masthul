module.exports = {
    // تنظیمات سرور
    server: {
        port: 3001,
        host: 'localhost',
        apiPrefix: '/api/v1'
    },
    
    // تنظیمات هوش مصنوعی
    ai: {
        model: 'natiq-enhanced-v3',
        maxTokens: 2000,
        temperature: 0.7,
        topP: 0.9
    },
    
    // تنظیمات NLP
    nlp: {
        maxSequenceLength: 173,
        embeddingSize: 512,
        attentionHeads: 8,
        layers: 6
    },
    
    // تنظیمات کش
    cache: {
        maxSize: 1000,
        ttl: 3600000, // 1 hour
        cleanupInterval: 600000 // 10 minutes
    },
    
    // تنظیمات امنیتی
    security: {
        rateLimit: 100, // requests per minute
        timeout: 30010,
        corsOrigins: ['http://localhost:3001']
    }
};
