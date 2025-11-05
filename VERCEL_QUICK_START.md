# 🚀 Quick Start: Deploy to Vercel

## ⚡ Nhanh nhất (3 phút)

### 1. Cài Vercel CLI

```bash
npm install -g vercel
```

### 2. Login và Deploy

```bash
vercel login
vercel
```

Xong! Website đã live tại `https://your-project.vercel.app`

---

## 🔄 Setup CI/CD (Auto deploy khi push)

### Bước 1: Lấy thông tin project

Chạy script tự động:

```bash
# Windows PowerShell
.\scripts\setup-vercel.ps1

# Linux/Mac
chmod +x scripts/setup-vercel.sh
./scripts/setup-vercel.sh
```

Script sẽ hiển thị:

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Bước 2: Tạo Vercel Token

1. Truy cập: https://vercel.com/account/tokens
2. Click **Create Token**
3. Tên: `GitHub Actions`
4. Scope: **Full Account**
5. Copy token

### Bước 3: Thêm GitHub Secrets

Vào: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

Thêm 3 secrets:

- `VERCEL_TOKEN` → token từ bước 2
- `VERCEL_ORG_ID` → từ script bước 1
- `VERCEL_PROJECT_ID` → từ script bước 1

### Bước 4: Push code

```bash
git add .
git commit -m "Setup Vercel CI/CD"
git push origin main
```

✅ Xong! GitHub Actions sẽ tự động deploy mỗi khi push.

---

## 📝 Environment Variables (Quan trọng!)

Vào Vercel Dashboard → Settings → Environment Variables

Thêm:

```env
DATABASE_URL=postgresql://...your-supabase-url...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=...generate-with-openssl...
```

**Generate secret:**

```bash
openssl rand -base64 32
```

---

## 📚 Hướng dẫn chi tiết

Xem file [DEPLOYMENT.md](./DEPLOYMENT.md) để biết:

- Cấu hình chi tiết
- Troubleshooting
- Best practices
- Advanced configurations

---

## 🔧 NPM Scripts

```bash
# Development
npm run dev

# Build (với Prisma)
npm run build

# Deploy production
npm run vercel:deploy

# Deploy preview
npm run vercel:preview

# Setup Vercel
npm run vercel:setup
```

---

## ✅ Checklist Deploy

- [ ] Code đã push lên GitHub
- [ ] Environment variables đã set trên Vercel
- [ ] DATABASE_URL đúng (Supabase)
- [ ] NEXTAUTH_SECRET đã generate
- [ ] NEXTAUTH_URL = domain Vercel
- [ ] GitHub Secrets đã thêm (nếu dùng CI/CD)
- [ ] Test deployment thành công

---

## 🆘 Lỗi thường gặp

### "Prisma Client not found"

→ Build command phải có `prisma generate`

### "DATABASE_URL not set"

→ Thêm vào Vercel Environment Variables

### "NextAuth configuration error"

→ Kiểm tra NEXTAUTH_URL và NEXTAUTH_SECRET

### GitHub Actions failed

→ Kiểm tra 3 secrets đã thêm đúng chưa

---

**Chi tiết xem [DEPLOYMENT.md](./DEPLOYMENT.md)**
