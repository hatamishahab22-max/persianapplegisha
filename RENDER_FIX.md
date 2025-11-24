# راه حل Render Deploy Issue

## مشکل:
Render در build گیر کرده و خطا میده: "Unknown command: start"

## حل سریع:

### روش 1: Manual Configuration در Render Dashboard

1. **برو به Render Dashboard:**
   - https://dashboard.render.com
   - پروژه `persianapplegisha` رو انتخاب کن

2. **Settings → Build & Deploy:**
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
   - Save Changes

3. **Environment Variables چک کن:**
   - `DATABASE_URL` = [Neon connection string]
   - `CLOUDINARY_CLOUD_NAME` = [value]
   - `CLOUDINARY_API_KEY` = [value]
   - `CLOUDINARY_API_SECRET` = [value]
   - `SESSION_SECRET` = [random-32-chars]
   - `NODE_ENV` = `production`

4. **Manual Deploy:**
   - برو **Manual Deploy** → **Deploy latest commit**

---

### روش 2: Render از Docker استفاده کنه

اگه روش 1 کار نکرد:

1. **Settings → Build & Deploy:**
   - **Runtime:** Docker
   - Render خود‌کار Dockerfile رو detect میکنه

2. **Save Changes و Manual Deploy**

---

## DATABASE_URL از Neon بگیر:

1. برو https://console.neon.tech
2. پروژه‌ات رو باز کن
3. **Connection Details** → Copy کن **Connection String**
4. Paste در Render Environment Variables

مثال:
```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## بعد از Deploy موفق:

سایتت live میشه در: `https://persianapplegisha.onrender.com`

✅ تمام!
