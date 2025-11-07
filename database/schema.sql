-- schema_supabase_full_fixed.sql

-- ===============================
-- Bật extension UUID cho Postgres
-- ===============================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===============================
-- Bảng users (chỉ admin)
-- ===============================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL, -- hash bcrypt
  full_name TEXT,
  deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert admin duy nhất
-- Mật khẩu: S!mpl3P@ssw0rd!2025 (bcrypt hash)
INSERT INTO public.users (username, password, full_name)
VALUES ('akira_hikaru', '$2b$10$sw7xxQXI17W9pSPN8YhVHemuhJghYuA8nWLbBPn9MamX0qE3RcCxC', 'Administrator');

-- ===============================
-- Hàm update_updated_at() cố định search_path
-- ===============================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Trigger tự động cập nhật updated_at
CREATE TRIGGER trg_update_users
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- ===============================
-- Bảng special_dates (ngày đặc biệt / lễ tết)
-- ===============================
CREATE TABLE public.special_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  date_type VARCHAR(10) NOT NULL CHECK (date_type IN ('solar', 'lunar')),
  day INT NOT NULL,
  month INT NOT NULL,
  year INT, -- NULL nếu lặp lại hàng năm
  is_holiday BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger tự động cập nhật updated_at
CREATE TRIGGER trg_update_special_dates
BEFORE UPDATE ON public.special_dates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Dữ liệu mẫu các ngày lễ Việt Nam
INSERT INTO public.special_dates (name, description, date_type, day, month, year, is_holiday, is_recurring) VALUES
('Tết Dương lịch', 'Năm mới dương lịch', 'solar', 1, 1, NULL, TRUE, TRUE),
('Ngày thành lập Đảng Cộng sản Việt Nam', '', 'solar', 3, 2, NULL, FALSE, TRUE),
('Ngày Giải phóng miền Nam', 'Thống nhất đất nước', 'solar', 30, 4, NULL, TRUE, TRUE),
('Ngày Quốc tế Lao động', '', 'solar', 1, 5, NULL, TRUE, TRUE),
('Ngày sinh Chủ tịch Hồ Chí Minh', '', 'solar', 19, 5, NULL, FALSE, TRUE),
('Ngày Quốc tế Thiếu nhi', '', 'solar', 1, 6, NULL, FALSE, TRUE),
('Ngày Quốc khánh', 'Quốc khánh nước CHXHCN Việt Nam', 'solar', 2, 9, NULL, TRUE, TRUE),
('Ngày Nhà giáo Việt Nam', '', 'solar', 20, 11, NULL, FALSE, TRUE),
('Tết Nguyên Đán', 'Tết Âm lịch - Ngày đầu tiên của năm', 'lunar', 1, 1, NULL, TRUE, TRUE),
('Mùng 2 Tết', 'Ngày thứ hai Tết Nguyên Đán', 'lunar', 2, 1, NULL, TRUE, TRUE),
('Mùng 3 Tết', 'Ngày thứ ba Tết Nguyên Đán', 'lunar', 3, 1, NULL, TRUE, TRUE),
('Mùng 4 Tết', 'Ngày thứ tư Tết Nguyên Đán', 'lunar', 4, 1, NULL, TRUE, TRUE),
('Mùng 5 Tết', 'Ngày thứ năm Tết Nguyên Đán', 'lunar', 5, 1, NULL, TRUE, TRUE),
('Tết Hàn thực', 'Tết Hàn thực', 'lunar', 3, 3, NULL, FALSE, TRUE),
('Giỗ Tổ Hùng Vương', 'Ngày Giỗ Tổ Hùng Vương', 'lunar', 10, 3, NULL, TRUE, TRUE),
('Lễ Phật Đản', 'Phật Đản Sanh', 'lunar', 15, 4, NULL, FALSE, TRUE),
('Tết Đoan Ngọ', 'Tết Đoan Ngọ', 'lunar', 5, 5, NULL, FALSE, TRUE),
('Vu Lan', 'Lễ Vu Lan', 'lunar', 15, 7, NULL, FALSE, TRUE),
('Tết Trung Thu', 'Tết Trung Thu', 'lunar', 15, 8, NULL, FALSE, TRUE),
('Tết Trùng Cửu', 'Tết Trùng Cửu', 'lunar', 9, 9, NULL, FALSE, TRUE),
('Tết Hạ Nguyên', 'Tết Hạ Nguyên', 'lunar', 15, 10, NULL, FALSE, TRUE),
('Tết Ông Công Ông Táo', 'Ông Công Ông Táo về trời', 'lunar', 23, 12, NULL, FALSE, TRUE),
('Giao Thừa', 'Đêm Giao Thừa', 'lunar', 30, 12, NULL, FALSE, TRUE);