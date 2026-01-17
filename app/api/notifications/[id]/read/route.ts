import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { id } = params

        // Verify ownership
        const notification = await prisma.notification.findUnique({
            where: { id }
        })

        if (!notification) {
            return NextResponse.json({ message: "Notification not found" }, { status: 404 })
        }

        if (notification.userId !== user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        })

        return NextResponse.json({ notification: updated })

    } catch (error) {
        console.error("Error marking notification as read:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
