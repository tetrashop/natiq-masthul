#!/bin/bash
echo "🔍 تشخیص مشکل سیستم..."

echo "1. بررسی ورژن:"
curl -s "https://natiq-masthul.ramin-edjlal1359.workers.dev/health" | grep version

echo -e "\n2. بررسی فایل اصلی در GitHub:"
echo "https://github.com/tetrashop/natiq-masthul/blob/main/src/main-server.js"

echo -e "\n3. بررسی دپلوی‌های اخیر:"
echo "به Cloudflare Dashboard → Workers & Pages → natiq-masthul → Deployments بروید"
