import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helpers"
import * as db from "@/lib/db-operations"

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const profile = await db.getUserProfile(user.id)
        if (!profile) {
            return NextResponse.json({ message: "Profile not found" }, { status: 404 })
        }

        return NextResponse.json(profile)
    } catch (error) {
        console.error("[Mobile Profile] GET error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const updates = await req.json()

        console.log("[Mobile Profile] Updating profile for:", user.id, updates)

        await db.updateUserProfile(user.id, updates)

        // Fetch updated profile to return full object including nested profile data
        const updatedProfile = await db.getUserProfile(user.id)

        return NextResponse.json(updatedProfile)
    } catch (error) {
        console.error("[Mobile Profile] PATCH error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
