import { NextRequest } from 'next/server'
import { decode } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

/**
 * Extract and verify JWT token from Authorization header or cookie
 * Supports both Bearer token (mobile) and cookie-based auth (web)
 */
export async function getUserFromRequest(req: NextRequest) {
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    if (!secret) {
        throw new Error('AUTH_SECRET not configured')
    }

    // Check for Bearer token first (mobile apps)
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        try {
            const decoded = await decode({ token, secret })
            if (decoded && decoded.sub) {
                return {
                    id: decoded.sub as string,
                    email: decoded.email as string,
                    name: decoded.name as string,
                    role: decoded.role as string,
                    username: decoded.username as string,
                    kycStatus: decoded.kycStatus as string,
                }
            }
        } catch (error) {
            console.error('[Auth Helper] Invalid bearer token:', error)
            return null
        }
    }

    // Fallback to session cookie (web browsers)
    const sessionToken = req.cookies.get('authjs.session-token')?.value ||
        req.cookies.get('next-auth.session-token')?.value

    if (sessionToken) {
        try {
            const decoded = await decode({ token: sessionToken, secret })
            if (decoded && decoded.sub) {
                return {
                    id: decoded.sub as string,
                    email: decoded.email as string,
                    name: decoded.name as string,
                    role: decoded.role as string,
                    username: decoded.username as string,
                    kycStatus: decoded.kycStatus as string,
                }
            }
        } catch (error) {
            console.error('[Auth Helper] Invalid session token:', error)
            return null
        }
    }

    return null
}

/**
 * Middleware helper to require authentication
 */
export async function requireAuth(req: NextRequest) {
    const user = await getUserFromRequest(req)
    if (!user) {
        throw new Error('Unauthorized')
    }
    return user
}
