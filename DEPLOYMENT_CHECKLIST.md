# ✅ Vercel Deployment Checklist

## Trước khi Deploy

### 1. Code & Git

- [ ] Code đã được test local (npm run dev)
- [ ] Build thành công (npm run build)
- [ ] Không có lỗi TypeScript/ESLint
- [ ] Repository đã được push lên GitHub
- [ ] Branch main/master sạch sẽ

### 2. Database

- [ ] Supabase project đã được tạo
- [ ] Database schema đã được apply (prisma db push)
- [ ] Connection string đã được test
- [ ] User admin đã được tạo trong database

### 3. Environment Variables

- [ ] File .env.example đã được tạo
- [ ] DATABASE_URL sẵn sàng
- [ ] NEXTAUTH_SECRET đã generate (openssl rand -base64 32)
- [ ] NEXTAUTH_URL sẽ cập nhật sau khi deploy

### 4. Configuration Files

- [ ] vercel.json đã có
- [ ] .vercelignore đã có
- [ ] .github/workflows/vercel-deploy.yml đã có (nếu dùng CI/CD)
- [ ] package.json có build command: "prisma generate && next build"

---

## Deploy Lần Đầu

### 1. Vercel Account

- [ ] Đã tạo tài khoản Vercel
- [ ] Đã connect với GitHub
- [ ] Repository đã được import

### 2. Project Settings

- [ ] Framework: Next.js detected
- [ ] Build Command: `prisma generate && next build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

### 3. Environment Variables trên Vercel

- [ ] DATABASE_URL đã set
- [ ] NEXTAUTH_SECRET đã set
- [ ] NEXTAUTH_URL = https://your-app.vercel.app (tạm thời)

### 4. First Deploy

- [ ] Click Deploy button
- [ ] Đợi build xong (~2-3 phút)
- [ ] Nhận được domain: your-project.vercel.app
- [ ] Website truy cập được

### 5. Update NEXTAUTH_URL

- [ ] Copy domain thật từ Vercel
- [ ] Update NEXTAUTH_URL trong Environment Variables
- [ ] Redeploy để áp dụng

---

## Setup CI/CD (Optional nhưng recommended)

### 1. Vercel Token

- [ ] Vào https://vercel.com/account/tokens
- [ ] Tạo token mới: "GitHub Actions"
- [ ] Copy token (chỉ hiện 1 lần!)

### 2. Get Project IDs

- [ ] Cài Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] Link project: `vercel link`
- [ ] Lấy orgId và projectId từ .vercel/project.json

Hoặc chạy script:

- [ ] Windows: `.\scripts\setup-vercel.ps1`
- [ ] Linux/Mac: `./scripts/setup-vercel.sh`

### 3. GitHub Secrets

Vào: Settings → Secrets and variables → Actions

- [ ] VERCEL_TOKEN đã thêm
- [ ] VERCEL_ORG_ID đã thêm
- [ ] VERCEL_PROJECT_ID đã thêm

### 4. Test CI/CD

- [ ] Push code test lên main
- [ ] GitHub Actions chạy thành công
- [ ] Vercel tự động deploy
- [ ] Changes được reflect trên production

---

## Post-Deploy

### 1. Verify Website

- [ ] Homepage load được
- [ ] Login/Register hoạt động
- [ ] Calendar hiển thị đúng
- [ ] Dark mode toggle hoạt động
- [ ] Mobile responsive OK
- [ ] Dashboard truy cập được (sau khi login)

### 2. Database Connection

- [ ] Prisma connect thành công
- [ ] Query data từ database OK
- [ ] CRUD operations hoạt động
- [ ] Authentication hoạt động

### 3. Security

- [ ] Environment variables không bị expose
- [ ] .env không bị commit lên git
- [ ] NEXTAUTH_SECRET đủ mạnh
- [ ] Database credentials an toàn

### 4. Performance

- [ ] Page load speed < 3s
- [ ] Core Web Vitals OK (check trong Vercel Analytics)
- [ ] No console errors
- [ ] Images optimized

---

## Monitoring & Maintenance

### Daily/Weekly

- [ ] Check Vercel Analytics
- [ ] Monitor error logs
- [ ] Check deployment status
- [ ] Review performance metrics

### Monthly

- [ ] Update dependencies (npm update)
- [ ] Review and rotate secrets
- [ ] Check database storage usage
- [ ] Review Vercel usage/billing

### On Issues

- [ ] Check Vercel deployment logs
- [ ] Check GitHub Actions logs
- [ ] Check browser console errors
- [ ] Check Supabase logs

---

## Troubleshooting Checklist

### Build Failed

- [ ] Check build logs trong Vercel
- [ ] Verify build command đúng
- [ ] Check dependencies trong package.json
- [ ] Test build local: `npm run build`
- [ ] Check Node.js version compatible

### Runtime Errors

- [ ] Check Vercel function logs
- [ ] Verify environment variables
- [ ] Check database connection
- [ ] Verify Prisma client generated
- [ ] Check API routes

### Database Issues

- [ ] Verify DATABASE_URL format
- [ ] Check Supabase connection limits
- [ ] Verify Prisma schema sync
- [ ] Check database credentials
- [ ] Test connection local

### Authentication Issues

- [ ] Check NEXTAUTH_URL correct
- [ ] Verify NEXTAUTH_SECRET set
- [ ] Check session configuration
- [ ] Verify user exists in database
- [ ] Check password hashing

### CI/CD Issues

- [ ] Verify GitHub Secrets set correctly
- [ ] Check workflow file syntax
- [ ] Review GitHub Actions logs
- [ ] Verify Vercel token valid
- [ ] Check project IDs match

---

## 🎉 Deployment Complete!

Nếu tất cả items trên đã check ✅, congratulations!

Website của bạn đã:

- ✅ Live trên production
- ✅ Auto deploy khi push code
- ✅ Database connected
- ✅ Authentication working
- ✅ Monitored và secure

**Next steps:**

1. Add custom domain (optional)
2. Setup analytics
3. Add error tracking (Sentry)
4. Configure CDN/caching
5. Optimize performance

**Useful links:**

- Production: https://your-app.vercel.app
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Actions: https://github.com/YOUR_REPO/actions
- Supabase Dashboard: https://app.supabase.com
