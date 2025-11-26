class PersianNLP {
    constructor() {
        this.persianStopWords = new Set([
            'در', 'به', 'از', 'که', 'این', 'را', 'با', 'است', 'را', 'یک', 'های', 'برای',
            'آن', 'باشد', 'شود', 'های', 'کرد', 'کردن', 'باشد', 'شود', 'گیری', 'گیری'
        ]);
        
        this.sentimentLexicon = {
            positive: ['خوب', 'عالی', 'ممتاز', 'عالی', 'فوقالعاده', 'بینظیر'],
            negative: ['بد', 'ضعیف', 'نامطلوب', 'ناخوشایند', 'مشکل']
        };
    }

    processText(text) {
        const tokens = this.tokenize(text);
        const cleanTokens = this.removeStopWords(tokens);
        
        return {
            original: text,
            tokens: cleanTokens,
            stemmed: this.stemming(cleanTokens),
            sentiment: this.analyzeSentiment(text),
            entities: this.extractPersianEntities(text),
            statistics: {
                wordCount: tokens.length,
                uniqueWords: new Set(tokens).size,
                sentenceCount: this.countSentences(text),
                complexity: this.calculateComplexity(text)
            }
        };
    }

    tokenize(text) {
        return text
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0)
            .map(word => word.trim());
    }

    removeStopWords(tokens) {
        return tokens.filter(token => !this.persianStopWords.has(token));
    }

    stemming(tokens) {
        const stemmed = [];
        
        for (const token of tokens) {
            let stem = token;
            
            const suffixes = ['ها', 'ان', 'ات', 'ین', 'ی', 'مر', 'ترین'];
            for (const suffix of suffixes) {
                if (stem.endsWith(suffix)) {
                    stem = stem.slice(0, -suffix.length);
                    break;
                }
            }
            
            stemmed.push(stem);
        }
        
        return stemmed;
    }

    analyzeSentiment(text) {
        let score = 0;
        const tokens = this.tokenize(text);
        
        tokens.forEach(token => {
            if (this.sentimentLexicon.positive.includes(token)) score++;
            if (this.sentimentLexicon.negative.includes(token)) score--;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }

    extractPersianEntities(text) {
        const entities = [];
        
        const namePattern = /([\u0600-\u06FF]{2,})\s+([\u0600-\u06FF]{2,})/g;
        let match;
        while ((match = namePattern.exec(text)) !== null) {
            entities.push({
                type: 'PERSON',
                value: match[0],
                confidence: 0.7
            });
        }
        
        const locationIndicators = ['در', 'به', 'از', 'تا'];
        const tokens = this.tokenize(text);
        for (let i = 0; i < tokens.length - 1; i++) {
            if (locationIndicators.includes(tokens[i]) && tokens[i + 1].length > 2) {
                entities.push({
                    type: 'LOCATION',
                    value: tokens[i + 1],
                    confidence: 0.6
                });
            }
        }
        
        return entities;
    }

    countSentences(text) {
        return text.split(/[.!?۔]+/).filter(s => s.trim().length > 0).length;
    }

    calculateComplexity(text) {
        const words = this.tokenize(text);
        const uniqueWords = new Set(words);
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        
        const complexity = (
            (uniqueWords.size / words.length) * 0.4 +
            (avgWordLength / 10) * 0.3 +
            (this.countSentences(text) / Math.max(1, words.length)) * 0.3
        );
        
        return Math.min(1, complexity);
    }
}

module.exports = PersianNLP;
