# 🚀 Hướng dẫn Deploy lên Vercel với CI/CD

## 📋 Mục lục

1. [Chuẩn bị](#1-chuẩn-bị)
2. [Tạo tài khoản Vercel](#2-tạo-tài-khoản-vercel)
3. [Deploy lần đầu](#3-deploy-lần-đầu)
4. [Cấu hình CI/CD với GitHub Actions](#4-cấu-hình-cicd-với-github-actions)
5. [Test CI/CD](#5-test-cicd)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Chuẩn bị

### 1.1. Kiểm tra project

Đảm bảo project có các file:

- ✅ `package.json` với scripts build
- ✅ `next.config.mjs` hoặc `next.config.js`
- ✅ `prisma/schema.prisma`
- ✅ `.env.example` (template cho environment variables)
- ✅ `vercel.json` (config cho Vercel)
- ✅ `.vercelignore` (files không upload lên Vercel)

### 1.2. Push code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit"

# Tạo repository trên GitHub rồi push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 2. Tạo tài khoản Vercel

### 2.1. Đăng ký

1. Truy cập: https://vercel.com/signup
2. Chọn **Continue with GitHub**
3. Authorize Vercel truy cập GitHub của bạn

### 2.2. Import Project

1. Click **Add New Project**
2. Chọn repository của bạn từ danh sách
3. Click **Import**

---

## 3. Deploy lần đầu

### 3.1. Configure Project

Vercel sẽ tự động detect Next.js, bạn chỉ cần:

#### Framework Preset

- ✅ Next.js (tự động detect)

#### Build and Output Settings

- Build Command: `prisma generate && next build`
- Output Directory: `.next` (mặc định)
- Install Command: `npm install`

#### Environment Variables

Click **Environment Variables** và thêm:

**DATABASE_URL**

```
postgresql://user:password@host:port/database?schema=public
```

> ⚠️ Thay bằng connection string từ Supabase của bạn

**NEXTAUTH_URL**

```
https://your-project-name.vercel.app
```

> ⚠️ Sẽ cập nhật sau khi có domain

**NEXTAUTH_SECRET**

```bash
# Generate secret bằng lệnh:
openssl rand -base64 32
```

### 3.2. Deploy

1. Click **Deploy**
2. Đợi 2-3 phút để build
3. Nhận link: `https://your-project-name.vercel.app`

### 3.3. Cập nhật NEXTAUTH_URL

1. Sau khi deploy xong, copy domain
2. Vào **Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` với domain thật
4. Click **Redeploy** để áp dụng

---

## 4. Cấu hình CI/CD với GitHub Actions

### 4.1. Lấy Vercel Token

#### Tạo Token

1. Vào https://vercel.com/account/tokens
2. Click **Create Token**
3. Đặt tên: `GitHub Actions`
4. Scope: `Full Account`
5. Copy token (chỉ hiển thị 1 lần!)

#### Lấy Project IDs

```bash
# Cài Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd /path/to/your/project
vercel link

# Xem thông tin
cat .vercel/project.json
```

Bạn sẽ thấy:

```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

### 4.2. Thêm GitHub Secrets

1. Vào repository GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Thêm 3 secrets:

| Name                | Value                                 |
| ------------------- | ------------------------------------- |
| `VERCEL_TOKEN`      | Token từ bước 4.1                     |
| `VERCEL_ORG_ID`     | `orgId` từ `.vercel/project.json`     |
| `VERCEL_PROJECT_ID` | `projectId` từ `.vercel/project.json` |

### 4.3. Tạo GitHub Workflow

File `.github/workflows/vercel-deploy.yml` đã được tạo sẵn với nội dung:

```yaml
name: Vercel Deployment

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  push:
    branches:
      - main
      - master
  pull_request:
    branches:
      - main
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 4.4. Commit và Push

```bash
git add .github/workflows/vercel-deploy.yml
git commit -m "Add GitHub Actions CI/CD for Vercel"
git push origin main
```

---

## 5. Test CI/CD

### 5.1. Kiểm tra GitHub Actions

1. Vào repository → **Actions** tab
2. Xem workflow `Vercel Deployment` đang chạy
3. Click vào workflow để xem logs

### 5.2. Test tự động deploy

Thử thay đổi code:

```bash
# Sửa file bất kỳ
echo "// Test CI/CD" >> src/app/page.tsx

# Commit và push
git add .
git commit -m "Test CI/CD deployment"
git push origin main
```

→ GitHub Actions sẽ tự động chạy và deploy lên Vercel!

### 5.3. Xem deployment

- GitHub Actions logs: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`
- Vercel dashboard: `https://vercel.com/YOUR_USERNAME/YOUR_PROJECT`

---

## 6. Troubleshooting

### ❌ Lỗi: "Prisma Client not found"

**Nguyên nhân:** Prisma chưa được generate trước khi build

**Giải pháp:**

1. Vào Vercel dashboard → **Settings** → **General**
2. Sửa Build Command thành:

```bash
prisma generate && next build
```

### ❌ Lỗi: "DATABASE_URL not set"

**Nguyên nhân:** Environment variable chưa được set

**Giải pháp:**

1. Vào Vercel → **Settings** → **Environment Variables**
2. Thêm `DATABASE_URL` với connection string từ Supabase
3. Chọn **Production**, **Preview**, và **Development**
4. Click **Save**
5. **Redeploy** project

### ❌ Lỗi: "NextAuth configuration error"

**Nguyên nhân:** `NEXTAUTH_URL` hoặc `NEXTAUTH_SECRET` sai

**Giải pháp:**

1. Kiểm tra `NEXTAUTH_URL` = domain thật (https://your-app.vercel.app)
2. Generate secret mới:

```bash
openssl rand -base64 32
```

3. Update trong Vercel Environment Variables

### ❌ GitHub Actions failed

**Nguyên nhân:** Secrets chưa được set hoặc sai

**Giải pháp:**

1. Kiểm tra GitHub Secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
2. Xem logs chi tiết trong Actions tab
3. Chạy lại workflow: **Re-run jobs**

### ❌ Build timeout

**Nguyên nhân:** Dependencies quá lớn hoặc build chậm

**Giải pháp:**

1. Kiểm tra `package.json` có dependencies không cần thiết
2. Thêm `.vercelignore` để bỏ qua files lớn
3. Upgrade plan Vercel (nếu cần)

---

## 🎉 Hoàn thành!

Bây giờ mỗi khi bạn push code lên GitHub:

1. ✅ GitHub Actions tự động chạy
2. ✅ Build project với Vercel CLI
3. ✅ Deploy lên Vercel Production
4. ✅ Nhận thông báo kết quả (success/failed)

**Workflow:**

```
Push to GitHub
    ↓
GitHub Actions triggered
    ↓
Install dependencies
    ↓
Run Prisma generate
    ↓
Build Next.js
    ↓
Deploy to Vercel
    ↓
✅ Live at https://your-app.vercel.app
```

---

## 📚 Tài liệu tham khảo

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

## 💡 Tips

### Domain tùy chỉnh

Vào Vercel → **Settings** → **Domains** để thêm domain riêng

### Preview Deployments

Mỗi PR sẽ tự động tạo preview deployment riêng

### Environment per branch

Set khác nhau cho:

- **Production** (main branch)
- **Preview** (PR branches)
- **Development** (local)

### Monitoring

Vào Vercel → **Analytics** để xem:

- Performance metrics
- Error tracking
- User analytics

---

**Chúc bạn deploy thành công! 🚀**
