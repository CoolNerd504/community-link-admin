import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helpers"
import * as db from "@/lib/db-operations"
import { prisma } from "@/lib/prisma"

// GET /api/services - Get provider's own services
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        if (user.role !== "PROVIDER") {
            return NextResponse.json({ message: "Forbidden: Providers only" }, { status: 403 })
        }

        const services = await prisma.service.findMany({
            where: { providerId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: {
                        sessions: {
                            where: { status: 'COMPLETED' }
                        },
                        bookings: true // Total bookings received
                    }
                }
            }
        })

        return NextResponse.json(services)
    } catch (error) {
        console.error("[Services] GET error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

// POST /api/services - Create new service
export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        if (user.role !== "PROVIDER") {
            return NextResponse.json({ message: "Forbidden: Providers only" }, { status: 403 })
        }

        const body = await req.json()
        const { title, description, price, duration, category } = body

        // Basic validation
        // Basic validation
        const missingFields = []
        if (!title) missingFields.push('title')
        if (!description) missingFields.push('description')
        if (price === undefined || price === null) missingFields.push('price')
        if (duration === undefined || duration === null) missingFields.push('duration')
        if (!category) missingFields.push('category') // Enforce category if desired, or keep optional

        if (missingFields.length > 0) {
            return NextResponse.json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 })
        }

        const serviceData = {
            title,
            description,
            price: Number(price),
            duration: Number(duration),
            category: category || "General",
            createdById: user.id
        }

        const service = await db.addProviderService(user.id, serviceData)

        return NextResponse.json(service, { status: 201 })
    } catch (error) {
        console.error("[Create Service] POST error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
