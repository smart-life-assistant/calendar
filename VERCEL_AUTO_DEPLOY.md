# 🔄 Vercel Auto-Deploy - Hướng dẫn nhanh

## ✅ Cách 1: Vercel tự động (RECOMMENDED)

### Đây là cách ĐƠN GIẢN NHẤT và đã hoạt động sẵn!

Khi bạn import project từ GitHub vào Vercel:

- ✅ Vercel tự động theo dõi repository
- ✅ Mỗi khi push lên `main` → Tự động build & deploy
- ✅ Mỗi PR → Tự động tạo preview deployment
- ✅ KHÔNG CẦN setup gì thêm!

### Kiểm tra Vercel đã connect chưa:

1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Click vào project của bạn
3. Vào tab **Settings** → **Git**
4. Xem phần **Connected Git Repository**

Nếu thấy repository của bạn → ✅ **ĐÃ CONNECT RỒI!**

### Test auto-deploy:

```bash
# Thử sửa một file bất kỳ
echo "// Test auto deploy" >> src/app/page.tsx

# Commit và push
git add .
git commit -m "Test auto deploy"
git push origin main
```

→ Vào Vercel dashboard sẽ thấy deployment mới tự động chạy!

---

## 🔧 Cách 2: GitHub Actions (ADVANCED - Optional)

**Chỉ dùng nếu bạn cần:**

- Run tests trước khi deploy
- Deploy tới nhiều environments
- Custom build steps phức tạp
- Control deployment logic

### Setup (nếu muốn dùng cách này):

1. **Tạo Vercel Token:**

   - https://vercel.com/account/tokens
   - Create → "GitHub Actions" → Full Account
   - Copy token

2. **Get Project IDs:**

   ```bash
   # Chạy script setup
   .\scripts\setup-vercel.ps1
   ```

3. **Add GitHub Secrets:**

   - Vào: https://github.com/YOUR_REPO/settings/secrets/actions
   - Thêm 3 secrets:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

4. **Keep file:** `.github/workflows/vercel-deploy.yml`

### ⚠️ Lưu ý khi dùng cả 2 cách:

Nếu bạn enable cả Vercel auto-deploy VÀ GitHub Actions:

- Sẽ có **2 deployments** mỗi khi push (trùng lặp!)
- **Tốn quota** không cần thiết

**Khuyến nghị:**

- Dùng Vercel auto-deploy (Cách 1)
- Disable GitHub Actions bằng cách xóa file workflow

---

## 🎯 Khuyến nghị cho project này

### Đối với Calendar Project của bạn:

✅ **Dùng Vercel tự động (Cách 1)**

**Lý do:**

- ✅ Đơn giản, không cần config gì thêm
- ✅ Vercel tối ưu cho Next.js
- ✅ Preview deployments miễn phí cho PR
- ✅ Rollback dễ dàng trong dashboard
- ✅ Deployment logs rõ ràng

**Xóa file này đi (không cần):**

```bash
rm -rf .github/workflows/vercel-deploy.yml
# Hoặc Windows:
# Remove-Item -Path .github/workflows/vercel-deploy.yml -Force
```

---

## 📊 So sánh 2 cách

| Feature      | Vercel Auto     | GitHub Actions            |
| ------------ | --------------- | ------------------------- |
| Setup        | ✅ Dễ (1 click) | ⚠️ Phức tạp (cần secrets) |
| Auto-deploy  | ✅ Có           | ✅ Có                     |
| Preview PR   | ✅ Có           | ⚠️ Cần config thêm        |
| Custom tests | ❌ Không        | ✅ Có                     |
| Build logs   | ✅ Trong Vercel | ✅ Trong GitHub           |
| Quota        | ✅ Tiết kiệm    | ⚠️ Dùng 2x nếu overlap    |
| Rollback     | ✅ 1 click      | ⚠️ Phải redeploy          |

---

## ✅ Checklist: Vercel đã auto-deploy chưa?

- [ ] Repository đã được import vào Vercel
- [ ] Trong Vercel Settings → Git thấy repository connected
- [ ] Đã deploy thành công ít nhất 1 lần
- [ ] Push code test → Thấy deployment mới trong Vercel
- [ ] PR mới → Tự động có preview deployment

Nếu tất cả ✅ → **HOẠT ĐỘNG RỒI!**

---

## 🚀 Quick Test

```bash
# 1. Tạo branch mới
git checkout -b test-auto-deploy

# 2. Sửa file
echo "<!-- Test -->" >> src/app/page.tsx

# 3. Commit và push
git add .
git commit -m "Test: Vercel auto-deploy"
git push origin test-auto-deploy

# 4. Tạo PR trên GitHub

# 5. Check Vercel dashboard
# → Nên thấy preview deployment cho PR này
```

---

## 💡 Kết luận

### Cho project Calendar:

**GỠ BỎ GitHub Actions workflow** (không cần thiết):

```bash
rm .github/workflows/vercel-deploy.yml
git add .github/workflows/vercel-deploy.yml
git commit -m "Remove GitHub Actions workflow - use Vercel auto-deploy"
git push origin main
```

**Chỉ cần:**

1. ✅ Repository connected với Vercel (đã có)
2. ✅ Environment variables set trên Vercel (đã có)
3. ✅ Push code lên GitHub
4. ✅ Vercel tự động build & deploy!

**Workflow đơn giản:**

```
Code changes → Git push → Vercel auto-build → Live!
```

---

## 🆘 Nếu không tự động deploy

### Kiểm tra:

1. **Vercel Git Integration:**

   - Settings → Git → Connected Repository
   - Nếu chưa: Click "Connect Git Repository"

2. **Deployment Settings:**

   - Settings → Git
   - "Production Branch" = `main` hoặc `master`
   - "Automatic Deployments" = ✅ Enabled

3. **Build Settings:**
   - Settings → General
   - Framework Preset: Next.js
   - Build Command: `prisma generate && next build`

---

**TL;DR: Vercel ĐÃ TỰ ĐỘNG BUILD khi bạn push lên GitHub. Không cần GitHub Actions workflow!**
