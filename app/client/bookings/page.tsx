"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Video, X, RefreshCw } from "lucide-react"

export default function ClientBookingsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [bookings, setBookings] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoading(true)
            try {
                const res = await fetch("/api/bookings")
                if (res.ok) {
                    const data = await res.json()
                    setBookings(data)
                }
            } catch (error) {
                console.error("Error fetching bookings:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchBookings()
    }, [user])

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Cancel this booking?")) return
        try {
            await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" })
            setBookings(prev => prev.filter(b => b.id !== bookingId))
        } catch (error) {
            console.error("Error cancelling:", error)
        }
    }

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    const upcomingBookings = bookings.filter(b => ["PENDING", "ACCEPTED", "CONFIRMED"].includes(b.status))
    const pastBookings = bookings.filter(b => ["COMPLETED", "CANCELLED", "DECLINED"].includes(b.status))

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800"
            case "ACCEPTED":
            case "CONFIRMED": return "bg-green-100 text-green-800"
            case "COMPLETED": return "bg-blue-100 text-blue-800"
            case "CANCELLED":
            case "DECLINED": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

                <Tabs defaultValue="upcoming" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                        <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming">
                        <Card>
                            <CardContent className="p-6">
                                {upcomingBookings.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No upcoming bookings</p>
                                        <Button className="mt-4" onClick={() => router.push("/search")}>
                                            Find Providers
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {upcomingBookings.map(booking => (
                                            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-semibold">{booking.service?.title || "Service"}</p>
                                                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        with {booking.service?.provider?.name || "Provider"}
                                                    </p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                        <Clock className="w-4 h-4" />
                                                        {booking.requestedTime
                                                            ? new Date(booking.requestedTime).toLocaleString()
                                                            : "Pending confirmation"}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {booking.status === "CONFIRMED" && (
                                                        <Button size="sm" onClick={() => router.push(`/session/${booking.id}/call`)}>
                                                            <Video className="w-4 h-4 mr-1" /> Join
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="outline" onClick={() => router.push(`/session/${booking.id}`)}>
                                                        <RefreshCw className="w-4 h-4 mr-1" /> Reschedule
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleCancel(booking.id)}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="past">
                        <Card>
                            <CardContent className="p-6">
                                {pastBookings.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>No past bookings</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pastBookings.map(booking => (
                                            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg opacity-75">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-medium">{booking.service?.title || "Service"}</p>
                                                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {booking.requestedTime ? new Date(booking.requestedTime).toLocaleDateString() : "N/A"}
                                                    </p>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => router.push(`/provider/${booking.service?.providerId}`)}>
                                                    Book Again
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
