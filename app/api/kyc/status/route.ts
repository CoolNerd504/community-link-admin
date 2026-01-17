import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                kycStatus: true,
                kycSubmittedAt: true,
                kycVerifiedAt: true,
                kycRejectionReason: true
            }
        })

        if (!dbUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            status: dbUser.kycStatus,
            kycSubmittedAt: dbUser.kycSubmittedAt,
            kycVerifiedAt: dbUser.kycVerifiedAt,
            kycRejectionReason: dbUser.kycRejectionReason
        })
    } catch (error) {
        console.error('[KYC Status API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
