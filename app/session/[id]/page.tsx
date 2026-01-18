"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, RefreshCw, ArrowLeft, DollarSign } from "lucide-react"

export default function SessionDetailPage() {
    const { id: sessionId } = useParams()
    const { user, loading } = useAuth()
    const router = useRouter()

    const [session, setSession] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchSession = async () => {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/sessions/${sessionId}`)
                if (res.ok) {
                    const data = await res.json()
                    setSession(data)
                }
            } catch (error) {
                console.error("Error fetching session:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (sessionId && user) fetchSession()
    }, [sessionId, user])

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    if (!session) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">Session not found</p>
                <Button onClick={() => router.push("/client/bookings")}>Back to Bookings</Button>
            </div>
        )
    }

    const isWithin15Minutes = () => {
        if (!session.startTime) return false
        const startTime = new Date(session.startTime).getTime()
        const now = Date.now()
        const diff = startTime - now
        return diff <= 15 * 60 * 1000 && diff > 0
    }

    const canJoin = session.status === "SCHEDULED" && isWithin15Minutes()
    const canReschedule = session.status === "SCHEDULED" && !isWithin15Minutes()

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Session Details</h2>
                            <Badge variant={session.status === "SCHEDULED" ? "default" : "secondary"}>
                                {session.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Provider Info */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <Avatar className="w-14 h-14">
                                <AvatarImage src={session.provider?.image || ""} />
                                <AvatarFallback>{session.provider?.name?.[0] || "P"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{session.provider?.name || "Provider"}</p>
                                <p className="text-sm text-gray-500">{session.service?.title || "Service"}</p>
                            </div>
                        </div>

                        {/* Session Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-medium">
                                        {session.startTime
                                            ? new Date(session.startTime).toLocaleDateString()
                                            : "TBD"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Time</p>
                                    <p className="font-medium">
                                        {session.startTime
                                            ? new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : "TBD"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="font-medium">ZMW {session.price || session.service?.price || 0}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                            {canJoin && (
                                <Button className="flex-1" onClick={() => router.push(`/session/${sessionId}/call`)}>
                                    <Video className="w-4 h-4 mr-2" /> Join Session
                                </Button>
                            )}
                            {canReschedule && (
                                <Button variant="outline" className="flex-1">
                                    <RefreshCw className="w-4 h-4 mr-2" /> Reschedule
                                </Button>
                            )}
                            {session.status === "SCHEDULED" && !canJoin && !canReschedule && (
                                <p className="text-sm text-gray-500 text-center w-full py-2">
                                    You can join 15 minutes before the session starts
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
