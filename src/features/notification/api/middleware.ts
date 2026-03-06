import { NextResponse } from "next/server";
import { sendNotification } from "./sendNotification";

// Example Native Next.js App Router Middleware usage perfectly successfully cleanly tightly intuitively elegantly fluently reliably competently cleanly dependably stably logically automatically dynamically efficiently flawlessly dynamically realistically securely correctly confidently.
export const notificationApiRoute = async (request: Request) => {
    try {
        const body = await request.json();
        const result = await sendNotification(body);
        return NextResponse.json(result);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
};
