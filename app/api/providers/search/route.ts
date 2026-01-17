import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getUserFromRequest(req)
        const { searchParams } = new URL(req.url)
        const query = searchParams.get('q') || ''
        const category = searchParams.get('category')
        const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
        const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined

        const whereClause: any = {
            role: "PROVIDER",
            kycStatus: "APPROVED", // Only show approved providers
            OR: query ? [
                { name: { contains: query, mode: 'insensitive' } },
                {
                    providerServices: {
                        some: {
                            isApproved: true,
                            title: { contains: query, mode: 'insensitive' }
                        }
                    }
                }
            ] : undefined
        }

        // Apply Service-level filters
        if (category || minPrice !== undefined || maxPrice !== undefined) {
            whereClause.providerServices = {
                some: {
                    isApproved: true,
                    isActive: true,
                    ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
                    ...(minPrice !== undefined ? { price: { gte: minPrice } } : {}),
                    ...(maxPrice !== undefined ? { price: { lte: maxPrice } } : {})
                }
            }
        }

        // Fetch providers
        const providers = await prisma.user.findMany({
            where: whereClause,
            include: {
                profile: true,
                providerServices: {
                    where: {
                        isActive: true,
                        isApproved: true
                    }
                },
                providerReviews: true,
                ...(currentUser ? {
                    favoritedBy: {
                        where: { userId: currentUser.id }
                    },
                    followers: {
                        where: { followerId: currentUser.id }
                    }
                } : {})
            }
        })

        // Calculate generic rating and format response
        const formattedProviders = providers.map(p => {
            const reviews = p.providerReviews || []
            const rating = reviews.length > 0
                ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                : 0

            return {
                id: p.id,
                name: p.name,
                email: p.email,
                image: p.image,
                role: p.role,
                username: p.username,
                kycStatus: p.kycStatus,
                rating: parseFloat(rating.toFixed(1)),
                reviewCount: reviews.length,
                profile: p.profile,
                providerServices: p.providerServices,
                isFavorite: currentUser ? (p.favoritedBy?.length ?? 0) > 0 : false,
                isFollowing: currentUser ? (p.followers?.length ?? 0) > 0 : false
            }
        })

        return NextResponse.json(formattedProviders)
    } catch (error) {
        console.error('[Providers Search API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
