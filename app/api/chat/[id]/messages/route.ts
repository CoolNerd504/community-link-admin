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

    const { id: chatRoomId } = params

    try {
        // Verify chat room access
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
            include: { session: true }
        })

        if (!chatRoom) {
            return NextResponse.json({ message: 'Chat room not found' }, { status: 404 })
        }

        const isParticipant = chatRoom.session.clientId === user.id || chatRoom.session.providerId === user.id
        if (!isParticipant) {
            return NextResponse.json({ message: 'Unauthorized: You are not a participant in this chat' }, { status: 403 })
        }

        // Fetch messages
        const messages = await prisma.message.findMany({
            where: { chatRoomId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                senderId: true,
                content: true,
                isRead: true,
                createdAt: true
            }
        })

        return NextResponse.json(messages)

    } catch (error) {
        console.error('[Chat API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
