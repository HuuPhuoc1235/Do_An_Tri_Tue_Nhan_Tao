# Web mô phỏng thuật toán bằng AI (Gemini)

Đây là đồ án môn Trí tuệ nhân tạo của nhóm mình.

Ý tưởng khá đơn giản: người dùng gõ tên một bài toán thuật toán (ví dụ "N quân hậu"), web sẽ nhờ AI Gemini tạo ra một trang HTML mô phỏng bài toán đó, để mình xem thuật toán chạy từng bước cho dễ hiểu hơn là đọc code.

## Web này làm được gì

- Nhập đề bài bằng tiếng Việt hoặc tiếng Anh, AI tự tạo trang mô phỏng.
- Mô phỏng có nút **Tạm dừng**, **Từng bước**, **Lùi** và thanh trượt để chỉnh tham số (ví dụ số N).
- Bài nào đã tạo rồi thì lưu lại trong thư mục `cache/`, lần sau mở lại cho nhanh và đỡ tốn lượt gọi AI.
- Nếu nhập đề không liên quan (ví dụ "viết thơ") thì web sẽ báo từ chối.
- Có giới hạn số lần gọi để tránh bị spam.

## Công nghệ nhóm dùng

- Node.js (cần bản 20.6 trở lên)
- Gemini API của Google
- HTML, CSS, JavaScript cho phần giao diện
- Playwright (không bắt buộc, dùng để kiểm tra lỗi JS)

## Cách web hoạt động

1. Người dùng nhập đề bài ở trang chủ.
2. Backend (`server.js`) kiểm tra xem bài này đã có trong cache chưa. Có rồi thì trả luôn.
3. Nếu chưa có thì gọi Gemini (`llm.js`) kèm hướng dẫn trong `prompt.js` để AI viết ra file HTML mô phỏng.
4. Backend kiểm tra file HTML đó có an toàn không rồi lưu vào cache.
5. Kết quả được hiển thị trong một `iframe` có sandbox.

## Các file trong project

```
public/index.html   giao diện người dùng
server.js           API /api/render, cache, giới hạn số lần gọi, kiểm tra an toàn
llm.js              chỗ gọi Gemini (muốn đổi sang AI khác chỉ cần sửa file này)
prompt.js           câu lệnh hướng dẫn AI (sửa ở đây nếu muốn đổi kiểu giao diện mô phỏng)
template.js         khung HTML mẫu để dựng trang mô phỏng
package.json        danh sách thư viện
.env.example        file mẫu để cấu hình
```

Thư mục `cache/` tự sinh ra khi chạy nên không đưa lên GitHub.

## Cách chạy trên máy

Máy cần cài Node.js 20.6 trở lên.

**Bước 1:** Tải code về

```bash
git clone https://github.com/HuuPhuoc1235/Do_An_Tri_Tue_Nhan_Tao.git
cd Do_An_Tri_Tue_Nhan_Tao
```

Hoặc bấm nút **Code → Download ZIP** trên GitHub rồi giải nén.

**Bước 2:** Cài thư viện

```bash
npm install
```

**Bước 3:** Tạo file `.env`

Copy file `.env.example` thành `.env` (Windows: `copy .env.example .env`), rồi mở ra điền `GEMINI_API_KEY` của bạn vào. Key lấy miễn phí ở [Google AI Studio](https://aistudio.google.com/apikey).

**Bước 4:** Chạy

```bash
npm start
```

**Bước 5:** Mở trình duyệt vào http://localhost:3000

## Các biến trong file .env

| Biến | Ý nghĩa | Mặc định |
|---|---|---|
| `GEMINI_API_KEY` | Key Gemini (bắt buộc phải có) | không có |
| `PORT` | Cổng chạy web | 3000 |
| `RUNTIME_CHECK` | Đặt là 1 để bật kiểm tra lỗi JS bằng trình duyệt thật | 0 |
| `TRUST_PROXY` | Đặt là 1 khi chạy sau reverse proxy | 0 |

## Bật kiểm tra lỗi JS bằng trình duyệt (không bắt buộc)

Nhóm khuyến nghị bật cái này vì AI đôi khi viết code bị lỗi, bật lên thì web sẽ chạy thử trước khi hiển thị:

```bash
npm i playwright
npx playwright install chromium
```

Sau đó đặt `RUNTIME_CHECK=1` trong file `.env`.

## Cách nhóm tự kiểm tra web

- Thanh trượt N và các nút Tạm dừng, Từng bước, Lùi chạy đúng.
- Bài N quân hậu với N = 8 phải ra đúng 92 lời giải.
- Nhập đề không liên quan (như "viết thơ") thì phải ra trang từ chối.

## Lưu ý về bảo mật

- Không đưa file `.env` lên GitHub, vì trong đó có API key.
- API key chỉ để ở backend, không để trong code giao diện.
- `iframe` chỉ dùng `sandbox="allow-scripts"` (không có `allow-same-origin`) và HTML được chèn thêm CSP để chặn truy cập mạng, tránh code do AI viết làm điều bất ngờ.
- Nên đặt giới hạn chi tiêu cho API key để lỡ bị lạm dụng thì không mất tiền.
- Nếu deploy sau reverse proxy thì đặt `TRUST_PROXY=1`.
- Nếu nơi deploy hay xóa thư mục `cache/` mỗi lần cập nhật thì nên gắn volume để giữ lại.

## Deploy

Web này có backend Node.js nên không chạy được trên GitHub Pages. Muốn đưa lên mạng thì dùng Render hoặc Railway:

- Build command: `npm install`
- Start command: `npm start`
- Nhớ thêm biến môi trường `GEMINI_API_KEY` trong phần cài đặt của dịch vụ.

## Tài liệu của nhóm

- [Slide thuyết trình](PH_Math_AlgoVisualizer.pptx) (tải về rồi mở bằng PowerPoint)
- [Giải thuật toán cho sinh viên](GiaiThuatToanChoSinhVien.pdf) (tài liệu tham khảo)

## Lời cảm ơn

Cảm ơn thầy/cô đã hướng dẫn nhóm trong quá trình làm đồ án. Do còn hạn chế về thời gian và kinh nghiệm nên web chắc chắn còn thiếu sót, mong mọi người góp ý thêm.
