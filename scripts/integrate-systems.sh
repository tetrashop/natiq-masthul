#!/bin/bash

cd ~/natiq-masthul

echo "🔄 شروع یکپارچه‌سازی سیستم‌ها..."

# 1. بررسی وجود پوشه ecosystem
if [ ! -d "natiq-ecosystem" ]; then
    echo "❌ پوشه natiq-ecosystem یافت نشد!"
    exit 1
fi

# 2. پیدا کردن فایل‌های تکراری
echo "🔍 یافتن فایل‌های تکراری..."
duplicates=$(find . -maxdepth 1 -name "*.js" -o -name "*.json" -o -name "*.md" | xargs -I {} basename {} | while read file; do
    if [ -f "natiq-ecosystem/$file" ]; then
        echo "$file"
    fi
done)

if [ -n "$duplicates" ]; then
    echo "⚠️  فایل‌های تکراری یافت شد:"
    echo "$duplicates"
    
    # تصمیم‌گیری برای هر فایل تکراری
    echo ""
    echo "🎯 انتخاب اقدام برای هر فایل:"
    for file in $duplicates; do
        echo "   فایل: $file"
        echo "   - تاریخچه natiq-masthul: $(stat -c %y "$file" 2>/dev/null || echo 'یافت نشد')"
        echo "   - تاریخچه natiq-ecosystem: $(stat -c %y "natiq-ecosystem/$file" 2>/dev/null || echo 'یافت نشد')"
        echo "   اقدام پیشنهادی: نگهداری نسخه جدیدتر"
    done
else
    echo "✅ هیچ فایل تکراری یافت نشد"
fi

# 3. پیشنهاد ساختار نهایی
echo ""
echo "🏗️ پیشنهاد ساختار یکپارچه:"
echo "   📁 natiq-masthul/"
echo "   ├── 📄 فایل‌های اصلی (NAtiQ-ENHANCED.js, etc.)"
echo "   ├── 📁 natiq-ecosystem/ (فایل‌های اجرایی)"
echo "   └── 📁 docs/ (مستندات)"

echo ""
echo "🎯 برای اجرای یکپارچه‌سازی دستور زیر را اجرا کنید:"
echo "   ./final-integration.sh"
