# Render Configuration Quick Reference

## Build Settings
```
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

## Environment Variables (برای کپی‌پیست سریع)

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=your_neon_database_url_here
CLOUDINARY_CLOUD_NAME=df9akm3go
CLOUDINARY_API_KEY=312844322743625
CLOUDINARY_API_SECRET=your_secret_here
SESSION_SECRET=your_random_secret_here
```

## Generate SESSION_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database Migration
After first deploy, run:
```bash
npm run db:push
```

## Admin Access
- URL: `https://your-app.onrender.com/admin/login`
- Username: `admin`
- Password: `selena@2523`

## Support
- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs
- Cloudinary Docs: https://cloudinary.com/documentation
