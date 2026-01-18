"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, Zap, History } from "lucide-react"

import { BookingsHeader } from "@/components/bookings/bookings-header"
import { BookingStats } from "@/components/bookings/booking-stats"
import { BookingsSidebar } from "@/components/bookings/bookings-sidebar"
import { ScheduledSessionCard } from "@/components/bookings/scheduled-session-card"
import { InstantRequestCard } from "@/components/bookings/instant-request-card"
import { HistoryCard } from "@/components/bookings/history-card"
import { BookingResponse } from "@/components/bookings/types"

export default function ClientBookingsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [bookings, setBookings] = useState<BookingResponse[]>([])
    const [stats, setStats] = useState({
        totalHours: 0,
        activeBookings: 0,
        walletCredits: 0,
        currency: "ZMW"
    })
    const [activeTab, setActiveTab] = useState<"scheduled" | "instant" | "history">("scheduled")
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch Bookings
                const res = await fetch("/api/bookings")
                if (res.ok) {
                    const data = await res.json()
                    setBookings(data)
                }

                // Fetch Wallet for stats (optional, could be separate)
                const walletRes = await fetch("/api/wallet/balance")
                if (walletRes.ok) {
                    const walletData = await walletRes.json()
                    setStats(prev => ({
                        ...prev,
                        walletCredits: walletData.balance || 0,
                        currency: walletData.currency || "ZMW"
                    }))
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchData()
    }, [user])

    // Calculate dynamic stats
    useEffect(() => {
        if (bookings.length > 0) {
            const activeCount = bookings.filter(b => ["PENDING", "ACCEPTED", "CONFIRMED"].includes(b.status)).length
            const totalMins = bookings.filter(b => ["COMPLETED"].includes(b.status)).reduce((acc, curr) => acc + curr.duration, 0)

            setStats(prev => ({
                ...prev,
                activeBookings: activeCount,
                totalHours: totalMins / 60
            }))
        }
    }, [bookings])

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" })
            if (res.ok) {
                setBookings(prev => prev.filter(b => b.id !== bookingId))
            } else {
                alert("Failed to cancel booking")
            }
        } catch (error) {
            console.error("Error cancelling:", error)
        }
    }

    const filteredBookings = bookings.filter(booking => {
        // Search Filter
        const matchesSearch = booking.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.service.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
        if (!matchesSearch) return false

        // Tab Filter
        if (activeTab === "scheduled") {
            return !booking.isInstant && ["PENDING", "ACCEPTED", "CONFIRMED"].includes(booking.status)
        }
        if (activeTab === "instant") {
            return booking.isInstant && ["PENDING", "ACCEPTED"].includes(booking.status)
        }
        if (activeTab === "history") {
            return ["COMPLETED", "CANCELLED", "DECLINED", "EXPIRED"].includes(booking.status)
        }
        return false
    })

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-12">
            <BookingsHeader
                onSearch={setSearchTerm}
                onNewBooking={() => router.push("/search")}
            />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                {/* Stats Grid */}
                <BookingStats stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content (3 cols) */}
                    <div className="lg:col-span-3">

                        {/* Tab Navigation */}
                        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-2 mb-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                            <div className="flex gap-2 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab("scheduled")}
                                    className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-[14px] font-semibold transition-all whitespace-nowrap ${activeTab === "scheduled"
                                            ? "bg-[#2563eb] text-white shadow-md"
                                            : "text-[#767676] hover:bg-[#f5f5f5] hover:text-[#181818]"
                                        }`}
                                >
                                    <Calendar className="size-4" />
                                    Scheduled
                                </button>
                                <button
                                    onClick={() => setActiveTab("instant")}
                                    className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-[14px] font-semibold transition-all whitespace-nowrap ${activeTab === "instant"
                                            ? "bg-[#2563eb] text-white shadow-md"
                                            : "text-[#767676] hover:bg-[#f5f5f5] hover:text-[#181818]"
                                        }`}
                                >
                                    <Zap className="size-4" />
                                    Instant Requests
                                </button>
                                <button
                                    onClick={() => setActiveTab("history")}
                                    className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-[14px] font-semibold transition-all whitespace-nowrap ${activeTab === "history"
                                            ? "bg-[#2563eb] text-white shadow-md"
                                            : "text-[#767676] hover:bg-[#f5f5f5] hover:text-[#181818]"
                                        }`}
                                >
                                    <History className="size-4" />
                                    History
                                </button>
                            </div>
                        </div>

                        {/* List Content */}
                        <div className="space-y-4">
                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-[24px] border border-[#eee]">
                                    <p className="text-[#767676]">No bookings found in this section.</p>
                                    {activeTab === "scheduled" && (
                                        <button
                                            onClick={() => router.push("/search")}
                                            className="mt-4 text-[#2563eb] font-semibold hover:underline"
                                        >
                                            Find a Provider
                                        </button>
                                    )}
                                </div>
                            ) : (
                                filteredBookings.map(booking => {
                                    if (activeTab === "scheduled") {
                                        return (
                                            <ScheduledSessionCard
                                                key={booking.id}
                                                booking={booking}
                                                onJoin={(id) => router.push(`/session/${id}/call`)}
                                                onReschedule={(id) => router.push(`/session/${id}/reschedule`)}
                                                onCancel={handleCancel}
                                            />
                                        )
                                    }
                                    if (activeTab === "instant") {
                                        return (
                                            <InstantRequestCard
                                                key={booking.id}
                                                booking={booking}
                                                onCancel={handleCancel}
                                            />
                                        )
                                    }
                                    return (
                                        <HistoryCard
                                            key={booking.id}
                                            booking={booking}
                                        />
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Sidebar (1 col) */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <BookingsSidebar />
                    </div>
                </div>
            </div>
        </div>
    )
}

