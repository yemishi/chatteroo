
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db,";



export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId
    const cookie = (await cookies()).get("token")
    const isFriend = req.nextUrl.searchParams.get("isFriend") as string

    try {
        if (isFriend) {
            if (!cookie || !cookie.value) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET as string)
            if (!decoded || typeof decoded === 'string') {
                throw new Error('Invalid token');
            }

            const checkFriend = await db.user.findFirst({ where: { id: userId, friends: { has: decoded.userId } } })
            return NextResponse.json({ isFriend: !!checkFriend }, { status: 200 })
        }
        const userFriends = await db.user.findFirstOrThrow({ where: { id: userId }, select: { friends: true } })

        const friendsData = await db.user.findMany({ where: { id: { in: userFriends?.friends } }, select: { picture: true, username: true, id: true, bio: true } })
        return NextResponse.json({ friends: friendsData }, { status: 200 })
    } catch {
        return NextResponse.json({ message: "We had a problem trying to get data of friends from this user." }, { status: 500 })
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId
    const cookie = (await cookies()).get("token")
    try {
        if (!cookie || !cookie.value) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

        const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET as string)
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }
        const { unfriend } = await req.json()
        if (unfriend) {
            const user = await db.user.findUnique({ where: { id: userId }, select: { friends: true } })
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 })
            }

            const updatedFriends = user.friends.filter(friendId => friendId !== decoded.userId)
            await db.$transaction([
                db.user.update({
                    where: { id: userId },
                    data: { friends: { set: updatedFriends } }
                }),

                db.user.update({
                    where: { id: decoded.userId },
                    data: { friends: { set: updatedFriends.filter(friendId => friendId !== userId) } }
                })
            ])

            return NextResponse.json({ message: "User unfriended successfully" }, { status: 201 })
        }

        return NextResponse.json({ message: "No action taken" }, { status: 200 })
    } catch {
        return NextResponse.json({ message: "There was a problem processing your request" }, { status: 500 })
    }
}

