const express = require('express');
const app = express();
const PORT = 3006;

app.use(express.json());
app.use(express.static('frontend'));

let nlpPosts = [];
let postCount = 0;

// Routes
app.get('/health', (req, res) => {
    res.json({ 
        status: '✅ سرور NLP فعال',
        port: PORT,
        totalPosts: nlpPosts.length,
        timestamp: new Date().toLocaleString('fa-IR')
    });
});

app.get('/api/nlp/posts', (req, res) => {
    res.json(nlpPosts);
});

app.post('/api/nlp/generate-samples', (req, res) => {
    console.log('🚀 شروع تولید ۱۶۲ پست نمونه...');
    
    nlpPosts = [];
    for (let i = 1; i <= 162; i++) {
        nlpPosts.push({
            id: i,
            title: `پست NLP نمونه ${i}`,
            content: `این محتوای نمونه برای پست NLP شماره ${i} است. این پست بخشی از مجموعه کامل پردازش زبان طبیعی می‌باشد.`,
            tags: ['NLP', 'پردازش متن', 'هوش مصنوعی'],
            category: 'پردازش زبان طبیعی',
            author: 'سیستم',
            createdAt: new Date()
        });
    }
    
    console.log(`✅ ${nlpPosts.length} پست نمونه ایجاد شد`);
    res.json({ 
        success: true,
        message: '۱۶۲ پست نمونه با موفقیت ایجاد شد',
        count: nlpPosts.length
    });
});

app.get('/nlp.html', (req, res) => {
    res.sendFile(process.cwd() + '/frontend/nlp.html');
});

app.get('/', (req, res) => {
    res.redirect('/nlp.html');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 ================================');
    console.log('✅ سرور NLP با موفقیت راه‌اندازی شد!');
    console.log('📍 پورت: ' + PORT);
    console.log('📚 آدرس صفحه NLP:');
    console.log('   http://localhost:' + PORT + '/nlp.html');
    console.log('🎉 ================================');
});
// اضافه کردن این کد به final-nlp-server.js بعد از خطوط موجود
const natural = require('natural');
const sentiment = require('sentiment');

// تحلیل احساسات پست‌ها
app.get('/api/nlp/sentiment', (req, res) => {
    const postsWithSentiment = nlpPosts.map(post => {
        const analysis = sentiment(post.content);
        return {
            ...post,
            sentiment: {
                score: analysis.score,
                comparative: analysis.comparative,
                sentiment: analysis.score > 0 ? 'مثبت' : analysis.score < 0 ? 'منفی' : 'خنثی'
            }
        };
    });
    res.json(postsWithSentiment);
});

// استخراج کلمات کلیدی
app.get('/api/nlp/keywords', (req, res) => {
    const keywordAnalysis = nlpPosts.map(post => {
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(post.content);
        const freq = {};
        
        tokens.forEach(token => {
            if (token.length > 3) { // فقط کلمات با طول بیشتر از ۳
                freq[token] = (freq[token] || 0) + 1;
            }
        });
        
        const keywords = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5) // ۵ کلمه کلیدی برتر
            .map(([word, count]) => ({ word, count }));
            
        return {
            postId: post.id,
            title: post.title,
            keywords: keywords
        };
    });
    
    res.json(keywordAnalysis);
});
