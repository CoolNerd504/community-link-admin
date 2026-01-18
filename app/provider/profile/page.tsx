"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ProviderHeader } from "@/components/provider-shared/provider-header"
import { ProviderSidebar } from "@/components/provider-shared/provider-sidebar"
import { ProviderProfileCard } from "@/components/provider/profile/provider-profile-card"
import { VerificationStatusCard } from "@/components/provider/profile/verification-status-card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function ProviderProfilePage() {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
        // if (!loading && user?.role !== "PROVIDER") router.push("/dashboard")
        setIsLoading(loading)
    }, [loading, user, router])

    const handleEditProfile = () => {
        // Open modal or navigate to edit page
        console.log("Edit profile")
    }

    const handleVerify = () => {
        router.push("/provider/kyc")
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <ProviderHeader />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-[28px] font-bold text-[#181818] mb-1">
                        Profile & Settings
                    </h1>
                    <p className="text-[15px] text-[#767676]">
                        Manage your public profile and account settings.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Main Profile) */}
                    <div className="lg:col-span-2 space-y-6">
                        <ProviderProfileCard
                            user={user}
                            onEdit={handleEditProfile}
                        />

                        <VerificationStatusCard
                            status={user?.kycStatus || "PENDING"}
                            onVerify={handleVerify}
                        />

                        {/* Additional Settings Sections could go here */}
                    </div>

                    {/* Right Column (Sidebar & Actions) */}
                    <div className="lg:col-span-1 space-y-6">
                        <ProviderSidebar />

                        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-[16px] font-bold text-gray-900 mb-4">Account Actions</h3>
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-[12px] font-semibold text-[14px] hover:bg-red-100 transition-colors"
                            >
                                <LogOut className="size-4" />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
