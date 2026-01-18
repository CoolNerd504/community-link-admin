import 'dotenv/config'
import { prisma } from './lib/prisma'

async function main() {
    console.log("Starting backfill of AppSession.serviceId...")

    // Fetch sessions without serviceId
    const sessions = await prisma.appSession.findMany({
        where: { serviceId: null },
    })

    console.log(`Found ${sessions.length} sessions to check.`)

    let updatedCount = 0

    for (const session of sessions) {
        // Try to find a matching booking
        // - Same Client
        // - Same Provider (via Service)
        // - Approx same time (within 1 min)
        // - Accepted status

        const booking = await prisma.bookingRequest.findFirst({
            where: {
                clientId: session.clientId,
                service: { providerId: session.providerId },
                status: 'ACCEPTED',
                // Time matching is tricky if exact times differ slightly.
                // But typically they are created with exact same Date object in the code.
                // Let's try exact match first.
                // requestedTime match session.startTime?
                // In respond/route.ts: const startTime = booking.requestedTime || new Date()
                // So if requestedTime was null, it uses 'now'.

                // Let's match roughly by Date (ignoring milliseconds potentially) if exact fails?
                // Or just match by Client+Provider and closest time?
            },
            include: { service: true }
        })

        // If we found a booking, check if times align
        if (booking) {
            // In a real scenario with multiple bookings, we'd need tighter time checks.
            // For now, let's assume if we found one accepted booking for this pair, it's a candidate.
            // But checking time is safer.
            const timeDiff = Math.abs(booking.requestedTime?.getTime()! - session.startTime.getTime())
            const isTimeMatch = timeDiff < 60000 // 1 minute

            if (isTimeMatch || !booking.requestedTime) {
                await prisma.appSession.update({
                    where: { id: session.id },
                    data: { serviceId: booking.serviceId }
                })
                updatedCount++
                console.log(`Updated Session ${session.id} with Service ${booking.serviceId} (Booking ${booking.id})`)
            } else {
                // Try to find looser match?
                // Let's verify time diff
                // console.log(`Session ${session.id} skipped. Time diff: ${timeDiff/1000}s`)
            }
        }
    }

    console.log(`Backfill complete. Updated ${updatedCount} sessions.`)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
