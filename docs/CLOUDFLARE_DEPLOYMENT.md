# 🚀 استقرار نطق مصطلح روی Cloudflare Workers

## پیش‌نیازها:

1. **حساب Cloudflare**
   - به [cloudflare.com](https://cloudflare.com) بروید
   - حساب ایجاد کنید (رایگان)

2. **نصب Wrangler CLI**
   ```bash
   npm install -g wrangler
wrangler login
# جایگزینی account-id و zone-id
wrangler whoami  # دریافت account ID
wrangler dev  # اجرای محلی
wrangler deploy
# پس از استقرار
curl https://natiq-masthul.your-account.workers.dev/health

### 5. **دستورات نهایی برای استقرار**

```bash
# نصب وابستگی‌ها
npm install

# لاگین به Cloudflare
npx wrangler login

# استقرار
npx wrangler deploy

echo ""
echo "✅ پروژه برای Cloudflare آماده شد!"
echo "🚀 دستورات استقرار:"
echo "   npx wrangler dev    # اجرای محلی"
echo "   npx wrangler deploy # استقرار روی Cloudflare"
echo ""
echo "🌐 پس از استقرار، سیستم در آدرس زیر قابل دسترسی است:"
echo "   https://natiq-masthul.your-account.workers.dev"
echo ""
echo "⚡ مزایای Cloudflare:"
echo "   • سرعت فوق‌العاده در سراسر جهان"
echo "   • امنیت پیشرفته"
echo "   • مقیاس‌پذیری خودکار"
echo "   • هزینه بسیار کم"
