"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Clock } from "lucide-react"

export default function ClientSessionCallPage() {
    const { id: sessionId } = useParams()
    const { user, loading } = useAuth()
    const router = useRouter()

    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(false)
    const [duration, setDuration] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        // Start session timer
        const startCall = async () => {
            try {
                await fetch(`/api/sessions/${sessionId}/start`, { method: "POST" })
                timerRef.current = setInterval(() => {
                    setDuration(prev => prev + 1)
                }, 1000)
            } catch (error) {
                console.error("Failed to start session:", error)
            }
        }

        if (sessionId && user) startCall()

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [sessionId, user])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleEndCall = async () => {
        try {
            if (timerRef.current) clearInterval(timerRef.current)
            await fetch(`/api/sessions/${sessionId}/end`, { method: "POST" })
            router.push(`/session/${sessionId}/review`)
        } catch (error) {
            console.error("Failed to end session:", error)
        }
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Video Area */}
            <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-400 text-lg">Provider Video Feed</p>
                </div>

                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-white">
                    <p className="text-gray-400 text-xs">You</p>
                </div>

                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                    <Card className="bg-black/50 border-none">
                        <CardContent className="p-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-white" />
                            <span className="text-white font-mono text-lg">{formatTime(duration)}</span>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-6">
                <div className="flex justify-center gap-6">
                    <Button
                        variant="outline"
                        size="lg"
                        className={`rounded-full w-14 h-14 ${isMuted ? 'bg-red-500 text-white border-red-500' : ''}`}
                        onClick={() => setIsMuted(!isMuted)}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className={`rounded-full w-14 h-14 ${isCameraOff ? 'bg-red-500 text-white border-red-500' : ''}`}
                        onClick={() => setIsCameraOff(!isCameraOff)}
                    >
                        {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                    </Button>

                    <Button
                        variant="destructive"
                        size="lg"
                        className="rounded-full w-14 h-14"
                        onClick={handleEndCall}
                    >
                        <PhoneOff className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
