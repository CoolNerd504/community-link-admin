import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth-helpers'
import { z } from 'zod'

const profileUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    headline: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    languages: z.array(z.string()).optional(),
})

export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                profile: true
            }
        })

        if (!dbUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(dbUser)
    } catch (error) {
        console.error('[Profile API] GET Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const validatedData = profileUpdateSchema.parse(body)

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: validatedData.name,
                profile: {
                    update: {
                        headline: validatedData.headline,
                        bio: validatedData.bio,
                        location: validatedData.location,
                        languages: validatedData.languages
                    }
                }
            },
            include: {
                profile: true
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
        }
        console.error('[Profile API] PATCH Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
