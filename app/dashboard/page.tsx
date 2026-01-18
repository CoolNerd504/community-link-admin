"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/auth/signin") // Or wherever login is
                return
            }

            switch (user.role) {
                case "SUPER_ADMIN":
                case "ADMIN":
                    router.push("/admin/dashboard")
                    break
                case "PROVIDER":
                    router.push("/provider/dashboard")
                    break
                default:
                    router.push("/user/dashboard")
                    break
            }
        }
    }, [user, loading, router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    )
}
