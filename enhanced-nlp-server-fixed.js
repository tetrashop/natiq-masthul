const express = require('express');
const natural = require('natural');
const sentiment = require('sentiment');
const app = express();
const PORT = 3007;

app.use(express.json());
app.use(express.static('frontend'));

// راه‌اندازی tokenizer برای زبان فارسی (بدون PorterStemmer)
const tokenizer = new natural.WordTokenizer();

let nlpPosts = [];

// Routes پایه
app.get('/health', (req, res) => {
    res.json({ 
        status: '✅ سرور NLP پیشرفته فعال',
        port: PORT,
        totalPosts: nlpPosts.length,
        features: ['تولید پست', 'تحلیل احساسات', 'کلمات کلیدی', 'تحلیل آماری']
    });
});

app.get('/api/nlp/posts', (req, res) => {
    res.json(nlpPosts);
});

app.post('/api/nlp/generate-samples', (req, res) => {
    console.log('🚀 شروع تولید ۱۶۲ پست نمونه...');
    
    nlpPosts = [];
    const topics = ['پردازش زبان طبیعی', 'یادگیری ماشین', 'هوش مصنوعی', 'داده‌کاوی', 'شبکه‌های عصبی'];
    const emotions = ['عالی', 'جالب', 'مهم', 'کاربردی', 'پیچیده'];
    
    for (let i = 1; i <= 162; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const emotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        nlpPosts.push({
            id: i,
            title: `پست ${i} درباره ${topic}`,
            content: `این پست شماره ${i} در مورد ${topic} است. موضوع ${emotion} و بسیار کاربردی می‌باشد. ما در این پست به بررسی جنبه‌های مختلف ${topic} می‌پردازیم.`,
            tags: [topic, 'NLP', emotion],
            category: topic,
            author: 'سیستم',
            createdAt: new Date(),
            length: Math.floor(Math.random() * 100) + 50
        });
    }
    
    console.log(`✅ ${nlpPosts.length} پست نمونه ایجاد شد`);
    res.json({ 
        success: true,
        message: '۱۶۲ پست نمونه با موفقیت ایجاد شد',
        count: nlpPosts.length
    });
});

// 🔥 تحلیل احساسات پیشرفته
app.get('/api/nlp/sentiment-analysis', (req, res) => {
    console.log('📊 شروع تحلیل احساسات...');
    
    const sentimentResults = nlpPosts.map(post => {
        try {
            const analysis = sentiment(post.content);
            
            // تشخیص احساس بر اساس امتیاز
            let sentimentLabel = 'خنثی';
            if (analysis.score > 2) sentimentLabel = 'بسیار مثبت';
            else if (analysis.score > 0) sentimentLabel = 'مثبت';
            else if (analysis.score < -2) sentimentLabel = 'بسیار منفی';
            else if (analysis.score < 0) sentimentLabel = 'منفی';
            
            return {
                postId: post.id,
                title: post.title,
                sentiment: {
                    score: analysis.score,
                    comparative: analysis.comparative,
                    label: sentimentLabel,
                    positive: analysis.positive,
                    negative: analysis.negative
                },
                content: post.content.substring(0, 100) + '...'
            };
        } catch (error) {
            return {
                postId: post.id,
                title: post.title,
                sentiment: { error: 'خطا در تحلیل' },
                content: post.content.substring(0, 100) + '...'
            };
        }
    });
    
    // آمار کلی
    const stats = sentimentResults.reduce((acc, item) => {
        if (item.sentiment.label) {
            acc[item.sentiment.label] = (acc[item.sentiment.label] || 0) + 1;
        }
        return acc;
    }, {});
    
    res.json({
        totalPosts: sentimentResults.length,
        sentimentStats: stats,
        detailedAnalysis: sentimentResults.slice(0, 20) // فقط ۲۰ مورد اول
    });
});

// 🔑 استخراج کلمات کلیدی
app.get('/api/nlp/keyword-analysis', (req, res) => {
    console.log('🔑 استخراج کلمات کلیدی...');
    
    const allText = nlpPosts.map(post => 
        post.title + ' ' + post.content
    ).join(' ');
    
    // توکنایز کردن متن
    const tokens = tokenizer.tokenize(allText);
    
    // محاسبه فرکانس کلمات
    const wordFreq = {};
    tokens.forEach(token => {
        // فیلتر کردن کلمات کوتاه و عمومی
        if (token && token.length > 3 && !['این', 'است', 'های', 'ترین', 'باشد', 'می‌باشد'].includes(token)) {
            const cleanToken = token.replace(/[.,!?;]/g, '');
            if (cleanToken.length > 2) {
                wordFreq[cleanToken] = (wordFreq[cleanToken] || 0) + 1;
            }
        }
    });
    
    // مرتب‌سازی بر اساس فرکانس
    const topKeywords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([word, count]) => ({
            word,
            count,
            frequency: ((count / tokens.length) * 100).toFixed(2) + '%'
        }));
    
    res.json({
        totalTokens: tokens.length,
        uniqueWords: Object.keys(wordFreq).length,
        topKeywords: topKeywords,
        sampleTokens: tokens.slice(0, 10)
    });
});

// 📈 تحلیل آماری
app.get('/api/nlp/stats', (req, res) => {
    const stats = {
        totalPosts: nlpPosts.length,
        totalCharacters: nlpPosts.reduce((sum, post) => sum + post.content.length, 0),
        totalWords: nlpPosts.reduce((sum, post) => sum + post.content.split(' ').length, 0),
        averagePostLength: Math.round(nlpPosts.reduce((sum, post) => sum + post.content.length, 0) / nlpPosts.length),
        categories: {},
        tags: {}
    };
    
    // تحلیل دسته‌بندی‌ها
    nlpPosts.forEach(post => {
        stats.categories[post.category] = (stats.categories[post.category] || 0) + 1;
        post.tags.forEach(tag => {
            stats.tags[tag] = (stats.tags[tag] || 0) + 1;
        });
    });
    
    res.json(stats);
});

// سرو کردن صفحات
app.get('/nlp-dashboard.html', (req, res) => {
    res.sendFile(process.cwd() + '/frontend/nlp-advanced.html');
});

app.get('/', (req, res) => {
    res.redirect('/nlp-dashboard.html');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 سرور NLP پیشرفته راه‌اندازی شد!');
    console.log('📍 پورت: ' + PORT);
    console.log('📊 آدرس دشبورد:');
    console.log('   http://localhost:' + PORT + '/nlp-dashboard.html');
    console.log('🔗 آدرس API سلامت:');
    console.log('   http://localhost:' + PORT + '/health');
    console.log('🎉 =================================');
});
