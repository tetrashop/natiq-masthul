#!/bin/bash

echo "🔄 حل مشکل push به GitHub..."

# بررسی وضعیت
echo "📊 وضعیت فعلی:"
git status --short

# دریافت تغییرات از remote
echo "📥 دریافت تغییرات از GitHub..."
if git pull origin main --allow-unrelated-histories; then
    echo "✅ تغییرات با موفقیت ادغام شد"
    
    # push کردن
    echo "📤 در حال push به GitHub..."
    if git push origin main; then
        echo "🎉 موفقیت! پروژه به روزرسانی شد"
        echo "🌐 آدرس: https://github.com/tetrashop/natiq-masthul"
    else
        echo "❌ خطا در push. استفاده از روش force با احتیاط..."
        read -p "⚠️  آیا مطمئن هستید؟ (y/n): " confirm_force
        
        if [ "$confirm_force" = "y" ]; then
            git push -u origin main --force-with-lease
            echo "✅ پروژه با force push ارسال شد"
        else
            echo "ℹ️  عملیات لغو شد"
        fi
    fi
else
    echo "❌ خطا در pull. بررسی conflictها..."
    echo "🔍 فایل‌های conflict:"
    git status | grep -i "unmerged"
    echo "📝 لطفاً conflictها را رفع و سپس دستورات زیر را اجرا کنید:"
    echo "   git add ."
    echo "   git commit -m 'resolve conflicts'"
    echo "   git push origin main"
fi
