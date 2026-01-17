import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

// POST /api/providers/[id]/favorite - Favorite a provider
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id: providerId } = await params

    if (user.id === providerId) {
        return NextResponse.json({ message: "Cannot favorite yourself" }, { status: 400 })
    }

    try {
        await prisma.favorite.create({
            data: {
                userId: user.id,
                providerId: providerId
            }
        })
        return NextResponse.json({ message: "Favorited successfully" })
    } catch (error) {
        // Unique constraint failed means already favorited
        return NextResponse.json({ message: "Already favorited" }, { status: 200 })
    }
}

// DELETE /api/providers/[id]/favorite - Unfavorite a provider
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id: providerId } = await params

    try {
        await prisma.favorite.deleteMany({
            where: {
                userId: user.id,
                providerId: providerId
            }
        })
        return NextResponse.json({ message: "Unfavorited successfully" })
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
