import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { password } = body;

        // In a real app, use a strong hashed password or auth provider.
        // For admin access, a simple env check is usually sufficient if HTTPS is enforced.
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (password === adminPassword) {
            const cookieStore = await cookies();
            cookieStore.set('admin_auth', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
