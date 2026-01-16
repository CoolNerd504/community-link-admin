import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { z } from "zod"
import { compare } from "bcryptjs"
import type { NextAuthConfig } from "next-auth"

export const config = {
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    console.log("[Auth] Authorize called with:", { email: credentials?.email })

                    if (!credentials?.email || !credentials?.password) {
                        console.log("[Auth] Missing credentials")
                        return null
                    }

                    const email = credentials.email as string

                    // Find user by email
                    const user = await prisma.user.findUnique({
                        where: { email },
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            password: true,
                            role: true,
                            username: true,
                            kycStatus: true,
                        }
                    })

                    if (!user || !user.password) {
                        console.log("[Auth] User not found or no password")
                        return null
                    }

                    const isValid = await compare(credentials.password as string, user.password)

                    if (!isValid) {
                        console.log("[Auth] Invalid password")
                        return null
                    }

                    // Return user object if valid
                    console.log("[Auth] User authenticated:", user.id)
                    return user
                } catch (error) {
                    console.error("[Auth] Authorize error:", error)
                    throw error
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
                session.user.role = token.role
                session.user.username = token.username as string
                session.user.kycStatus = token.kycStatus as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
                token.role = user.role
                token.username = user.username
                token.kycStatus = user.kycStatus
            }
            return token
        }
    },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
