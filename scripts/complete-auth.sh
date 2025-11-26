#!/bin/bash

echo "🔐 شروع فرآیند احراز هویت Gmail..."

# دریافت URL احراز هویت
echo "📋 دریافت URL احراز هویت..."
AUTH_URL=$(curl -s http://localhost:3020/auth/url | grep -o '"authUrl":"[^"]*' | cut -d'"' -f4)

echo "🌐 لطفاً این URL را در مرورگر باز کنید:"
echo "$AUTH_URL"
echo ""
echo "📝 پس از احراز هویت، کد را از آدرس بار مرورگر کپی کنید و اینجا وارد کنید:"

read -p "🔑 کد احراز هویت: " AUTH_CODE

if [ -n "$AUTH_CODE" ]; then
    echo "🔄 در حال ذخیره توکن..."
    RESPONSE=$(curl -s -X POST http://localhost:3020/auth/token \
        -H "Content-Type: application/json" \
        -d "{\"code\": \"$AUTH_CODE\"}")
    
    echo "$RESPONSE"
    
    # بررسی وضعیت
    echo ""
    echo "📊 بررسی وضعیت نهایی..."
    curl -s http://localhost:3020/auth/status | python3 -m json.tool
else
    echo "❌ کد احراز هویت وارد نشد"
fi
