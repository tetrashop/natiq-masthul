#!/bin/bash

echo "🔄 شروع یکپارچه‌سازی natiq-ecosystem..."

# ایجاد پوشه موقت برای کلون
mkdir -p temp-integration
cd temp-integration

# کلون مخزن natiq-ecosystem
git clone https://github.com/tetrashop/natiq-ecosystem.git
cd natiq-ecosystem

# کپی فایل‌ها به پروژه اصلی
cp -r * ../../natiq-ecosystem/

# بازگشت به پوشه اصلی
cd ../..

# حذف پوشه موقت
rm -rf temp-integration

echo "✅ یکپارچه‌سازی کامل شد!"
echo "📁 فایل‌های natiq-ecosystem اضافه شدند"

# کامیت تغییرات
git add natiq-ecosystem/
git commit -m "🔄 یکپارچه‌سازی natiq-ecosystem از مخزن tetrashop"
git push origin main

echo "🎉 تغییرات به گیت‌هاب ارسال شد"
