#!/bin/bash

echo "🔄 شروع به‌روزرسانی مخزن..."

# بررسی وجود مخزن git
if [ ! -d .git ]; then
    echo "❌ این دایرکتوری مخزن Git نیست"
    exit 1
fi

# حل مشکل npm
echo "📦 حل مشکل npm..."
rm -f package-lock.json
npm install

# بررسی تغییرات
echo "🔍 بررسی تغییرات..."
if git diff-index --quiet HEAD --; then
    echo "✅ هیچ تغییری برای کامیت وجود ندارد"
    exit 0
fi

# نمایش تغییرات
echo "📋 تغییرات شناسایی شده:"
git status -s

# تایید از کاربر
read -p "آیا می‌خواهید این تغییرات را کامیت کنید؟ (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ به‌روزرسانی لغو شد"
    exit 1
fi

# اضافه کردن و کامیت
echo "💾 کامیت تغییرات..."
git add .
git commit -m "🔄 به‌روزرسانی خودکار - $(date +'%Y-%m-%d %H:%M:%S')"

# دریافت تغییرات از گیت‌هاب
echo "📥 دریافت تغییرات از گیت‌هاب..."
git pull origin main --rebase

# ارسال تغییرات
echo "🚀 ارسال به گیت‌هاب..."
if git push origin main; then
    echo "✅ مخزن با موفقیت به‌روزرسانی شد!"
else
    echo "❌ خطا در ارسال به گیت‌هاب"
    echo "💡 می‌توانید دستی اجرا کنید: git push origin main"
fi
