# BẮT BUỘC ĐỌC FILE NÀY TRƯỚC KHI LÀM VIỆC (MANDATORY READ FIRST)

Tài liệu này chứa thông tin tóm tắt toàn bộ dự án **Tuan Chau Atelier** để giúp các Agent AI hiểu nhanh dự án mà không cần đọc lại toàn bộ mã nguồn, giúp tiết kiệm tối đa Token và thời gian phản hồi.

---

## 1. THÔNG TIN DỰ ÁN & CÔNG NGHỆ (TECH STACK)
* **Loại ứng dụng**: Landing Page giới thiệu Gạch ốp lát & Đá tự nhiên cao cấp kết hợp các biểu mẫu tư vấn trực tuyến và tính năng giả lập App AR.
* **Frontend**: HTML5 (Vanilla), CSS3 (Vanilla), JavaScript (ES6 Vanilla).
* **Database & Backend**: Supabase (PostgreSQL) kết nối trực tiếp từ Client.
* **Hệ thống thông báo**: Telegram Bot API gửi thông tin đăng ký tư vấn về nhóm Telegram của admin theo thời gian thực.
* **Giao thức lưu trữ cục bộ**: LocalStorage lưu trữ trạng thái Theme (Light/Dark).

---

## 2. HỆ THỐNG MÀU SẮC & THIẾT KẾ (DESIGN SYSTEM)
Giao diện được thiết kế theo phong cách Sang trọng, Tối giản, Hiện đại (Luxury Glassmorphism & Marble Theme).

### Light Theme (Carrara & Calacatta Marble Inspired)
* **Background chính (`--bg-primary`)**: `#f8fafc` (Trắng xám Carrara nhẹ).
* **Background phụ (`--bg-secondary`)**: `#ffffff`.
* **Chữ chính (`--text-primary`)**: `#0f172a` (Slate đậm).
* **Vàng Champagne (`--accent-gold`)**: `#c5a880` (Dùng cho đường viền, nút bấm chính).
* **Nâu Đồng ấm (`--accent-bronze`)**: `#8c6d4f` (Dùng cho phụ đề, các phần text nhấn mạnh).
* **Nút bấm chính (`.btn-primary`)**: Nền `#160f06` (Nâu đen đậm), chữ vàng gold `#c5a880`.
* **Nút bấm phụ (`.btn-secondary`)**: Nền trong suốt, chữ và viền `#160f06`, hover đổi sang nền `#160f06` chữ gold `#c5a880`.

### Dark Theme (Nero Marquina & Graphite Inspired)
* **Background chính (`--bg-primary`)**: `#090d16` (Đen đá sâu).
* **Background phụ (`--bg-secondary`)**: `#111827`.
* **Chữ chính (`--text-primary`)**: `#f3f4f6` (Trắng xám nhạt).
* **Vàng Kim loại (`--accent-gold`)**: `#d4af37` (Vàng kim sáng).
* **Nâu Đồng tối (`--accent-bronze`)**: `#a18262`.
* **Nút bấm chính (`.btn-primary`)**: Nền `#d4af37` (Vàng kim), chữ `#110a04` (Đen nâu).
* **Nút bấm phụ (`.btn-secondary`)**: Nền trong suốt, chữ vàng kim `#d4af37`, viền vàng kim mờ `rgba(212, 175, 55, 0.4)`. Hover đổi nền vàng kim chữ `#110a04`.

---

## 3. CƠ SỞ DỮ LIỆU SUPABASE (DATABASE SCHEMA)
Gồm 3 bảng chính trên PostgreSQL (Supabase):

### Bảng 1: `categories` (Danh mục đá)
Quản lý các nhóm đá chính (Marble, Granite, Onyx, Quartz, Terrazzo).
* `id` (bigint, PK): Tự động tăng.
* `name` (varchar): Tên danh mục.
* `slug` (varchar, Unique): Slug danh mục (ví dụ: `da-marble`).
* `description` (text): Mô tả.

### Bảng 2: `products` (Sản phẩm gạch đá)
* `id` (bigint, PK): Tự động tăng.
* `category_id` (bigint, FK -> `categories.id`): Liên kết danh mục.
* `name` (varchar): Tên sản phẩm đá.
* `slug` (varchar, Unique): Slug sản phẩm.
* `stone_type` (varchar): Loại đá gốc (ví dụ: `Marble Tự Nhiên`).
* `is_translucent` (boolean): Có xuyên sáng không.
* `thumbnail_url` (text): Đường dẫn hình ảnh.
* `dimensions` (varchar): Kích thước khổ đá (Ví dụ: `3000x1800x20mm`).
* `price_range` (varchar): Khoảng giá hiển thị (Mặc định: "Liên hệ báo giá").
* `description` (text): Mô tả chi tiết vân đá.
* `is_active` (boolean): Có hiển thị trên web không.

### Bảng 3: `consultation_requests` (Yêu cầu tư vấn)
* `id` (uuid, PK): Mặc định `gen_random_uuid()`.
* `customer_name` (varchar): Tên khách hàng.
* `phone_number` (varchar): Số điện thoại/Zalo.
* `address` (text): Địa chỉ công trình.
* `room_region` (varchar): Không gian thi công (Bếp, Tắm, Vách TV, v.v.).
* `selected_stone_names` (text): Danh sách các mẫu đá khách quan tâm.
* `service_needed` (varchar): Loại dịch vụ (Đo đạc, Lên bản vẽ 3D).
* `customer_note` (text): Lời nhắn bổ sung.
* `status` (varchar): Trạng thái xử lý (Mặc định: `pending`).
* `created_at` (timestamp): Thời gian gửi yêu cầu.

---

## 4. TÍCH HỢP API & LUỒNG DỮ LIỆU (API INTEGRATIONS)

### Kết nối Supabase
* File cấu hình: [`landing-page-gach-da/js/config.js`](file:///d:/TuanChauAtelier/landing-page-gach-da/js/config.js).
* Đọc dữ liệu từ bảng `products` hiển thị lên Catalog.
* Ghi dữ liệu khách gửi từ Form vào bảng `consultation_requests` qua Supabase JS Client.

### Gửi thông báo Telegram Bot
Khi khách hàng gửi yêu cầu tư vấn thành công:
1. Frontend chuẩn bị nội dung thông báo bằng định dạng Markdown.
2. Gửi một request `POST` đến API Telegram Bot:
   `https://api.telegram.org/bot<TOKEN>/sendMessage`
3. Các tham số chính:
   * `chat_id`: ID của nhóm/kênh Telegram nhận tin.
   * `text`: Nội dung Markdown chứa thông tin khách hàng, số điện thoại, khu vực, mẫu đá đã chọn, dịch vụ yêu cầu.
   * `parse_mode`: `Markdown` hoặc `HTML`.

---

## 5. BỐ CỤC THƯ MỤC CHÍNH (FILE DIRECTORY)
* `landing-page-gach-da/index.html`: Chứa cấu trúc chính của trang, các khối Popup/Modal.
* `landing-page-gach-da/css/style.css`: File CSS chính, quản lý Theme và Responsive.
* `landing-page-gach-da/css/app-intro.css`: CSS riêng cho màn hình mô phỏng ứng dụng AR.
* `landing-page-gach-da/js/main.js`: Chứa logic thao tác DOM, lọc sản phẩm và khởi tạo các sự kiện.
* `landing-page-gach-da/js/app-intro.js`: Logic giả lập thay đổi ảnh ốp lát đá trên App mô phỏng.
* `landing-page-gach-da/js/api/`: Thư mục chứa các API Helper kết nối database/bot:
  - [`supabase.js`](file:///d:/TuanChauAtelier/landing-page-gach-da/js/api/supabase.js): Gọi dữ liệu sản phẩm, ghi nhận yêu cầu tư vấn.
  - [`telegram.js`](file:///d:/TuanChauAtelier/landing-page-gach-da/js/api/telegram.js): Gửi thông báo tức thời tới Telegram Bot.

---

## 6. HƯỚNG DẪN DÀNH CHO AI AGENT (RULES FOR AGENTS)
1. **Ưu tiên đọc file này trước**: Khi có yêu cầu thay đổi màu sắc, database, hoặc API, hãy tham chiếu file này thay vì lục lọi toàn bộ mã nguồn.
2. **Không tự động chạy Browser Agent**: Không mở trình duyệt tự động để kiểm tra trừ khi người dùng yêu cầu rõ ràng, vì việc này làm tăng thời gian chờ của người dùng. Hãy đề xuất họ tự mở F12 để kiểm tra.
3. **Giữ tính nhất quán**: Mọi nút bấm, màu sắc, font chữ phải tuân thủ đúng CSS variables có sẵn trong hệ thống để tránh bị lệch tông thiết kế.
