import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const packages = await prisma.minutePackage.findMany({
            where: { isActive: true },
            orderBy: { priceZMW: 'asc' }
        })

        return NextResponse.json(packages)
    } catch (error) {
        console.error('[Packages API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
