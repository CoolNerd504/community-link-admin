import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        const following = await prisma.follow.findMany({
            where: {
                followerId: user.id
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        profile: {
                            select: {
                                headline: true,
                                bio: true,
                                location: true,
                                isVerified: true,
                                isOnline: true,
                                hourlyRate: true,
                                interests: true
                            }
                        }
                    }
                }
            }
        })

        // Format for mobile app
        const formatted = following.map(item => {
            const provider = item.following
            return {
                id: provider.id,
                name: provider.name,
                image: provider.image,
                headline: provider.profile?.headline,
                bio: provider.profile?.bio,
                location: provider.profile?.location,
                isVerified: provider.profile?.isVerified,
                isOnline: provider.profile?.isOnline,
                hourlyRate: provider.profile?.hourlyRate,
                interests: provider.profile?.interests || []
            }
        })

        return NextResponse.json(formatted)
    } catch (error) {
        console.error("[Following API] Error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
