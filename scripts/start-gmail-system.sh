#!/bin/bash

echo "🚀 راه‌اندازی سیستم یکپارچه Gmail و دانش"
echo "========================================"

# توقف سرورهای قبلی
echo "1. توقف سرورهای قبلی..."
pkill -f "gmail-knowledge-server" 2>/dev/null
sleep 2

# بررسی وجود فایل credentials
if [ ! -f "gmail-credentials.json" ]; then
    echo "❌ فایل gmail-credentials.json یافت نشد"
    echo "📝 لطفاً فایل credentials را از Google Cloud Console دریافت و در این فایل قرار دهید"
    exit 1
fi

# راه‌اندازی سرور
echo "2. راه‌اندازی سرور Gmail و دانش..."
node gmail-knowledge-server.js &

sleep 3

# تست سرور
echo "3. تست سرور..."
curl -s http://localhost:3020/ | grep -o '"message":"[^"]*"'

echo ""
echo "✅ سیستم راه‌اندازی شد!"
echo "🌐 آدرس: http://localhost:3020"
echo ""
echo "📋 مراحل بعدی:"
echo "1. به آدرس http://localhost:3020/auth/url بروید"
echo "2. URL احراز هویت را کپی کرده و در مرورگر باز کنید"
echo "3. کد احراز هویت را دریافت کرده و با POST به /auth/token ارسال کنید"
echo "4. از endpoint /process برای پردازش ایمیل‌ها استفاده کنید"
