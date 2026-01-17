import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
    resetToken: z.string().min(1, 'Reset token is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character')
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, resetToken, newPassword } = resetPasswordSchema.parse(body)

        // Find the reset token
        const tokenRecord = await prisma.verificationToken.findFirst({
            where: {
                identifier: `reset:${email}`,
                token: resetToken
            }
        })

        if (!tokenRecord) {
            return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 })
        }

        // Check if token is expired
        if (new Date() > tokenRecord.expires) {
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: `reset:${email}`,
                        token: resetToken
                    }
                }
            })
            return NextResponse.json({ message: 'Reset token has expired. Please start over.' }, { status: 400 })
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12)

        // Update user password
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword
            }
        })

        // Delete the reset token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: `reset:${email}`,
                    token: resetToken
                }
            }
        })

        return NextResponse.json({
            message: 'Password reset successfully. You can now log in with your new password.'
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
        }
        console.error('[Reset Password API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
