import { NextResponse } from "next/server";
import { sendTemplateEmail } from "@/features/email";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { to, name } = body;

        if (!to || !name) {
            return NextResponse.json(
                { error: "Missing required fields: `to` and `name`" },
                { status: 400 }
            );
        }

        const result = await sendTemplateEmail(
            {
                to: [{ email: to, name }],
            },
            {
                name: "welcome",
                version: "v1",
                locale: "en",
                data: { name }
            }
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            messageId: result.messageId,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Email test API is running. Send a POST request to test email sending.",
        examplePayload: {
            to: "test@example.com",
            name: "Test User",
        },
    });
}
