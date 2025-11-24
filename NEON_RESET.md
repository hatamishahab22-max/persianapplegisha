# راهنمای Reset کردن Neon Database و Initialization صحیح

## مشکل:
Tables دستی در Neon ساخته شده‌اند ولی foreign key constraints با Drizzle schema مطابقت ندارند.

## حل (قدم به قدم):

### قدم 1: پاک کردن تمام Tables در Neon

1. برو https://console.neon.tech
2. پروژه‌ات رو انتخاب کن
3. برو **SQL Editor**
4. این SQL رو run کن (همه tables رو پاک میکنه):

```sql
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS color_options CASCADE;
DROP TABLE IF EXISTS storage_options CASCADE;
DROP TABLE IF EXISTS product_models CASCADE;
DROP TABLE IF EXISTS product_variations CASCADE;
DROP TABLE IF EXISTS used_phones CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS page_visits CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### قدم 2: از Replit Schema رو Push کن

بعد از پاک کردن tables:

1. **بیا اینجا Replit** بهم بگو "تموم شد"
2. من یک script میزنم که Production database رو initialize میکنه

---

## چرا این کار لازمه؟

- Drizzle ORM نیاز داره که database schema دقیقاً با TypeScript schema مطابقت داشته باشه
- Tables دستی foreign key constraint names درست ندارند
- Drizzle خودش constraint names خاص تولید میکنه

---

**بعد از Drop کردن tables، بهم بگو تا ادامه بدم!**
