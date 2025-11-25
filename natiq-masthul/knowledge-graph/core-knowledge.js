/**
 * گراف دانش هسته سیستم نطق مصطلح
 */

class CoreKnowledgeGraph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
        this.domainWeights = new Map();
        this.initCoreGraph();
    }

    initCoreGraph() {
        // گره‌های دانش پایه
        this.addNode('customer_recovery', {
            type: 'strategy_domain',
            patterns: ['بازگرداندن مشتری', 'مشتری ناراضی', 'جذب مجدد'],
            weight: 0.9,
            dependencies: ['psychology', 'business_strategy', 'communication']
        });

        this.addNode('psychology', {
            type: 'foundation',
            patterns: ['روانشناسی', 'انگیزه', 'رفتار مشتری'],
            weight: 0.8,
            principles: [
                'مشتری حریص با ارزش محسوس بازمی‌گردد',
                'اعتماد با شفافیت ساخته می‌شود',
                'درک عمیق نیازها کلید موفقیت است'
            ]
        });

        this.addNode('business_strategy', {
            type: 'foundation',
            patterns: ['استراتژی کسب‌وکار', 'بازگشت سرمایه', 'ROI'],
            weight: 0.85,
            principles: [
                'تمرکز بر ارزش مالی قابل اندازه‌گیری',
                'ارائه تضمین نتایج',
                'تحلیل هزینه-فایده'
            ]
        });

        this.addNode('communication', {
            type: 'skill',
            patterns: ['ارتباط', 'مکالمه', 'برقراری ارتباط'],
            weight: 0.75,
            techniques: [
                'ارتباط مستقیم مدیریت ارشد',
                'عذرخواهی صادقانه',
                'شنیدن فعال دغدغه‌ها'
            ]
        });

        // ایجاد یال‌های ارتباطی
        this.addEdge('customer_recovery', 'psychology', 0.9);
        this.addEdge('customer_recovery', 'business_strategy', 0.95);
        this.addEdge('customer_recovery', 'communication', 0.8);
    }

    addNode(id, data) {
        this.nodes.set(id, {
            id,
            ...data,
            activation: 0,
            lastUsed: Date.now()
        });
    }

    addEdge(from, to, weight) {
        const edgeId = `${from}_${to}`;
        this.edges.set(edgeId, { from, to, weight });
        
        if (!this.edges.has(from)) {
            this.edges.set(from, []);
        }
        this.edges.get(from).push({ to, weight });
    }

    activateNodes(questionPatterns) {
        // فعال‌سازی گره‌ها بر اساس تطابق با سوال
        for (const [nodeId, node] of this.nodes) {
            let activation = 0;
            
            for (const pattern of node.patterns) {
                if (questionPatterns.some(qp => qp.includes(pattern))) {
                    activation += node.weight * 0.3;
                }
            }

            // فعال‌سازی گره‌های وابسته
            const edges = this.edges.get(nodeId) || [];
            for (const edge of edges) {
                const dependentNode = this.nodes.get(edge.to);
                if (dependentNode) {
                    activation += dependentNode.weight * edge.weight * 0.2;
                }
            }

            node.activation = Math.min(1, activation);
        }

        return this.getActiveNodes();
    }

    getActiveNodes() {
        return Array.from(this.nodes.values())
            .filter(node => node.activation > 0.1)
            .sort((a, b) => b.activation - a.activation);
    }

    strengthenConnection(from, to, strengthIncrease = 0.05) {
        const edgeId = `${from}_${to}`;
        if (this.edges.has(edgeId)) {
            this.edges.get(edgeId).weight = Math.min(1, 
                this.edges.get(edgeId).weight + strengthIncrease
            );
        }
    }
}

module.exports = CoreKnowledgeGraph;
