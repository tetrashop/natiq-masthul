#!/bin/bash

echo "🔧 تعمیر و بازسازی پروژه نطق مصطلح..."

# ایجاد پوشه‌های ضروری
mkdir -p src/{services,controllers,routes,config,middleware,utils}
mkdir -p public scripts docs

# ایجاد فایل‌های اصلی اگر وجود ندارند
if [ ! -f "index.html" ]; then
    echo "📄 ایجاد index.html..."
    cat > index.html << 'HTML'
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح</title>
</head>
<body>
    <h1>🧠 نطق مصطلح - در حال راه‌اندازی</h1>
    <p>سیستم هوشمند پردازش دانش</p>
</body>
</html>
HTML
fi

if [ ! -f "vercel.json" ]; then
    echo "⚙️ ایجاد vercel.json..."
    cat > vercel.json << 'VERCEL'
{
  "version": 2,
  "builds": [
    {
      "src": "*.html", 
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/index.html"
    }
  ]
}
VERCEL
fi

# اضافه کردن به Git
git add .
git commit -m "fix: بازسازی ساختار پروژه" 2>/dev/null

echo "✅ پروژه تعمیر شد"
