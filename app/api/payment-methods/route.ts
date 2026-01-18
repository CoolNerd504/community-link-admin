import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const methods = await prisma.paymentMethod.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(methods)
    } catch (error) {
        console.error('[Payment Methods API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { type, phone, bankName, accountNumber } = body

        // Determine name and lastFour based on type
        let name = ''
        let lastFour = ''

        if (type === 'MOBILE_MONEY') {
            name = `Mobile Money (${phone?.slice(-4) || '****'})`
            lastFour = phone?.slice(-4) || ''
        } else if (type === 'BANK') {
            name = bankName || 'Bank Account'
            lastFour = accountNumber?.slice(-4) || ''
        }

        // Check if this is the first method
        const existingMethods = await prisma.paymentMethod.count({
            where: { userId: user.id }
        })

        const method = await prisma.paymentMethod.create({
            data: {
                userId: user.id,
                type,
                name,
                lastFour,
                isDefault: existingMethods === 0, // First method is default
                details: JSON.stringify({ phone, bankName, accountNumber })
            }
        })

        return NextResponse.json(method)
    } catch (error) {
        console.error('[Payment Methods API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
