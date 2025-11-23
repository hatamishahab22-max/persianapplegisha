# Deploy به Render

## مراحل Deploy:

### 1. هماکنون انجام شده:
✅ Build تموم شد
✅ Dockerfile ساخته شد
✅ render.yaml ساخته شد

### 2. آپلود به GitHub:
```bash
git add .
git commit -m "Add Render deployment files"
git push origin main
```

### 3. Render دنبال کنید:
1. برو به https://render.com
2. Sign up / Login
3. **"New +"** کلیک کن → **"Web Service"**
4. **GitHub** رو انتخاب کن
5. repo **"persian-apple-store"** رو پیدا کن
6. اینترفیس انتخاب کن و بزن **"Deploy"**

### 4. Environment Variables اضافه کنید:
به **Environment** بخش اینها اضافه کنید:

```
DATABASE_URL = [از Neon بگیر]
CLOUDINARY_CLOUD_NAME = [مقدارت]
CLOUDINARY_API_KEY = [مقدارت]
CLOUDINARY_API_SECRET = [مقدارت]
SESSION_SECRET = [کد پیچیده]
NODE_ENV = production
```

### 5. بیاید Deploy شود:
Render خود‌کار build و deploy می‌کند! 

✨ سایت شما live خواهد شد! ✨

---

## متغیرهای محیط:

**DATABASE_URL:** دقیقاً از Neon کپی کنید
```
postgresql://user:password@hostname/database?sslmode=require
```

**SESSION_SECRET:** یک رشته پیچیده (حد اقل 32 کاراکتر):
```
your-secret-key-min-32-chars-long
```

---

## نکات مهم:
- Dockerfile خود‌کار optimize می‌کند
- render.yaml تمام configs رو handle می‌کند
- Render خود‌کار SSL/HTTPS اضافه می‌کند
- CDN برای static files خود‌کار فعال است

✅ آماده‌اید!
