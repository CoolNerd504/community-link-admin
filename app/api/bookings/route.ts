import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

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
        const { serviceId, date, notes } = body

        if (!serviceId || !date) {
            return NextResponse.json({ message: 'Missing serviceId or date' }, { status: 400 })
        }

        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        })

        if (!service) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 })
        }

        // Prevent booking your own service?
        if (service.providerId === user.id) {
            return NextResponse.json({ message: 'Cannot book your own service' }, { status: 400 })
        }

        const booking = await prisma.bookingRequest.create({
            data: {
                clientId: user.id,
                serviceId,
                requestedTime: new Date(date),
                notes,
                status: 'PENDING'
            },
            include: {
                service: {
                    select: { title: true }
                },
                client: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json(booking, { status: 201 })
    } catch (error) {
        console.error('[Bookings API] Create Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
