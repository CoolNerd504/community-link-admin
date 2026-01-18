import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, addDays, format, parseISO, setHours, setMinutes } from 'date-fns'

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: providerId } = params
        const { searchParams } = new URL(req.url)
        const dateParam = searchParams.get('date') // ISO string or YYYY-MM-DD
        const daysParam = parseInt(searchParams.get('days') || '7')

        if (!dateParam) {
            return NextResponse.json({ message: "Date parameter is required" }, { status: 400 })
        }

        const startDate = parseISO(dateParam)
        const endDate = addDays(startDate, daysParam)

        // 1. Fetch Existing Bookings (Pending/Accepted)
        // We only care about blocking, so status PENDING or ACCEPTED
        const existingBookings = await prisma.bookingRequest.findMany({
            where: {
                service: { providerId },
                status: { in: ['PENDING', 'ACCEPTED'] },
                requestedTime: {
                    gte: startOfDay(startDate),
                    lt: endOfDay(endDate)
                }
            },
            select: { requestedTime: true, duration: true }
        })

        // Also fetch AppSessions (Confirmed/Active sessions that might not check BookingRequest?)
        // Usually BookingRequest becomes AppSession. But for safety check both or just BookingRequest if it covers all.
        // If AppSession exists, BookingRequest is likely ACCEPTED. So filtering BookingRequest is usually sufficient.
        // But if manual sessions exist?
        const conflictingSessions = await prisma.appSession.findMany({
            where: {
                providerId,
                status: { in: ['SCHEDULED', 'ACTIVE'] },
                startTime: {
                    gte: startOfDay(startDate),
                    lt: endOfDay(endDate)
                }
            },
            select: { startTime: true, endTime: true }
        })

        // Generate Slots
        const availability = []

        // Define working hours (e.g. 9 AM to 5 PM)
        const WORK_START = 9
        const WORK_END = 17
        const SLOT_INTERVAL = 30 // minutes

        for (let i = 0; i < daysParam; i++) {
            const currentDate = addDays(startDate, i)
            const dateStr = format(currentDate, 'yyyy-MM-dd')
            const slots = []

            let slotTime = setMinutes(setHours(currentDate, WORK_START), 0)
            const endTime = setMinutes(setHours(currentDate, WORK_END), 0)

            while (slotTime < endTime) {
                // Check conflicts
                const isConflict = checkConflict(slotTime, existingBookings, conflictingSessions)

                if (!isConflict) {
                    slots.push(format(slotTime, 'HH:mm'))
                }

                slotTime = new Date(slotTime.getTime() + SLOT_INTERVAL * 60000)
            }

            availability.push({
                date: dateStr,
                isAvailable: slots.length > 0,
                slots
            })
        }

        return NextResponse.json({
            providerId,
            availability
        })

    } catch (error) {
        console.error('[Availability API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

function checkConflict(slotTime: Date, bookings: any[], sessions: any[]) {
    // Simple check: Is slotTime inside any booking range?
    // Or does any booking start at slotTime?
    // Assuming 30 min slots. logic can be more complex.

    // Check Bookings
    for (const b of bookings) {
        if (!b.requestedTime) continue
        const bStart = b.requestedTime.getTime()
        // Default duration 60 if missing?
        const bDuration = b.duration || 60
        const bEnd = bStart + bDuration * 60000

        if (slotTime.getTime() >= bStart && slotTime.getTime() < bEnd) return true
    }

    // Check Sessions
    for (const s of sessions) {
        const sStart = s.startTime.getTime()
        // If endTime is null, assume 60 mins
        const sEnd = s.endTime ? s.endTime.getTime() : sStart + 60 * 60000

        if (slotTime.getTime() >= sStart && slotTime.getTime() < sEnd) return true
    }

    return false
}
