"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"

export default function MessagesListPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [conversations, setConversations] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true)
            try {
                // Fetch sessions that have chat rooms
                const res = await fetch("/api/sessions")
                if (res.ok) {
                    const data = await res.json()
                    // Filter to only those with chat activity
                    setConversations(data.filter((s: any) => s.chatRoom))
                }
            } catch (error) {
                console.error("Error fetching conversations:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchConversations()
    }, [user])

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Messages</h1>

                {conversations.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">No conversations yet</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Start a conversation by messaging a provider
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {conversations.map(conv => {
                            const otherUser = user?.role === "PROVIDER" ? conv.client : conv.provider
                            return (
                                <Card
                                    key={conv.id}
                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => router.push(`/messages/${conv.id}`)}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={otherUser?.image || ""} />
                                            <AvatarFallback>{otherUser?.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold">{otherUser?.name || "User"}</p>
                                                <span className="text-xs text-gray-400">
                                                    {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString() : ""}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">
                                                {conv.lastMessage || "No messages yet"}
                                            </p>
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <Badge className="bg-blue-600">{conv.unreadCount}</Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
