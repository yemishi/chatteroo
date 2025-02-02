import { db } from "@/lib/db,";
import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId
    try {
        const pendingSentRequests = await db.request.findMany({ where: { from: userId, status: "pending" } })
        const pendingReceivedRequests = await db.request.findMany({ where: { to: userId, status: "pending" } })
        return NextResponse.json({ pendingSentRequests, pendingReceivedRequests }, { status: 200 })
    } catch {
        return NextResponse.json({ message: "We had an error trying to retrieve the friend requests" }, { status: 401 })
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId
    const cookie = (await cookies()).get("token")

    if (!cookie || !cookie.value) return NextResponse.json({ message: "Invalid token" }, { status: 401 })


    try {
        const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET as string)
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }
        if (decoded.isGuest) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

        const { requestId, acceptRequest } = await req.json()
        if (requestId) {
            if (!acceptRequest) {
                await db.request.delete({ where: { id: requestId } })
                return NextResponse.json({ message: "Friend request declined successfully" }, { status: 200 })
            }
            await db.$transaction([
                db.user.update({
                    where: { id: userId },
                    data: { friends: { push: decoded.userId } }
                }),
                db.user.update({
                    where: { id: decoded.userId },
                    data: { friends: { push: userId } }
                }),
                db.request.update({
                    where: { id: requestId },
                    data: { status: "accepted" }
                }),
                db.chat.create({ data: { participants: { set: [decoded.userId, userId] } } })
            ])
            return NextResponse.json({ message: "Friend request accept successfully." }, { status: 201 })
        }


        await db.request.create({ data: { from: decoded.userId, to: userId } })

        return NextResponse.json({ message: "Friend request sent successfully." }, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
}
