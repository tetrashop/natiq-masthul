#!/bin/bash

echo "🚀 راه‌اندازی سیستم نطق مصطلح - نسخه بهینه‌سازی شده"
echo "🎯 هدف: حذف اسراف الگوریتمی و رسیدن به صفر درصد اتلاف"

# بررسی وجود پوشه
if [ ! -d "optimized-system" ]; then
    echo "❌ پوشه optimized-system یافت نشد"
    exit 1
fi

# اجرای سیستم بهینه‌سازی شده
echo "🔧 در حال اجرای سیستم بهینه‌سازی شده..."
node optimized-system/natiq-optimized.js

# نمایش گزارش بهینه‌سازی
echo ""
echo "📊 گزارش بهینه‌سازی:"
echo "===================="
node -e "
const system = require('./optimized-system/natiq-optimized.js');
const sys = new system();
sys.getPerformanceSummary().then(report => {
    console.log('✅ میانگین بهره‌وری سیستم:', report.averageEfficiency.toFixed(1) + '%');
    console.log('🗑️  کل اسراف کاهش یافته:', report.totalWasteReduced.toFixed(1) + '%');
    console.log('🎯 سطح بهینه‌سازی:', report.optimizationLevel.toFixed(1) + '%');
    console.log('📈 وضعیت اسراف:', report.wasteStatus);
});
"

echo ""
echo "✨ سیستم با موفقیت بهینه‌سازی شد!"
