# 🧮 Web mô phỏng thuật toán bằng AI (Gemini)

Ứng dụng web cho phép người dùng **nhập đề bài thuật toán** (ví dụ: "N quân hậu", "Dijkstra", "Sắp xếp nổi bọt"), sau đó AI (Google Gemini) sẽ **tự sinh ra một trang HTML mô phỏng trực quan** giúp sinh viên hiểu thuật toán từng bước.

> Đồ án môn **Trí tuệ nhân tạo**.

---

## 📌 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cách hoạt động](#-cách-hoạt-động)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [Cấu hình biến môi trường](#-cấu-hình-biến-môi-trường)
- [Kiểm tra lỗi bằng trình duyệt (tùy chọn)](#-kiểm-tra-lỗi-js-bằng-trình-duyệt-tùy-chọn)
- [Kiểm tra chất lượng](#-kiểm-tra-chất-lượng)
- [Bảo mật](#-bảo-mật)
- [Triển khai (deploy)](#-triển-khai-deploy)
- [Tài liệu đi kèm](#-tài-liệu-đi-kèm)
- [Thành viên nhóm](#-thành-viên-nhóm)

---

## 📖 Giới thiệu

Học thuật toán qua chữ và mã nguồn thường khó hình dung. Dự án này giải quyết bằng cách để người dùng chỉ cần **gõ tên bài toán**, hệ thống sẽ tạo ra một bản mô phỏng tương tác có thể **chạy, tạm dừng, đi từng bước và lùi lại**, giúp việc học trực quan hơn.

## ✨ Tính năng

- Nhập đề bài bằng ngôn ngữ tự nhiên, AI tự tạo trang mô phỏng.
- Mô phỏng có điều khiển: **Tạm dừng / Từng bước / Lùi**, thanh trượt thay đổi tham số (ví dụ N).
- **Cache** kết quả đã tạo vào thư mục `cache/`, bài đã tạo mở lại gần như tức thì và tiết kiệm lượt gọi AI.
- **Từ chối đề không liên quan** (ví dụ "viết thơ") bằng trang thông báo.
- Có **giới hạn tần suất (rate limit)** để tránh bị lạm dụng.
- Kiểm tra an toàn mã HTML do AI sinh ra trước khi hiển thị.

## 🛠 Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend | Node.js (>= 20.6) |
| AI | Google Gemini API |
| Giao diện | HTML, CSS, JavaScript |
| Hiển thị mô phỏng | `iframe` sandbox + CSP |
| Kiểm tra chạy thật (tùy chọn) | Playwright (Chromium) |

## ⚙️ Cách hoạt động

```
Người dùng nhập đề bài
        │
        ▼
Backend (server.js) nhận yêu cầu ──► kiểm tra cache
        │                                  │ (có sẵn → trả về ngay)
        ▼
Gọi Gemini (llm.js + prompt.js) sinh file HTML mô phỏng
        │
        ▼
Kiểm tra an toàn (kiểm tra tĩnh, chèn CSP, kiểm tra chạy thật tùy chọn)
        │
        ▼
Lưu vào cache/ và hiển thị trong iframe sandbox
```

## 📂 Cấu trúc thư mục

```
.
├── public/
│   └── index.html        # Giao diện người dùng
├── server.js             # API /api/render, cache, rate limit, kiểm tra tĩnh, CSP, kiểm tra chạy thật
├── llm.js                # Gọi Gemini (muốn đổi nhà cung cấp AI chỉ cần sửa file này)
├── prompt.js             # System prompt: chỉnh để đổi giao diện/phong cách mô phỏng
├── template.js           # Khung/mẫu HTML dùng để dựng trang mô phỏng
├── package.json
├── .env.example          # Mẫu cấu hình biến môi trường
└── .gitignore
```

> Thư mục `cache/` được tạo tự động khi chạy và **không** đưa lên Git.

## 🚀 Cài đặt và chạy

**Yêu cầu:** đã cài [Node.js](https://nodejs.org) phiên bản **20.6 trở lên**.

1. **Tải mã nguồn về máy**

   ```bash
   git clone https://github.com/HuuPhuoc1235/Do_An_Tri_Tue_Nhan_Tao.git
   cd Do_An_Tri_Tue_Nhan_Tao
   ```

2. **Cài thư viện**

   ```bash
   npm install
   ```

3. **Tạo file cấu hình `.env`**

   Sao chép `.env.example` thành `.env`, rồi điền `GEMINI_API_KEY`
   (lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/apikey)).

   - Windows (CMD): `copy .env.example .env`
   - macOS / Linux: `cp .env.example .env`

4. **Chạy ứng dụng**

   ```bash
   npm start
   ```

5. Mở trình duyệt tại **http://localhost:3000**

## 🔐 Cấu hình biến môi trường

| Biến | Ý nghĩa | Mặc định |
|---|---|---|
| `GEMINI_API_KEY` | Khóa API của Gemini (**bắt buộc**) | — |
| `PORT` | Cổng chạy server | `3000` |
| `RUNTIME_CHECK` | `1` để bật kiểm tra lỗi JS bằng trình duyệt thật | `0` |
| `TRUST_PROXY` | `1` khi chạy sau reverse proxy | `0` |

## 🧪 Kiểm tra lỗi JS bằng trình duyệt (tùy chọn)

Bật tính năng này (khuyến nghị) để hệ thống chạy thử bản mô phỏng và phát hiện lỗi JavaScript trước khi hiển thị:

```bash
npm i playwright
npx playwright install chromium
```

Sau đó đặt `RUNTIME_CHECK=1` trong file `.env`.

## ✅ Kiểm tra chất lượng

Sau khi chạy, thử các trường hợp sau:

- [ ] Thanh trượt N, nút **Tạm dừng / Từng bước / Lùi** hoạt động.
- [ ] Bài **N quân hậu** với N = 8 phải đếm ra **92** lời giải.
- [ ] Đề không liên quan (ví dụ "viết thơ") phải ra **trang từ chối**.

## 🛡 Bảo mật

- **Không commit file `.env`.** API key chỉ nằm ở backend, không bao giờ đưa vào mã giao diện.
- `iframe` chỉ dùng `sandbox="allow-scripts"` (**không** có `allow-same-origin`), và HTML được chèn **CSP chặn truy cập mạng**.
- Đặt **giới hạn chi tiêu/quota** cho API key và theo dõi mức sử dụng.
- Khi deploy sau reverse proxy, đặt `TRUST_PROXY=1`.
- Nếu nền tảng xóa thư mục `cache/` mỗi lần redeploy, hãy gắn **volume** để giữ lại cache.

## ☁️ Triển khai (deploy)

Dự án cần backend Node.js nên **không chạy được trên GitHub Pages**. Có thể deploy lên các dịch vụ hỗ trợ Node.js như Render hoặc Railway:

- Build command: `npm install`
- Start command: `npm start`
- Thêm biến môi trường `GEMINI_API_KEY` (và các biến khác nếu cần) trong phần cài đặt của dịch vụ.

## 📎 Tài liệu đi kèm

- 📊 [Slide thuyết trình](PH_Math_AlgoVisualizer.pptx) — tải về để xem bằng PowerPoint.
- 📘 [Tài liệu tham khảo: Giải thuật toán cho sinh viên](GiaiThuatToanChoSinhVien.pdf)

## 👥 Thành viên nhóm

| STT | Họ và tên | MSSV | Vai trò |
|---|---|---|---|
| 1 | _Điền họ tên_ | _Điền MSSV_ | _Ví dụ: Trưởng nhóm, Backend_ |
| 2 | _Điền họ tên_ | _Điền MSSV_ | _Ví dụ: Giao diện_ |
| 3 | _Điền họ tên_ | _Điền MSSV_ | _Ví dụ: Prompt/AI_ |

**Giảng viên hướng dẫn:** _Điền tên giảng viên_

---

⭐ Nếu thấy dự án hữu ích, hãy cho repo một **Star** nhé!
