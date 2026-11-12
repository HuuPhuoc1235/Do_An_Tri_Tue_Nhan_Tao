# Web mô phỏng thuật toán bằng AI (Gemini)

Người dùng nhập đề bài (ví dụ "N quân hậu") -> backend gọi Gemini sinh một file HTML mô phỏng
-> kiểm tra an toàn -> hiển thị trong iframe sandbox. Bài đã tạo được cache vào thư mục `cache/`.

## Chạy

1. Cài Node.js 20.6 trở lên.
2. `npm install`
3. Sao chép `.env.example` thành `.env` và điền `GEMINI_API_KEY` (lấy ở Google AI Studio).
4. `npm start` rồi mở http://localhost:3000

## Cấu trúc

- `server.js`   API `/api/render`, cache, rate limit, kiểm tra tĩnh, CSP, kiểm tra chạy thật (tùy chọn)
- `llm.js`      gọi Gemini (muốn đổi nhà cung cấp chỉ cần sửa file này)
- `prompt.js`   system prompt: chỉnh để đổi giao diện/phong cách mô phỏng
- `public/index.html`  giao diện người dùng

## Bật kiểm tra lỗi JS bằng trình duyệt (khuyến nghị)

    npm i playwright
    npx playwright install chromium
    # rồi đặt RUNTIME_CHECK=1 trong .env

## Kiểm tra chất lượng

- Slider N, nút Tạm dừng/Từng bước/Lùi hoạt động.
- N quân hậu với N=8 phải đếm ra 92 lời giải.
- Đề không liên quan (ví dụ "viết thơ") phải ra trang từ chối.

## Lưu ý bảo mật

- Không commit `.env`. API key chỉ nằm ở backend.
- iframe chỉ dùng `sandbox="allow-scripts"` (không `allow-same-origin`) và HTML được chèn CSP chặn mạng.
- Đặt giới hạn chi tiêu/quota cho key và theo dõi usage.
- Khi deploy sau reverse proxy, đặt `TRUST_PROXY=1`. Nếu nền tảng xóa `cache/` khi redeploy, gắn volume.
