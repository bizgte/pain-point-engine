import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Define the exact JSON schema we expect the AI to return.
// This matches the TemplateDefinition array structure from our app.
const responseSchema: any = {
    type: SchemaType.ARRAY,
    description: "An array of 10 highly-converting social media template posts tailored to the user's specific industry and pain points. Each array item represents one TemplateDefinition.",
    items: {
        type: SchemaType.OBJECT,
        properties: {
            id: { type: SchemaType.STRING, description: "A unique kebab-case identifier (e.g. 'custom-painpoint-name')" },
            industryId: { type: SchemaType.STRING, description: "Should always be 'custom'" },
            name: { type: SchemaType.STRING, description: "A catchy, short name for this template (e.g. 'The Empty Nester Downsize')" },
            type: { type: SchemaType.STRING, description: "The format. One of: 'carousel', 'single', 'ad', or 'caption'" },
            theme: { type: SchemaType.STRING, description: "The visual aesthetic. Return 'soft' for industries like wellness, beauty, coaching, arts, fashion, or anything requiring an elegant, light, peaceful vibe. Return 'default' for standard business, tech, or aggressive marketing industries." },
            isVisualHeavy: { type: SchemaType.BOOLEAN, description: "Set to true if this template relies heavily on visuals and needs larger typography." },
            goalTags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Array of goals, e.g., 'leads', 'awareness', 'authority'" },
            toneTags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Array of tones, e.g., 'professional', 'friendly', 'bold'" },
            platformTags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Array of platforms, e.g., 'instagram', 'facebook', 'linkedin'" },
            variables: {
                type: SchemaType.ARRAY,
                description: "Array of variables the user needs to fill in to complete the template (e.g. city, offer name).",
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        key: { type: SchemaType.STRING, description: "The variable key used in the text blocks, e.g. 'city'" },
                        label: { type: SchemaType.STRING, description: "A human-readable prompt for the input field, e.g. 'Your City'" },
                        required: { type: SchemaType.BOOLEAN, description: "Always true" }
                    },
                    required: ["key", "label", "required"]
                }
            },
            blocks: {
                type: SchemaType.ARRAY,
                description: "The actual textual building blocks of the post.",
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        kind: { type: SchemaType.STRING, description: "One of: 'headline', 'subhead', 'body', 'bullets', 'cta', 'disclaimer'" },
                        text: { type: SchemaType.STRING, description: "The text content for this block. Use {{variable_key}} to inject variables defined above. If kind is 'bullets', this should be empty/omitted." },
                        items: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "If kind is 'bullets', this is an array of strings representing the bullet points. Otherwise omit." }
                    },
                    required: ["kind"]
                }
            },
            deepDiveCaption: { type: SchemaType.STRING, description: "A long-form, highly detailed text caption that provides a deep dive into the psychological pain point being addressed. Formatted with line breaks." }
        },
        required: ["id", "industryId", "name", "type", "theme", "goalTags", "toneTags", "platformTags", "variables", "blocks", "deepDiveCaption"]
    }
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { industryName } = body;

        if (!industryName) {
            return NextResponse.json({ error: 'industryName is required' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
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

        // Strip out any markdown block formatting that Gemini might randomly inject
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/^```json\n?/, '').replace(/```$/, '');
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/^```\n?/, '').replace(/```$/, '');
        }

        return new NextResponse(responseText, {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error generating custom templates:', error);
        return NextResponse.json(
            { error: 'Failed to generate templates. Details: ' + (error.message || 'Unknown Gemini API error.') },
            { status: 500 }
        );
    }
}
