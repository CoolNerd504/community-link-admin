import NextAuth, { DefaultSession, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import { AdapterUser } from "next-auth/adapters"

declare module "next-auth/adapters" {
    interface AdapterUser extends User {
        role: UserRole
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: UserRole
            username?: string | null
            kycStatus?: string
        } & DefaultSession["user"]
    }

    interface User {
        role: UserRole
        username?: string | null
        kycStatus?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: UserRole
        username?: string | null
        kycStatus?: string
    }
}
