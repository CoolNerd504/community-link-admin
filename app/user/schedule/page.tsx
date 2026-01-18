"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Video, Receipt, X } from "lucide-react"

export default function UserSchedulePage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [bookings, setBookings] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedReceipt, setSelectedReceipt] = useState<any>(null)

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

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    const pendingRequests = bookings.filter(b => b.status === "PENDING")
    const confirmedSessions = bookings.filter(b => ["ACCEPTED", "CONFIRMED"].includes(b.status))
    const pastSessions = bookings.filter(b => ["COMPLETED", "CANCELLED", "DECLINED"].includes(b.status))

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
                <h1 className="text-2xl font-bold mb-6">My Schedule</h1>

                <Tabs defaultValue="upcoming" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upcoming">
                            Upcoming ({pendingRequests.length + confirmedSessions.length})
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            History ({pastSessions.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-6">
                        {/* Pending Requests */}
                        {pendingRequests.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <h3 className="font-semibold text-yellow-700">Pending Requests</h3>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {pendingRequests.map(booking => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={booking.service?.provider?.image || ""} />
                                                    <AvatarFallback>{booking.service?.provider?.name?.[0] || "P"}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{booking.service?.title || "Service"}</p>
                                                    <p className="text-sm text-gray-500">
                                                        with {booking.service?.provider?.name || "Provider"}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {booking.requestedTime ? new Date(booking.requestedTime).toLocaleString() : "Pending"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Confirmed Sessions */}
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">Confirmed Sessions</h3>
                            </CardHeader>
                            <CardContent>
                                {confirmedSessions.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                        <p>No confirmed sessions</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {confirmedSessions.map(booking => (
                                            <div
                                                key={booking.id}
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={booking.service?.provider?.image || ""} />
                                                        <AvatarFallback>{booking.service?.provider?.name?.[0] || "P"}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{booking.service?.title || "Service"}</p>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {booking.requestedTime ? new Date(booking.requestedTime).toLocaleString() : "TBD"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button onClick={() => router.push(`/session/${booking.id}/call`)}>
                                                    <Video className="w-4 h-4 mr-2" /> Join
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">Past Sessions</h3>
                            </CardHeader>
                            <CardContent>
                                {pastSessions.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No past sessions</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pastSessions.map(booking => (
                                            <div
                                                key={booking.id}
                                                className="flex items-center justify-between p-4 border rounded-lg opacity-80"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={booking.service?.provider?.image || ""} />
                                                        <AvatarFallback>{booking.service?.provider?.name?.[0] || "P"}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{booking.service?.title || "Service"}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {booking.requestedTime ? new Date(booking.requestedTime).toLocaleDateString() : "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                                    {booking.status === "COMPLETED" && (
                                                        <Button variant="ghost" size="sm" onClick={() => setSelectedReceipt(booking)}>
                                                            <Receipt className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Receipt Modal */}
                <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Session Receipt</DialogTitle>
                        </DialogHeader>
                        {selectedReceipt && (
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-500">Service</span>
                                    <span className="font-medium">{selectedReceipt.service?.title}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-500">Provider</span>
                                    <span className="font-medium">{selectedReceipt.service?.provider?.name}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-medium">
                                        {new Date(selectedReceipt.requestedTime).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="font-medium">{selectedReceipt.duration || 30} mins</span>
                                </div>
                                <div className="flex justify-between py-2 text-lg font-bold">
                                    <span>Total</span>
                                    <span>ZMW {selectedReceipt.price || selectedReceipt.service?.price || 0}</span>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
