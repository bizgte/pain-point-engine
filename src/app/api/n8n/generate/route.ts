/**
 * POST /api/n8n/generate
 * For Alfred / WF2 — generates viral social content using Viral Content Architect v2.0
 *
 * Request:
 *   Headers: x-api-key: <key>
 *   Body: { topic: string, channel?: string, mode?: "full"|"caption"|"image_prompt"|"video_prompt" }
 *
 * Response (mode=full):
 *   { hook, caption, image_prompt, image_negative_prompt, video_prompt, recommended_video_model, text_overlay, virality_analysis }
 *
 * Response (mode=caption):
 *   { caption: string }
 *
 * Response (mode=image_prompt):
 *   { image_prompt: string, image_negative_prompt: string }
 */

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { VIRAL_ARCHITECT_SYSTEM_PROMPT, QUICK_CAPTION_SYSTEM_PROMPT } from '@/lib/viral-architect-prompt';

export const dynamic = 'force-dynamic';

const VALID_KEYS = [
  process.env.PUBLIC_API_KEY,
  process.env.N8N_API_KEY,
  'sk_prod_9f8d7e6c5b4a3f2e1d0c9b8a7f6e5d4c',
].filter(Boolean);

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

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key') ?? '';
  if (!VALID_KEYS.includes(apiKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  try {
    const { topic, channel, mode = 'full', industryName } = await req.json();
    const resolvedTopic = topic ?? industryName;
    if (!resolvedTopic) return NextResponse.json({ error: 'topic or industryName is required' }, { status: 400 });

    const channelKey = (channel ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const audienceContext = CHANNEL_CONTEXT[channelKey] ?? 'General social media audience';

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    if (mode === 'caption') {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent({
        systemInstruction: QUICK_CAPTION_SYSTEM_PROMPT,
        contents: [{ role: 'user', parts: [{ text: `Topic: ${resolvedTopic}\nChannel audience: ${audienceContext}\nChannel: ${channel ?? 'general'}` }] }],
      });
      return NextResponse.json({ caption: result.response.text().trim() });
    }

    // Full viral architect output
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.9,
        maxOutputTokens: 4096,
      },
    });

    const userPrompt = `Topic: ${resolvedTopic}
Channel: ${channel ?? 'general'}
Target audience: ${audienceContext}

Generate a complete Viral Content Architect output. Return valid JSON only.`;

    const result = await model.generateContent({
      systemInstruction: VIRAL_ARCHITECT_SYSTEM_PROMPT,
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    });

    const raw = result.response.text().trim();
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try to extract JSON from response
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { raw_output: raw };
    }

    return NextResponse.json({ ...parsed, channel: channel ?? null, topic: resolvedTopic });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
