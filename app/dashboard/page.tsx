"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ClientDashboard from "../features/client/ClientDashboard"
import { ProviderDashboard } from "../features/provider/ProviderDashboard"
import { AdminDashboard } from "../features/admin/AdminDashboard"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
    const { user: currentUser, loading: isAuthLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthLoading && !currentUser) {
            router.push("/")
        }
    }, [isAuthLoading, currentUser, router])

    if (isAuthLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (!currentUser) {
        return null // Will redirect
    }

    if (currentUser.role === "SUPER_ADMIN" || currentUser.role === "ADMIN") {
        return <AdminDashboard currentUser={currentUser} />
    }

    if (currentUser.role === "PROVIDER") {
        return <ProviderDashboard currentUser={currentUser} />
    }

    // Default to client dashboard
    return <ClientDashboard />
}
