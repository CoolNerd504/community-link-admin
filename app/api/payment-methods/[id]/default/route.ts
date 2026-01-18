import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const method = await prisma.paymentMethod.findUnique({
            where: { id: params.id }
        })

        if (!method || method.userId !== user.id) {
            return NextResponse.json({ message: 'Not found' }, { status: 404 })
        }

        // Unset all other defaults
        await prisma.paymentMethod.updateMany({
            where: { userId: user.id },
            data: { isDefault: false }
        })

        // Set this one as default
        await prisma.paymentMethod.update({
            where: { id: params.id },
            data: { isDefault: true }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[Payment Method Default API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
