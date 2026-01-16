import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { encode } from 'next-auth/jwt'
import { z } from 'zod'

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['USER', 'PROVIDER']),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    pin: z.string().length(6, 'PIN must be exactly 6 digits'),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        console.log('[Mobile Register] Registration attempt:', {
            email: body.email,
            role: body.role
        })

        // Validate input
        const validatedData = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { username: validatedData.username },
                    { phoneNumber: validatedData.phoneNumber },
                ],
            },
        })

        if (existingUser) {
            const field = existingUser.email === validatedData.email
                ? 'Email'
                : existingUser.username === validatedData.username
                    ? 'Username'
                    : 'Phone number'

            return NextResponse.json(
                { message: `${field} already registered` },
                { status: 409 }
            )
        }

        // Hash password and PIN
        const hashedPassword = await hash(validatedData.password, 12)
        const hashedPin = await hash(validatedData.pin, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                role: validatedData.role,
                username: validatedData.username,
                phoneNumber: validatedData.phoneNumber,
                pinHash: hashedPin,
                profile: {
                    create: {
                        isVerified: false,
                        vettingStatus: validatedData.role === 'PROVIDER' ? 'PENDING' : 'APPROVED',
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                username: true,
                kycStatus: true,
            },
        })

        // Generate JWT token
        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
        if (!secret) {
            console.error('[Mobile Register] AUTH_SECRET not configured')
            return NextResponse.json(
                { message: 'Server configuration error' },
                { status: 500 }
            )
        }

        const token = await encode({
            token: {
                sub: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                username: user.username,
                kycStatus: user.kycStatus,
            },
            secret,
            salt: 'authjs.session-token',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        })

        console.log('[Mobile Register] User registered:', user.id)

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                username: user.username,
                kycStatus: user.kycStatus,
                image: user.image,
            },
            token,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('[Mobile Register] Registration error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
