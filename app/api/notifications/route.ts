import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to last 50
        })

        return NextResponse.json(notifications)

    } catch (error) {
        console.error('[Notifications API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

// Optional: Mark all as read
export async function PATCH(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.notification.updateMany({
            where: {
                userId: user.id,
                isRead: false
            },
            data: { isRead: true }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('[Notifications API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
