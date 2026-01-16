import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SUPER_ADMIN_KEY = process.env.NEXT_PUBLIC_SUPER_ADMIN_KEY || "COMMLINK_SUPER_2024"

export async function POST(request: NextRequest) {
    try {
        const { userId, secretKey } = await request.json()

        // Verify secret key
        if (secretKey !== SUPER_ADMIN_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        // Update user role to ADMIN
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: 'ADMIN' }
        })

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        })
    } catch (error) {
        console.error('Error promoting user:', error)
        return NextResponse.json({ error: 'Failed to promote user' }, { status: 500 })
    }
}
