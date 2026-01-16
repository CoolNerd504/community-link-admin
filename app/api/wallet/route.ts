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
            where: { userId: user.id },
            include: {
                minutePurchases: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5
                },
                minuteUsage: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5
                }
            }
        })

        if (!wallet) {
            // Create wallet if it doesn't exist (should have been created on register but safety check)
            const newWallet = await prisma.wallet.create({
                data: { userId: user.id }
            })
            return NextResponse.json(newWallet)
        }

        return NextResponse.json(wallet)
    } catch (error) {
        console.error('[Wallet API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
