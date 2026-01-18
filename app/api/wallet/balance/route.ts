import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const wallet = await prisma.wallet.findUnique({
            where: { userId: user.id }
        })

        return NextResponse.json({
            balance: wallet?.balance || 0,
            availableMinutes: wallet?.availableMinutes || 0
        })
    } catch (error) {
        console.error('[Wallet Balance API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
