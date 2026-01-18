"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Star } from "lucide-react"

export default function ClientFavoritesPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [favorites, setFavorites] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchFavorites = async () => {
            setIsLoading(true)
            try {
                const res = await fetch("/api/mobile/favorites")
                if (res.ok) {
                    const data = await res.json()
                    setFavorites(data)
                }
            } catch (error) {
                console.error("Error fetching favorites:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchFavorites()
    }, [user])

    const handleRemoveFavorite = async (providerId: string) => {
        try {
            await fetch(`/api/providers/${providerId}/favorite`, { method: "DELETE" })
            setFavorites(prev => prev.filter(f => f.id !== providerId))
        } catch (error) {
            console.error("Error removing favorite:", error)
        }
    }

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

                {favorites.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500 mb-4">No favorites yet</p>
                            <Button onClick={() => router.push("/search")}>Discover Providers</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favorites.map(provider => (
                            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={provider.image || ""} />
                                            <AvatarFallback>{provider.name?.[0] || "P"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold">{provider.name}</p>
                                            <p className="text-sm text-gray-500">{provider.profile?.headline || "Provider"}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFavorite(provider.id)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Heart className="w-5 h-5 fill-current" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1 mb-3">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">4.8</span>
                                        <span className="text-sm text-gray-500">(24 reviews)</span>
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={() => router.push(`/provider/${provider.id}`)}
                                    >
                                        View Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
