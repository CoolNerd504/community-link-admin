import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { currentPin, newPin } = body

        if (!newPin || newPin.length !== 6) {
            return NextResponse.json({ message: 'PIN must be 6 digits' }, { status: 400 })
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { pinHash: true }
        })

        // If user has existing PIN, verify current PIN
        if (dbUser?.pinHash) {
            if (!currentPin) {
                return NextResponse.json({ message: 'Current PIN required' }, { status: 400 })
            }
            const isValid = await bcrypt.compare(currentPin, dbUser.pinHash)
            if (!isValid) {
                return NextResponse.json({ message: 'Current PIN incorrect' }, { status: 400 })
            }
        }

        // Hash and save new PIN
        const hashedPin = await bcrypt.hash(newPin, 10)
        await prisma.user.update({
            where: { id: user.id },
            data: { pinHash: hashedPin }
        })

        return NextResponse.json({ success: true, message: 'PIN updated successfully' })
    } catch (error) {
        console.error('[Change PIN API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
