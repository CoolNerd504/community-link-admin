import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import { z } from 'zod'

const reviewSchema = z.object({
    sessionId: z.string().min(1, 'Session ID is required'),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional()
})

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const validatedData = reviewSchema.parse(body)

        // Find the session and verify ownership
        const session = await prisma.appSession.findUnique({
            where: { id: validatedData.sessionId },
            include: { review: true }
        })

        if (!session) {
            return NextResponse.json({ message: 'Session not found' }, { status: 404 })
        }

        if (session.clientId !== user.id) {
            return NextResponse.json({ message: 'Unauthorized: Only the client who booked the session can review it' }, { status: 403 })
        }

        if (session.status !== 'COMPLETED') {
            return NextResponse.json({ message: 'Only completed sessions can be reviewed' }, { status: 400 })
        }

        if (session.review) {
            return NextResponse.json({ message: 'This session has already been reviewed' }, { status: 400 })
        }

        // Create the review
        const review = await prisma.review.create({
            data: {
                sessionId: session.id,
                clientId: session.clientId,
                providerId: session.providerId,
                rating: validatedData.rating,
                comment: validatedData.comment
            }
        })

        return NextResponse.json({
            id: review.id,
            createdAt: review.createdAt
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 })
        }
        console.error('[Reviews API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
