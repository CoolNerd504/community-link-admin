import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helpers"
import * as db from "@/lib/db-operations"
import { prisma } from "@/lib/prisma"

// GET /api/services/[id] - Get service details
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true,
                        profile: true
                    }
                }
            }
        })

        if (!service) {
            return NextResponse.json({ message: "Service not found" }, { status: 404 })
        }

        return NextResponse.json(service)
    } catch (error) {
        console.error("[Get Service] Error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

// PATCH /api/services/[id] - Update service
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(req)
        if (!user || user.role !== "PROVIDER") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { id } = params
        const body = await req.json()

        // Verify ownership
        const service = await prisma.service.findUnique({ where: { id } })
        if (!service) {
            return NextResponse.json({ message: "Service not found" }, { status: 404 })
        }

        if (service.providerId !== user.id) {
            return NextResponse.json({ message: "Forbidden: Not your service" }, { status: 403 })
        }

        // Prepare updates (only allow specific fields)
        const updates: any = {}
        if (body.title) updates.title = body.title
        if (body.description) updates.description = body.description
        if (body.price) updates.price = Number(body.price)
        if (body.duration) updates.duration = Number(body.duration)
        if (body.category) updates.category = body.category
        if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive)

        const updatedService = await db.updateProviderService(user.id, id, updates)

        return NextResponse.json(updatedService)
    } catch (error) {
        console.error("[Update Service] Error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

// DELETE /api/services/[id] - Delete service
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(req)
        if (!user || user.role !== "PROVIDER") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { id } = params

        // Verify ownership
        const service = await prisma.service.findUnique({ where: { id } })
        if (!service) {
            return NextResponse.json({ message: "Service not found" }, { status: 404 })
        }

        if (service.providerId !== user.id) {
            return NextResponse.json({ message: "Forbidden: Not your service" }, { status: 403 })
        }

        await db.deleteProviderService(user.id, id)

        return NextResponse.json({ message: "Service deleted successfully" })
    } catch (error) {
        console.error("[Delete Service] Error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
