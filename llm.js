import { GoogleGenAI } from '@google/genai';
import { SYSTEM } from './prompt.js';
import { SHELL } from './template.js';

if (!process.env.GEMINI_API_KEY) {
  console.error('Thiếu GEMINI_API_KEY. Hãy tạo file .env (xem .env.example).');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

export function extractJs(text) {
  let t = String(text || '').trim();
  t = t.replace(/^```(?:javascript|js)?\s*/i, '').replace(/```\s*$/, '');
  return t.includes('function* algo') && t.includes('CODE_LINES') && t.includes('function draw') ? t : null;
}

export async function generate(problem, feedback) {
  const contents =
    `Đề bài: ${problem}` +
    (feedback
      ? `\n\nLần trước bị lỗi: ${feedback}\nHãy sửa lỗi và trả lại đầy đủ code JavaScript gồm META, CODE_LINES, algo, draw.`
      : '');

  const config = {
    systemInstruction: SYSTEM,
    temperature: 0.3,
    maxOutputTokens: Number(process.env.MAX_OUTPUT_TOKENS) || 8000,
  };
  if (process.env.THINKING_LEVEL) config.thinkingConfig = { thinkingLevel: process.env.THINKING_LEVEL };
  else if (process.env.THINKING_BUDGET) config.thinkingConfig = { thinkingBudget: Number(process.env.THINKING_BUDGET) };

  const res = await ai.models.generateContent({ model: MODEL, contents, config });

  const text = res.text ?? '';
  const cand = res.candidates?.[0];
  console.log(
    `[gemini] model=${MODEL} finish=${cand?.finishReason} chars=${text.length} usage=${JSON.stringify(res.usageMetadata)}`
  );
  if (res.promptFeedback) console.log('[gemini] promptFeedback:', JSON.stringify(res.promptFeedback));

  const js = extractJs(text);
  if (!js) {
    console.log('[gemini] ĐẦU:', JSON.stringify(text.slice(0, 200)));
    console.log('[gemini] CUỐI:', JSON.stringify(text.slice(-200)));
    return null;
  }
  return SHELL.replace('/*__AI_CODE__*/', () => js.replace(/<\/script/gi, '<\\/script'));
}