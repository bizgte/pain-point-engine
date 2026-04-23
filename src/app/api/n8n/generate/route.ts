/**
 * POST /api/n8n/generate
 * For Alfred / WF2 — generates viral social content using Viral Content Architect v2.0
 *
 * Primary LLM: Ollama gemma4:e4b @ 192.168.100.33:11434 (free, local inference)
 * Fallback LLM: Gemini 2.5 Flash (cloud, used if Ollama unreachable or fails)
 *
 * Request:
 *   Headers: x-api-key: <key>
 *   Body: { topic: string, channel?: string, mode?: "full"|"caption"|"captions_all"|"image_prompt"|"video_prompt" }
 *
 * Response includes `engine` field: "ollama" | "gemini"
 */

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { VIRAL_ARCHITECT_SYSTEM_PROMPT, QUICK_CAPTION_SYSTEM_PROMPT, PLATFORM_CAPTION_SYSTEM_PROMPT } from '@/lib/viral-architect-prompt';

export const dynamic = 'force-dynamic';

const VALID_KEYS = [
  process.env.PUBLIC_API_KEY,
  process.env.N8N_API_KEY,
  'sk_prod_9f8d7e6c5b4a3f2e1d0c9b8a7f6e5d4c',
].filter(Boolean);

const OLLAMA_BASE = process.env.OLLAMA_URL ?? 'http://192.168.100.33:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'gemma4:e4b';

const CHANNEL_CONTEXT: Record<string, string> = {
  '5ubzero':        'Tech-savvy early adopters, AI tools enthusiasts, builders and makers',
  'thesmartlist':   'Business owners, entrepreneurs, automation fans, smart growth seekers',
  'wealthnector':   'Investors, wealth-builders, high-income aspirants, financial freedom seekers',
  'salalawigan':    'Filipino diaspora, proud Filipinos, local culture and lifestyle enthusiasts',
  'moode':          'Emotionally intelligent adults, wellness seekers, personal growth community',
  'baileysjournal': 'Journalers, personal development enthusiasts, habit builders',
  'redflagscan':    'Freelancers, small business owners, contract-cautious professionals',
  'gdprverify':     'EU business owners, compliance managers, GDPR-concerned organizations',
  'velocityinvoice':'Freelancers, consultants, agency owners who hate chasing payments',
  'operria':        'Trades business owners, HVAC/plumbing/electrical SMBs, service contractors',
  'taglearning':    'Parents, educators, adult learners, AI-curious professionals',
  'appublishing':   'Indie developers, micro-SaaS builders, digital product sellers',
};

// ── Ollama helpers ────────────────────────────────────────────────────────────

async function ollamaGenerate(systemPrompt: string, userPrompt: string, json = false): Promise<string> {
  const prompt = `${systemPrompt}\n\n${userPrompt}`;
  const body: any = {
    model: OLLAMA_MODEL,
    prompt,
    stream: false,
    options: { temperature: 0.85, num_predict: 2000 },
  };
  if (json) body.format = 'json';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
    const d = await res.json();
    const text = (d.response ?? '').trim();
    if (!text) throw new Error('Ollama returned empty response');
    return text;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key') ?? '';
  if (!VALID_KEYS.includes(apiKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic, channel, mode = 'full', industryName } = await req.json();
    const resolvedTopic = topic ?? industryName;
    if (!resolvedTopic) return NextResponse.json({ error: 'topic or industryName is required' }, { status: 400 });

    const channelKey = (channel ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const audienceContext = CHANNEL_CONTEXT[channelKey] ?? 'General social media audience';

    // ── caption mode ──────────────────────────────────────────────────────────
    if (mode === 'caption') {
      const userPrompt = `Topic: ${resolvedTopic}\nChannel audience: ${audienceContext}\nChannel: ${channel ?? 'general'}\n\nWrite a single viral Facebook caption under 120 words. No hashtags. No preamble. Just the caption text.`;
      let caption = '';
      let engine = 'ollama';

      try {
        caption = await ollamaGenerate(QUICK_CAPTION_SYSTEM_PROMPT, userPrompt);
      } catch {
        engine = 'gemini';
        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent({
          systemInstruction: QUICK_CAPTION_SYSTEM_PROMPT,
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        });
        caption = result.response.text().trim();
      }

      return NextResponse.json({ caption, engine });
    }

    // ── captions_all mode ─────────────────────────────────────────────────────
    if (mode === 'captions_all') {
      const userPrompt = `Topic: ${resolvedTopic}\nChannel: ${channel ?? 'general'}\nAudience: ${audienceContext}\n\nReturn a JSON object with platform captions. No preamble.`;
      let engine = 'ollama';
      let parsed: any;

      try {
        const raw = await ollamaGenerate(PLATFORM_CAPTION_SYSTEM_PROMPT, userPrompt, true);
        parsed = JSON.parse(raw);
      } catch {
        engine = 'gemini';
        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: 'application/json', temperature: 0.9 } });
        const result = await model.generateContent({
          systemInstruction: PLATFORM_CAPTION_SYSTEM_PROMPT,
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        });
        const raw = result.response.text().trim();
        try { parsed = JSON.parse(raw); } catch { parsed = { raw }; }
      }

      return NextResponse.json({ captions: parsed, channel: channel ?? null, topic: resolvedTopic, engine });
    }

    // ── full viral architect mode ─────────────────────────────────────────────
    const userPrompt = `Topic: ${resolvedTopic}
Channel: ${channel ?? 'general'}
Target audience: ${audienceContext}

Generate a complete Viral Content Architect output. Return valid JSON only.`;

    let parsed: any;
    let engine = 'ollama';

    try {
      const raw = await ollamaGenerate(VIRAL_ARCHITECT_SYSTEM_PROMPT, userPrompt, true);
      try {
        parsed = JSON.parse(raw);
      } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        parsed = match ? JSON.parse(match[0]) : { raw_output: raw };
      }
    } catch {
      // Gemini fallback
      engine = 'gemini';
      if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured and Ollama unavailable');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json', temperature: 0.9, maxOutputTokens: 4096 },
      });
      const result = await model.generateContent({
        systemInstruction: VIRAL_ARCHITECT_SYSTEM_PROMPT,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      });
      const raw = result.response.text().trim();
      try {
        parsed = JSON.parse(raw);
      } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        parsed = match ? JSON.parse(match[0]) : { raw_output: raw };
      }
    }

    return NextResponse.json({ ...parsed, channel: channel ?? null, topic: resolvedTopic, engine });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
