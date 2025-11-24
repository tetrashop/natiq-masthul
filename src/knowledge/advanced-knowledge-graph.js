class AdvancedKnowledgeGraph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
        this.initializeKnowledgeBase();
    }

    initializeKnowledgeBase() {
        // اضافه کردن نود رامین اجلال
        this.addNode('person:رامین_اجلال', {
            type: 'person',
            name: 'رامین اجلال',
            profession: 'توسعه‌دهنده و محقق هوش مصنوعی',
            expertise: ['پردازش زبان فارسی', 'هوش مصنوعی', 'توسعه نرم‌افزار'],
            achievements: [
                'توسعه سیستم نطق مصطلح',
                'تحقیق در پردازش زبان طبیعی فارسی',
                'توسعه معماری‌های مقیاس‌پذیر'
            ]
        });

        // اضافه کردن نود هوش مصنوعی
        this.addNode('topic:هوش_مصنوعی', {
            type: 'topic',
            name: 'هوش مصنوعی',
            definition: 'شاخه‌ای از علوم کامپیوتر که به ساخت ماشین‌های هوشمند می‌پردازد',
            applications: ['پردازش زبان طبیعی', 'بینایی کامپیوتر', 'سیستم‌های توصیه‌گر']
        });

        // ایجاد ارتباطات
        this.addEdge('person:رامین_اجلال', 'topic:هوش_مصنوعی', 'expert_in');
        this.addEdge('person:رامین_اجلال', 'person:رامین_اجلال', 'has_achievement');
    }

    addNode(id, data) {
        this.nodes.set(id, { id, ...data });
    }

    addEdge(from, to, relationship) {
        const edgeId = `${from}-${relationship}-${to}`;
        this.edges.set(edgeId, { from, to, relationship });
    }

    query(pattern) {
        const results = [];
        
        for (const [id, node] of this.nodes) {
            if (this.matchesPattern(node, pattern)) {
                results.push(node);
            }
        }
        
        return results;
    }

    matchesPattern(node, pattern) {
        for (const [key, value] of Object.entries(pattern)) {
            if (node[key] !== value) {
                return false;
            }
        }
        return true;
    }

    // پرس و جو پیشرفته
    advancedQuery(startNode, maxDepth = 2) {
        const results = new Set();
        const visited = new Set();
        
        const traverse = (nodeId, depth) => {
            if (depth > maxDepth || visited.has(nodeId)) return;
            
            visited.add(nodeId);
            results.add(nodeId);
            
            // پیدا کردن ارتباطات خروجی
            for (const [edgeId, edge] of this.edges) {
                if (edge.from === nodeId) {
                    traverse(edge.to, depth + 1);
                }
            }
        };
        
        traverse(startNode, 0);
        return Array.from(results).map(id => this.nodes.get(id));
    }
}

module.exports = AdvancedKnowledgeGraph;
