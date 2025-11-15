# راهنمای دپلوی پروژه

## 1️⃣ Push کردن به GitHub

### روش اول: استفاده از Git Pane در Replit
1. در سمت چپ Replit روی آیکون **Source Control** (شبیه شاخه درخت) کلیک کنید
2. تمام فایل‌های تغییر یافته را **Stage** کنید
3. یک پیام commit بنویسید (مثلاً: "Complete Persian Apple Store")
4. روی **Commit** کلیک کنید
5. سپس روی **Push** کلیک کنید تا کد به GitHub برود

### روش دوم: استفاده از Shell
```bash
git add .
git commit -m "Complete Persian Apple Store with background system"
git push origin main
```

**نکته:** اگر از روش Shell استفاده می‌کنید و خطا گرفتید، از Git Pane استفاده کنید.

---

## 2️⃣ دپلوی روی Render

### مرحله ۱: ایجاد Web Service جدید
1. به [Render Dashboard](https://dashboard.render.com) بروید
2. روی **New +** کلیک کنید و **Web Service** را انتخاب کنید
3. GitHub repository خود را متصل کنید: `hatamishahab22-max/PswDataRenderr`

### مرحله ۲: تنظیمات Build
در صفحه تنظیمات، موارد زیر را وارد کنید:

**Name:** `persian-apple-store` (یا هر نام دلخواهی)

**Region:** Frankfurt (برای سرعت بیشتر در ایران) یا Oregon

**Branch:** `main`

**Runtime:** `Node`

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### مرحله ۳: Environment Variables
این متغیرها را در بخش Environment Variables اضافه کنید:

| Key | Value | توضیحات |
|-----|-------|---------|
| `NODE_ENV` | `production` | محیط اجرا |
| `DATABASE_URL` | `postgresql://...` | آدرس دیتابیس Neon شما |
| `CLOUDINARY_CLOUD_NAME` | `df9akm3go` | نام Cloud در Cloudinary |
| `CLOUDINARY_API_KEY` | `312844322743625` | API Key از Cloudinary |
| `CLOUDINARY_API_SECRET` | `***` | API Secret از Cloudinary (مخفی) |
| `SESSION_SECRET` | `***` | یک رشته تصادفی برای امنیت Session |

**⚠️ نکته مهم:** `SESSION_SECRET` را از Replit Secrets کپی کنید یا یک رشته تصادفی جدید بسازید:
```bash
openssl rand -base64 32
```

### مرحله ۴: دیتابیس Neon
1. به [Neon Dashboard](https://console.neon.tech) بروید
2. `DATABASE_URL` خود را کپی کنید
3. در Render به عنوان Environment Variable اضافه کنید

### مرحله ۵: Deploy
1. روی **Create Web Service** کلیک کنید
2. منتظر بمانید تا build و deploy کامل شود (۵-۱۰ دقیقه)
3. بعد از اتمام، لینک سایت شما آماده است: `https://persian-apple-store.onrender.com`

---

## 3️⃣ بررسی Deploy

بعد از deploy موفق:
- سایت شما در آدرس Render در دسترس است
- می‌توانید به پنل ادمین بروید: `/admin/login`
- اطلاعات ورود:
  - **Username:** `admin`
  - **Password:** `selena@2523`

---

## 🔧 عیب‌یابی (Troubleshooting)

### مشکل: Build Error
- لاگ‌های Render را بررسی کنید
- مطمئن شوید تمام Environment Variables درست تنظیم شده‌اند

### مشکل: Database Connection Error
- `DATABASE_URL` را بررسی کنید
- مطمئن شوید Neon database در حالت Active است

### مشکل: Cloudinary Upload نمی‌کند
- `CLOUDINARY_API_SECRET` را دوباره چک کنید
- مطمئن شوید API Key و Cloud Name درست است

### مشکل: Session Error
- `SESSION_SECRET` را تنظیم کنید
- مقدار آن نباید خالی باشد

---

## 📝 نکات مهم

1. **هزینه Render Free Tier:**
   - سرویس بعد از ۱۵ دقیقه عدم استفاده خاموش می‌شود
   - اولین بار بازکردن ممکن است ۳۰-۶۰ ثانیه طول بکشد
   - برای سرویس ۲۴/۷ نیاز به پلن پولی است ($7/month)

2. **امنیت:**
   - هرگز API Keys و Secrets را در کد commit نکنید
   - همیشه از Environment Variables استفاده کنید

3. **بروزرسانی:**
   - هر بار که کد را push می‌کنید، Render به صورت خودکار دوباره deploy می‌کند
   - می‌توانید Auto-Deploy را در تنظیمات Render فعال یا غیرفعال کنید

---

## 🚀 مراحل بعدی

بعد از deploy موفق:
- [ ] دامنه اختصاصی متصل کنید (اختیاری)
- [ ] SSL/HTTPS به صورت خودکار فعال است
- [ ] تنظیمات CDN برای سرعت بیشتر (اختیاری)
- [ ] Monitoring و Analytics اضافه کنید

موفق باشید! 🎉
