import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret) {
    // Graceful no-op — Stripe not yet configured
    return NextResponse.json({ received: true, note: "Stripe not configured" });
  }

  try {
    const stripe = (await import("stripe")).default;
    const client = new stripe(process.env.STRIPE_SECRET_KEY ?? "");
    const sig = req.headers.get("stripe-signature") ?? "";
    const rawBody = await req.text();

    const event = client.webhooks.constructEvent(rawBody, sig, stripeSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        // TODO: provision credits on successful checkout
        console.log("Checkout completed:", event.data.object);
        break;
      }
      case "customer.subscription.deleted": {
        // TODO: downgrade user to free tier
        console.log("Subscription cancelled:", event.data.object);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
