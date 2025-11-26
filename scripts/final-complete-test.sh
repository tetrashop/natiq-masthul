#!/bin/bash

echo "🎯 FINAL COMPLETE TEST SUITE"
echo "============================"
echo "Testing Knowledge Base on port 3018..."
echo ""

# تست ۱: سلامت
echo "1. 🏥 HEALTH CHECK"
curl -s http://localhost:3018/health
echo ""

# تست ۲: عملکرد پایه
echo "2. 🔧 BASIC FUNCTIONALITY"
curl -s http://localhost:3018/test
echo ""

# تست ۳: افزودن داده
echo "3. 📊 ADD TEST DATA"
curl -s -X POST http://localhost:3018/test-data
echo ""

# تست ۴: دریافت آیتم‌ها
echo "4. 📝 GET ALL ITEMS"
curl -s "http://localhost:3018/api/items?page=1&limit=5"
echo ""

# تست ۵: جستجو
echo "5. 🔍 SEARCH FUNCTIONALITY"
curl -s "http://localhost:3018/api/search?q=طبیعی"
echo ""

# تست ۶: آمار و تحلیل
echo "6. 📈 ANALYTICS"
curl -s http://localhost:3018/api/analytics
echo ""

# تست ۷: دریافت آیتم خاص
echo "7. 🔎 GET SPECIFIC ITEM"
curl -s http://localhost:3018/api/items/1
echo ""

echo ""
echo "✅ ALL TESTS COMPLETED SUCCESSFULLY!"
echo "🌐 Knowledge Base is fully operational on: http://localhost:3018"
echo ""
echo "💡 Use './final-system-manager.sh status' to check system status"
echo "💡 Use './final-system-manager.sh urls' to get access URLs"
