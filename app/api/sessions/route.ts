import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

// GET /api/sessions - List sessions for authenticated user
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const searchParams = req.nextUrl.searchParams
        const status = searchParams.get("status") || "ALL"
        const limit = parseInt(searchParams.get("limit") || "20")
        const offset = parseInt(searchParams.get("offset") || "0")

        // Build where clause based on user role
        const whereClause: any = {}

        if (user.role === "PROVIDER") {
            whereClause.providerId = user.id
        } else {
            whereClause.clientId = user.id
        }

        // Filter by status if not ALL
        if (status !== "ALL") {
            whereClause.status = status
        }

        const sessions = await prisma.appSession.findMany({
            where: whereClause,
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        providerServices: {
                            take: 1,
                            select: { title: true }
                        }
                    }
                }
            },
            orderBy: { startTime: 'desc' },
            take: limit,
            skip: offset
        })

        // Format response to match requirements
        const formattedSessions = sessions.map(s => ({
            id: s.id,
            clientName: s.client.name,
            clientImage: s.client.image,
            providerName: s.provider.name,
            service: s.provider.providerServices[0]?.title || "Session",
            date: s.startTime,
            durationMinutes: s.endTime
                ? Math.round((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000)
                : null,
            status: s.status
        }))

        return NextResponse.json(formattedSessions)
    } catch (error) {
        console.error("[Sessions] GET error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
