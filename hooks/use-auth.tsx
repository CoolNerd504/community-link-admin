"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
// We might need to fetch the profile from an API route if it's not in the session
// For now, let's assume session.user is enough or we fetch profile separate

export const useAuth = () => {
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status !== "loading") {
            setLoading(false)
        }
    }, [status])

    return {
        user: session?.user ?? null,
        loading: status === "loading",
        isAuthenticated: status === "authenticated",
        signOut
    }
}
