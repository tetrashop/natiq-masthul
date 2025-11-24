export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // مدیریت CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route سلامت
    if (pathname === '/health' || pathname === '/api/health') {
      const healthData = {
        status: 'success',
        message: 'سیستم نطق مصطلح روی Cloudflare فعال است',
        timestamp: new Date().toISOString(),
        version: '3.2.0',
        platform: 'Cloudflare Workers'
      };
      return Response.json(healthData, { headers: corsHeaders });
    }

    // Route اطلاعات سیستم
    if (pathname === '/system' || pathname === '/api/system') {
      const systemData = {
        status: 'success',
        system: 'نطق مصطلح - Cloudflare Deployment',
        version: '3.2.0',
        environment: 'production',
        features: [
          'پایگاه دانش جامع',
          'پردازش زبان فارسی',
          'APIهای RESTful',
          'سیستم Enterprise'
        ],
        timestamp: new Date().toISOString()
      };
      return Response.json(systemData, { headers: corsHeaders });
    }

    // Route اصلی API
    if (pathname === '/api/comprehensive/ask' || pathname === '/api/ask') {
      if (request.method === 'POST') {
        try {
          const { question } = await request.json();
          
          if (!question) {
            return Response.json(
              { status: 'error', message: 'سوال الزامی است' },
              { status: 400, headers: corsHeaders }
            );
          }

          // پردازش سوال
          const response = await processQuestion(question);
          
          return Response.json(response, { headers: corsHeaders });
        } catch (error) {
          return Response.json(
            { status: 'error', message: 'خطا در پردازش سوال' },
            { status: 500, headers: corsHeaders }
          );
        }
      }
    }

    // Route اصلی - رابط کاربری
    if (pathname === '/' || pathname === '/index.html') {
      const html = generateHTML();
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          ...corsHeaders
        }
      });
    }

    // Route 404
    return Response.json(
      { status: 'error', message: 'مسیر یافت نشد' },
      { status: 404, headers: corsHeaders }
    );
  }
}

// تابع پردازش سوالات
async function processQuestion(question) {
  // پایگاه دانش رامین اجلال
  const knowledgeBase = {
    تحصیلات: {
      pattern: ['تحصیلات', 'مدرک', 'دانشگاه', 'رشته'],
      response: `🎓 سوابق تحصیلی رامین اجلال:
• کارشناسی ارشد هوش مصنوعی از دانشگاه تهران
• کارشناسی مهندسی کامپیوتر از دانشگاه شریف
• دیپلم ریاضی از مدرسه تیزهوشان`
    },
    دستاوردها: {
      pattern: ['دستاورد', 'موفقیت', 'پروژه', 'اختراع'],
      response: `🏆 دستاوردهای مهم:
• توسعه سیستم‌های هوش مصنوعی برای پردازش زبان فارسی
• ایجاد پلتفرم‌های آموزشی پیشرفته
• مشاوره به استارتاپ‌های فناوری
• تولید محتوای تخصصی در حوزه AI`
    },
    تخصص: {
      pattern: ['تخصص', 'مهارت', 'توانایی', 'فنی'],
      response: `💻 تخصص‌های فنی:
• هوش مصنوعی و یادگیری ماشین
• پردازش زبان طبیعی (NLP)
• توسعه وب و اپلیکیشن‌های پیشرفته
• معماری نرم‌افزار و سیستم‌های توزیع‌شده
• مدیریت پروژه‌های فناوری`
    },
    سوابق: {
      pattern: ['سوابق', 'کاری', 'تجربه', 'شغل'],
      response: `💼 سوابق کاری:
• مدیر فنی در شرکت‌های بین‌المللی
• مشاور ارشد فناوری اطلاعات
• مدرس دوره‌های پیشرفته برنامه‌نویسی
• پژوهشگر در حوزه هوش مصنوعی`
    },
    تحقیقات: {
      pattern: ['تحقیق', 'پژوهش', 'مقاله', 'علمی'],
      response: `🔬 پروژه‌های تحقیقاتی:
• توسعه الگوریتم‌های NLP برای زبان فارسی
• پژوهش در زمینه بینایی کامپیوتر
• مطالعه سیستم‌های توصیه‌گر پیشرفته
• تحقیق در حوزه امنیت سایبری`
    }
  };

  // پردازش سوال و پیدا کردن بهترین پاسخ
  let bestMatch = null;
  let maxScore = 0;

  for (const [category, data] of Object.entries(knowledgeBase)) {
    let score = 0;
    for (const pattern of data.pattern) {
      if (question.includes(pattern)) {
        score += pattern.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = data.response;
    }
  }

  const defaultResponse = `🧠 سیستم نطق مصطلح - نسخه Cloudflare

سوال شما: "${question}"

💡 پاسخ عمومی:
رامین اجلال متخصص در حوزه هوش مصنوعی، پردازش زبان فارسی و توسعه سیستم‌های پیشرفته است. برای دریافت اطلاعات تخصصی‌تر، لطفاً سوال خود را دقیق‌تر فرمایید.

🔍 برای اطلاعات بیشتر در مورد:
• تحصیلات → "تحصیلات رامین اجلال"
• تخصص‌ها → "تخصص‌های فنی"
• سوابق → "سوابق کاری"
• دستاوردها → "دستاوردهای مهم"`;

  return {
    status: 'success',
    question: question,
    answer: bestMatch || defaultResponse,
    confidence: bestMatch ? 0.9 : 0.6,
    category: bestMatch ? Object.keys(knowledgeBase).find(key => knowledgeBase[key].response === bestMatch) : 'عمومی',
    timestamp: new Date().toISOString(),
    version: '3.2.0',
    platform: 'Cloudflare Workers'
  };
}

// تابع تولید HTML
function generateHTML() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح - سیستم هوش مصنوعی روی Cloudflare</title>
    <style>
        /* استایل‌ها اینجا قرار می‌گیرند */
        body {
            font-family: Tahoma, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: #333;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        /* بقیه استایل‌ها... */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 نطق مصطلح</h1>
            <p>سیستم هوش مصنوعی حرفه‌ای - نسخه Cloudflare</p>
            <div style="background: #28a745; display: inline-block; padding: 5px 15px; border-radius: 20px; margin-top: 10px;">
                ✅ سیستم فعال - میزبانی روی Cloudflare
            </div>
        </div>
        <!-- بقیه HTML... -->
    </div>
    <script>
        // JavaScript اینجا قرار می‌گیرد
        console.log('سیستم نطق مصطلح بارگذاری شد');
    </script>
</body>
</html>`;
}
