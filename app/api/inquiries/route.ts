import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth-helpers'
import * as db from '@/lib/db-operations'

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { providerId } = body

        if (!providerId) {
            return NextResponse.json({ message: 'Provider ID required' }, { status: 400 })
        }

        const sessionResult = await db.createInquirySession(user.id, providerId)

        return NextResponse.json({
            sessionId: sessionResult.id,
            message: 'Inquiry session created'
        }, { status: 201 })
    } catch (error) {
        console.error('[Inquiry API] Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
