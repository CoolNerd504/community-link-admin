import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Get all active categories with their subcategories
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
                parentId: null, // Only get top-level categories
            },
            include: {
                children: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        name: 'asc',
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        return NextResponse.json({
            categories: categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                description: cat.description,
                icon: cat.icon,
                subcategories: cat.children.map(sub => ({
                    id: sub.id,
                    name: sub.name,
                    description: sub.description,
                    icon: sub.icon,
                })),
            })),
            count: categories.length,
        })
    } catch (error) {
        console.error('[Categories API] Error:', error)
        return NextResponse.json(
            { message: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}
