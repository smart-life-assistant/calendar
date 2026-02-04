# API Security - Hướng dẫn Bảo vệ API

## Tổng quan

Hệ thống bảo vệ API đã được implement để ngăn chặn truy cập trực tiếp vào các API endpoints từ bên ngoài. Chỉ các requests từ website chính thức mới được phép truy cập.

## Các biện pháp bảo vệ

### 1. **Kiểm tra Origin và Referer**

- API sẽ kiểm tra header `Origin` và `Referer` của mỗi request
- Chỉ cho phép requests từ các domain được whitelist

### 2. **Chặn Direct Browser Access**

- Khi ai đó paste URL API trực tiếp vào browser và nhấn Enter
- Hệ thống sẽ phát hiện và trả về lỗi 403 Forbidden

### 3. **CORS Protection**

- Giới hạn cross-origin requests
- Chỉ cho phép từ các domain được chỉ định

## Cấu hình

### Environment Variables

Thêm vào file `.env.local` hoặc Vercel Environment Variables:

```env
NEXT_PUBLIC_APP_URL="https://calendar-eight-beige.vercel.app"
```

### Allowed Origins

Các domain được phép truy cập API được cấu hình trong `/src/lib/api-security.ts`:

```typescript
const allowedOrigins = [
  "https://calendar-eight-beige.vercel.app",
  process.env.NEXT_PUBLIC_APP_URL,
  // Development
  "http://localhost:3000" (chỉ trong môi trường development)
]
```

## Cách hoạt động

### Scenario 1: Truy cập từ Browser trực tiếp

```
User: Paste https://calendar-eight-beige.vercel.app/api/special-dates vào browser
System: ❌ Trả về 403 Forbidden
Response: {
  "error": "Direct API access is not allowed",
  "message": "This API endpoint can only be accessed through the application"
}
```

### Scenario 2: Truy cập từ Website của bạn

```
User: Sử dụng website bình thường
Website: Gọi API qua fetch/axios
System: ✅ Kiểm tra origin header
System: ✅ Origin hợp lệ → Cho phép truy cập
Response: Dữ liệu API bình thường
```

### Scenario 3: Truy cập từ domain khác

```
Attacker: Gọi API từ website khác (example.com)
System: ❌ Kiểm tra origin header
System: ❌ Origin không hợp lệ → Chặn
Response: {
  "error": "Access denied",
  "message": "This API is not accessible from your origin"
}
```

### Scenario 4: Development (localhost)

```
Developer: Làm việc trên localhost:3000
System: ✅ Tự động cho phép trong NODE_ENV=development
Response: Dữ liệu API bình thường
```

## Testing

### Test 1: Direct Browser Access

```bash
# Mở browser và paste URL này:
https://calendar-eight-beige.vercel.app/api/special-dates

# Expected: 403 Forbidden error
```

### Test 2: cURL (giả lập direct access)

```bash
curl https://calendar-eight-beige.vercel.app/api/special-dates

# Expected: 403 Forbidden
```

### Test 3: cURL with Origin

```bash
curl https://calendar-eight-beige.vercel.app/api/special-dates \
  -H "Origin: https://calendar-eight-beige.vercel.app"

# Expected: Success (nếu CORS được config đúng)
```

### Test 4: From your website

```javascript
// Trong browser console trên website của bạn:
fetch("/api/special-dates")
  .then((res) => res.json())
  .then((data) => console.log(data));

// Expected: Success - data trả về bình thường
```

## Protected API Endpoints

Tất cả các endpoints sau đã được bảo vệ:

- ✅ `/api/special-dates` - GET, POST, PUT, DELETE
- ✅ `/api/user/profile` - GET, PUT
- ✅ `/api/user/password` - PUT
- ✅ `/api/ping-db` - GET
- ⚠️ `/api/auth/*` - KHÔNG được bảo vệ (cần thiết cho authentication flow)

## Lưu ý quan trọng

### 1. **Vercel Environment Variables**

Nhớ thêm `NEXT_PUBLIC_APP_URL` vào Vercel:

```
Dashboard → Settings → Environment Variables
Key: NEXT_PUBLIC_APP_URL
Value: https://calendar-eight-beige.vercel.app
```

### 2. **Custom Domain**

Nếu bạn thêm custom domain, cập nhật:

```typescript
// src/lib/api-security.ts
const allowedOrigins = [
  "https://calendar-eight-beige.vercel.app",
  "https://your-custom-domain.com", // Thêm domain của bạn
  process.env.NEXT_PUBLIC_APP_URL,
];
```

### 3. **Development**

Trong development, localhost được tự động cho phép. Không cần config gì thêm.

### 4. **Postman/API Testing Tools**

Khi test bằng Postman, thêm header:

```
Origin: https://calendar-eight-beige.vercel.app
```

## Giới hạn

### Header Spoofing

⚠️ **Lưu ý**: Origin và Referer headers CÓ THỂ bị giả mạo trong một số trường hợp:

- Sử dụng tools như Postman, cURL
- Requests từ server-side

**Giải pháp bổ sung** (nếu cần bảo mật cao hơn):

1. **API Keys**: Mỗi request yêu cầu API key
2. **JWT Tokens**: Yêu cầu authentication token
3. **Rate Limiting**: Giới hạn số requests từ mỗi IP
4. **CAPTCHA**: Cho các endpoint quan trọng

## Cải tiến trong tương lai

### 1. API Key System

```typescript
// Thêm API key validation
const apiKey = request.headers.get("x-api-key");
if (apiKey !== process.env.API_SECRET_KEY) {
  return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
}
```

### 2. Rate Limiting

```typescript
// Giới hạn 100 requests/phút cho mỗi IP
import { Ratelimit } from "@upstash/ratelimit";
```

### 3. Request Signing

```typescript
// Mỗi request được sign với secret key
const signature = generateSignature(requestBody, SECRET_KEY);
```

## Troubleshooting

### Lỗi: "Direct API access is not allowed"

- ✅ Đúng: Đây là behavior mong muốn khi truy cập trực tiếp
- ✅ Website của bạn vẫn hoạt động bình thường

### Lỗi: Website không gọi được API

1. Check NEXT_PUBLIC_APP_URL trong Vercel
2. Check CORS headers
3. Check browser console for errors
4. Verify origin header đang được gửi

### Development không hoạt động

1. Kiểm tra NODE_ENV=development
2. Restart dev server
3. Clear cache: `rm -rf .next`

## Kết luận

Hệ thống bảo vệ API này giúp:

- ✅ Chặn direct browser access
- ✅ Chặn requests từ domain không được phép
- ✅ Bảo vệ dữ liệu khỏi crawlers
- ✅ Vẫn cho phép website hoạt động bình thường
- ✅ Hỗ trợ development environment

**Quan trọng**: Đây là lớp bảo vệ cơ bản. Đối với dữ liệu nhạy cảm, cân nhắc thêm authentication/authorization.
