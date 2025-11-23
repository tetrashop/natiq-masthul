const express = require('express');
const router = express.Router();
const KnowledgeService = require('../services/KnowledgeService');
const KnowledgeItem = require('../models/KnowledgeItem');




// اضافه کردن این route به فایل knowledge-base/api/knowledgeRoutes.js
// قبل از خط module.exports این کد را اضافه کنید:

router.get('/test-search', async (req, res) => {
    try {
        // جستجوی تستی با query از پیش تعریف شده
        const testQuery = 'پردازش زبان طبیعی';
        const results = await KnowledgeService.semanticSearch(testQuery, 5);
        
        res.json({
            success: true,
            message: 'تست جستجوی معنایی موفق بود',
            testQuery: testQuery,
            resultsCount: results.length,
            results: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در تست جستجو',
            error: error.message
        });
    }
});

router.post('/test-data', async (req, res) => {
    try {
        // افزودن داده‌های تستی
        const testData = [
            {
                title: "پردازش زبان طبیعی در پزشکی",
                content: "پردازش زبان طبیعی در حوزه پزشکی برای تحلیل متون بالینی استفاده می‌شود. این فناوری می‌تواند روابط بین علائم و بیماری‌ها را شناسایی کند.",
                category: "هوش مصنوعی در پزشکی",
                tags: ["NLP", "پزشکی", "هوش مصنوعی"]
            },
            {
                title: "یادگیری ماشین در تحلیل داده",
                content: "یادگیری ماشین یکی از شاخه‌های مهم هوش مصنوعی است که به کامپیوترها توانایی یادگیری از داده را می‌دهد.",
                category: "هوش مصنوعی",
                tags: ["یادگیری ماشین", "تحلیل داده", "هوش مصنوعی"]
            },
            {
                title: "شبکه‌های عصبی مصنوعی",
                content: "شبکه‌های عصبی مصنوعی از ساختار مغز انسان الهام گرفته شده و برای حل مسائل پیچیده استفاده می‌شوند.",
                category: "هوش مصنوعی",
                tags: ["شبکه عصبی", "یادگیری عمیق", "هوش مصنوعی"]
            }
        ];

        const results = [];
        for (const item of testData) {
            const result = await KnowledgeService.addKnowledgeItem(item);
            results.push(result);
        }

        res.json({
            success: true,
            message: 'داده‌های تستی با موفقیت افزوده شدند',
            addedItems: results.length,
            items: results.map(item => item.title)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در افزودن داده‌های تستی',
            error: error.message
        });
    }
});

// افزودن آیتم دانش
router.post('/items', async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;
        
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: 'عنوان، محتوا و دسته‌بندی الزامی هستند'
            });
        }

        const knowledgeItem = await KnowledgeService.addKnowledgeItem({
            title,
            content,
            category,
            tags: tags || []
        });

        res.json({
            success: true,
            message: 'آیتم دانش با موفقیت افزوده شد',
            data: knowledgeItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در افزودن آیتم دانش',
            error: error.message
        });
    }
});

// جستجوی معنایی
router.get('/search/semantic', async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'پارامتر جستجو الزامی است'
            });
        }

        const results = await KnowledgeService.semanticSearch(q, parseInt(limit));
        
        res.json({
            success: true,
            query: q,
            results: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در جستجوی معنایی',
            error: error.message
        });
    }
});

// جستجوی کلیدواژه
router.get('/search/keyword', async (req, res) => {
    try {
        const { q, category, limit = 20 } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'پارامتر جستجو الزامی است'
            });
        }

        const filters = {};
        if (category) filters.category = category;
        if (limit) filters.limit = parseInt(limit);

        const results = await KnowledgeService.keywordSearch(q, filters);
        
        res.json({
            success: true,
            query: q,
            results: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در جستجوی کلیدواژه',
            error: error.message
        });
    }
});

// تحلیل پایگاه دانش
router.get('/analytics', async (req, res) => {
    try {
        const analytics = await KnowledgeService.analyzeKnowledgeBase();
        
        res.json({
            success: true,
            analytics: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در تحلیل پایگاه دانش',
            error: error.message
        });
    }
});

// دریافت همه آیتم‌ها
router.get('/items', async (req, res) => {
    try {
        const { limit = 50, page = 1 } = req.query;
        const items = await KnowledgeItem.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await KnowledgeItem.countDocuments();

        res.json({
            success: true,
            items: items,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آیتم‌ها',
            error: error.message
        });
    }
});

module.exports = router;
