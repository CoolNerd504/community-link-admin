import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const provider = await prisma.user.findUnique({
            where: {
                id: id,
                role: 'PROVIDER'
            },
            include: {
                profile: true,
                providerServices: {
                    where: {
                        isActive: true
                    },
                    orderBy: {
                        price: 'asc'
                    }
                },
                providerReviews: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10,
                    include: {
                        client: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        })

        if (!provider) {
            return NextResponse.json({ message: 'Provider not found' }, { status: 404 })
        }

        // Calculate aggregate rating
        const reviewCount = provider.providerReviews.length
        const totalRating = provider.providerReviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0

        const responseData = {
            id: provider.id,
            name: provider.name,
            email: provider.email,
            image: provider.image,
            role: provider.role,
            username: provider.username,
            kycStatus: provider.kycStatus,
            rating: parseFloat(averageRating.toFixed(1)),
            reviewCount: reviewCount,
            profile: provider.profile,
            providerServices: provider.providerServices,
            providerReviews: provider.providerReviews
        }

        return NextResponse.json(responseData)
    } catch (error) {
        console.error('[Provider Detail API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
