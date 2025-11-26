#!/bin/bash

cd ~/natiq-masthul

echo "🔄 بهینه‌سازی ساختار فایل‌ها برای افزایش بهره‌وری..."

# ایجاد ساختار بهینه
mkdir -p frontend
mkdir -p backend/core
mkdir -p backend/api
mkdir -p scripts
mkdir -p docs

# انتقال فایل‌ها به مکان‌های بهینه
mv unified-dashboard.js frontend/
mv web-interface-simple.js frontend/
mv *.html frontend/ 2>/dev/null || true

mv NAtiQ-ENHANCED.js backend/core/
mv free-api-server.js backend/api/
mv simple-free-server.js backend/api/

mv *.sh scripts/
mv *.md docs/

# ایجاد فایل اصلی راه‌اندازی
cat > app.js << 'EOF2'
const UnifiedDashboard = require('./frontend/unified-dashboard');
const { getStatus } = require('./backend/core/NAtiQ-ENHANCED');

console.log('🚀 نطق مصطلح - سیستم یکپارچه و بهینه');
console.log('📊 وضعیت سیستم:', getStatus());

// راه‌اندازی داشبورد اصلی
const dashboard = new UnifiedDashboard(8080);
dashboard.start();
EOF2

echo "✅ ساختار بهینه‌سازی شد!"
echo ""
echo "📁 ساختار جدید:"
echo "natiq-masthul/"
echo "├── 📁 frontend/     # رابط‌های کاربری"
echo "├── 📁 backend/      # هسته و API"
echo "│   ├── core/       # موتور اصلی"
echo "│   └── api/        # سرویس‌های API"
echo "├── 📁 scripts/     # اسکریپت‌های مدیریتی"
echo "├── 📁 docs/        # مستندات"
echo "└── 📄 app.js       # فایل اصلی راه‌اندازی"

