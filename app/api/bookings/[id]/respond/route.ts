import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import { BookingStatus, AppSessionStatus } from '@prisma/client'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params

    try {
        const body = await req.json()
        const { status, suggestedTime } = body

        if (!['accepted', 'declined', 'suggest_alternative'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 })
        }

        if (status === 'suggest_alternative' && !suggestedTime) {
            return NextResponse.json({ message: 'suggestedTime is required for suggest_alternative' }, { status: 400 })
        }

        // Verify ownership (service provider must be the current user)
        const booking = await prisma.bookingRequest.findUnique({
            where: { id: bookingId },
            include: { service: true }
        })

        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 })
        }

        if (booking.service.providerId !== user.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
        }

        // Handle suggest_alternative - update time and keep PENDING
        if (status === 'suggest_alternative') {
            const updatedBooking = await prisma.bookingRequest.update({
                where: { id: bookingId },
                data: {
                    requestedTime: new Date(suggestedTime),
                    status: BookingStatus.PENDING,
                    notes: `Provider suggested alternative time: ${suggestedTime}`
                },
                include: {
                    service: { include: { provider: { select: { id: true, name: true } } } },
                    client: { select: { id: true, name: true } }
                }
            })
            return NextResponse.json({
                message: 'Alternative time suggested. Awaiting client confirmation.',
                booking: updatedBooking
            })
        }

        const updatedBooking = await prisma.$transaction(async (tx) => {
            const updated = await tx.bookingRequest.update({
                where: { id: bookingId },
                data: {
                    status: status === 'accepted' ? BookingStatus.ACCEPTED : BookingStatus.DECLINED
                }
            })

            if (status === 'accepted') {
                // Create session
                const duration = booking.duration || booking.service.duration
                const startTime = booking.requestedTime || new Date()
                const endTime = new Date(startTime.getTime() + duration * 60000)

                await tx.appSession.create({
                    data: {
                        clientId: booking.clientId,
                        providerId: user.id,
                        status: AppSessionStatus.SCHEDULED,
                        startTime: startTime,
                        endTime: endTime,
                        price: booking.price || booking.service.price,
                    }
                })
            }

            return updated
        })

        return NextResponse.json(updatedBooking)
    } catch (error) {
        console.error('[Booking Response API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

