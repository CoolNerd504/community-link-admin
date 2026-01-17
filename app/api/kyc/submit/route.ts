import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import { z } from 'zod'

const kycSchema = z.object({
    idFront: z.string().url('Invalid ID Front URL'),
    idBack: z.string().url('Invalid ID Back URL'),
    selfie: z.string().url('Invalid Selfie URL'),
})

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const validatedData = kycSchema.parse(body)

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                kycStatus: 'SUBMITTED',
                kycSubmittedAt: new Date(),
                idFrontUrl: validatedData.idFront,
                idBackUrl: validatedData.idBack,
                selfieUrl: validatedData.selfie
            }
        })

        return NextResponse.json({
            status: updatedUser.kycStatus,
            kycSubmittedAt: updatedUser.kycSubmittedAt
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
        }
        console.error('[KYC Submit API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
