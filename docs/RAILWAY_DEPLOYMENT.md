# 🚀 استقرار نطق مصطلح روی Railway

## مراحل استقرار:

1. **ایجاد حساب Railway**
   - به [railway.app](https://railway.app) بروید
   - با GitHub لاگین کنید

2. **ایجاد پروژه جدید**
   - New Project → Deploy from GitHub repo
   - ریپازیتوری natiq-masthul را انتخاب کنید

3. **تنظیمات خودکار**
   - Railway به طور خودکار پروژه را تشخیص می‌دهد
   - وابستگی‌ها نصب می‌شوند
   - سرور راه‌اندازی می‌شود

4. **دامنه سفارشی (اختیاری)**
   - Settings → Domains
   - دامنه مورد نظر را اضافه کنید

## ویژگی‌های استقرار Railway:

✅ **مقیاس‌پذیری خودکار**  
✅ **CD پیوسته**  
✅ **SSL رایگان**  
✅ **مانیتورینگ پیشرفته**  
✅ **پشتیبان‌گیری خودکار**

## وضعیت سیستم:

- سرور: `src/railway-server.js`
- پورت: خودکار (Environment Variable)
- محیط: Production
- پایگاه دانش: جامع

## تست سلامت:

```bash
# پس از استقرار
curl https://your-project.railway.app/health
# مشاهده لاگ‌ها در Railway dashboard
# یا از Railway CLI استفاده کنید
railway logs

### 6. بروزرسانی package.json برای استفاده از سرور Railway

```bash
# به‌روزرسانی package.json
cat > package.json << 'EOF'
{
  "name": "natiq-masthul",
  "version": "3.2.0",
  "description": "سیستم هوش مصنوعی نطق مصطلح - نسخه درآمدزا",
  "main": "src/railway-server.js",
  "scripts": {
    "start": "node src/railway-server.js",
    "dev": "node src/railway-server.js",
    "test": "echo \"✅ سیستم فعال است\" && curl -s http://localhost:3001/health",
    "railway:deploy": "git add . && git commit -m \"Deploy to Railway\" && git push origin main"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "keywords": [
    "ai",
    "nlp",
    "persian",
    "natiq-masthul",
    "railway"
  ],
  "author": "Ramin Ejlal",
  "license": "MIT",
  "engines": {
    "node": ">=16.0.0"
  }
}
