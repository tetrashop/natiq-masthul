#!/bin/bash

echo "🔍 بررسی سریع سلامت سیستم نطق مصطلح"
echo "===================================="

# بررسی وجود پوشه‌های اصلی
echo "📁 بررسی ساختار پوشه‌ها..."
folders=("knowledge-graph" "reasoning-engine" "response-generator" "monitoring" "optimized-system")
for folder in "${folders[@]}"; do
    if [ -d "$folder" ]; then
        echo "   ✅ $folder"
    else
        echo "   ❌ $folder - مفقود!"
    fi
done

# بررسی فایل‌های اصلی
echo ""
echo "📄 بررسی فایل‌های اصلی..."
files=("main.js" "main-final.js" "optimized-system/natiq-optimized.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        echo "   ✅ $file ($((size/1024)) KB)"
    else
        echo "   ❌ $file - مفقود!"
    fi
done

# تست اجرای سریع
echo ""
echo "⚡ تست اجرای سریع..."
if node -e "require('./main.js'); console.log('✅ سیستم اصلی قابل بارگذاری است')" 2>/dev/null; then
    echo "   ✅ سیستم اصلی - OK"
else
    echo "   ❌ سیستم اصلی - خطا در بارگذاری"
fi

if node -e "require('./optimized-system/natiq-optimized.js'); console.log('✅ سیستم بهینه‌سازی قابل بارگذاری است')" 2>/dev/null; then
    echo "   ✅ سیستم بهینه‌سازی - OK"
else
    echo "   ❌ سیستم بهینه‌سازی - خطا در بارگذاری"
fi

echo ""
echo "🎯 نتیجه بررسی سریع:"
echo "اگر تمام موارد ✅ هستند، سیستم آماده بروزرسانی در گیت‌هاب است!"
