import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { industryName, prompt } = body;

        const apiKey = process.env.KIE_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'KIE_API_KEY is missing from environment variables.' }, { status: 500 });
        }

        if (!industryName) {
            return NextResponse.json({ error: 'Missing industry name' }, { status: 400 });
        }

        const systemPrompt = `A highly aesthetic, premium, and photorealistic background image representing the ${industryName} industry. It should ideally depict ${prompt}. The image should look like an expensive, high-end stock photo. Ensure there is absolutely NO TEXT, no words, no letters, and no logos in the image. High contrast, cinematic lighting, 8k resolution.`;

        // Assuming Kie.ai provides an OpenAI-compatible endpoint or stable-diffusion proxy. 
        // We'll use a standard POST request structure based on common AI image generation APIs like Fal or Replicate.
        // Update this URL and payload structure to match Kie.ai's exact spec if known, 
        // but typically it's an OpenAI drop-in or a replicate-style json payload.

        // Example using an OpenAI compatible wrapper format (often used by aggregators):
        const response = await fetch('https://api.kie.ai/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "bria-ai/bria-2.3", // Replace with intended photoreal model on Kie
                prompt: systemPrompt,
                n: 1,
                size: "1024x1024",
                response_format: "url"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Kie AI Error:", errorText);
            return NextResponse.json({ error: `Image generation failed: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();

        if (data && data.data && data.data.length > 0 && data.data[0].url) {
            return NextResponse.json({ imageUrl: data.data[0].url });
        } else {
            return NextResponse.json({ error: 'Invalid response format from API' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: 'Failed to generate image. Please check server logs.' },
            { status: 500 }
        );
    }
}
