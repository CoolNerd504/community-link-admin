import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helpers"
import * as db from "@/lib/db-operations"

// GET /api/me - Get current authenticated user profile
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const profile = await db.getUserProfile(user.id)
        if (!profile) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        return NextResponse.json(profile)
    } catch (error) {
        console.error("[API /me] GET error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
