
import { db } from "@/lib/db,";
import { hashSync, compareSync } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId") as string

    try {
        const email = req.nextUrl.searchParams.get("email") as string
        if (email) {
            const isAvailable = await db.user.findFirst({ where: { email } })
            return NextResponse.json({ isAvailable: !isAvailable }, { status: 200 })
        }
        const { password, id, ...user } = await db.user.findFirstOrThrow({ where: { id: userId } })

        return NextResponse.json({ user })
    } catch {
        return NextResponse.json({ message: "User not found" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { username, email, password, picture, bio, isGuest } = await req.json()

        if (isGuest) {
            const guestUsername = () => {
                const words1 = ["Bubbly", "Fluffy", "Pudding", "Snuggle", "Peachy", "Tofu", "Marsh", "Choco", "Cloudy", "Twinkle"];
                const words2 = ["Bun", "Paws", "Muffin", "Bean", "Sprout", "Puff", "Cuddle", "Whiskers", "Duckie", "MooMoo"];
                const random1 = words1[Math.floor(Math.random() * words1.length)];
                const random2 = words2[Math.floor(Math.random() * words2.length)];
                return `${random1}${random2}`;
            }
            await db.user.create({
                data: {
                    username: guestUsername(),
                    picture: picture ?? "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
                }
            })
            return NextResponse.json({ message: "User created successfully." }, { status: 201 })
        }
        const unavailableEmail = await db.user.findFirst(({ where: { email } }))
        if (unavailableEmail) return NextResponse.json({ message: "Email is already being used." }, { status: 400 })

        const hashedPass = hashSync(password, 10)
        await db.user.create({
            data: {
                email,
                password: hashedPass,
                username,
                picture: picture ?? "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
                bio
            }
        })
        return NextResponse.json({ message: "User created successfully." }, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Failed to create user." }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const cookie = (await cookies()).get("token")

    try {
        if (!cookie || !cookie.value) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

        const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET as string)
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }
        const { username, email, password, picture, bio } = await req.json()

        const user = await db.user.findUnique({ where: { id: decoded.userId } })
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

        if (email && email !== user.email) {
            const emailExists = await db.user.findFirst({ where: { email } })
            if (emailExists) return NextResponse.json({ message: "Email is already in use" }, { status: 400 })
        }

        let hashedPassword = user.password
        if (password) {
            hashedPassword = hashSync(password, 10)
        }

        const updatedUser = await db.user.update({
            where: { id: decoded.userId },
            data: {
                username: username ?? user.username,
                email: email ?? user.email,
                password: hashedPassword,
                picture: picture ?? user.picture,
                bio: bio ?? user.bio,
            }
        })

        return NextResponse.json({ message: "User updated successfully", updatedUser }, { status: 200 })

    } catch {
        return NextResponse.json({ message: "Failed to update user." }, { status: 500 })
    }
}


export async function DELETE(req: NextRequest) {
    const cookie = (await cookies()).get("token")
    try {
        if (!cookie || !cookie.value) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

        const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET as string)
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }
        const { password } = await req.json()
        const user = await db.user.findFirstOrThrow(({ where: { id: decoded.userId } }))

        if (user.isGuest) {
            await db.$transaction([
                db.request.deleteMany({ where: { OR: [{ from: user.id }, { to: user.id }] } }),
                db.user.delete({ where: { id: user.id } })
            ])

            return NextResponse.json({ message: "User deleted successfully." }, { status: 200 })
        }

        const checkPass = compareSync(password, user.password as string)
        if (!checkPass) return NextResponse.json({ status: 404, message: "User not found." })
        await db.$transaction([
            db.request.deleteMany({ where: { OR: [{ from: user.id }, { to: user.id }] } }),
            db.user.delete({ where: { id: user.id } })
        ])

        return NextResponse.json({ message: "User deleted successfully." }, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Failed to delete user data." }, { status: 500 })
    }
}
