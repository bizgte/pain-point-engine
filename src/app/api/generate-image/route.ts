import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { industryName, prompt } = body;

        if (!industryName) {
            return NextResponse.json({ error: 'Missing industry name' }, { status: 400 });
        }

        const systemPrompt = `A cinematic, photography-style image representing ${industryName}: ${prompt}. No text, no words, visual only.`;
        // Fallback to Pollinations.ai for reliable, free, key-less image generation.
        const encodedPrompt = encodeURIComponent(systemPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

        // Fetch server-side to bypass client CORS blocks in html-to-image downloads
        const imageRes = await fetch(imageUrl);
        if (!imageRes.ok) {
            throw new Error(`Pollinations API failed with status ${imageRes.status}`);
        }
        
        const arrayBuffer = await imageRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64}`;

        return NextResponse.json({ imageUrl: dataUri });

    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: 'Failed to generate image. Please check server logs.' },
            { status: 500 }
        );
    }
}
