import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address')
})

// Generate a random 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email } = forgotPasswordSchema.parse(body)

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // Don't reveal if user exists or not for security
            return NextResponse.json({
                message: 'If an account with that email exists, a recovery code has been sent.'
            })
        }

        // Generate OTP
        const otp = generateOTP()
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        // Delete any existing tokens for this email
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        })

        // Store the OTP
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: otp,
                expires: expiresAt
            }
        })

        // TODO: Send email with OTP
        // For now, log it (in production, integrate with email service)
        console.log(`[Forgot Password] OTP for ${email}: ${otp}`)

        return NextResponse.json({
            message: 'If an account with that email exists, a recovery code has been sent.',
            // DEV ONLY - remove in production
            ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
        }
        console.error('[Forgot Password API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
