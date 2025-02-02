import { db } from '@/lib/db,';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const chatId = req.nextUrl.searchParams.get("chatId") as string
    const cookie = (await cookies()).get("token")
    try {
        if (!cookie || !cookie.value) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

        const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET as string)
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }

        const chat = await db.chat.findUnique({ where: { id: chatId }, select: { participants: true } })
        if (!chat || !chat.participants.includes(decoded.userId)) {
            return NextResponse.json({ message: "User is not part of the chat" }, { status: 403 })
        }

        const messages = await db.message.findMany({ where: { chatId }, orderBy: { timestamp: 'asc' } })

        return NextResponse.json({ messages }, { status: 200 })

    } catch (error) {
        console.error("Error retrieving messages:", error)
        return NextResponse.json({ message: "There was a problem retrieving the messages" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const cookie = (await cookies()).get("token")

    try {
        if (!cookie || !cookie.value) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

        const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET as string)
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }

        const { chatId, content } = await req.json()

        if (!chatId || !content) {
            return NextResponse.json({ message: "Chat ID and content are required" }, { status: 400 })
        }

        const chat = await db.chat.findUnique({ where: { id: chatId } })
        if (!chat || !chat.participants.includes(decoded.userId)) {
            return NextResponse.json({ message: "User is not part of the chat" }, { status: 403 })
        }

        const newMessage = await db.message.create({
            data: {
                content,
                senderId: decoded.userId,
                chatId,
            }
        })

        return NextResponse.json({ message: "Message sent successfully", newMessage }, { status: 200 })

    } catch {
        return NextResponse.json({ message: "There was a problem sending the message" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {

    const messageId = req.nextUrl.searchParams.get("messageId") as string
    const cookie = (await cookies()).get("token")

    try {
        if (!cookie || !cookie.value) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

        const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET as string)
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }

        const { content } = await req.json()
        if (!content) {
            return NextResponse.json({ message: "Content is required" }, { status: 400 })
        }

        const message = await db.message.findUnique({ where: { id: messageId } })
        if (!message) {
            return NextResponse.json({ message: "Message not found" }, { status: 404 })
        }

        if (message.senderId !== decoded.userId) {
            return NextResponse.json({ message: "You are not authorized to update this message" }, { status: 403 })
        }

        const updatedMessage = await db.message.update({
            where: { id: messageId },
            data: { content, editedAt: new Date() }
        })

        return NextResponse.json({ message: "Message updated successfully", updatedMessage }, { status: 200 })

    } catch {
        return NextResponse.json({ message: "There was a problem updating the message" }, { status: 500 })
    }
}
