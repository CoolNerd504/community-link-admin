import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SUPER_ADMIN_KEY = process.env.NEXT_PUBLIC_SUPER_ADMIN_KEY || "COMMLINK_SUPER_2024"

export async function POST(request: NextRequest) {
    try {
        const { email, secretKey } = await request.json()

        // Verify secret key
        if (secretKey !== SUPER_ADMIN_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 })
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Update user role to ADMIN
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
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
        console.error('Error creating admin:', error)
        return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
    }
}
