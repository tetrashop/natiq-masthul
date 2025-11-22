cat > backend/src/controllers/nlpController.js << 'EOF'
const NlpPost = require('../models/NlpPost');

// ایجاد پست جدید
exports.createPost = async (req, res) => {
  try {
    const post = new NlpPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// دریافت همه پست‌ها
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await NlpPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// دریافت پست بر اساس ID
exports.getPostById = async (req, res) => {
  try {
    const post = await NlpPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تولید ۱۶۲ پست نمونه
exports.generateSamplePosts = async (req, res) => {
  try {
    const samplePosts = [];
    for (let i = 1; i <= 162; i++) {
      samplePosts.push({
        title: `پست NLP نمونه ${i}`,
        content: `این محتوای نمونه برای پست NLP شماره ${i} است. این پست به موضوعات پردازش زبان طبیعی می‌پردازد.`,
        tags: ['NLP', 'پردازش متن', 'هوش مصنوعی'],
        category: 'پردازش زبان طبیعی'
      });
    }
    
    await NlpPost.deleteMany({}); // پاک کردن پست‌های قبلی
    const posts = await NlpPost.insertMany(samplePosts);
    res.json({ message: '۱۶۲ پست نمونه ایجاد شد', count: posts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
