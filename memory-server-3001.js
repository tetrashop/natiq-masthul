const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;  // تغییر پورت به 3001

// بقیه کدها مانند memory-server.js
app.use(express.json());
app.use(express.static('frontend'));

let nlpPosts = [];

app.get('/api/nlp/posts', (req, res) => {
    res.json(nlpPosts);
});

app.post('/api/nlp/generate-samples', (req, res) => {
    nlpPosts = [];
    for (let i = 1; i <= 162; i++) {
        nlpPosts.push({
            id: i,
            title: 'پست NLP نمونه ' + i,
            content: 'این محتوای نمونه برای پست NLP شماره ' + i + ' است.',
            tags: ['NLP', 'پردازش متن'],
            category: 'پردازش زبان طبیعی',
            createdAt: new Date()
        });
    }
    res.json({ message: '۱۶۲ پست نمونه ایجاد شد', count: nlpPosts.length });
});

app.get('/nlp.html', (req, res) => {
    res.sendFile(__dirname + '/frontend/nlp.html');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Server running on port ' + PORT);
    console.log('📱 Access: http://localhost:' + PORT + '/nlp.html');
});
