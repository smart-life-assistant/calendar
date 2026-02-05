# Hiển thị Realtime Visitors trên Website

## 🎯 Tính năng

Hiển thị số người đang online realtime trực tiếp trên website (góc dưới bên phải):

- 🟢 Số người đang truy cập (cập nhật mỗi 30s)
- ✨ Animation đẹp mắt với Framer Motion
- 🎨 Hỗ trợ dark mode
- 📱 Responsive

## 🔧 Cách setup

### Bước 1: Enable Google Analytics Data API

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project hoặc tạo project mới
3. Vào **APIs & Services** → **Enable APIs and Services**
4. Tìm **"Google Analytics Data API"**
5. Click **ENABLE**

### Bước 2: Tạo API Key

1. Vào **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy API key vừa tạo
4. (Optional) Click vào API key → **Restrict key**:
   - API restrictions: Chọn **"Google Analytics Data API"**
   - Application restrictions: Chọn **"HTTP referrers"** và thêm domain của bạn
5. Save

### Bước 3: Lấy Property ID

1. Vào [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bánh răng ở góc dưới trái)
3. Trong cột **Property**, chọn property của bạn
4. Click **Property Settings**
5. Copy **Property ID** (số dạng: `123456789`)

### Bước 4: Cấu hình Environment Variables

#### Local Development (`.env.local`):

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GA_PROPERTY_ID=123456789
GA_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### Vercel Production:

1. Vào Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Thêm 3 biến:
   - `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`
   - `GA_PROPERTY_ID` = `123456789`
   - `GA_API_KEY` = `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
3. **Important**: Chọn **All** (Production, Preview, Development)
4. Redeploy

### Bước 5: Test

1. Restart dev server: `npm run dev`
2. Mở website trong một vài tab/browsers
3. Sau 30s, counter ở góc dưới bên phải sẽ cập nhật!

## 🎨 Tùy chỉnh vị trí

Mở file [RealtimeVisitors.tsx](src/components/analytics/RealtimeVisitors.tsx):

**Góc dưới phải (mặc định):**

```tsx
className = "fixed bottom-6 right-6 z-50";
```

**Góc dưới trái:**

```tsx
className = "fixed bottom-6 left-6 z-50";
```

**Góc trên phải:**

```tsx
className = "fixed top-20 right-6 z-50";
```

**Góc trên trái:**

```tsx
className = "fixed top-20 left-6 z-50";
```

## 🚫 Tắt hiển thị

Nếu không muốn hiển thị, comment hoặc xóa dòng này trong [layout.tsx](src/app/layout.tsx):

```tsx
{
  /* <RealtimeVisitors /> */
}
```

## 📊 API Endpoint

API endpoint tại: `/api/analytics/realtime`

Response:

```json
{
  "activeUsers": 5,
  "timestamp": "2026-02-05T12:34:56.789Z"
}
```

## ⚠️ Lưu ý

- Data cập nhật mỗi **30 giây** (có thể thay đổi interval trong component)
- API có cache 30s để tránh vượt quota
- Free tier: **10,000 requests/day** (đủ dùng)
- Counter chỉ hiển thị khi có `GA_PROPERTY_ID` và `GA_API_KEY`

## 🔍 Troubleshooting

**Counter không hiển thị?**

- Kiểm tra console có lỗi không
- Verify API key và Property ID đúng
- Đảm bảo Google Analytics Data API đã enable
- Hard refresh (Ctrl + Shift + R)

**Số liệu không chính xác?**

- GA data có delay ~30-60s
- Multiple tabs cùng user chỉ tính là 1 active user

**403 Forbidden?**

- API key chưa có quyền
- Restrict key không đúng (thử bỏ restriction để test)
