/**
 * گراف دانش هسته سیستم نطق مصطلح - نسخه بهبود یافته
 */

class CoreKnowledgeGraph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
        this.domainWeights = new Map();
        this.initCoreGraph();
    }

    initCoreGraph() {
        // گره‌های دانش پایه - گسترش یافته
        this.addNode('customer_recovery', {
            type: 'strategy_domain',
            patterns: [
                'بازگرداندن مشتری', 'مشتری ناراضی', 'جذب مجدد', 'مشتری از دست رفته',
                'برگرداندن کاربر', 'مشتری حریص', 'کنار گذاشته', 'لغو اشتراک',
                'ترک کرده', 'عودت مشتری', 'بازگشت کاربر'
            ],
            weight: 0.95,
            dependencies: ['psychology', 'business_strategy', 'communication', 'value_proposition']
        });

        this.addNode('psychology', {
            type: 'foundation',
            patterns: [
                'روانشناسی', 'انگیزه', 'رفتار مشتری', 'حریص', 'نیاز', 
                'انگیزش', 'رفتار', 'ذهنیت', 'نگرش', 'تمایل'
            ],
            weight: 0.9,
            principles: [
                'مشتری حریص با ارزش محسوس بازمی‌گردد',
                'اعتماد با شفافیت ساخته می‌شود',
                'درک عمیق نیازها کلید موفقیت است',
                'مشتریان بر اساس ارزش تصمیم می‌گیرند',
                'رضایت احساسی منجر به وفاداری می‌شود'
            ]
        });

        this.addNode('business_strategy', {
            type: 'foundation',
            patterns: [
                'استراتژی کسب‌وکار', 'بازگشت سرمایه', 'ROI', 'سود', 'منفعت',
                'ارزش مالی', 'هزینه', 'فایده', 'سرمایه', 'بازدهی',
                'اقتصادی', 'مالی', 'سودآوری'
            ],
            weight: 0.88,
            principles: [
                'تمرکز بر ارزش مالی قابل اندازه‌گیری',
                'ارائه تضمین نتایج',
                'تحلیل هزینه-فایده',
                'بازگشت سرمایه سریع عامل کلیدی است',
                'شفافیت مالی اعتماد می‌آورد'
            ]
        });

        this.addNode('communication', {
            type: 'skill',
            patterns: [
                'ارتباط', 'مکالمه', 'برقراری ارتباط', 'تماس', 'گفتگو',
                'مصاحبه', 'مذاکره', 'صحبت', 'گفت‌وگو', 'تعامل'
            ],
            weight: 0.8,
            techniques: [
                'ارتباط مستقیم مدیریت ارشد',
                'عذرخواهی صادقانه',
                'شنیدن فعال دغدغه‌ها',
                'برقراری ارتباط شخصی‌شده',
                'پاسخ سریع و مؤثر'
            ]
        });

        this.addNode('value_proposition', {
            type: 'strategy',
            patterns: [
                'ارزش', 'مزیت', 'فایده', 'منفعت', 'سودمندی',
                'کاربرد', 'قابلیت', 'امکانات', 'ویژگی', 'مزایا'
            ],
            weight: 0.85,
            principles: [
                'ارزش واضح و ملموس ارائه دهید',
                'مزیت رقابتی مشخص نشان دهید',
                'نیازهای اصلی مشتری را هدف بگیرید',
                'راه‌حل‌های عملی پیشنهاد دهید'
            ]
        });

        this.addNode('software_business', {
            type: 'domain',
            patterns: [
                'نرم‌افزار', 'اپلیکیشن', 'برنامه', 'سیستم', 'سرویس',
                'ساختار', 'پلتفرم', 'ابزار', 'پروژه', 'توسعه'
            ],
            weight: 0.8,
            principles: [
                'بهبود مستمر محصول ضروری است',
                'تجربه کاربری عامل تعیین‌کننده است',
                'پشتیبانی قوی تفاوت ایجاد می‌کند'
            ]
        });

        // ایجاد یال‌های ارتباطی پیشرفته
        this.addEdge('customer_recovery', 'psychology', 0.95);
        this.addEdge('customer_recovery', 'business_strategy', 0.92);
        this.addEdge('customer_recovery', 'communication', 0.88);
        this.addEdge('customer_recovery', 'value_proposition', 0.9);
        this.addEdge('customer_recovery', 'software_business', 0.85);
        
        this.addEdge('psychology', 'business_strategy', 0.8);
        this.addEdge('business_strategy', 'value_proposition', 0.9);
        this.addEdge('communication', 'psychology', 0.75);
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
        console.log('🔍 الگوهای شناسایی شده:', questionPatterns);
        
        // فعال‌سازی گره‌ها بر اساس تطابق با سوال
        for (const [nodeId, node] of this.nodes) {
            let activation = 0;
            
            for (const pattern of node.patterns) {
                for (const qp of questionPatterns) {
                    if (qp.includes(pattern) || pattern.includes(qp)) {
                        activation += node.weight * 0.5; // افزایش ضریب تطابق
                        console.log(`✅ تطابق: "${pattern}" با "${qp}" -> +${node.weight * 0.5}`);
                        break;
                    }
                }
            }

            // فعال‌سازی گره‌های وابسته
            const edges = this.edges.get(nodeId) || [];
            for (const edge of edges) {
                const dependentNode = this.nodes.get(edge.to);
                if (dependentNode) {
                    activation += dependentNode.weight * edge.weight * 0.3;
                }
            }

            node.activation = Math.min(1, activation);
            console.log(`🎯 فعال‌سازی گره ${nodeId}: ${node.activation}`);
        }

        return this.getActiveNodes();
    }

    getActiveNodes() {
        const activeNodes = Array.from(this.nodes.values())
            .filter(node => node.activation > 0.1)
            .sort((a, b) => b.activation - a.activation);
        
        console.log('📊 گره‌های فعال:', activeNodes.map(n => `${n.id} (${(n.activation * 100).toFixed(1)}%)`));
        return activeNodes;
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
