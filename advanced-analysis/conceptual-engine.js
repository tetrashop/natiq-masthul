export class ConceptualAnalysisEngine {
    constructor() {
        this.conceptNetwork = this.buildConceptNetwork();
        this.inferenceRules = this.buildInferenceRules();
    }

    buildConceptNetwork() {
        return {
            'تعادل': {
                related: ['انعطاف‌پذیری', 'انطباق', 'تغییر', 'ثبات', 'هماهنگی'],
                opposites: ['تطرف', 'بی‌ثباتی', 'خشک‌اندیشی'],
                dimensions: ['زمانی', 'عاطفی', 'فکری', 'جسمی', 'اجتماعی'],
                levels: ['فردی', 'روابط', 'سازمانی', 'اجتماعی']
            },
            'بهره‌وری': {
                related: ['تمرکز', 'انرژی', 'اولویت‌بندی', 'هدف‌گذاری', 'انضباط'],
                opposites: ['اتلاف', 'پراکندگی', 'بی‌هدفیمی'],
                dimensions: ['کارایی', 'اثربخشی', 'رضایت', 'پایداری'],
                levels: ['فردی', 'تیمی', 'سازمانی']
            },
            'تصمیم‌گیری': {
                related: ['قضاوت', 'ارزش‌ها', 'اطلاعات', 'ریسک', 'نتایج'],
                opposites: ['تعلل', 'شتاب‌زدگی', 'بی‌تفاوتی'],
                dimensions: ['عقلانی', 'عاطفی', 'اخلاقی', 'عملی'],
                levels: ['استراتژیک', 'تاکتیکی', 'عملیاتی']
            }
        };
    }

    buildInferenceRules() {
        return {
            'تعادل': {
                conditions: ['استرس مزمن', 'خستگی مفرط', 'احساس گناه'],
                implications: ['نیاز به بازنگری اولویت‌ها', 'لزوم مرزبندی', 'ضرورت خودمراقبتی'],
                actions: ['ارزیابی زمان‌بندی', 'بازتعریف انتظارات', 'ایجاد سیستم پشتیبانی']
            },
            'بهره‌وری': {
                conditions: ['احساس درجا زدن', 'فرسودگی', 'عدم پیشرفت'],
                implications: ['نیاز به تغییر سیستم', 'بازتعریف معیارهای موفقیت', 'بازسازی انرژی'],
                actions: ['تحلیل موانع', 'بهینه‌سازی فرآیندها', 'ایجاد سیستم پاداش']
            }
        };
    }

    analyzeQuestion(question, userContext = {}) {
        const concepts = this.extractConcepts(question);
        const analysis = {
            primaryConcept: concepts[0],
            relatedConcepts: this.findRelatedConcepts(concepts),
            underlyingNeeds: this.inferUnderlyingNeeds(question, concepts),
            conceptualDimensions: this.analyzeDimensions(concepts),
            inferencePath: this.generateInferencePath(concepts, userContext)
        };

        return analysis;
    }

    extractConcepts(question) {
        const conceptKeywords = {
            'تعادل': ['تعادل', 'توازن', 'میانه', 'تعادل زندگی', 'کار و زندگی'],
            'بهره‌وری': ['بهره‌وری', 'کارایی', 'اثربخشی', 'مدیریت زمان', 'تمرکز'],
            'تصمیم‌گیری': ['تصمیم', 'انتخاب', 'قطعی', 'شک', 'تردید'],
            'رشد': ['رشد', 'توسعه', 'پیشرفت', 'یادگیری', 'تحول'],
            'معنا': ['معنا', 'هدف', 'انگیزه', 'اشتیاق', 'رسالت']
        };

        const foundConcepts = [];
        for (const [concept, keywords] of Object.entries(conceptKeywords)) {
            if (keywords.some(keyword => question.includes(keyword))) {
                foundConcepts.push(concept);
            }
        }

        return foundConcepts.length > 0 ? foundConcepts : ['توسعه فردی'];
    }

    findRelatedConcepts(concepts) {
        const related = new Set();
        concepts.forEach(concept => {
            if (this.conceptNetwork[concept]) {
                this.conceptNetwork[concept].related.forEach(rel => related.add(rel));
            }
        });
        return Array.from(related);
    }

    inferUnderlyingNeeds(question, concepts) {
        const needsMapping = {
            'تعادل': ['نیاز به آرامش', 'نیاز به کنترل', 'نیاز به پیش‌بینی‌پذیری'],
            'بهره‌وری': ['نیاز به پیشرفت', 'نیاز به شناخته شدن', 'نیاز به اثرگذاری'],
            'تصمیم‌گیری': ['نیاز به امنیت', 'نیاز به تایید', 'نیاز به autonomy'],
            'رشد': ['نیاز به کمال', 'نیاز به معنا', 'نیاز به contribution']
        };

        const needs = new Set();
        concepts.forEach(concept => {
            if (needsMapping[concept]) {
                needsMapping[concept].forEach(need => needs.add(need));
            }
        });

        // تحلیل عاطفی سوال
        const emotionalIndicators = {
            'چگونه': 'نیاز به راهنمایی عملی',
            'چرا': 'نیاز به درک علل',
            'چه وقت': 'نیاز به زمان‌بندی',
            'آیا': 'نیاز به تایید یا رد فرضیه'
        };

        for (const [indicator, need] of Object.entries(emotionalIndicators)) {
            if (question.includes(indicator)) {
                needs.add(need);
            }
        }

        return Array.from(needs);
    }

    generateInferencePath(concepts, userContext) {
        const path = [];
        
        concepts.forEach(concept => {
            if (this.inferenceRules[concept]) {
                path.push({
                    concept,
                    conditions: this.inferenceRules[concept].conditions,
                    implications: this.inferenceRules[concept].implications,
                    recommendedActions: this.inferenceRules[concept].actions
                });
            }
        });

        return path;
    }

    analyzeDimensions(concepts) {
        const dimensions = new Set();
        
        concepts.forEach(concept => {
            if (this.conceptNetwork[concept]) {
                this.conceptNetwork[concept].dimensions.forEach(dim => dimensions.add(dim));
            }
        });

        return Array.from(dimensions);
    }
}
