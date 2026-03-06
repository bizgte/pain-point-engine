import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const responseSchema: any = {
    type: SchemaType.ARRAY,
    description: "An array of 10 highly-converting social media template posts tailored to the user's specific industry and pain points. Each array item represents one TemplateDefinition.",
    items: {
        type: SchemaType.OBJECT,
        properties: {
            id: { type: SchemaType.STRING },
            industryId: { type: SchemaType.STRING },
            name: { type: SchemaType.STRING },
            type: { type: SchemaType.STRING },
            theme: { type: SchemaType.STRING },
            isVisualHeavy: { type: SchemaType.BOOLEAN },
            goalTags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            toneTags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            platformTags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            variables: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        key: { type: SchemaType.STRING },
                        label: { type: SchemaType.STRING },
                        required: { type: SchemaType.BOOLEAN }
                    },
                    required: ["key", "label", "required"]
                }
            },
            blocks: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        kind: { type: SchemaType.STRING },
                        text: { type: SchemaType.STRING },
                        items: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
                    },
                    required: ["kind"]
                }
            },
            deepDiveCaption: { type: SchemaType.STRING }
        },
        required: ["id", "industryId", "name", "type", "theme", "goalTags", "toneTags", "platformTags", "variables", "blocks", "deepDiveCaption"]
    }
};

export async function POST(req: Request) {
    try {
        // 1. Verify Authentication Header
        const authHeader = req.headers.get('Authorization');
        const expectedKey = process.env.N8N_API_KEY || 'development_key_123';

        if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== expectedKey) {
            return NextResponse.json({ error: 'Unauthorized. Invalid or missing API Key.' }, { status: 401 });
        }

        const body = await req.json();
        const { industryName } = body;

        if (!industryName) {
            return NextResponse.json({ error: 'industryName is required in JSON body' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
        }

        // 2. Generate Templates via Gemini
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
            }
        });

        const prompt = `You are an expert, top-tier direct response copywriter and social media strategist.
The user wants to generate a "Pain Point Template Pack" for their specific industry: "${industryName}".
Your job is to identify the 10 deepest, most urgent psychological pain points, objections, and desires of their target customer, and then write 10 distinct, highly-converting social media posts (templates) addressing them.

DO NOT write generic, boring AI text. Write punchy, authoritative, and persuasive copy or soft, elegant, and peaceful copy depending on what fits the industry best. Pick the correct 'theme' (soft or default) based on the industry's vibe!
Use the variables array to leave placeholders like {{city}}, {{offer}}, {{years_experience}} for the user to fill in later.
Ensure the 'blocks' array builds a complete visual post (headline -> subhead -> body/bullets -> cta).
Ensure the 'deepDiveCaption' is a long-form, 2-3 paragraph textual caption providing immense value and context.
You must return EXACTLY 10 templates.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/^```json\n?/, '').replace(/```$/, '');
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/^```\n?/, '').replace(/```$/, '');
        }

        const parsedContent = JSON.parse(responseText);

        return NextResponse.json({
            success: true,
            industry: industryName,
            templates: parsedContent
        }, { status: 200 });

    } catch (error) {
        console.error('Error in n8n API generation:', error);
        return NextResponse.json(
            { error: 'Failed to generate templates via API.' },
            { status: 500 }
        );
    }
}
