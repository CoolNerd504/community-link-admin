import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import { z } from 'zod'

const rescheduleSchema = z.object({
    requestedTime: z.string().datetime('Invalid date format'),
    reason: z.string().optional()
})

// PATCH /api/bookings/[id]/reschedule - Request reschedule (resets to PENDING)
export async function PATCH(
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
        const { requestedTime, reason } = rescheduleSchema.parse(body)

        // Find the booking
        const booking = await prisma.bookingRequest.findUnique({
            where: { id: bookingId },
            include: { service: true }
        })

        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 })
        }

        // Check if user is the client or provider
        const isClient = booking.clientId === user.id
        const isProvider = booking.service.providerId === user.id

        if (!isClient && !isProvider) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
        }

        // Update booking with new time and reset status to PENDING
        const updatedBooking = await prisma.bookingRequest.update({
            where: { id: bookingId },
            data: {
                requestedTime: new Date(requestedTime),
                status: 'PENDING',
                notes: reason ? `Reschedule request: ${reason}` : booking.notes
            },
            include: {
                service: {
                    include: { provider: { select: { id: true, name: true, image: true } } }
                },
                client: { select: { id: true, name: true, image: true } }
            }
        })

        return NextResponse.json({
            message: 'Reschedule request submitted. Awaiting provider approval.',
            booking: updatedBooking
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
        }
        console.error('[Reschedule Booking API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
