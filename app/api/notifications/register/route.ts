import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import { z } from 'zod'

const registerSchema = z.object({
    token: z.string().min(1, "Token is required"),
    platform: z.enum(["android", "ios", "web"]).optional(),
})

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validation = registerSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation failed", errors: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { token, platform } = validation.data

        // Upsert the device token for this user
        const device = await prisma.device.upsert({
            where: {
                userId_token: {
                    userId: user.id,
                    token: token,
                },
            },
            update: {
                platform: platform || "unknown",
                updatedAt: new Date(),
            },
            create: {
                userId: user.id,
                token: token,
                platform: platform || "unknown",
            },
        })

        return NextResponse.json({
            message: "Device registered successfully",
            device
        }, { status: 200 })

    } catch (error) {
        console.error("Error registering device:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
