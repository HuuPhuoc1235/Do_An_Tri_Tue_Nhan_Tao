import express from 'express';
import rateLimit from 'express-rate-limit';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { generate } from './llm.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CACHE_DIR = 'cache';
const MAX_IN_FLIGHT = 3;           // tối đa 3 lượt gọi AI cùng lúc
let inFlight = 0;

if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));
app.use(express.static('public'));
app.use(
  '/api/',
  rateLimit({
    windowMs: 60_000,
    max: Number(process.env.RATE_LIMIT_PER_MIN) || 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Bạn thao tác quá nhanh, hãy thử lại sau ít phút.' },
  })
);

await fs.mkdir(CACHE_DIR, { recursive: true });

/* ---------- Tiện ích ---------- */
const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const keyOf = (p) =>
  crypto.createHash('sha256').update(normalize(p)).digest('hex').slice(0, 24);

/* ---------- Lớp kiểm tra tĩnh ---------- */
const BAD = [
  /<script[^>]+src=/i,
  /\bfetch\s*\(/,
  /XMLHttpRequest/,
  /WebSocket/,
  /localStorage|sessionStorage/,        
  /<iframe/i,
  /\beval\s*\(/,
  /window\.(top|parent)/,
];

function staticCheck(html) {
  if (!html) return 'Không tìm thấy file HTML hoàn chỉnh trong kết quả (có thể bị cắt cụt)';
  if (!/<head/i.test(html)) return 'Thiếu thẻ <head>';
  if (html.length > 150_000) return 'HTML quá lớn';
  const hit = BAD.find((r) => r.test(html));
  return hit ? `Chứa mã không được phép: ${hit}` : null;
}

/* ---------- Lớp kiểm tra chạy thật (tùy chọn, cần playwright) ---------- */
let playwright = null;
if (process.env.RUNTIME_CHECK === '1') {
  try {
    playwright = await import('playwright');
    console.log('Đã bật RUNTIME_CHECK (Playwright).');
  } catch {
    console.warn('RUNTIME_CHECK=1 nhưng chưa cài playwright, bỏ qua bước này.');
  }
}

async function runtimeCheck(html) {
  if (!playwright) return null;
  const browser = await playwright.chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    // thử bấm vài nút đầu tiên để kích hoạt thuật toán
    const buttons = await page.$$('button');
    for (const b of buttons.slice(0, 4)) {
      await b.click({ timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
    await page.waitForTimeout(1000);
    return errors[0] ? `Lỗi JavaScript khi chạy: ${errors[0]}` : null;
  } finally {
    await browser.close();
  }
}

/* ---------- CSP: chặn mọi truy cập mạng từ trang được sinh ---------- */
const CSP =
  `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; ` +
  `script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:">`;
const withCsp = (html) => html.replace(/<head[^>]*>/i, (m) => m + CSP);

/* ---------- API ---------- */
app.post('/api/render', async (req, res) => {
  const problem = String(req.body?.problem || '').trim().slice(0, 200);
  if (problem.length < 3) return res.status(400).json({ error: 'Đề bài quá ngắn.' });

  const file = path.join(CACHE_DIR, keyOf(problem) + '.html');

  // 1) Trả từ cache nếu có (trừ khi người dùng bấm "Tạo lại")
  if (req.body?.force !== true) {
    try {
      return res.json({ html: await fs.readFile(file, 'utf8'), cached: true });
    } catch {
      /* chưa có cache */
    }
  }

  if (inFlight >= MAX_IN_FLIGHT) {
    return res.status(503).json({ error: 'Hệ thống đang bận, hãy thử lại sau ít giây.' });
  }

  inFlight++;
  try {
    let feedback = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const html = await generate(problem, feedback);
        feedback = staticCheck(html);
        if (!feedback) feedback = await runtimeCheck(html);
        if (!feedback) {
          const safe = withCsp(html);
          await fs.writeFile(file, safe);
          return res.json({ html: safe, cached: false });
        }
        console.warn(`[lần ${attempt + 1}] "${problem}" -> ${feedback}`);
      } catch (e) {
        console.error(e);
        if (e?.status === 429) {
          return res
            .status(429)
            .json({ error: 'Hết hạn mức API, hãy thử lại sau ít phút.' });
        }
        feedback = 'Lỗi khi gọi API';
      }
    }
    res.status(502).json({ error: 'Không tạo được mô phỏng hợp lệ, hãy bấm "Tạo lại".' });
  } finally {
    inFlight--;
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Chạy tại http://localhost:${PORT}`));
