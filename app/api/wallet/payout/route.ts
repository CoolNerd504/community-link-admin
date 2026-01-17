import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import { TransactionType, TransactionStatus, PayoutStatus } from '@prisma/client'

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { amount, bankDetails } = body

        if (!amount || amount <= 0 || !bankDetails) {
            return NextResponse.json({ message: 'Invalid amount or bank details' }, { status: 400 })
        }

        const wallet = await prisma.wallet.findUnique({
            where: { userId: user.id }
        })

        if (!wallet || wallet.balance < amount) {
            return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 })
        }

        const payoutRequest = await prisma.$transaction(async (tx) => {
            // Deduct from balance
            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: { decrement: amount } }
            })

            // Create Transaction Record
            await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount: amount,
                    type: TransactionType.WITHDRAWAL,
                    status: TransactionStatus.PENDING,
                    description: 'Payout Request'
                }
            })

            // Create Payout Request
            return await tx.payoutRequest.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    status: PayoutStatus.PENDING,
                    bankDetails
                }
            })
        })

        return NextResponse.json({
            id: payoutRequest.id,
            amount: payoutRequest.amount,
            status: payoutRequest.status,
            message: 'Payout request submitted.'
        }, { status: 201 })
    } catch (error) {
        console.error('[Payout API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
