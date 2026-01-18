"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions"
import { ProgressCard } from "@/components/dashboard/progress-card"

export default function UserDashboardPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [wallet, setWallet] = useState<any>(null)
    const [bookings, setBookings] = useState<any[]>([])
    const [favorites, setFavorites] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
        if (!loading && user?.role === "PROVIDER") router.push("/provider/dashboard")
    }, [loading, user, router])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch wallet balance
                const walletRes = await fetch("/api/wallet/balance")
                if (walletRes.ok) {
                    const data = await walletRes.json()
                    setWallet(data)
                }

                // Fetch bookings
                const bookingsRes = await fetch("/api/bookings")
                if (bookingsRes.ok) {
                    const data = await bookingsRes.json()
                    setBookings(data)
                }

                // Fetch favorites
                const favRes = await fetch("/api/mobile/favorites")
                if (favRes.ok) {
                    const data = await favRes.json()
                    setFavorites(data)
                }
            } catch (error) {
                console.error("Error fetching dashboard:", error)
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

    const upcomingSessions = bookings
        .filter(b => ["PENDING", "ACCEPTED"].includes(b.status))
        .sort((a, b) => new Date(a.requestedTime).getTime() - new Date(b.requestedTime).getTime())
        .slice(0, 3)

    // Calculate stats
    // Note: Total spent logic assumes we sum up prices of completed sessions or transactions. 
    // Since we don't have a direct "spent" endpoint here, we'll approximate from completed bookings or 0 if not available.
    // Ideally this comes from backend analytics.
    const completedBookings = bookings.filter(b => b.status === "COMPLETED")
    const totalSpent = completedBookings.reduce((acc, curr) => acc + (curr.price || 0), 0)

    const stats = {
        totalSessions: bookings.length,
        upcomingSessions: upcomingSessions.length,
        totalSpent: totalSpent, // Using calculated approximate or mock 0 if not populated
        savedProviders: favorites.length
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-12">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                {/* Stats Grid */}
                <StatsGrid stats={stats} />

                {/* Quick Actions */}
                <QuickActions />

                {/* Main Content Grid */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Upcoming Sessions */}
                    <UpcomingSessions sessions={upcomingSessions} />

                    {/* Right Column: Progress & Goals */}
                    <div className="shrink-0">
                        <ProgressCard
                            sessionCount={completedBookings.length}
                            monthlyGoal={5} // This could be a user setting in future
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
