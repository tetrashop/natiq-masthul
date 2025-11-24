const AdvancedIntentRecognition = require('../../src/nlp/advanced-intent-recognition');
const AdvancedKnowledgeGraph = require('../../src/knowledge/advanced-knowledge-graph');

describe('Performance Tests', () => {
    let intentRecognizer;
    let knowledgeGraph;

    beforeAll(() => {
        intentRecognizer = new AdvancedIntentRecognition();
        knowledgeGraph = new AdvancedKnowledgeGraph();
    });

    test('Intent recognition should respond under 100ms', () => {
        const startTime = Date.now();
        
        for (let i = 0; i < 100; i++) {
            intentRecognizer.detectIntent('رامین اجلال کیست؟');
        }
        
        const endTime = Date.now();
        const averageTime = (endTime - startTime) / 100;
        
        expect(averageTime).toBeLessThan(100);
    });

    test('Knowledge graph query should respond under 50ms', () => {
        const startTime = Date.now();
        
        knowledgeGraph.query({ type: 'person' });
        
        const endTime = Date.now();
        const queryTime = endTime - startTime;
        
        expect(queryTime).toBeLessThan(50);
    });

    test('System should handle 1000 concurrent requests', async () => {
        const requests = Array.from({ length: 1000 }, (_, i) => 
            intentRecognizer.detectIntent(`سوال تستی ${i}`)
        );
        
        const startTime = Date.now();
        await Promise.all(requests);
        const endTime = Date.now();
        
        expect(endTime - startTime).toBeLessThan(5000);
    });
});
