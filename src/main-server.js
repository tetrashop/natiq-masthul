const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Import advanced engines
let AdvancedIntentRecognition, AdvancedKnowledgeGraph;

try {
    AdvancedIntentRecognition = require('./nlp/advanced-intent-recognition');
    AdvancedKnowledgeGraph = require('./knowledge/advanced-knowledge-graph');
    console.log('✅ موتورهای پیشرفته بارگذاری شدند');
} catch (error) {
    console.log('⚠️ برخی موتورها بارگذاری نشدند، از حالت ساده استفاده می‌شود:', error.message);
}

// Initialize engines
const intentRecognizer = AdvancedIntentRecognition ? new AdvancedIntentRecognition() : null;
const knowledgeGraph = AdvancedKnowledgeGraph ? new AdvancedKnowledgeGraph() : null;

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/ai-interface.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../ai-interface.html'));
});

// تابع تشخیص هدف پیشرفته (Fallback)
function detectIntentFallback(question) {
    const lowerQuestion = question.toLowerCase();
    const normalized = lowerQuestion
        .replace(/[؟?]/g, '')
        .replace(/[\s]+/g, ' ')
        .trim();

    const entities = {
        persons: [],
        skills: [],
        topics: []
    };

    // تشخیص افراد
    if (normalized.includes('رامین') || normalized.includes('اجلال')) {
        entities.persons.push('رامین اجلال');
    }

    // تشخیص هدف
    if (normalized.includes('کیست') || normalized.includes('چه کسی') || normalized.includes('معرفی')) {
        return {
            intent: 'person_introduction',
            entities: entities,
            confidence: 0.9,
            normalized: normalized
        };
    }

    if (normalized.includes('دستاورد') || normalized.includes('پروژه') || normalized.includes('کار')) {
        return {
            intent: 'person_achievements',
            entities: entities,
            confidence: 0.85,
            normalized: normalized
        };
    }

    if (normalized.includes('تخصص') || normalized.includes('مهارت') || normalized.includes('توانایی')) {
        return {
            intent: 'person_skills',
            entities: entities,
            confidence: 0.8,
            normalized: normalized
        };
    }

    if (normalized.includes('مقاله') || normalized.includes('نوشتن') || normalized.includes('تولید محتوا')) {
        return {
            intent: 'article_generation',
            entities: entities,
            confidence: 0.75,
            normalized: normalized
        };
    }

    return {
        intent: 'general_inquiry',
        entities: entities,
        confidence: 0.6,
        normalized: normalized
    };
}

// تابع تولید پاسخ پیشرفته
function generateEnhancedResponse(analysis, originalQuestion) {
    const { intent, entities, confidence, normalized } = analysis;
    
    console.log('🔍 تحلیل سوال:', { intent, entities, normalized });

    // پاسخ‌های تخصصی برای رامین اجلال
    if (intent === 'person_introduction' || 
        entities.persons?.includes('رامین اجلال') ||
        normalized.includes('رامین') && (normalized.includes('کیست') || normalized.includes('چه کسی'))) {
        
        return `👤 **رامین اجلال - توسعه‌دهنده و محقق هوش مصنوعی**

🎯 **تخصص‌های اصلی:**
• پردازش زبان فارسی و هوش مصنوعی
• توسعه سیستم‌های توزیع‌شده و مقیاس‌پذیر
• یادگیری ماشین و داده‌کاوی
• معماری نرم‌افزارهای پیشرفته

🏢 **زمینه فعالیت:**
- تحقیق و توسعه در حوزه پردازش زبان طبیعی فارسی
- طراحی سیستم‌های هوش مصنوعی سازمانی
- توسعه پلتفرم‌های دانش محور

💡 *برای اطلاعات بیشتر در مورد دستاوردها یا تخصص‌های خاص، سوال دقیق‌تری بپرسید.*`;
    }
    
    if (intent === 'person_achievements' || 
        (entities.persons && normalized.includes('دستاورد')) ||
        normalized.includes('دستاورد') && normalized.includes('رامین')) {
        
        return `🏆 **دستاوردهای رامین اجلال:**

1. **توسعه سیستم نطق مصطلح** - پلتفرم هوشمند پردازش دانش و درک زبان فارسی
2. **تحقیق در پردازش زبان طبیعی فارسی** - توسعه الگوریتم‌های ویژه زبان فارسی
3. **طراحی معماری‌های مقیاس‌پذیر** - برای سیستم‌های هوش مصنوعی سازمانی
4. **همکاری در پروژه‌های متن‌باز** - مرتبط با هوش مصنوعی فارسی

🚀 **پروژه‌های در دست اجرا:**
• گسترش قابلیت‌های سیستم نطق مصطلح
• بهبود الگوریتم‌های درک مطلب فارسی
• توسعه معماری‌های پیشرفته برای پردازش بلادرنگ`;
    }
    
    if (intent === 'person_skills' || 
        normalized.includes('تخصص') || normalized.includes('مهارت')) {
        
        return `🎯 **مهارت‌ها و تخصص‌های رامین اجلال:**

💻 **زبان‌ها و تکنولوژی‌ها:**
JavaScript/Node.js, Python, TensorFlow, PyTorch, React, Docker, Kubernetes

🧠 **هوش مصنوعی و ML:**
• پردازش زبان طبیعی (NLP)
• یادگیری عمیق و شبکه‌های عصبی
• بینایی کامپیوتر
• سیستم‌های توصیه‌گر

⚙️ **مهندسی نرم‌افزار:**
• معماری میکروسرویس
• سیستم‌های توزیع‌شده
• پایگاه داده‌های NoSQL و SQL
• DevOps و CI/CD

🔬 **حوزه‌های تحقیقاتی:**
پردازش زبان فارسی، هوش مصنوعی تفسیرپذیر، سیستم‌های استدلال خودکار، یادگیری نیمه‌نظارتی`;
    }
    
    if (normalized.includes('مقاله') || normalized.includes('نوشتن')) {
        return `📝 **سیستم تولید مقاله هوشمند**

✅ **این قابلیت فعال است!** می‌توانم در تولید محتوای تخصصی کمک کنم.

🎯 **موضوعات قابل پوشش:**
• هوش مصنوعی و یادگیری ماشین
• پردازش زبان فارسی
• توسعه نرم‌افزار و معماری
• فناوری‌های نوین

💡 **برای تولید مقاله:**
"مقاله‌ای در مورد [موضوع مورد نظر] بنویس"
یا از دکمه «مقاله» استفاده کنید.`;
    }
    
    if (normalized.includes('همسر') || normalized.includes('خانواده') || normalized.includes('زندگی شخصی')) {
        return `🔒 **احترام به حریم شخصی**

من اطلاعات شخصی مانند وضعیت تأهل، اطلاعات خانوادگی یا جزئیات زندگی شخصی افراد را ذخیره یا ارائه نمی‌دهم.

💡 **من می‌توانم در این زمینه‌ها کمک کنم:**
• اطلاعات حرفه‌ای و تخصصی
• دستاوردها و پروژه‌ها
• مهارت‌ها و زمینه‌های تحقیقاتی
• دانش فنی و تخصصی

لطفاً سوال خود را در این حوزه‌ها مطرح کنید.`;
    }
    
    // پاسخ عمومی بهبود یافته
    return `🤔 **سوال شما:** "${originalQuestion}"

🧠 **سیستم نطق مصطلح** می‌تواند در مورد این موضوعات کمک کند:

👤 **معرفی رامین اجلال** - اطلاعات تخصصی و حرفه‌ای
🏆 **دستاوردها و پروژه‌ها** - جزئیات کامل
🎯 **مهارت‌ها و تخصص‌ها** - اطلاعات فنی
📝 **تولید مقاله** - محتوای تخصصی

💡 *برای پاسخ دقیق‌تر، لطفاً سوال خود را واضح‌تر بیان کنید یا از دکمه‌های سریع استفاده کنید.*`;
}

// تابع تولید پاسخ ساده (Fallback)
function generateSimpleResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('رامین') && (lowerQuestion.includes('کیست') || lowerQuestion.includes('چه کسی'))) {
        return `👤 **رامین اجلال** - توسعه‌دهنده و محقق هوش مصنوعی
تخصص اصلی در پردازش زبان فارسی و توسعه سیستم‌های هوش مصنوعی

🎯 زمینه‌های فعالیت:
• پردازش زبان طبیعی فارسی
• هوش مصنوعی و یادگیری ماشین  
• توسعه سیستم‌های توزیع‌شده
• معماری نرم‌افزارهای مقیاس‌پذیر`;
    }
    
    if (lowerQuestion.includes('دستاورد') || lowerQuestion.includes('پروژه')) {
        return `🏆 **دستاوردهای اصلی:**
• توسعه سیستم نطق مصطلح
• تحقیق در پردازش زبان فارسی
• توسعه معماری‌های مقیاس‌پذیر
• همکاری در پروژه‌های متن‌باز هوش مصنوعی`;
    }
    
    if (lowerQuestion.includes('تخصص') || lowerQuestion.includes('مهارت')) {
        return `🎯 **تخصص‌ها و مهارت‌ها:**
پردازش زبان فارسی، هوش مصنوعی، یادگیری ماشین، 
توسعه نرم‌افزار، معماری سیستم‌های توزیع‌شده، Python, JavaScript, TensorFlow`;
    }
    
    if (lowerQuestion.includes('مقاله')) {
        return `📝 سیستم تولید مقاله فعال است. می‌توانم در تولید محتوای تخصصی کمک کنم.`;
    }
    
    return `🤔 سوال شما دریافت شد. سیستم نطق مصطلح می‌تواند در مورد رامین اجلال و حوزه‌های تخصصی کمک کند.`;
}

// Enhanced API
app.get('/api/chat', async (req, res) => {
    const question = req.query.q;
    const userId = req.query.userId || 'default';
    
    if (!question) {
        return res.json({
            error: 'لطفا سوال خود را وارد کنید',
            question: null,
            answer: null
        });
    }
    
    try {
        let answer;
        let analysis = {};
        
        // استفاده از موتور پیشرفته اگر موجود باشد
        if (intentRecognizer) {
            try {
                analysis = intentRecognizer.detectIntent(question);
                console.log('🔍 تحلیل پیشرفته:', analysis);
            } catch (error) {
                console.log('⚠️ خطا در تحلیل پیشرفته، استفاده از حالت ساده:', error.message);
                analysis = detectIntentFallback(question);
            }
        } else {
            // حالت ساده
            analysis = detectIntentFallback(question);
        }
        
        // تولید پاسخ
        if (intentRecognizer) {
            answer = generateEnhancedResponse(analysis, question);
        } else {
            answer = generateSimpleResponse(question);
        }
        
        res.json({
            success: true,
            question: question,
            answer: answer,
            analysis: analysis,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error processing question:', error);
        res.json({
            success: false,
            question: question,
            answer: '⚠️ خطا در پردازش سوال. لطفاً دوباره تلاش کنید.',
            timestamp: new Date().toISOString()
        });
    }
});

// API وضعیت سیستم
app.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        system: 'نطق مصطلح - سیستم پیشرفته',
        version: '7.0.1',
        timestamp: new Date().toISOString(),
        engines: {
            intent_recognition: intentRecognizer ? 'فعال' : 'غیرفعال',
            knowledge_graph: knowledgeGraph ? 'فعال' : 'غیرفعال'
        },
        capabilities: [
            'پردازش زبان طبیعی فارسی',
            'تشخیص هدف سوالات',
            'پاسخ‌های ساختاریافته',
            'مدیریت دانش تخصصی',
            'تولید محتوای هوشمند'
        ]
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🧠 نطق مصطلح پیشرفته در پورت ${PORT} اجرا شد`);
    console.log(`🔗 دسترسی: http://localhost:${PORT}`);
    console.log(`🤖 رابط هوش مصنوعی: http://localhost:${PORT}/ai-interface.html`);
    console.log(`📊 وضعیت سیستم: http://localhost:${PORT}/api/status`);
});

module.exports = app;
