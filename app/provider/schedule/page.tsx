"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CheckCircle, XCircle, Video } from "lucide-react"

export default function ProviderSchedulePage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [bookings, setBookings] = useState<any[]>([])
    const [pastSessions, setPastSessions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
        if (!loading && user?.role !== "PROVIDER") router.push("/dashboard")
    }, [loading, user, router])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch all bookings
                const bookingsRes = await fetch("/api/bookings")
                if (bookingsRes.ok) {
                    const data = await bookingsRes.json()
                    setBookings(data)
                }

                // Fetch past sessions
                const sessionsRes = await fetch("/api/sessions?status=COMPLETED")
                if (sessionsRes.ok) {
                    const data = await sessionsRes.json()
                    setPastSessions(data)
                }
            } catch (error) {
                console.error("Error fetching schedule:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchData()
    }, [user])

    const handleRespond = async (bookingId: string, status: "accepted" | "declined") => {
        try {
            await fetch(`/api/bookings/${bookingId}/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            })
            // Refresh
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: status.toUpperCase() } : b))
        } catch (error) {
            console.error("Error responding to booking:", error)
        }
    }

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    const pendingBookings = bookings.filter(b => b.status === "PENDING")
    const upcomingBookings = bookings.filter(b => ["ACCEPTED", "CONFIRMED"].includes(b.status))

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Schedule</h1>

                <Tabs defaultValue="upcoming" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="past">Past Sessions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-6">
                        {/* Pending Requests */}
                        {pendingBookings.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <h3 className="font-semibold">Pending Requests ({pendingBookings.length})</h3>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {pendingBookings.map(booking => (
                                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{booking.service?.title || "Service"}</p>
                                                <p className="text-sm text-gray-500">
                                                    <Calendar className="inline w-4 h-4 mr-1" />
                                                    {booking.requestedTime
                                                        ? new Date(booking.requestedTime).toLocaleString()
                                                        : "Instant Request"}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600"
                                                    onClick={() => handleRespond(booking.id, "declined")}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" /> Decline
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleRespond(booking.id, "accepted")}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" /> Accept
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Upcoming Sessions */}
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">Upcoming Sessions</h3>
                            </CardHeader>
                            <CardContent>
                                {upcomingBookings.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No upcoming sessions</p>
                                ) : (
                                    <div className="space-y-3">
                                        {upcomingBookings.map(booking => (
                                            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{booking.service?.title || "Service"}</p>
                                                    <p className="text-sm text-gray-500">
                                                        <Clock className="inline w-4 h-4 mr-1" />
                                                        {booking.requestedTime
                                                            ? new Date(booking.requestedTime).toLocaleString()
                                                            : "TBD"}
                                                    </p>
                                                </div>
                                                <Button size="sm">
                                                    <Video className="w-4 h-4 mr-1" /> Join
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="past">
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">Past Sessions</h3>
                            </CardHeader>
                            <CardContent>
                                {pastSessions.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No past sessions</p>
                                ) : (
                                    <div className="space-y-3">
                                        {pastSessions.map((session: any) => (
                                            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{session.service || "Session"}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(session.startTime).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary">{session.status}</Badge>
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
