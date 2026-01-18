"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign, Clock, Star, AlertCircle, CheckCircle } from "lucide-react"

export default function ProviderDashboardPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [isOnline, setIsOnline] = useState(false)
    const [isInstantAvailable, setIsInstantAvailable] = useState(false)
    const [earnings, setEarnings] = useState({ total: 0, minutes: 0, pending: 0 })
    const [services, setServices] = useState<any[]>([])
    const [requests, setRequests] = useState<any[]>([])

    useEffect(() => {
        if (!loading && !user) router.push("/")
        if (!loading && user?.role !== "PROVIDER") router.push("/dashboard")
    }, [loading, user, router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch earnings
                const earningsRes = await fetch("/api/provider/earnings")
                if (earningsRes.ok) {
                    const data = await earningsRes.json()
                    setEarnings({
                        total: data.totalEarningsZMW || 0,
                        minutes: data.totalMinutesServiced || 0,
                        pending: data.pendingPayoutZMW || 0
                    })
                }

                // Fetch services
                const servicesRes = await fetch("/api/services")
                if (servicesRes.ok) {
                    const data = await servicesRes.json()
                    setServices(data)
                }

                // Fetch pending requests
                const requestsRes = await fetch("/api/bookings")
                if (requestsRes.ok) {
                    const data = await requestsRes.json()
                    setRequests(data.filter((b: any) => b.status === "PENDING"))
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            }
        }

        if (user) fetchData()
    }, [user])

    const handleToggleOnline = async (value: boolean) => {
        setIsOnline(value)
        await fetch("/api/mobile/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isOnline: value })
        })
    }

    const handleToggleInstant = async (value: boolean) => {
        setIsInstantAvailable(value)
        await fetch("/api/mobile/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isAvailableForInstant: value })
        })
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    const kycStatus = user?.kycStatus || "PENDING"

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(" ")[0]}!</h1>
                        <p className="text-gray-500">Provider Dashboard</p>
                    </div>
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback>{user?.name?.[0] || "P"}</AvatarFallback>
                    </Avatar>
                </div>

                {/* KYC Banner */}
                {kycStatus !== "APPROVED" && (
                    <Card className={kycStatus === "PENDING" ? "border-blue-300 bg-blue-50" : "border-yellow-300 bg-yellow-50"}>
                        <CardContent className="p-4 flex items-center gap-4">
                            {kycStatus === "PENDING" ? (
                                <AlertCircle className="text-blue-600 w-6 h-6" />
                            ) : (
                                <CheckCircle className="text-yellow-600 w-6 h-6" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium">
                                    {kycStatus === "PENDING" ? "Complete Your Verification" : "Verification Under Review"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {kycStatus === "PENDING"
                                        ? "Submit your documents to unlock all features."
                                        : "Your documents are being reviewed."}
                                </p>
                            </div>
                            {kycStatus === "PENDING" && (
                                <Button size="sm" onClick={() => router.push("/kyc")}>Complete KYC</Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Toggles */}
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <Switch checked={isOnline} onCheckedChange={handleToggleOnline} />
                                <span>Online</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch checked={isInstantAvailable} onCheckedChange={handleToggleInstant} disabled={!isOnline} />
                                <span>Instant Sessions</span>
                            </div>
                        </div>
                        <Badge variant={isOnline ? "default" : "secondary"}>
                            {isOnline ? "Visible to Clients" : "Offline"}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Earnings Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <DollarSign className="w-8 h-8 mx-auto text-green-600 mb-2" />
                            <p className="text-2xl font-bold">ZMW {earnings.total.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Total Earnings</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Clock className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                            <p className="text-2xl font-bold">{earnings.minutes}</p>
                            <p className="text-sm text-gray-500">Minutes Serviced</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                            <p className="text-2xl font-bold">4.8</p>
                            <p className="text-sm text-gray-500">Average Rating</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Services */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <h3 className="font-semibold">Active Services</h3>
                        <Button variant="outline" size="sm" onClick={() => router.push("/provider/services")}>
                            Manage
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {services.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No active services</p>
                        ) : (
                            <div className="space-y-2">
                                {services.slice(0, 3).map((s: any) => (
                                    <div key={s.id} className="flex justify-between items-center p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{s.title}</p>
                                            <p className="text-sm text-gray-500">{s.category}</p>
                                        </div>
                                        <Badge>ZMW {s.price}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pending Requests */}
                {isInstantAvailable && requests.length > 0 && (
                    <Card>
                        <CardHeader>
                            <h3 className="font-semibold">Pending Requests ({requests.length})</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {requests.map((r: any) => (
                                    <div key={r.id} className="flex justify-between items-center p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{r.service?.title || "Service"}</p>
                                            <p className="text-sm text-gray-500">
                                                {r.requestedTime ? new Date(r.requestedTime).toLocaleString() : "Instant"}
                                            </p>
                                        </div>
                                        <Button size="sm" onClick={() => router.push(`/provider/schedule`)}>
                                            View
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
