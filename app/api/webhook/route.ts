import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    console.log("inside stripe");
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }
    const session =  event.data.object as Stripe.Checkout.Session;
    // metadata
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;
    console.log("evnet ", event);

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
        }

        await db.purchase.create({
            data: {
                courseId: courseId,
                userId: userId
            }
        })
    }else{
        // if webhook has too many status 400 error stripe turnoff webhook 
        // thats why here we pass as error as 200
        console.log("[STRIPE_ERROR]");
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
    }
    console.log("here");
    return new NextResponse(null, { status: 200 });
}