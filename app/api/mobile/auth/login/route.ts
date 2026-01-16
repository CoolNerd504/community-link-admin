import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { encode } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, password } = body

        console.log('[Mobile Auth] Login attempt:', { email })

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                password: true,
                role: true,
                username: true,
                kycStatus: true,
            }
        })

        if (!user || !user.password) {
            console.log('[Mobile Auth] User not found or no password')
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Verify password
        const isValid = await compare(password, user.password)

        if (!isValid) {
            console.log('[Mobile Auth] Invalid password')
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Generate JWT token
        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
        if (!secret) {
            console.error('[Mobile Auth] AUTH_SECRET not configured')
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

        console.log('[Mobile Auth] User authenticated:', user.id)

        // Return user data and token
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
        })
    } catch (error) {
        console.error('[Mobile Auth] Login error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
