"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ProviderHeader } from "@/components/provider-shared/provider-header"
import { ProviderSidebar } from "@/components/provider-shared/provider-sidebar"
import { StatusToggle } from "@/components/provider-shared/status-toggle"
import { StatCard } from "@/components/provider-shared/stat-card"
import { EarningsSummaryCard } from "@/components/provider/dashboard/earnings-summary-card"
import { PendingRequestsCard } from "@/components/provider/dashboard/pending-requests-card"
import { ActiveServicesCard } from "@/components/provider/dashboard/active-services-card"
import { Star, Shield, TrendingUp, DollarSign } from "lucide-react"

export default function ProviderDashboardPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [isOnline, setIsOnline] = useState(false)
    const [isAvailableForInstant, setIsAvailableForInstant] = useState(false)
    const [stats, setStats] = useState({ rating: "4.9", completionRate: "98%" })

    // Simulate Auth Check
    useEffect(() => {
        if (!loading && !user) router.push("/")
        // In real app, strict role check: if (!loading && user?.role !== "PROVIDER") router.push("/dashboard")
    }, [loading, user, router])

    // Load initial status (mocked or from profile)
    useEffect(() => {
        if (user) {
            setIsOnline(user.profile?.isOnline || false)
            // setIsAvailableForInstant(...)
        }
    }, [user])

    const handleToggleOnline = (value: boolean) => {
        setIsOnline(value)
        // API call to update status
    }

    const handleToggleInstant = (value: boolean) => {
        setIsAvailableForInstant(value)
        // API call to update status
    }

    if (loading) {
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
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-[28px] font-bold text-[#181818] mb-1">
                        Welcome back, {user?.name?.split(" ")[0]}! 👋
                    </h1>
                    <p className="text-[15px] text-[#767676]">
                        Here's what's happening with your services today.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column (3/4) */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Key Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Total Earnings"
                                value="ZMW 2,450"
                                icon={DollarSign}
                                color="green"
                                trend={{ value: "12.5%", isPositive: true }}
                            />
                            <StatCard
                                title="Completion Rate"
                                value={stats.completionRate}
                                icon={Shield}
                                color="blue"
                                subtitle="Top 5% of providers"
                            />
                            <StatCard
                                title="Average Rating"
                                value={stats.rating}
                                icon={Star}
                                color="orange"
                                subtitle="Based on 45 reviews"
                            />
                        </div>

                        {/* Main Content Area */}

                        {/* Earnings Graph */}
                        <EarningsSummaryCard />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pending Requests */}
                            <PendingRequestsCard />

                            {/* Active Services */}
                            <ActiveServicesCard />
                        </div>

                    </div>

                    {/* Right Column (1/4) - Sticky Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <StatusToggle
                            isOnline={isOnline}
                            onToggleOnline={handleToggleOnline}
                            isAvailableForInstant={isAvailableForInstant}
                            onToggleInstant={handleToggleInstant}
                        />

                        <ProviderSidebar />
                    </div>
                </div>
            </div>
        </div>
    )
}
