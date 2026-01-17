"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../../../hooks/use-auth"
import { getSessionDetailsAction } from "../../../app/actions"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { ArrowLeft, Send } from "lucide-react"

interface Message {
    id: string
    senderId: string
    content: string
    createdAt: string
    isRead: boolean
}

interface ChatSession {
    id: string
    chatRoom?: {
        id: string
    }
    provider: {
        id: string
        name: string
        image?: string | null
    }
    client: {
        id: string
        name: string
        image?: string | null
    }
}

export default function ChatPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const sessionId = params.sessionId as string

    const [session, setSession] = useState<ChatSession | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        const loadSession = async () => {
            try {
                const sessionData = await getSessionDetailsAction(sessionId)
                setSession(sessionData as unknown as ChatSession) // Casting due to loose types

                if (sessionData && sessionData.chatRoom) {
                    // Load messages
                    fetchMessages(sessionData.chatRoom.id)
                }
            } catch (error) {
                console.error("Error loading session:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (sessionId) {
            loadSession()
        }
    }, [sessionId])

    const fetchMessages = async (chatRoomId: string) => {
        try {
            const res = await fetch(`/api/chat/${chatRoomId}/messages`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
                setTimeout(scrollToBottom, 100)
            }
        } catch (error) {
            console.error("Error fetching messages:", error)
        }
    }

    // Polling for new messages
    useEffect(() => {
        if (!session?.chatRoom?.id) return

        const interval = setInterval(() => {
            fetchMessages(session.chatRoom!.id)
        }, 5000)

        return () => clearInterval(interval)
    }, [session?.chatRoom?.id])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !session?.chatRoom?.id || isSending) return

        try {
            setIsSending(true)
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatRoomId: session.chatRoom.id,
                    content: newMessage
                })
            })

            if (res.ok) {
                setNewMessage("")
                fetchMessages(session.chatRoom.id)
            }
        } catch (error) {
            console.error("Error sending message:", error)
        } finally {
            setIsSending(false)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading chat...</div>
    }

    if (!session) {
        return <div className="flex justify-center items-center h-screen">Session not found</div>
    }

    const otherUser = user?.id === session.provider.id ? session.client : session.provider

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto h-[80vh] flex flex-col">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-2">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </div>

                <Card className="flex-1 flex flex-col overflow-hidden shadow-lg">
                    <CardHeader className="border-b p-4 flex flex-row items-center space-x-4 bg-white">
                        <Avatar>
                            <AvatarImage src={otherUser.image || ""} />
                            <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold text-lg">{otherUser.name}</h2>
                            <p className="text-xs text-gray-500">
                                {user?.id === session.provider.id ? "Client" : "Provider"}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gray-50">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === user?.id
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${isMe
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white border rounded-bl-none shadow-sm'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="rounded-full"
                                    disabled={!newMessage.trim() || isSending}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
