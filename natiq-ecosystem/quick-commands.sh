#!/bin/bash

echo "🎯 دستورات سریع نطق مصطلح"

case $1 in
    "start")
        echo "🚀 راه‌اندازی سیستم یکپارچه"
        node natiq-unified-system.js
        ;;
    "api")
        echo "🌐 راه‌اندازی API رایگان" 
        node free-api-server.js
        ;;
    "web")
        echo "🖥️ راه‌اندازی رابط وب"
        node web-interface-simple.js
        ;;
    "simple")
        echo "⚡ نسخه ساده و سریع"
        node simple-free-server.js
        ;;
    "status")
        echo "📊 نمایش وضعیت"
        node health-check.js
        ;;
    "smart")
        echo "🧠 راه‌اندازی هوشمند"
        node smart-launcher.js
        ;;
    "all")
        echo "🌟 راه‌اندازی تمام سرویس‌ها"
        node start-all-services.js
        ;;
    *)
        echo "🎪 نمایشگاه قابلیت‌ها"
        node system-showcase.js
        ;;
esac
