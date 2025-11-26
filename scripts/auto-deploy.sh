#!/bin/bash
echo "🚀 شروع دپلوی خودکار..."
git add .
git commit -m "🔧 بروزرسانی: $1"
git push origin main
echo "✅ دپلوی انجام شد!"
