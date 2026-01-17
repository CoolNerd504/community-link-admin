import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.id
    if (!sessionId) {
        return NextResponse.json({ message: 'Session ID required' }, { status: 400 })
    }

    try {
        const body = await req.json()
        const { newStartTime } = body

        if (!newStartTime) {
            return NextResponse.json({ message: 'newStartTime is required' }, { status: 400 })
        }

        const appSession = await prisma.appSession.findUnique({
            where: { id: sessionId }
        })

        if (!appSession) {
            return NextResponse.json({ message: 'Session not found' }, { status: 404 })
        }

        // Security check
        if (appSession.clientId !== user.id && appSession.providerId !== user.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
        }

        // Check 15 min rule
        const now = new Date()
        const currentStartTime = new Date(appSession.startTime)
        const diffMins = (currentStartTime.getTime() - now.getTime()) / 60000

        if (diffMins <= 15) {
            return NextResponse.json({ message: 'Cannot reschedule within 15 minutes of start time' }, { status: 400 })
        }

        // Calculate new End Time (preserve duration)
        let newEndTime = null
        const newStart = new Date(newStartTime)

        if (appSession.endTime) {
            const duration = appSession.endTime.getTime() - currentStartTime.getTime()
            if (duration > 0) {
                newEndTime = new Date(newStart.getTime() + duration)
            }
        }

        const updatedSession = await prisma.appSession.update({
            where: { id: sessionId },
            data: {
                startTime: newStart,
                endTime: newEndTime,
                status: 'SCHEDULED'
            }
        })

        return NextResponse.json(updatedSession)
    } catch (error) {
        console.error('[Session Reschedule API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
