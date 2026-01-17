import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

// GET /api/provider/analytics - Provider insights dashboard
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
        const range = searchParams.get("range") || "7d"

        // Calculate date range
        const now = new Date()
        let startDate: Date
        switch (range) {
            case "30d":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                break
            case "90d":
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
                break
            default: // 7d
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        }

        // Fetch sessions in range
        const sessions = await prisma.appSession.findMany({
            where: {
                providerId: user.id,
                startTime: { gte: startDate }
            }
        })

        // Calculate completion rate
        const totalSessions = sessions.length
        const completedSessions = sessions.filter(s => s.status === "COMPLETED").length
        const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

        // Calculate unique clients and retention
        const clientIds = [...new Set(sessions.map(s => s.clientId))]
        const repeatClients = await prisma.appSession.groupBy({
            by: ['clientId'],
            where: {
                providerId: user.id,
                clientId: { in: clientIds }
            },
            _count: { clientId: true }
        })
        const returningClients = repeatClients.filter(c => c._count.clientId > 1).length
        const retentionRate = clientIds.length > 0 ? (returningClients / clientIds.length) * 100 : 0

        // Calculate total duration
        let totalDuration = 0
        sessions.forEach(s => {
            if (s.startTime && s.endTime) {
                totalDuration += Math.round((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000)
            }
        })

        // Get reviews
        const reviews = await prisma.review.findMany({
            where: { providerId: user.id }
        })
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0

        // Rating breakdown
        const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => ({
            stars,
            percentage: reviews.length > 0
                ? Math.round((reviews.filter(r => r.rating === stars).length / reviews.length) * 100)
                : 0
        }))

        // Weekly sessions (group by day)
        const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
        const weeklySessions = dayNames.map(day => ({
            day,
            count: sessions.filter(s => dayNames[new Date(s.startTime).getDay()] === day).length
        }))

        return NextResponse.json({
            completion: {
                value: parseFloat(completionRate.toFixed(1)),
                change: 0, // Would need previous period to calculate
                trend: "stable"
            },
            retention: {
                value: parseFloat(retentionRate.toFixed(1)),
                change: 0,
                trend: "stable"
            },
            rating: parseFloat(avgRating.toFixed(1)),
            reviewCount: reviews.length,
            totalDuration,
            durationChange: 0,
            newClients: clientIds.length,
            clientsChange: 0,
            weeklySessions,
            ratingBreakdown
        })
    } catch (error) {
        console.error("[Provider Analytics] GET error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
