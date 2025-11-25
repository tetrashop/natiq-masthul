#!/bin/bash

cd ~/natiq-masthul

echo "🔄 شروع یکپارچه‌سازی خودکار..."
echo "📊 وضعیت قبل از یکپارچه‌سازی:"

# بررسی تفاوت package.json
echo "🔍 مقایسه package.json:"
diff -u package.json natiq-ecosystem/package.json || echo "⚠️ تفاوت‌ها نمایش داده شد"

# 1. کپی فایل‌های حیاتی از ecosystem به main
echo ""
echo "📥 انتقال فایل‌های حیاتی از natiq-ecosystem به natiq-masthul..."

essential_files=("NAtiQ-ENHANCED.js" "free-api-server.js" "free-version.js" "web-interface-simple.js" "simple-free-server.js")

for file in "${essential_files[@]}"; do
    if [ -f "natiq-ecosystem/$file" ]; then
        cp "natiq-ecosystem/$file" .
        echo "✅ $file انتقال یافت"
    else
        echo "❌ $file در natiq-ecosystem یافت نشد"
    fi
done

# 2. بررسی و ادغام package.json
echo ""
echo "🔧 ادغام package.json..."
if [ -f "natiq-ecosystem/package.json" ]; then
    # نگهداری نسخه جدیدتر (ecosystem)
    cp "natiq-ecosystem/package.json" "package.json.new"
    echo "✅ package.json جدید آماده شد"
fi

# 3. کپی فایل‌های مدیریتی
echo ""
echo "📁 انتقال فایل‌های مدیریتی..."
management_files=("system-showcase.js" "master-launcher.js" "health-check.js" "smart-launcher.js")

for file in "${management_files[@]}"; do
    if [ -f "natiq-ecosystem/$file" ]; then
        cp "natiq-ecosystem/$file" .
        echo "✅ $file انتقال یافت"
    fi
done

# 4. ایجاد ساختار نهایی
echo ""
echo "🏗️ ایجاد ساختار نهایی..."
mkdir -p docs
mkdir -p scripts

# انتقال اسکریپت‌ها
if [ -f "integrate-systems.sh" ]; then
    mv integrate-systems.sh scripts/
fi
if [ -f "deploy-now.sh" ]; then
    mv deploy-now.sh scripts/
fi

# 5. بروزرسانی README.md
echo ""
echo "📝 بروزرسانی مستندات..."
cat >> README.md << 'EOR'

## 🔄 یکپارچه‌سازی انجام شد

سیستم نطق مصطلح با موفقیت یکپارچه شد. فایل‌های اصلی:

- `NAtiQ-ENHANCED.js` - هسته اصلی هوش مصنوعی
- `free-api-server.js` - سرور API رایگان
- `system-showcase.js` - نمایشگر قابلیت‌ها

EOR

echo "✅ یکپارچه‌سازی کامل شد!"
echo ""
echo "📁 ساختار نهایی:"
echo "natiq-masthul/"
echo "├── 📄 فایل‌های اصلی (.js, .json)"
echo "├── 📁 natiq-ecosystem/ (فایل‌های پشتیبان)"
echo "├── 📁 scripts/ (اسکریپت‌های مدیریتی)"
echo "└── 📁 docs/ (مستندات)"

