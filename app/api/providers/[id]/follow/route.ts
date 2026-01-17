import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import * as db from '@/lib/db-operations'

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const providerId = params.id
    if (!providerId) {
        return NextResponse.json({ message: 'Provider ID missing' }, { status: 400 })
    }

    try {
        const isFollowing = await db.isFollowing(user.id, providerId)

        if (isFollowing) {
            await db.unfollowUser(user.id, providerId)
            return NextResponse.json({ isFollowing: false, message: 'Unfollowed' })
        } else {
            await db.followUser(user.id, providerId)
            return NextResponse.json({ isFollowing: true, message: 'Followed' })
        }
    } catch (error) {
        console.error('[Follow API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
