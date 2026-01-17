import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await prisma.notification.updateMany({
            where: {
                userId: user.id,
                isRead: false
            },
            data: { isRead: true }
        })

        return NextResponse.json({ message: "All notifications marked as read" })

    } catch (error) {
        console.error("Error marking all as read:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
