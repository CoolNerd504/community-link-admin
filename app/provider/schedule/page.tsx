"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ProviderHeader } from "@/components/provider-shared/provider-header"
import { ProviderSidebar } from "@/components/provider-shared/provider-sidebar"
import { SessionList } from "@/components/provider/schedule/session-list"
import { RequestActionCard } from "@/components/provider/schedule/request-action-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProviderSchedulePage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("upcoming")

    // State for sessions
    const [bookings, setBookings] = useState<any[]>([])
    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    const fetchBookings = async () => {
        setLoadingData(true)
        try {
            const res = await fetch("/api/bookings")
            if (res.ok) {
                const data = await res.json()
                setBookings(data)
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error)
        } finally {
            setLoadingData(false)
        }
    }

    useEffect(() => {
        if (user) fetchBookings()
    }, [user])

    const handleAccept = async (id: string) => {
        try {
            await fetch(`/api/bookings/${id}/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "ACCEPTED" })
            })
            fetchBookings() // Refresh
        } catch (e) {
            console.error("Error accepting", e)
        }
    }

    const handleDecline = async (id: string) => {
        try {
            await fetch(`/api/bookings/${id}/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "DECLINED" })
            })
            fetchBookings() // Refresh
        } catch (e) {
            console.error("Error declining", e)
        }
    }

    const handleJoin = (id: string) => {
        router.push(`/session/${id}`)
    }

    if (loading || loadingData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
            </div>
        )
    }

    const pendingRequests = bookings.filter(b => b.status === "PENDING")
    const upcomingSessions = bookings.filter(b => ["ACCEPTED", "CONFIRMED"].includes(b.status))
    const pastSessions = bookings.filter(b => ["COMPLETED", "CANCELLED", "DECLINED"].includes(b.status))

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <ProviderHeader />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-[28px] font-bold text-[#181818] mb-1">
                        Schedule
                    </h1>
                    <p className="text-[15px] text-[#767676]">
                        Manage your appointments and requests.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content (3/4) */}
                    <div className="lg:col-span-3">

                        {/* Pending Requests Section */}
                        <RequestActionCard
                            requests={pendingRequests}
                            onAccept={handleAccept}
                            onDecline={handleDecline}
                        />

                        {/* Tabs for Upcoming/Past */}
                        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm min-h-[600px]">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-gray-100 rounded-[14px]">
                                    <TabsTrigger
                                        value="upcoming"
                                        className="rounded-[10px] data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-[14px] font-semibold py-2.5 transition-all"
                                    >
                                        My Upcoming Sessions ({upcomingSessions.length})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="past"
                                        className="rounded-[10px] data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-[14px] font-semibold py-2.5 transition-all"
                                    >
                                        Past History
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="upcoming" className="mt-0">
                                    <SessionList
                                        sessions={upcomingSessions}
                                        type="upcoming"
                                        onJoin={handleJoin}
                                        onView={(id) => console.log('view', id)}
                                    />
                                </TabsContent>

                                <TabsContent value="past" className="mt-0">
                                    <SessionList
                                        sessions={pastSessions}
                                        type="past"
                                        onView={(id) => console.log('view', id)}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar (1/4) */}
                    <div className="lg:col-span-1 space-y-6">
                        <ProviderSidebar />
                    </div>
                </div>
            </div>
        </div>
    )
}
