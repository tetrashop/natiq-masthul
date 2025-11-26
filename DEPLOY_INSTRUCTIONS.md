# 🚀 راهنمای آپلود مستقیم به Cloudflare

## مرحله ۱: ورود به Cloudflare Dashboard
1. به https://dash.cloudflare.com بروید
2. وارد حساب خود شوید
3. به بخش "Workers & Pages" بروید

## مرحله ۲: انتخاب Worker موجود
1. روی Worker "natiq-masthul" کلیک کنید
2. به تب "Settings" بروید
3. روی "Edit Code" کلیک کنید

## مرحله ۳: آپلود کد جدید
1. محتوای فایل `dist/cloudflare-worker.js` را کپی کنید
2. کد موجود را با کد جدید جایگزین کنید
3. روی "Save and Deploy" کلیک کنید

## مرحله ۴: تست سیستم
پس از deploy، این تست را اجرا کنید:

```bash
curl -X POST "https://natiq-masthul.ramin-edjlal1359.workers.dev/" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "چطور یک مقاله درباره دست آوردهای خودم برای سخنرانی بنویسم"}' \\
  | jq '.response'
q
ZzEOF
