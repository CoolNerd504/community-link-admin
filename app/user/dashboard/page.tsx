"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Heart, CreditCard, Star, ArrowRight, Lightbulb } from "lucide-react"

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

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    const upcomingSessions = bookings
        .filter(b => ["PENDING", "ACCEPTED", "CONFIRMED"].includes(b.status))
        .slice(0, 3)

    const completedThisMonth = bookings.filter(b => {
        if (b.status !== "COMPLETED") return false
        const date = new Date(b.completedAt || b.requestedTime)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length

    const minutesUsed = bookings
        .filter(b => b.status === "COMPLETED")
        .reduce((sum, b) => sum + (b.duration || 0), 0)

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
                        <p className="text-gray-500">Here's what's happening with your sessions</p>
                    </div>
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Balance Card */}
                <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-100 text-sm">Available Minutes</p>
                                <p className="text-4xl font-bold">{wallet?.availableMinutes || 0}</p>
                                <p className="text-indigo-200 text-sm mt-1">mins remaining</p>
                            </div>
                            <Button
                                variant="secondary"
                                className="bg-white text-indigo-600 hover:bg-indigo-50"
                                onClick={() => router.push("/user/wallet")}
                            >
                                <CreditCard className="w-4 h-4 mr-2" /> Top Up
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{completedThisMonth}</p>
                                <p className="text-sm text-gray-500">Sessions this month</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{minutesUsed}</p>
                                <p className="text-sm text-gray-500">Minutes used</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Sessions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <h3 className="font-semibold">Upcoming Sessions</h3>
                        <Button variant="ghost" size="sm" onClick={() => router.push("/user/schedule")}>
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {upcomingSessions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                <p>No upcoming sessions</p>
                                <Button className="mt-4" onClick={() => router.push("/user/discover")}>
                                    Find a Provider
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingSessions.map(session => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                        onClick={() => router.push(`/session/${session.id}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={session.service?.provider?.image || ""} />
                                                <AvatarFallback>{session.service?.provider?.name?.[0] || "P"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{session.service?.title || "Session"}</p>
                                                <p className="text-sm text-gray-500">
                                                    {session.requestedTime
                                                        ? new Date(session.requestedTime).toLocaleString()
                                                        : "Pending"}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={session.status === "CONFIRMED" ? "default" : "secondary"}>
                                            {session.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Favorite Providers */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <h3 className="font-semibold">Favorite Providers</h3>
                        <Button variant="ghost" size="sm" onClick={() => router.push("/client/favorites")}>
                            <Heart className="w-4 h-4 mr-1" /> View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {favorites.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No favorites yet</p>
                        ) : (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {favorites.slice(0, 5).map(provider => (
                                    <div
                                        key={provider.id}
                                        className="flex-shrink-0 w-24 text-center cursor-pointer"
                                        onClick={() => router.push(`/provider/${provider.id}`)}
                                    >
                                        <Avatar className="w-16 h-16 mx-auto mb-2">
                                            <AvatarImage src={provider.image || ""} />
                                            <AvatarFallback>{provider.name?.[0] || "P"}</AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm font-medium truncate">{provider.name}</p>
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs">4.8</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tips */}
                <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4 flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-medium text-amber-800">Pro Tip</p>
                            <p className="text-sm text-amber-700">
                                Follow your favorite providers to get notified when they're available for instant sessions!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
