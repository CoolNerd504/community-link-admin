"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ChevronLeft } from "lucide-react"
import { ProfileCard } from "@/components/user-profile/profile-card"
import { TabNavigation } from "@/components/user-profile/tab-navigation"
import { ProfileTab } from "@/components/user-profile/profile-tab"
import { SecurityTab } from "@/components/user-profile/security-tab"
import { WalletTab } from "@/components/user-profile/wallet-tab"
import { SettingsTab } from "@/components/user-profile/settings-tab"

export default function UserProfilePage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState("profile")
    const [kycStatus, setKycStatus] = useState("PENDING")
    const [wallet, setWallet] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
        // if (!loading && user?.role === "PROVIDER") router.push("/provider/profile") 
        // Commented out provider redirect to allow testing or shared profile view for now, 
        // user role check should be stricter in production if needed.
    }, [loading, user, router])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch KYC Status
                const kycRes = await fetch("/api/kyc/status")
                if (kycRes.ok) {
                    const data = await kycRes.json()
                    setKycStatus(data.status)
                }

                // Fetch Wallet
                const walletRes = await fetch("/api/wallet/balance")
                if (walletRes.ok) {
                    const data = await walletRes.json()
                    setWallet(data)
                }
            } catch (error) {
                console.error("Error fetching profile data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchData()
    }, [user])

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
            </div>
        )
    }

    // Merge user data with fetched status
    const extendedUser = {
        ...(user as any),
        kycStatus: kycStatus,
        profile: {
            ...((user as any)?.profile || {}),
            bio: (user as any)?.profile?.bio || "Product Designer based in San Francisco. Passionate about creating intuitive and beautiful user experiences.",
            location: (user as any)?.profile?.location || "San Francisco, CA",
            languages: (user as any)?.profile?.languages || ["English", "Spanish"],
            interests: (user as any)?.profile?.interests || ["Design", "Technology", "Art"],
            headline: (user as any)?.profile?.headline || "Product Designer"
        },
        stats: {
            totalSessions: 24, // Mock
            savedProviders: 8  // Mock
        }
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-12">
            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b border-[#eee] mb-8">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
                    <button
                        onClick={() => router.push("/user/dashboard")}
                        className="flex items-center gap-2 text-[14px] text-[#767676] hover:text-[#181818] transition-colors"
                    >
                        <ChevronLeft className="size-4" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <ProfileCard
                            user={extendedUser}
                            onEdit={() => console.log("Edit profile clicked")}
                            onLogout={async () => {
                                // For now, we'll just redirect to home since we're using a mock auth hook
                                // In real app: await signOut({ callbackUrl: '/' })
                                router.push("/")
                            }}
                        />
                    </div>

                    {/* Right Column - Tabbed Content */}
                    <div className="lg:col-span-2">
                        <TabNavigation activeTab={activeTab} onChange={setActiveTab} />

                        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-8 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                            {activeTab === "profile" && <ProfileTab user={extendedUser} />}
                            {activeTab === "security" && <SecurityTab user={extendedUser} />}
                            {activeTab === "wallet" && <WalletTab wallet={wallet} />}
                            {activeTab === "settings" && <SettingsTab user={extendedUser} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
