import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helpers"
import * as db from "@/lib/db-operations"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        if (user.role !== "PROVIDER") {
            return NextResponse.json({ message: "Forbidden: Providers only" }, { status: 403 })
        }

        const searchParams = req.nextUrl.searchParams
        const providerId = searchParams.get("providerId") || user.id

        // Security check: Providers can only see their own earnings
        if (providerId !== user.id) {
            return NextResponse.json({ message: "Forbidden: Cannot view other provider's earnings" }, { status: 403 })
        }

        const earnings = await db.getProviderEarnings(providerId)

        // Calculate minutes growth percent
        let minutesGrowthPercent = 0
        if (earnings) {
            // Get previous month minutes from completed sessions
            const now = new Date()
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

            const previousMonthSessions = await prisma.appSession.findMany({
                where: {
                    providerId,
                    status: "COMPLETED",
                    startTime: {
                        gte: startOfPreviousMonth,
                        lt: startOfCurrentMonth
                    }
                }
            })

            let previousMonthMinutes = 0
            previousMonthSessions.forEach(s => {
                if (s.startTime && s.endTime) {
                    previousMonthMinutes += Math.round(
                        (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000
                    )
                }
            })

            if (previousMonthMinutes > 0) {
                minutesGrowthPercent = parseFloat(
                    (((earnings.currentMonthMinutes - previousMonthMinutes) / previousMonthMinutes) * 100).toFixed(1)
                )
            }
        }

        return NextResponse.json({
            ...earnings,
            minutesGrowthPercent
        })
    } catch (error) {
        console.error("[Provider Earnings] GET error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

