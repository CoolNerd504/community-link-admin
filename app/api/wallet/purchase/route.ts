import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { packageId, paymentMethod = 'MOBILE_MONEY' } = body

        if (!packageId) {
            return NextResponse.json({ message: 'Package ID required' }, { status: 400 })
        }

        const pkg = await prisma.minutePackage.findUnique({
            where: { id: packageId }
        })

        if (!pkg) {
            return NextResponse.json({ message: 'Package not found' }, { status: 404 })
        }

        // Ensure wallet exists
        let wallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
        if (!wallet) {
            // Verify user exists first to prevent FK constraint errors
            const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
            if (!dbUser) {
                return NextResponse.json({ message: 'User account not found or stale token' }, { status: 401 })
            }
            wallet = await prisma.wallet.create({ data: { userId: user.id } })
        }

        // Transaction: Create Purchase & Update Wallet
        const purchase = await prisma.$transaction(async (tx) => {
            // 1. Create Purchase
            const record = await tx.minutePurchase.create({
                data: {
                    walletId: wallet.id,
                    packageName: pkg.name,
                    minutesPurchased: pkg.minutes,
                    priceZMW: pkg.priceZMW,
                    paymentMethod,
                    paymentStatus: 'COMPLETED', // Simulating instant completion
                    transactionRef: `REF-${Date.now()}`
                }
            })

            // 2. Update Wallet
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    totalMinutesPurchased: { increment: pkg.minutes },
                    availableMinutes: { increment: pkg.minutes }
                }
            })

            return record
        })

        return NextResponse.json(purchase, { status: 201 })
    } catch (error) {
        console.error('[Purchase API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
