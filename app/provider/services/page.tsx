"use client"

import ServiceList from "../../features/provider/components/ServiceList"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ServicesPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && (!user || user.role !== "PROVIDER")) {
            router.push("/")
        }
    }, [user, loading, router])

    if (loading) return <div>Loading...</div>
    if (!user) return null

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-blue-600 hover:underline mb-4 flex items-center"
                >
                    ← Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
                <p className="text-gray-600">View and manage your service offerings.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <ServiceList />
            </div>
        </div>
    )
}
