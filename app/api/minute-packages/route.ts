import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Static minute packages - could be moved to DB later
const MINUTE_PACKAGES = [
    { id: 'pkg_30', minutes: 30, price: 50, name: 'Starter' },
    { id: 'pkg_60', minutes: 60, price: 90, name: 'Basic' },
    { id: 'pkg_120', minutes: 120, price: 160, name: 'Value' },
    { id: 'pkg_300', minutes: 300, price: 350, name: 'Premium' }
]

export async function GET(req: NextRequest) {
    return NextResponse.json(MINUTE_PACKAGES)
}
