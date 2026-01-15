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
                if (!credentials?.email || !credentials?.password) {
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
                    }
                })

                if (!user || !user.password) {
                    // Verify if we want to allow login failure or implicit registration? 
                    // Usually login failure. Registration handles creation.
                    return null
                }

                const isValid = await compare(credentials.password as string, user.password)

                if (!isValid) return null

                // Return user object if valid
                return user
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
                session.user.role = token.role
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
                token.role = user.role
            }
            return token
        }
    },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
