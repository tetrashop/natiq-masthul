#!/bin/bash

echo "🚀 راه‌اندازی کامل سیستم مدیریت دانش (نسخه اصلاح شده)"
echo "==================================================="

# توقف سرورهای قبلی
echo "1. توقف سرورهای قبلی..."
pkill -f "simple-knowledge-server" 2>/dev/null
pkill -f "stable-nlp-server-fixed" 2>/dev/null
pkill -f "simple-gateway" 2>/dev/null
pkill -f "vite" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null

sleep 3

# راه‌اندازی سرور دانش
echo "2. راه‌اندازی سرور دانش..."
cd ~/natiq-masthul
node simple-knowledge-server.js &
KNOWLEDGE_PID=$!
sleep 2

# راه‌اندازی سرور NLP
echo "3. راه‌اندازی سرور NLP..."
node stable-nlp-server-fixed.js &
NLP_PID=$!
sleep 2

# راه‌اندازی API Gateway
echo "4. راه‌اندازی API Gateway..."
node simple-gateway.js &
GATEWAY_PID=$!
sleep 3

# تست سرورهای بک‌اند
echo "5. تست سرورهای بک‌اند..."
echo "   - تست Gateway..."
curl -s http://localhost:3000/ > /dev/null && echo "      ✅ Gateway فعال" || echo "      ❌ Gateway مشکل دارد"
echo "   - تست پایگاه دانش..."
curl -s http://localhost:3000/api/knowledge/health > /dev/null && echo "      ✅ پایگاه دانش فعال" || echo "      ❌ پایگاه دانش مشکل دارد"
echo "   - تست NLP..."
curl -s http://localhost:3000/api/nlp/health > /dev/null && echo "      ✅ سرور NLP فعال" || echo "      ❌ سرور NLP مشکل دارد"

# راه‌اندازی فرانت‌اند
echo "6. راه‌اندازی فرانت‌اند..."
cd ~/natiq-masthul/frontend
npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!

# منتظر راه‌اندازی فرانت‌اند
echo "7. منتظر راه‌اندازی فرانت‌اند..."
for i in {1..10}; do
    if curl -s http://localhost:5173/ > /dev/null 2>&1; then
        echo "      ✅ فرانت‌اند پس از $i ثانیه فعال شد"
        break
    fi
    sleep 1
    if [ $i -eq 10 ]; then
        echo "      ⚠️ فرانت‌اند پس از 10 ثانیه فعال نشد، اما ادامه می‌دهیم..."
    fi
done

echo ""
echo "✅ سیستم با موفقیت راه‌اندازی شد!"
echo "🌐 آدرس‌های دسترسی:"
echo "   - فرانت‌اند: http://localhost:5173"
echo "   - فرانت‌اند (شبکه): http://$(hostname -I | awk '{print $1}'):5173"
echo "   - API Gateway: http://localhost:3000"
echo "   - پایگاه دانش: http://localhost:3018"
echo "   - سرور NLP: http://localhost:3004"
echo ""
echo "📋 وضعیت سرورها:"
echo "   - سرور دانش: PID $KNOWLEDGE_PID"
echo "   - سرور NLP: PID $NLP_PID"
echo "   - API Gateway: PID $GATEWAY_PID"
echo "   - فرانت‌اند: PID $FRONTEND_PID"
echo ""
echo "🔧 برای توقف سیستم: pkill -f node"
