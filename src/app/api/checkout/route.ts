import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRICE_IDS = {
  plus_monthly: process.env.STRIPE_PLUS_MONTHLY_PRICE_ID ?? "",
  plus_annual: process.env.STRIPE_PLUS_ANNUAL_PRICE_ID ?? "",
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
  pro_annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? "",
};

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe not configured", note: "Add STRIPE_SECRET_KEY to .env" },
      { status: 503 }
    );
  }

  try {
    const stripe = (await import("stripe")).default;
    const client = new stripe(stripeKey);
    const { plan } = await req.json() as { plan: keyof typeof PRICE_IDS };

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: `No price ID for plan: ${plan}` }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const session = await client.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?upgrade=success`,
      cancel_url: `${origin}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
