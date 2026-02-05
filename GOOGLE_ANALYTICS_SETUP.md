# Google Analytics Setup Guide

## Cách tích hợp Google Analytics 4 để theo dõi lượt truy cập

### Bước 1: Tạo tài khoản Google Analytics

1. Truy cập [Google Analytics](https://analytics.google.com/)
2. Đăng nhập bằng tài khoản Google
3. Click **"Start measuring"** hoặc **"Admin"** (nếu đã có tài khoản)
4. Tạo Property mới:
   - Property name: "Lịch Việt Nam" (hoặc tên bạn muốn)
   - Timezone: **(GMT+07:00) Asia/Bangkok** (giờ Việt Nam)
   - Currency: **Vietnamese Dong (₫)**
5. Điền thông tin business details
6. Chọn objectives (mục tiêu tracking)

### Bước 2: Tạo Data Stream

1. Trong Property settings, chọn **"Data Streams"**
2. Click **"Add stream"** → **"Web"**
3. Nhập thông tin:
   - Website URL: `https://your-domain.com`
   - Stream name: "Web"
4. Click **"Create stream"**

### Bước 3: Lấy Measurement ID

1. Sau khi tạo stream, bạn sẽ thấy **Measurement ID** (format: `G-XXXXXXXXXX`)
2. Copy Measurement ID này

### Bước 4: Cấu hình trong project

1. Mở file `.env.local` (hoặc tạo mới nếu chưa có)
2. Thêm dòng sau:

   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

   (Thay `G-XXXXXXXXXX` bằng Measurement ID của bạn)

3. Restart dev server:
   ```bash
   npm run dev
   ```

### Bước 5: Kiểm tra hoạt động

1. Truy cập website của bạn
2. Mở Google Analytics → **Reports** → **Realtime**
3. Bạn sẽ thấy traffic realtime của mình!

## Các tính năng có sẵn

✅ **Realtime tracking** - Xem số người đang truy cập ngay lúc này
✅ **Page views** - Tự động track khi chuyển trang
✅ **User demographics** - Độ tuổi, giới tính, địa lý
✅ **Device info** - Desktop, mobile, tablet
✅ **Traffic sources** - Organic, Direct, Referral, Social
✅ **Engagement metrics** - Session duration, bounce rate

## Custom Event Tracking (Optional)

Nếu muốn track các events tùy chỉnh, sử dụng:

```typescript
import { event } from "@/lib/gtag";

// Track button click
event({
  action: "click",
  category: "Button",
  label: "Add Event",
  value: 1,
});

// Track form submission
event({
  action: "submit",
  category: "Form",
  label: "Contact Form",
});
```

## Lưu ý

- Measurement ID **KHÔNG** là API key, safe để commit
- Data có thể mất 24-48h để xuất hiện đầy đủ trong reports
- Realtime data hiển thị ngay lập tức
- Tuân thủ GDPR/Privacy nếu có user ở EU

## Troubleshooting

**Không thấy data?**

- Kiểm tra `NEXT_PUBLIC_GA_ID` có đúng format không
- Restart dev server sau khi thêm env variable
- Kiểm tra Console có lỗi không
- Tắt Ad Blocker khi test

**Realtime không cập nhật?**

- Đợi vài phút
- Hard refresh browser (Ctrl + Shift + R)
- Kiểm tra Network tab xem có gọi gtag API không
