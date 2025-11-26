# 🏗️ ساختار بهینه نطق مصطلح

## فایل‌های اصلی:
- `simple-dashboard.js` - رابط اصلی (کار میکند)
- `NAtiQ-ENHANCED.js` - موتور هوش مصنوعی  
- `free-api-server.js` - API رایگان
- `system-showcase.js` - نمایش قابلیت‌ها

## دستورات سریع:
```bash
# راه‌اندازی رابط اصلی
node simple-dashboard.js

# راه‌اندازی API
node free-api-server.js

# نمایش قابلیت‌ها  
node system-showcase.js

## 🔄 **اسکریپت راه‌اندازی مطمئن**

```bash
cat > start-safe.js << 'EOF'
#!/bin/bash

cd ~/natiq-masthul

echo "🔍 بررسی سلامت سیستم..."

# بررسی فایل‌های ضروری
ESSENTIAL_FILES=("NAtiQ-ENHANCED.js" "simple-dashboard.js")

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ فایل ضروری $file یافت نشد"
        exit 1
    fi
done

echo "✅ تمام فایل‌های ضروری موجود هستند"

# تست سیستم اصلی
echo "🧪 تست موتور هوش مصنوعی..."
node -e "const { ask } = require('./NAtiQ-ENHANCED.js'); console.log('✅ موتور هوش مصنوعی سالم است')"

if [ $? -eq 0 ]; then
    echo "🚀 راه‌اندازی رابط کاربری..."
    node simple-dashboard.js
else
    echo "❌ خطا در موتور هوش مصنوعی"
    exit 1
fi
