"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { format, isBefore, subMinutes } from "date-fns"
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    AlertCircle,
    CheckCircle,
    XCircle,
    User as UserIcon,
    ArrowLeft
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Calendar as CalendarComponent } from "../../../components/ui/calendar"
import { getSessionByIdAction, rescheduleSessionAction } from "../../actions"

export default function SessionOverviewPage() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params.id as string

    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
    const [newDate, setNewDate] = useState<Date | undefined>(undefined)
    const [newTime, setNewTime] = useState("09:00")
    const [rescheduleLoading, setRescheduleLoading] = useState(false)

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await getSessionByIdAction(sessionId)
                setSession(data)
            } catch (error) {
                console.error("Failed to fetch session", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSession()
    }, [sessionId])

    if (loading) return <div className="p-8 text-center">Loading session details...</div>
    if (!session) return <div className="p-8 text-center text-red-500">Session not found</div>

    const startTime = new Date(session.startTime)
    const endTime = session.endTime ? new Date(session.endTime) : null
    const now = new Date()

    // Can join if meeting is active or starting in < 15 mins
    // Assuming "active" means scheduled time has arrived or passed but not completed
    const minutesUntilStart = (startTime.getTime() - now.getTime()) / 60000
    const canJoin = minutesUntilStart <= 15 && session.status !== 'COMPLETED'

    // Can reschedule if > 15 mins before start
    const canReschedule = minutesUntilStart > 15 && session.status === 'SCHEDULED'

    const handleReschedule = async () => {
        if (!newDate) return

        setRescheduleLoading(true)
        try {
            const [hours, minutes] = newTime.split(':').map(Number)
            const scheduledDate = new Date(newDate)
            scheduledDate.setHours(hours, minutes)

            await rescheduleSessionAction(sessionId, scheduledDate)

            // Refresh
            const updated = await getSessionByIdAction(sessionId)
            setSession(updated)
            setIsRescheduleOpen(false)
            alert("Session rescheduled successfully.")
        } catch (error) {
            console.error("Reschedule failed", error)
            alert("Failed to reschedule. Please try again.")
        } finally {
            setRescheduleLoading(false)
        }
    }

    const handleJoin = () => {
        // Navigate to chat/video room
        // Assuming messages page handles the session context
        router.push(`/messages/${sessionId}`)
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
            <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge className={
                            session.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                session.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                    'bg-gray-100 text-gray-800 hover:bg-gray-100'
                        }>
                            {session.status}
                        </Badge>
                        <span className="text-sm text-gray-500">#{session.id.slice(-6)}</span>
                    </div>
                    <h1 className="text-2xl font-bold">Session Overview</h1>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {canReschedule && (
                        <Button variant="outline" className="flex-1 md:flex-none" onClick={() => setIsRescheduleOpen(true)}>
                            Reschedule
                        </Button>
                    )}
                    <Button
                        className="flex-1 md:flex-none"
                        disabled={!canJoin}
                        onClick={handleJoin}
                    >
                        <Video className="w-4 h-4 mr-2" />
                        Join Session
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Session Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-blue-600" />
                            Time & Duration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date</p>
                            <p className="text-lg font-semibold">{format(startTime, "EEEE, MMMM d, yyyy")}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Start Time</p>
                                <p className="font-semibold">{format(startTime, "h:mm a")}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">End Time</p>
                                <p className="font-semibold">{endTime ? format(endTime, "h:mm a") : '-'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Duration</p>
                            <p>{endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : '-'} minutes</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Participants Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                            Participants
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Provider */}
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={session.provider.image || undefined} />
                                <AvatarFallback>{session.provider.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Provider</p>
                                <p className="font-semibold">{session.provider.name}</p>
                                <p className="text-xs text-gray-400 capitalize">{session.provider.role?.toLowerCase()}</p>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Client */}
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={session.client.image || undefined} />
                                <AvatarFallback>{session.client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Client</p>
                                <p className="font-semibold">{session.client.name}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Info Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Badge variant="secondary" className="mr-2">ZMW</Badge>
                            Payment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-2xl font-bold">ZMW {session.price?.toFixed(2)}</p>
                        </div>
                        <Badge variant="outline" className="px-3 py-1">
                            {session.status === 'COMPLETED' ? 'PAID' : 'PENDING RELEASE'}
                        </Badge>
                    </CardContent>
                </Card>

            </div>

            {/* Reschedule Modal */}
            <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reschedule Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-center border rounded-lg p-2">
                            <CalendarComponent
                                mode="single"
                                selected={newDate}
                                onSelect={setNewDate}
                                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Start Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="time"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>Cancel</Button>
                        <Button onClick={handleReschedule} disabled={!newDate || rescheduleLoading}>
                            {rescheduleLoading ? "Saving..." : "Confirm New Time"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
