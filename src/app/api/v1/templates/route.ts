import { NextResponse } from 'next/server';
import { templates } from '@/data/templates';
import { TemplateDefinition } from '@/types';

// In a real application, this would query a database
// Or validate via Stripe / Clerk / Auth0.
const VALID_API_KEYS = [
    process.env.PUBLIC_API_KEY,
    'sk_test_12345'
];

export async function POST(req: Request) {
    try {
        // 1. Authenticate Request
        const apiKey = req.headers.get('x-api-key');

        if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
            return NextResponse.json(
                { error: 'Unauthorized. Invalid or missing x-api-key header.' },
                { status: 401 }
            );
        }

        // 2. Parse Payload
        const body = await req.json().catch(() => ({}));
        const { industryId, limit = 10 } = body;

        // 3. Handle Request
        let responseTemplates: TemplateDefinition[] = [];

        if (industryId) {
            // Find existing curated templates first
            responseTemplates = templates.filter(t => t.industryId === industryId);

            // If they ask for something like 'custom' or an industry not in our DB,
            // we *could* trigger the Gemini API here programmatically on their behalf.
            // For MVP, we will return a 404 or an empty array.
            if (responseTemplates.length === 0) {
                return NextResponse.json(
                    {
                        error: `No templates found for industryId: ${industryId}. Send a request to our internal visual generator first, or wait for v2 dynamic generation via API.`
                    },
                    { status: 404 }
                );
            }
        } else {
            // If no industry specified, return everything (paginated/limited)
            responseTemplates = templates;
        }

        // Apply limits
        responseTemplates = responseTemplates.slice(0, Number(limit));

        // 4. Return Output
        return NextResponse.json({
            count: responseTemplates.length,
            data: responseTemplates
        });

    } catch (error) {
        console.error('Error serving developer API:', error);
        return NextResponse.json(
            { error: 'Internal Server Error.' },
            { status: 500 }
        );
    }
}
