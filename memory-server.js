const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('frontend'));

// In-memory storage (بدون نیاز به MongoDB)
let nlpPosts = [];

// Routes
app.get('/api/nlp/posts', (req, res) => {
    res.json(nlpPosts);
});

app.post('/api/nlp/generate-samples', (req, res) => {
    nlpPosts = [];
    for (let i = 1; i <= 162; i++) {
        nlpPosts.push({
            id: i,
            title: 'پست NLP نمونه ' + i,
            content: 'این محتوای نمونه برای پست NLP شماره ' + i + ' است. این پست بخشی از مجموعه ۱۶۲ پست پردازش زبان طبیعی می‌باشد.',
            tags: ['NLP', 'پردازش متن', 'هوش مصنوعی'],
            category: 'پردازش زبان طبیعی',
            createdAt: new Date()
        });
    }
    res.json({ message: '۱۶۲ پست نمونه ایجاد شد', count: nlpPosts.length });
});

// Serve pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.get('/nlp.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/nlp.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
    console.log('Access NLP page at: http://localhost:' + PORT + '/nlp.html');
    console.log('Memory-based server - no MongoDB required');
});
