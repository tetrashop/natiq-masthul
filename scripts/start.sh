#!/bin/bash

echo "🚀 شروع راه‌اندازی نطق مصطلح..."
echo "📁 مسیر جاری: $(pwd)"
echo "🕒 زمان: $(date)"

# بررسی وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد. لطفا Node.js را نصب کنید."
    exit 1
fi

echo "✅ Node.js پیدا شد: $(node --version)"

# بررسی وجود فایل‌های ضروری
required_files=(
    "natiq-ecosystem/NAtiQ-ENHANCED.js"
    "natiq-core/core-engine.js"
    "config/main-config.js"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ فایل ضروری یافت نشد: $file"
        exit 1
    fi
done

echo "✅ تمام فایل‌های ضروری وجود دارند"

# نصب وابستگی‌ها (اگر package.json وجود دارد)
if [ -f "package.json" ]; then
    echo "📦 نصب وابستگی‌ها..."
    npm install
fi

# ایجاد پوشه لاگ
mkdir -p logs

echo "🔧 شروع سرور..."
node natiq-ecosystem/NAtiQ-ENHANCED.js
