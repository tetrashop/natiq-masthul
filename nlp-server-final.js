const express = require('express');
const natural = require('natural');
const sentiment = require('sentiment');
const app = express();
const PORT = 3008;

app.use(express.json());
app.use(express.static('frontend'));

let nlpPosts = [];

// توکنایزر سفارشی برای فارسی
function persianTokenizer(text) {
    // حذف اعداد و علائم نگارشی، سپس جدا کردن کلمات
    return text
        .replace(/[0-9۰-۹]/g, ' ') // حذف اعداد
        .replace(/[.,!?;،؛]/g, ' ') // حذف علائم نگارشی
        .split(/\s+/) // جدا کردن بر اساس فاصله
        .filter(word => word.length > 2) // فقط کلمات با طول بیشتر از ۲
        .filter(word => !['این', 'است', 'های', 'ترین', 'باشد', 'می‌باشد', 'about', 'the'].includes(word));
}

// Routes
app.get('/health', (req, res) => {
    res.json({ 
        status: '✅ سرور NLP فارسی فعال',
        port: PORT,
        totalPosts: nlpPosts.length
    });
});

app.get('/api/nlp/posts', (req, res) => {
    res.json(nlpPosts);
});

app.post('/api/nlp/generate-samples', (req, res) => {
    console.log('🚀 شروع تولید ۱۶۲ پست نمونه...');
    
    nlpPosts = [];
    const topics = [
        'پردازش زبان طبیعی', 'یادگیری ماشین', 'هوش مصنوعی', 
        'داده‌کاوی', 'شبکه‌های عصبی', 'پردازش تصویر'
    ];
    
    const adjectives = ['عالی', 'مهم', 'کاربردی', 'جالب', 'پیچیده', 'مدرن'];
    const verbs = ['آنالیز می‌کند', 'پردازش می‌نماید', 'تحلیل می‌کند', 'بررسی می‌نماید'];
    
    for (let i = 1; i <= 162; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        
        nlpPosts.push({
            id: i,
            title: `مقاله ${i} در زمینه ${topic}`,
            content: `این مقاله آموزشی شماره ${i} به موضوع ${topic} می‌پردازد. ${topic} یکی از حوزه‌های ${adj} در علوم کامپیوتر است که داده‌های مختلف را ${verb}. این فناوری در صنایع مختلف کاربردهای گسترده‌ای دارد.`,
            tags: [topic, 'NLP', adj],
            category: topic,
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

// تحلیل احساسات
app.get('/api/nlp/sentiment-analysis', (req, res) => {
    console.log('📊 تحلیل احساسات ۱۶۲ پست...');
    
    const results = nlpPosts.map(post => {
        const analysis = sentiment(post.content);
        const label = analysis.score > 0 ? 'مثبت' : analysis.score < 0 ? 'منفی' : 'خنثی';
        
        return {
            postId: post.id,
            title: post.title,
            score: analysis.score,
            label: label
        };
    });
    
    const stats = results.reduce((acc, curr) => {
        acc[curr.label] = (acc[curr.label] || 0) + 1;
        return acc;
    }, {});
    
    res.json({
        total: results.length,
        stats: stats,
        samples: results.slice(0, 10)
    });
});

// استخراج کلمات کلیدی فارسی
app.get('/api/nlp/persian-keywords', (req, res) => {
    console.log('🔑 استخراج کلمات کلیدی فارسی...');
    
    const allText = nlpPosts.map(post => post.title + ' ' + post.content).join(' ');
    const tokens = persianTokenizer(allText);
    
    const wordFreq = {};
    tokens.forEach(token => {
        if (token && token.length > 2) {
            wordFreq[token] = (wordFreq[token] || 0) + 1;
        }
    });
    
    const topKeywords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word, count]) => ({
            word: word,
            count: count,
            frequency: ((count / tokens.length) * 100).toFixed(2) + '%'
        }));
    
    res.json({
        totalTokens: tokens.length,
        uniqueWords: Object.keys(wordFreq).length,
        topKeywords: topKeywords,
        sampleText: allText.substring(0, 200) + '...'
    });
});

// دشبورد تحلیلی
app.get('/api/nlp/analytics-dashboard', (req, res) => {
    const stats = {
        totalPosts: nlpPosts.length,
        totalWords: nlpPosts.reduce((sum, post) => sum + post.content.split(' ').length, 0),
        totalChars: nlpPosts.reduce((sum, post) => sum + post.content.length, 0),
        categories: {},
        tags: {}
    };
    
    nlpPosts.forEach(post => {
        stats.categories[post.category] = (stats.categories[post.category] || 0) + 1;
        post.tags.forEach(tag => {
            stats.tags[tag] = (stats.tags[tag] || 0) + 1;
        });
    });
    
    res.json(stats);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 =================================');
    console.log('🧠 سرور NLP فارسی فعال شد!');
    console.log('📍 پورت: ' + PORT);
    console.log('🌐 آدرس‌ها:');
    console.log('   http://localhost:' + PORT + '/health');
    console.log('   http://localhost:' + PORT + '/nlp-dashboard.html');
    console.log('🎉 =================================');
});

// ایجاد صفحه دشبورد در صورت عدم وجود
const fs = require('fs');
const dashboardHTML = `
<!DOCTYPE html>
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <title>دشبورد تحلیل NLP فارسی</title>
    <style>
        body { font-family: Tahoma; margin: 20px; background: #f0f8ff; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; background: #4CAF50; color: white; padding: 20px; border-radius: 10px; }
        .card { background: white; margin: 15px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .btn { background: #2196F3; color: white; border: none; padding: 10px 15px; margin: 5px; border-radius: 5px; cursor: pointer; }
        .keyword { display: inline-block; background: #e3f2fd; padding: 5px 10px; margin: 3px; border-radius: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 دشبورد تحلیل NLP فارسی</h1>
            <p>تحلیل ۱۶۲ پست پردازش زبان طبیعی</p>
        </div>
        
        <div class="card">
            <button class="btn" onclick="generatePosts()">🚀 تولید پست‌ها</button>
            <button class="btn" onclick="loadAnalytics()">📊 نمایش آمار</button>
            <button class="btn" onclick="analyzeSentiment()">😊 تحلیل احساسات</button>
            <button class="btn" onclick="extractKeywords()">🔑 کلمات کلیدی</button>
        </div>
        
        <div id="results" class="card"></div>
    </div>

    <script>
        async function generatePosts() {
            const res = await fetch('/api/nlp/generate-samples', {method: 'POST'});
            const data = await res.json();
            showResult('✅ ' + data.message);
        }

        async function loadAnalytics() {
            const res = await fetch('/api/nlp/analytics-dashboard');
            const data = await res.json();
            
            let html = '<h3>📈 آمار کلی</h3>';
            html += `<p>تعداد پست‌ها: <strong>${data.totalPosts}</strong></p>`;
            html += `<p>تعداد کلمات: <strong>${data.totalWords}</strong></p>`;
            html += `<p>تعداد کاراکترها: <strong>${data.totalChars}</strong></p>`;
            
            html += '<h4>📂 دسته‌بندی‌ها:</h4>';
            for(const [cat, count] of Object.entries(data.categories)) {
                html += `<div>${cat}: ${count} پست</div>`;
            }
            
            showResult(html);
        }

        async function analyzeSentiment() {
            const res = await fetch('/api/nlp/sentiment-analysis');
            const data = await res.json();
            
            let html = '<h3>😊 تحلیل احساسات</h3>';
            html += `<p>تعداد پست‌های تحلیل شده: <strong>${data.total}</strong></p>`;
            
            for(const [label, count] of Object.entries(data.stats)) {
                html += `<div>${label}: ${count} پست</div>`;
            }
            
            showResult(html);
        }

        async function extractKeywords() {
            const res = await fetch('/api/nlp/persian-keywords');
            const data = await res.json();
            
            let html = '<h3>🔑 کلمات کلیدی پرتکرار</h3>';
            html += `<p>تعداد کل کلمات: ${data.totalTokens}</p>`;
            html += `<p>کلمات منحصر بفرد: ${data.uniqueWords}</p>`;
            
            data.topKeywords.forEach(kw => {
                html += `<span class="keyword">${kw.word} (${kw.count})</span>`;
            });
            
            showResult(html);
        }

        function showResult(content) {
            document.getElementById('results').innerHTML = content;
        }
    </script>
</body>
</html>
`;

// ذخیره صفحه دشبورد
if (!fs.existsSync('frontend')) fs.mkdirSync('frontend');
fs.writeFileSync('frontend/nlp-dashboard.html', dashboardHTML);
