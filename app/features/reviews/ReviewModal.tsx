"use client"

import { useState } from "react"
import { Star, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createReviewAction } from "@/app/actions"

interface ReviewModalProps {
    sessionId: string
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function ReviewModal({ sessionId, isOpen, onClose, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) return

        setIsSubmitting(true)
        try {
            await createReviewAction(sessionId, rating, comment)
            if (onSuccess) onSuccess()
            onClose()
        } catch (error) {
            console.error("Failed to submit review", error)
            alert("Failed to submit review. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rate your session</DialogTitle>
                    <DialogDescription>
                        How was your experience? Your feedback helps verify providers.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-colors"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= (hoverRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Additional Comments (Optional)</Label>
                        <Textarea
                            id="comment"
                            placeholder="Share details about your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Review"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
