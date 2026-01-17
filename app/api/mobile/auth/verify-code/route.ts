import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

const verifyCodeSchema = z.object({
    email: z.string().email('Invalid email address'),
    code: z.string().length(6, 'Code must be 6 digits')
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, code } = verifyCodeSchema.parse(body)

        // Find the verification token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: email,
                token: code
            }
        })

        if (!verificationToken) {
            return NextResponse.json({ message: 'Invalid or expired code' }, { status: 400 })
        }

        // Check if token is expired
        if (new Date() > verificationToken.expires) {
            // Clean up expired token
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: email,
                        token: code
                    }
                }
            })
            return NextResponse.json({ message: 'Code has expired. Please request a new one.' }, { status: 400 })
        }

        // Generate a reset token (short-lived, for the reset password step)
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        // Delete the OTP token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: code
                }
            }
        })

        // Create a reset token
        await prisma.verificationToken.create({
            data: {
                identifier: `reset:${email}`,
                token: resetToken,
                expires: resetExpires
            }
        })

        return NextResponse.json({
            verified: true,
            resetToken,
            message: 'Code verified successfully. You can now reset your password.'
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
        }
        console.error('[Verify Code API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
