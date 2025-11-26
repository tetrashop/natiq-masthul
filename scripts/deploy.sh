#!/bin/bash

echo "🚀 شروع دپلوی نطق مصطلح روی Cloudflare..."
echo "📁 مسیر جاری: $(pwd)"

# بررسی وجود Wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler یافت نشد. در حال نصب..."
    npm install -g wrangler
fi

echo "✅ Wrangler پیدا شد: $(wrangler --version)"

# بررسی سلامت سیستم
echo "🔍 بررسی سلامت سیستم..."
node health-check.js

if [ $? -ne 0 ]; then
    echo "❌ سیستم سلامت نیست. دپلوی متوقف شد."
    exit 1
fi

# دپلوی
echo "☁️ در حال دپلوی روی Cloudflare..."
wrangler deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 دپلوی با موفقیت انجام شد!"
    echo "🌐 سیستم نطق مصطلح اکنون روی Cloudflare در دسترس است"
    echo ""
    echo "📚 راهنما:"
    echo "   • آدرس داشبورد: https://natiq-masthul.YOUR_SUBDOMAIN.workers.dev/"
    echo "   • API سلامت: https://natiq-masthul.YOUR_SUBDOMAIN.workers.dev/api/health"
    echo "   • API پرسش: https://natiq-masthul.YOUR_SUBDOMAIN.workers.dev/api/ask"
else
    echo "❌ خطا در دپلوی"
    exit 1
fi
