import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import { z } from 'zod'

const messageSchema = z.object({
    chatRoomId: z.string().min(1, 'Chat Room ID is required'),
    content: z.string().min(1, 'Content is required')
})

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const validatedData = messageSchema.parse(body)

        // Verify the chat room exists and the user is a participant
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: validatedData.chatRoomId },
            include: {
                session: true
            }
        })

        if (!chatRoom) {
            return NextResponse.json({ message: 'Chat room not found' }, { status: 404 })
        }

        const isParticipant = chatRoom.session.clientId === user.id || chatRoom.session.providerId === user.id
        if (!isParticipant) {
            return NextResponse.json({ message: 'Unauthorized: You are not a participant in this chat' }, { status: 403 })
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                chatRoomId: chatRoom.id,
                senderId: user.id,
                content: validatedData.content
            }
        })

        return NextResponse.json({
            id: message.id,
            isRead: message.isRead
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 })
        }
        console.error('[Chat API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
