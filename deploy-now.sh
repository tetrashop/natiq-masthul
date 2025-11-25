#!/bin/bash

cd ~/natiq-masthul

echo "🔍 بررسی وضعیت Git..."
if [ ! -d ".git" ]; then
    echo "📦 ساخت مخزن Git جدید..."
    git init
    git add .
    git commit -m "🚀 انتشار نطق مصطلح"
    echo "✅ مخزن محلی ساخته شد"
    GIT_READY="new"
else
    echo "✅ مخزن Git موجود است"
    if git diff --cached --quiet && git diff --quiet; then
        echo "📭 هیچ تغییری برای commit وجود ندارد"
        GIT_READY="clean"
    else
        echo "📦 ثبت تغییرات جدید..."
        git add .
        git commit -m "🔧 بروزرسانی: $(date +%Y-%m-%d)"
        GIT_READY="updated"
    fi
fi

echo ""
echo "🌐 وضعیت Remote:"
git remote -v

echo ""
if git remote | grep -q origin; then
    echo "🚀 در حال آپلود به GitHub..."
    git push origin main
    echo "✅ موفق! پروژه شما در GitHub است"
else
    echo "⚠️  لطفاً دستورات زیر را با آدرس REAL خودتان اجرا کنید:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/natiq-masthul.git"
    echo "   git push -u origin main"
    echo ""
    echo "📝 ابتدا مطمئن شوید مخزن در GitHub ساخته شده است:"
    echo "   https://github.com/new"
fi
