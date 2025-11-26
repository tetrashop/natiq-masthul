#!/bin/bash
echo "🧪 شروع تست API های نطق مصطلح..."

# آدرس پایه - جایگزین کنید با آدرس واقعی Worker شما
BASE_URL="https://natiq-masthul.your-subdomain.workers.dev"

# تابع برای نمایش نتایج تست
print_result() {
    if [ $1 -eq 0 ]; then
        echo "✅ $2"
    else
        echo "❌ $2"
        echo "📋 Response: $3"
    fi
}

# تست سلامت سیستم
echo "1. تست سلامت سیستم..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | head -n1)

if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "Health Endpoint" "$RESPONSE_BODY"
else
    print_result 1 "Health Endpoint" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# تست اطلاعات سیستم
echo "2. تست اطلاعات سیستم..."
SYSTEM_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/system")
HTTP_CODE=$(echo "$SYSTEM_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$SYSTEM_RESPONSE" | head -n1)

if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "System Endpoint" "$RESPONSE_BODY"
else
    print_result 1 "System Endpoint" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# تست API پرسش و پاسخ
echo "3. تست API پرسش و پاسخ..."
API_RESPONSE=$(curl -s -w "%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"question": "تحصیلات رامین اجلال چیست؟"}' \
    "$BASE_URL/api/comprehensive/ask")
HTTP_CODE=$(echo "$API_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$API_RESPONSE" | head -n1)

if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "Ask API" "$RESPONSE_BODY"
else
    print_result 1 "Ask API" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# تست رابط کاربری اصلی
echo "4. تست رابط کاربری اصلی..."
UI_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/")
HTTP_CODE=$(echo "$UI_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "UI Endpoint" "رابط کاربری بارگذاری شد"
else
    print_result 1 "UI Endpoint" "HTTP $HTTP_CODE"
fi

echo "🎯 تست کامل شد!"
