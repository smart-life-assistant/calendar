# Hướng dẫn Setup Vercel Cron với API Security

## 📋 Tổng quan

Hệ thống bảo vệ API hiện tại:

- **User APIs** (`/api/special-dates`, `/api/user/*`) → Bảo vệ bằng **Origin/Referer check**
- **Cron APIs** (`/api/ping-db`, `/api/cron/*`) → Bảo vệ bằng **Authorization Bearer Token**

## 🔑 Bước 1: Generate CRON_SECRET

### Option A: Dùng OpenSSL (Windows PowerShell)

```powershell
# Generate random string
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### Option B: Dùng Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option C: Dùng online tool

Truy cập: https://generate-secret.vercel.app/32

**Ví dụ kết quả:**

```
Xg8vF2Kp9Lq4Mn3Rt6Yz7Wv0Jh5Dx8Cb=
```

## 📝 Bước 2: Setup Environment Variables trên Vercel

### 2.1. Vào Vercel Dashboard

1. Mở project: https://vercel.com/your-username/calendar
2. Click **Settings** → **Environment Variables**

### 2.2. Thêm các biến sau:

#### Variable 1: CRON_SECRET

```
Key: CRON_SECRET
Value: [paste secret từ bước 1]
Environment: Production, Preview, Development
```

#### Variable 2: NEXT_PUBLIC_APP_URL

```
Key: NEXT_PUBLIC_APP_URL
Value: https://calendar-eight-beige.vercel.app
Environment: Production, Preview
```

### 2.3. Save và Redeploy

Click **Save** → Vercel sẽ tự động redeploy

## 🔧 Bước 3: Setup Local Development

### 3.1. Tạo file `.env.local`

```bash
# Copy from example
cp .env.example .env.local
```

### 3.2. Điền thông tin vào `.env.local`

```env
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cron Secret (không bắt buộc trong development)
CRON_SECRET="your-cron-secret"

# Node Environment
NODE_ENV="development"
```

**Lưu ý:** Trong development mode, `CRON_SECRET` không bắt buộc.

## ✅ Bước 4: Verify Setup

### 4.1. Test Cron Endpoint (Production)

#### Test WITHOUT Authorization (phải fail):

```bash
curl https://calendar-eight-beige.vercel.app/api/ping-db
```

**Expected response:**

```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid authorization header"
}
```

#### Test WITH Authorization (phải success):

```bash
curl https://calendar-eight-beige.vercel.app/api/ping-db \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected response:**

```json
{
  "ok": true,
  "timestamp": "2026-02-04T10:00:00.000Z",
  "message": "Database connection is healthy"
}
```

### 4.2. Test User API (Production)

#### Test direct browser access (phải fail):

```bash
curl https://calendar-eight-beige.vercel.app/api/special-dates
```

**Expected response:**

```json
{
  "error": "Access denied",
  "message": "Missing origin or referer header"
}
```

#### Test from website (phải success):

Mở browser → Console → Run:

```javascript
fetch("/api/special-dates")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

**Expected:** Data trả về bình thường

### 4.3. Test Local Development

```bash
# Start dev server
npm run dev

# Test cron endpoint (không cần auth trong dev)
curl http://localhost:3000/api/ping-db
# Expected: Success

# Test user API (không cần origin trong dev)
curl http://localhost:3000/api/special-dates
# Expected: Success
```

## 🤖 Bước 5: Vercel Cron Setup

Cron job đã được config trong `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/ping-db",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Cron Schedule Explained:

```
0 0 * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, 0 và 7 = Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)

0 0 * * * = Chạy lúc 00:00 (midnight UTC) mỗi ngày
```

### Common Cron Schedules:

```bash
# Mỗi giờ
0 * * * *

# Mỗi 6 giờ
0 */6 * * *

# Mỗi 12 giờ
0 */12 * * *

# Mỗi ngày lúc 3am UTC
0 3 * * *

# Mỗi tuần (Chủ nhật 2am)
0 2 * * 0

# Mỗi tháng (ngày 1 lúc 1am)
0 1 1 * *
```

### Vercel Cron tự động thêm headers:

```
Authorization: Bearer <CRON_SECRET>
User-Agent: vercel-cron/1.0
```

## 📊 Bước 6: Monitor Cron Jobs

### 6.1. Xem Cron Logs trên Vercel

1. Vào **Deployments** → Click vào deployment mới nhất
2. Click **Functions** tab
3. Tìm function `/api/ping-db`
4. Xem logs để check execution

### 6.2. Check trong Vercel Dashboard

1. Vào **Settings** → **Crons**
2. Xem list của cron jobs
3. Check last execution time
4. Xem error logs (nếu có)

## 🔍 Troubleshooting

### Issue 1: Cron job return 401 Unauthorized

**Nguyên nhân:** CRON_SECRET không match

**Giải pháp:**

1. Check CRON_SECRET trong Vercel Environment Variables
2. Verify không có trailing spaces
3. Redeploy sau khi change env vars

### Issue 2: Cron job không chạy

**Nguyên nhân:**

- Schedule format sai
- Endpoint bị block
- Vercel plan không support cron

**Giải pháp:**

1. Check schedule format: https://crontab.guru/
2. Verify endpoint hoạt động (test manual với curl)
3. Check Vercel plan (Hobby plan hỗ trợ cron)

### Issue 3: Local development không hoạt động

**Nguyên nhân:** NODE_ENV không được set

**Giải pháp:**

```env
# .env.local
NODE_ENV="development"
```

### Issue 4: User API bị block trong production

**Nguyên nhân:** Origin header missing

**Giải pháp:**

- Verify website đang gọi API từ cùng domain
- Check NEXT_PUBLIC_APP_URL được set đúng
- Check CORS headers

## 📚 API Protection Summary

| Endpoint             | Protection Method        | Required Header                       |
| -------------------- | ------------------------ | ------------------------------------- |
| `/api/auth/*`        | None (NextAuth built-in) | -                                     |
| `/api/ping-db`       | Bearer Token             | `Authorization: Bearer <CRON_SECRET>` |
| `/api/cron/*`        | Bearer Token             | `Authorization: Bearer <CRON_SECRET>` |
| `/api/special-dates` | Origin/Referer           | `Origin: https://your-domain.com`     |
| `/api/user/*`        | Origin/Referer           | `Origin: https://your-domain.com`     |

## 🚀 Deploy Checklist

- [ ] Generate CRON_SECRET
- [ ] Add CRON_SECRET to Vercel env vars
- [ ] Add NEXT_PUBLIC_APP_URL to Vercel env vars
- [ ] Push code to GitHub
- [ ] Wait for auto-deploy
- [ ] Test cron endpoint with curl + auth header
- [ ] Test cron endpoint without auth (phải fail)
- [ ] Test user API from browser directly (phải fail)
- [ ] Test user API from website (phải success)
- [ ] Check cron execution logs sau 24h

## 📖 References

- Vercel Cron: https://vercel.com/docs/cron-jobs
- Crontab Guru: https://crontab.guru/
- Generate Secret: https://generate-secret.vercel.app/

## 🆘 Support

Nếu gặp vấn đề, check:

1. Vercel Function Logs
2. Browser Console (F12)
3. Network Tab trong DevTools
4. Vercel Dashboard → Crons section
