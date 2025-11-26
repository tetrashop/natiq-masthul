#!/bin/bash

echo "🚀 راهنمای دپلوی دستی نطق مصطلح"
echo "================================"

echo ""
echo "📋 چون Wrangler روی Termux کار نمی‌کند، از یکی از روش‌های زیر استفاده کنید:"
echo ""

echo "🔸 روش ۱: دپلوی خودکار از طریق GitHub Actions"
echo "   - فایل‌ها را به گیت‌هاب push کنید"
echo "   - به https://github.com/tetrashop/natiq-masthul/settings/secrets/actions بروید"
echo "   - دو secret زیر را اضافه کنید:"
echo "     1. CLOUDFLARE_API_TOKEN"
echo "     2. CLOUDFLARE_ACCOUNT_ID"
echo "   - با هر push به main، سیستم خودکار دپلوی می‌شود"
echo ""

echo "🔸 روش ۲: دپلوی دستی از طریق کنسول Cloudflare"
echo "   - به https://dash.cloudflare.com بروید"
echo "   - Workers & Pages → Create application → Create Worker"
echo "   - کد cloudflare-worker.js را کپی کنید"
echo "   - فایل‌های natiq-core.js و nlp-engine.js را در کنسول آپلود کنید"
echo ""

echo "🔸 روش ۳: استفاده از wrangler.toml و دپلوی از کامپیوتر شخصی"
echo "   - پروژه را روی کامپیوتر شخصی کلون کنید"
echo "   - wrangler install کنید"
echo "   - wrangler deploy اجرا کنید"
echo ""

echo "📁 فایل‌های ضروری برای دپلوی:"
echo "   ✅ cloudflare-worker.js"
echo "   ✅ natiq-ecosystem/natiq-core.js" 
echo "   ✅ natiq-ecosystem/nlp-engine.js"
echo "   ✅ wrangler.toml"
echo "   ✅ package.json"

echo ""
echo "🌐 پس از دپلوی، آدرس worker شما خواهد بود:"
echo "   https://natiq-masthul.YOUR_SUBDOMAIN.workers.dev"
echo ""

# تست سلامت محلی
echo "🔍 تست سلامت محلی:"
node health-check.js
