
import { db } from "@/lib/db,";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const chatId = req.nextUrl.searchParams.get("chatId");
        if (!chatId) {
            return NextResponse.json({ message: "Chat ID is required" }, { status: 400 });
        }

        const chat = await db.chat.findUnique({ where: { id: chatId }, });

        if (!chat) {
            return NextResponse.json({ message: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json({ chat }, { status: 200 });

    } catch {
        return NextResponse.json({ message: "Failed to fetch chat." }, { status: 500 });
    }
}

