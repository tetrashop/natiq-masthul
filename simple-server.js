const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('frontend'));

// MongoDB connection (ساده‌تر)
mongoose.connect('mongodb://127.0.0.1:27017/natiq-masthul')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// NLP Post Model
const nlpPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});
const NlpPost = mongoose.model('NlpPost', nlpPostSchema);

// Routes
app.get('/api/nlp/posts', async (req, res) => {
    try {
        const posts = await NlpPost.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/nlp/generate-samples', async (req, res) => {
    try {
        const samplePosts = [];
        for (let i = 1; i <= 162; i++) {
            samplePosts.push({
                title: 'پست NLP نمونه ' + i,
                content: 'این محتوای نمونه برای پست NLP شماره ' + i + ' است. این پست بخشی از مجموعه ۱۶۲ پست پردازش زبان طبیعی می‌باشد.',
                tags: ['NLP', 'پردازش متن', 'هوش مصنوعی'],
                category: 'پردازش زبان طبیعی'
            });
        }
        await NlpPost.deleteMany({});
        const posts = await NlpPost.insertMany(samplePosts);
        res.json({ message: '۱۶۲ پست نمونه ایجاد شد', count: posts.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Serve NLP page
app.get('/nlp.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/nlp.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
    console.log('Access NLP page at: http://localhost:' + PORT + '/nlp.html');
});
