"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Star } from "lucide-react"

export default function ClientFollowingPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [following, setFollowing] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchFollowing = async () => {
            setIsLoading(true)
            try {
                const res = await fetch("/api/mobile/following")
                if (res.ok) {
                    const data = await res.json()
                    setFollowing(data)
                }
            } catch (error) {
                console.error("Error fetching following:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchFollowing()
    }, [user])

    const handleUnfollow = async (providerId: string) => {
        try {
            await fetch(`/api/providers/${providerId}/follow`, { method: "DELETE" })
            setFollowing(prev => prev.filter(f => f.id !== providerId))
        } catch (error) {
            console.error("Error unfollowing:", error)
        }
    }

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Following</h1>

                {following.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500 mb-4">You're not following anyone yet</p>
                            <Button onClick={() => router.push("/search")}>Find Providers</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {following.map(provider => (
                            <Card key={provider.id}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-14 h-14">
                                            <AvatarImage src={provider.image || ""} />
                                            <AvatarFallback>{provider.name?.[0] || "P"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{provider.name}</p>
                                            <p className="text-sm text-gray-500">{provider.profile?.headline || "Provider"}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm">4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleUnfollow(provider.id)}
                                        >
                                            Unfollow
                                        </Button>
                                        <Button onClick={() => router.push(`/provider/${provider.id}`)}>
                                            View
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
