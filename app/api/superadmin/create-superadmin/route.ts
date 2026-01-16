import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const SUPER_ADMIN_KEY = process.env.NEXT_PUBLIC_SUPER_ADMIN_KEY || "COMMLINK_SUPER_2024"

export async function POST(request: NextRequest) {
    try {
        const { email, phoneNumber, password, secretKey } = await request.json()

        // Verify secret key
        if (secretKey !== SUPER_ADMIN_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!email || !phoneNumber || !password) {
            return NextResponse.json({ error: 'Email, phone number, and password are required' }, { status: 400 })
        }

        // Check if super admin already exists
        const existingSuperAdmin = await prisma.user.findFirst({
            where: { role: 'SUPER_ADMIN' }
        })

        if (existingSuperAdmin) {
            return NextResponse.json({ error: 'Super Admin already exists' }, { status: 400 })
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create super admin user
        const superAdmin = await prisma.user.create({
            data: {
                email,
                phoneNumber,
                password: hashedPassword,
                name: 'Super Administrator',
                role: 'SUPER_ADMIN',
                phoneVerified: true,
                isActive: true
            }
        })

        return NextResponse.json({
            success: true,
            user: {
                id: superAdmin.id,
                name: superAdmin.name,
                email: superAdmin.email,
                phoneNumber: superAdmin.phoneNumber,
                role: superAdmin.role
            }
        })
    } catch (error) {
        console.error('Error creating super admin:', error)
        return NextResponse.json({ error: 'Failed to create super admin' }, { status: 500 })
    }
}
