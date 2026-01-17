import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import { sendNotification } from '@/lib/notifications'
import { NotificationType } from '@prisma/client'

export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const bookings = await prisma.bookingRequest.findMany({
            where: {
                OR: [
                    { clientId: user.id },
                    { service: { providerId: user.id } }
                ]
            },
            include: {
                service: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        duration: true,
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                role: true
                            }
                        }
                    }
                },
                client: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(bookings)
    } catch (error) {
        console.error('[Bookings API] Error:', error)
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
        const { serviceId, date, notes, duration, isInstant } = body

        if (!serviceId) {
            return NextResponse.json({ message: 'Missing serviceId' }, { status: 400 })
        }

        // For scheduled bookings, date is required
        if (!isInstant && !date) {
            return NextResponse.json({ message: 'Date is required for scheduled bookings' }, { status: 400 })
        }

        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        })

        if (!service) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 })
        }

        // Prevent booking your own service
        if (service.providerId === user.id) {
            return NextResponse.json({ message: 'Cannot book your own service' }, { status: 400 })
        }

        // Calculate Price if duration is provided, else use service defaults
        let finalPrice = service.price
        const finalDuration = duration || service.duration

        if (duration) {
            const { calculateDynamicPrice } = await import('@/lib/booking-utils')
            finalPrice = calculateDynamicPrice(service.price, service.duration, duration)
        }

        const bookingData: any = {
            clientId: user.id,
            serviceId,
            notes,
            status: 'PENDING',
            duration: finalDuration,
            price: finalPrice
        }

        if (isInstant) {
            bookingData.isInstant = true
            bookingData.expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 mins expiry
            // Instant bookings might not have a requestedTime initially or set to now
            bookingData.requestedTime = new Date()
        } else {
            bookingData.requestedTime = new Date(date)
        }

        const booking = await prisma.bookingRequest.create({
            data: bookingData,
            include: {
                service: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        duration: true,
                        category: true,
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                email: true,
                                profile: {
                                    select: {
                                        headline: true,
                                        isVerified: true,
                                        bio: true
                                    }
                                }
                            }
                        }
                    }
                },
                client: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    }
                }
            }
        })

        // Send Notification to Provider
        await sendNotification({
            userId: service.providerId,
            type: NotificationType.BOOKING_REQUEST,
            title: "New Booking Request",
            body: `${user.name || 'A client'} sent a request for ${service.title}.`,
            data: { bookingId: booking.id, serviceId: service.id }
        })

        return NextResponse.json({
            message: 'Booking created successfully',
            booking: {
                ...booking,
                service: booking.service,
                client: booking.client
            }
        }, { status: 201 })
    } catch (error) {
        console.error('[Bookings API] Create Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
