# ایجاد فایل مدل NLP
cat > backend/src/models/NlpPost.js << 'EOF'
const mongoose = require('mongoose');

const nlpPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'NLP' },
  tags: [String],
  author: { type: String, default: 'System' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NlpPost', nlpPostSchema);
