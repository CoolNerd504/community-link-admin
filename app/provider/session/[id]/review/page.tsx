"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, CheckCircle } from "lucide-react"

export default function SessionReviewPage() {
    const { id: sessionId } = useParams()
    const { user, loading } = useAuth()
    const router = useRouter()

    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) return

        setIsSubmitting(true)
        try {
            await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    rating,
                    comment
                })
            })
            setIsSubmitted(true)
            setTimeout(() => router.push("/provider/dashboard"), 2000)
        } catch (error) {
            console.error("Failed to submit review:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Review Submitted!</h2>
                    <p className="text-gray-500">Thank you for your feedback.</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <h2 className="text-xl font-bold text-center">Session Complete</h2>
                    <p className="text-gray-500 text-center">How was your experience?</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Star Rating */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Comment */}
                    <div>
                        <Textarea
                            placeholder="Share your thoughts about the session (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Submit */}
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={rating === 0 || isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => router.push("/provider/dashboard")}
                    >
                        Skip
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
