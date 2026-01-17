import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'

export async function GET(
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
        const appSession = await prisma.appSession.findUnique({
            where: { id: sessionId },
            include: {
                provider: {
                    select: { id: true, name: true, image: true, role: true }
                },
                client: {
                    select: { id: true, name: true, image: true }
                },
                chatRoom: true
            }
        })

        if (!appSession) {
            return NextResponse.json({ message: 'Session not found' }, { status: 404 })
        }

        // Security check
        if (appSession.clientId !== user.id && appSession.providerId !== user.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
        }

        return NextResponse.json(appSession)
    } catch (error) {
        console.error('[Session API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
