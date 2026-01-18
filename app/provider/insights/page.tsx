"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Star, Users, Clock } from "lucide-react"

export default function ProviderInsightsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [range, setRange] = useState("7d")
    const [analytics, setAnalytics] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
        if (!loading && user?.role !== "PROVIDER") router.push("/dashboard")
    }, [loading, user, router])

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/provider/analytics?range=${range}`)
                if (res.ok) {
                    const data = await res.json()
                    setAnalytics(data)
                }
            } catch (error) {
                console.error("Error fetching analytics:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchAnalytics()
    }, [user, range])

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Insights</h1>
                    <div className="flex gap-2">
                        {["7d", "30d", "90d"].map(r => (
                            <Button
                                key={r}
                                variant={range === r ? "default" : "outline"}
                                size="sm"
                                onClick={() => setRange(r)}
                            >
                                {r}
                            </Button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">Loading analytics...</div>
                ) : (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500">Completion</span>
                                        {analytics?.completion?.trend === "up" ? (
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold">{analytics?.completion?.value || 0}%</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500">Retention</span>
                                        {analytics?.retention?.trend === "up" ? (
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold">{analytics?.retention?.value || 0}%</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500">Rating</span>
                                        <Star className="w-4 h-4 text-yellow-500" />
                                    </div>
                                    <p className="text-2xl font-bold">{analytics?.rating || 0}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500">New Clients</span>
                                        <Users className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <p className="text-2xl font-bold">{analytics?.newClients || 0}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Weekly Sessions Chart Placeholder */}
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">Weekly Sessions</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-around h-40 border-t pt-4">
                                    {(analytics?.weeklySessions || [
                                        { day: "Mon", count: 3 },
                                        { day: "Tue", count: 5 },
                                        { day: "Wed", count: 2 },
                                        { day: "Thu", count: 7 },
                                        { day: "Fri", count: 4 },
                                        { day: "Sat", count: 1 },
                                        { day: "Sun", count: 0 }
                                    ]).map((d: any) => (
                                        <div key={d.day} className="flex flex-col items-center">
                                            <div
                                                className="w-8 bg-blue-500 rounded-t"
                                                style={{ height: `${Math.max(d.count * 15, 4)}px` }}
                                            />
                                            <span className="text-xs mt-2 text-gray-500">{d.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rating Breakdown */}
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">Rating Breakdown</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {(analytics?.ratingBreakdown || [
                                        { stars: 5, percentage: 70 },
                                        { stars: 4, percentage: 20 },
                                        { stars: 3, percentage: 5 },
                                        { stars: 2, percentage: 3 },
                                        { stars: 1, percentage: 2 }
                                    ]).map((r: any) => (
                                        <div key={r.stars} className="flex items-center gap-3">
                                            <span className="w-8 text-sm">{r.stars}★</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{ width: `${r.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-500 w-12">{r.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}
