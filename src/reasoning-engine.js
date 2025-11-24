/**
 * موتور استدلال و حل مسئله برای نطق مصطلح
 */

export class ReasoningEngine {
    constructor() {
        this.solvedProblems = new Map();
        this.problemPatterns = this.defineProblemPatterns();
        this.learningThreshold = 0.8; // آستانه اطمینان برای یادگیری
    }

    defineProblemPatterns() {
        return {
            'mathematical': {
                name: 'مسائل ریاضی',
                patterns: [
                    'محاسبه کن', 'حل کن', 'مسئله', 'ریاضی', 'جمع', 'تفریق',
                    'ضرب', 'تقسیم', 'معادله', 'محاسبه', 'چند میشود', 'حاصل'
                ],
                solver: this.solveMathematicalProblem.bind(this)
            },
            'logical': {
                name: 'مسائل منطقی',
                patterns: [
                    'منطقی', 'استدلال', 'اگر آنگاه', 'شرطی', 'استنتاج',
                    'نتیجه گیری', 'تحلیل منطقی', 'دلیل'
                ],
                solver: this.solveLogicalProblem.bind(this)
            },
            'pattern_recognition': {
                name: 'تشخیص الگو',
                patterns: [
                    'الگو', 'دنباله', 'پترن', 'قاعده', 'فرمول',
                    'تکرار', 'سری', 'ترتیب'
                ],
                solver: this.solvePatternRecognition.bind(this)
            }
        };
    }

    async analyzeProblemType(question) {
        const normalizedQuestion = question.toLowerCase().trim();
        
        let maxScore = 0;
        let bestType = null;
        let matchedPatterns = [];

        for (const [typeId, type] of Object.entries(this.problemPatterns)) {
            let typeScore = 0;
            const typeMatches = [];

            for (const pattern of type.patterns) {
                if (normalizedQuestion.includes(pattern.toLowerCase())) {
                    typeScore += pattern.length * 0.1;
                    typeMatches.push(pattern);
                }
            }

            if (typeScore > maxScore) {
                maxScore = typeScore;
                bestType = type;
                matchedPatterns = typeMatches;
            }
        }

        return {
            type: bestType,
            confidence: Math.min(1, maxScore),
            matchedPatterns: matchedPatterns,
            isSolvable: maxScore > 0.3
        };
    }

    solveMathematicalProblem(question) {
        try {
            // استخراج اعداد و عملگرها از سوال
            const numbers = question.match(/\d+/g)?.map(Number) || [];
            const operators = question.match(/[+\-×÷*\/]/g) || [];
            
            let result = null;
            let solutionSteps = [];
            let confidence = 0.7;

            // تشخیص نوع عملیات ریاضی
            if (question.includes('جمع') || question.includes('+')) {
                result = numbers.reduce((a, b) => a + b, 0);
                solutionSteps = numbers.map((num, i) => `عدد ${i+1}: ${num}`);
                solutionSteps.push(`جمع: ${numbers.join(' + ')} = ${result}`);
                confidence = 0.9;
            }
            else if (question.includes('ضرب') || question.includes('*') || question.includes('×')) {
                result = numbers.reduce((a, b) => a * b, 1);
                solutionSteps = numbers.map((num, i) => `عدد ${i+1}: ${num}`);
                solutionSteps.push(`ضرب: ${numbers.join(' × ')} = ${result}`);
                confidence = 0.9;
            }
            else if (question.includes('تفریق') || question.includes('-')) {
                if (numbers.length >= 2) {
                    result = numbers[0] - numbers[1];
                    solutionSteps = [`تفریق: ${numbers[0]} - ${numbers[1]} = ${result}`];
                    confidence = 0.9;
                }
            }
            else if (question.includes('تقسیم') || question.includes('/') || question.includes('÷')) {
                if (numbers.length >= 2 && numbers[1] !== 0) {
                    result = numbers[0] / numbers[1];
                    solutionSteps = [`تقسیم: ${numbers[0]} ÷ ${numbers[1]} = ${result}`];
                    confidence = 0.9;
                }
            }

            return {
                solvable: result !== null,
                result: result,
                solutionSteps: solutionSteps,
                confidence: confidence,
                explanation: this.generateMathExplanation(question, result, solutionSteps)
            };
        } catch (error) {
            return {
                solvable: false,
                error: 'خطا در حل مسئله ریاضی',
                confidence: 0.1
            };
        }
    }

    solveLogicalProblem(question) {
        // تحلیل مسائل منطقی ساده
        const logicalPatterns = {
            'اگر همه انسان‌ها فانی هستند و سقراط انسان است، پس سقراط فانی است': {
                type: 'قیاس منطقی',
                result: true,
                explanation: 'این یک قیاس استاندارد است: همه Aها B هستند، C یک A است، بنابراین C یک B است.',
                confidence: 0.95
            }
        };

        for (const [pattern, solution] of Object.entries(logicalPatterns)) {
            if (question.includes(pattern.substring(0, 20))) { // مقایسه بخشی از متن
                return {
                    solvable: true,
                    result: solution.result,
                    explanation: solution.explanation,
                    confidence: solution.confidence,
                    solutionType: solution.type
                };
            }
        }

        return {
            solvable: false,
            error: 'نمی‌توانم این مسئله منطقی را حل کنم',
            confidence: 0.3
        };
    }

    solvePatternRecognition(question) {
        // تشخیص الگوهای ساده عددی
        const numbers = question.match(/\d+/g)?.map(Number) || [];
        
        if (numbers.length >= 3) {
            // بررسی الگوی جمع
            const sumPattern = this.detectSumPattern(numbers);
            if (sumPattern) {
                return {
                    solvable: true,
                    result: sumPattern.nextNumber,
                    pattern: sumPattern.description,
                    confidence: 0.8,
                    explanation: `الگو: ${sumPattern.description}. عدد بعدی: ${sumPattern.nextNumber}`
                };
            }

            // بررسی الگوی ضرب
            const multiplyPattern = this.detectMultiplyPattern(numbers);
            if (multiplyPattern) {
                return {
                    solvable: true,
                    result: multiplyPattern.nextNumber,
                    pattern: multiplyPattern.description,
                    confidence: 0.8,
                    explanation: `الگو: ${multiplyPattern.description}. عدد بعدی: ${multiplyPattern.nextNumber}`
                };
            }
        }

        return {
            solvable: false,
            error: 'نمی‌توانم الگوی این دنباله را تشخیص دهم',
            confidence: 0.3
        };
    }

    detectSumPattern(numbers) {
        const differences = [];
        for (let i = 1; i < numbers.length; i++) {
            differences.push(numbers[i] - numbers[i-1]);
        }
        
        if (differences.every(diff => diff === differences[0])) {
            const nextNumber = numbers[numbers.length - 1] + differences[0];
            return {
                nextNumber: nextNumber,
                description: `جمع ${differences[0]}`
            };
        }
        return null;
    }

    detectMultiplyPattern(numbers) {
        const ratios = [];
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i-1] !== 0) {
                ratios.push(numbers[i] / numbers[i-1]);
            }
        }
        
        if (ratios.length > 0 && ratios.every(ratio => ratio === ratios[0])) {
            const nextNumber = numbers[numbers.length - 1] * ratios[0];
            return {
                nextNumber: nextNumber,
                description: `ضرب در ${ratios[0]}`
            };
        }
        return null;
    }

    generateMathExplanation(question, result, steps) {
        return `**حل مسئله ریاضی:**

سوال: "${question}"

مراحل حل:
${steps.map(step => `• ${step}`).join('\n')}

نتیجه: **${result}**

این مسئله با موفقیت حل شد و به دانش من اضافه گردید.`;
    }

    async learnNewProblem(question, solution, domain = 'general') {
        const problemId = this.generateProblemId(question);
        
        this.solvedProblems.set(problemId, {
            question: question,
            solution: solution,
            domain: domain,
            timestamp: new Date().toISOString(),
            confidence: solution.confidence,
            usageCount: 1
        });

        // ذخیره در حافظه پایدار (در نسخه کامل می‌تواند در پایگاه داده باشد)
        await this.persistKnowledge(problemId, this.solvedProblems.get(problemId));

        return problemId;
    }

    generateProblemId(question) {
        const normalized = question.toLowerCase().replace(/[^\w\u0600-\u06FF]/g, '');
        return `problem_${Buffer.from(normalized).toString('base64').substring(0, 16)}`;
    }

    async persistKnowledge(problemId, data) {
        // در این نسخه ساده، در localStorage مرورگر ذخیره می‌شود
        // در نسخه کامل می‌تواند به سرور ارسال شود
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`natiq_knowledge_${problemId}`, JSON.stringify(data));
        }
        
        // همچنین در حافظه داخلی سیستم نگهداری می‌شود
        this.solvedProblems.set(problemId, data);
    }

    async recallSimilarProblem(question) {
        const problemId = this.generateProblemId(question);
        let storedSolution = null;

        // جستجو در حافظه محلی
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(`natiq_knowledge_${problemId}`);
            if (stored) {
                storedSolution = JSON.parse(stored);
            }
        }

        // جستجو در حافظه فعال
        if (!storedSolution && this.solvedProblems.has(problemId)) {
            storedSolution = this.solvedProblems.get(problemId);
        }

        return storedSolution;
    }

    getLearningStats() {
        return {
            totalSolved: this.solvedProblems.size,
            byDomain: this.getProblemsByDomain(),
            recentProblems: Array.from(this.solvedProblems.values())
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 5)
        };
    }

    getProblemsByDomain() {
        const domains = {};
        for (const problem of this.solvedProblems.values()) {
            domains[problem.domain] = (domains[problem.domain] || 0) + 1;
        }
        return domains;
    }
}
