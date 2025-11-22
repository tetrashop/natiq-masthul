const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('frontend'));

// In-memory storage
let nlpPosts = [];

// Routes
app.get('/api/nlp/posts', (req, res) => {
    console.log('GET /api/nlp/posts - Returning', nlpPosts.length, 'posts');
    res.json(nlpPosts);
});

app.post('/api/nlp/generate-samples', (req, res) => {
    console.log('POST /api/nlp/generate-samples - Generating 162 posts');
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
    console.log('Serving nlp.html');
    res.sendFile(__dirname + '/frontend/nlp.html');
});

app.get('/', (req, res) => {
    res.redirect('/nlp.html');
});

// Start server on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Server is running on:');
    console.log('   http://localhost:' + PORT + '/nlp.html');
    console.log('   http://127.0.0.1:' + PORT + '/nlp.html');
    console.log('   Or use your device IP address');
});
