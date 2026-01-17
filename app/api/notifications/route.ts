import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const unreadOnly = searchParams.get('unreadOnly') === 'true'
        const limit = parseInt(searchParams.get('limit') || '20')
        const page = parseInt(searchParams.get('page') || '1')
        const skip = (page - 1) * limit

        const where = {
            userId: user.id,
            ...(unreadOnly ? { isRead: false } : {})
        }

        console.log("[Notifications] Fetching for user:", user.id)
        console.log("[Notifications] Where:", JSON.stringify(where))

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip,
        })

        const total = await prisma.notification.count({ where })

        return NextResponse.json({
            notifications,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error("Error fetching notifications:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
