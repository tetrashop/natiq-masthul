#!/bin/bash

echo "🚀 راه‌اندازی کامل سیستم مدیریت دانش"
echo "===================================="

# توقف سرورهای قبلی
echo "1. توقف سرورهای قبلی..."
pkill -f "simple-knowledge-server" 2>/dev/null
pkill -f "stable-nlp-server-fixed" 2>/dev/null
pkill -f "simple-gateway" 2>/dev/null
pkill -f "vite" 2>/dev/null

sleep 3

# راه‌اندازی سرور دانش
echo "2. راه‌اندازی سرور دانش..."
cd ~/natiq-masthul
node simple-knowledge-server.js &

sleep 2

# راه‌اندازی سرور NLP
echo "3. راه‌اندازی سرور NLP..."
node stable-nlp-server-fixed.js &

sleep 2

# راه‌اندازی API Gateway
echo "4. راه‌اندازی API Gateway..."
node simple-gateway.js &

sleep 3

# تست سرورهای بک‌اند
echo "5. تست سرورهای بک‌اند..."
echo "   - تست Gateway:"
curl -s http://localhost:3000/ | grep -o '"message":"[^"]*"'
echo "   - تست دانش:"
curl -s http://localhost:3000/api/knowledge/health | grep -o '"status":"[^"]*"'
echo "   - تست NLP:"
curl -s http://localhost:3000/api/nlp/health | grep -o '"status":"[^"]*"'

# راه‌اندازی فرانت‌اند
echo "6. راه‌اندازی فرانت‌اند..."
cd ~/natiq-masthul/frontend
npm run dev &

sleep 5

echo ""
echo "✅ سیستم با موفقیت راه‌اندازی شد!"
echo "🌐 آدرس‌های دسترسی:"
echo "   - فرانت‌اند: http://localhost:5173"
echo "   - API Gateway: http://localhost:3000"
echo "   - پایگاه دانش: http://localhost:3018"
echo "   - سرور NLP: http://localhost:3004"
echo ""
echo "📋 وضعیت سرورها:"
ps aux | grep -E "node|vite" | grep -v grep | while read line; do
    echo "   📍 $line" | cut -d' ' -f11-
done
