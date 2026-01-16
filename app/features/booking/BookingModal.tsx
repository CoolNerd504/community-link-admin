"use client"

import { useState } from "react"
import { Calendar } from "../../../components/ui/calendar"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { createScheduledBookingAction } from "../../../app/actions"
import { format } from "date-fns"
import { Clock } from "lucide-react"

interface BookingModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    providerId: string
    serviceId?: string
    serviceName?: string
    price?: number
}

export function BookingModal({ isOpen, onOpenChange, providerId, serviceId, serviceName, price }: BookingModalProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [time, setTime] = useState("09:00")
    const [notes, setNotes] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async () => {
        if (!date || !serviceId) {
            console.error("Missing date or serviceId")
            return
        }

        setIsSubmitting(true)
        try {
            // Combine date and time
            const [hours, minutes] = time.split(':').map(Number)
            const scheduledDate = new Date(date)
            scheduledDate.setHours(hours, minutes)

            await createScheduledBookingAction(providerId, serviceId, {
                date: scheduledDate,
                notes
            })
            setSuccess(true)
            setTimeout(() => {
                onOpenChange(false)
                setSuccess(false)
                setNotes("")
            }, 2000)
        } catch (error) {
            console.error("Booking failed:", error)
            alert("Failed to book session. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-center">Booking Request Sent!</h3>
                        <p className="text-center text-gray-500">
                            Your request for {serviceName || "session"} has been sent. You will be notified when the provider accepts.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Book Session</DialogTitle>
                    <DialogDescription>
                        Request a session with the provider.
                        {serviceName && <span className="block mt-1 font-medium text-black">{serviceName} • ZMW {price}</span>}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Select Date</Label>
                        <div className="border rounded-md p-2 flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border-0"
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="time">Select Time</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="time"
                                id="time"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Briefly describe what you'd like to discuss..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !date}>
                        {isSubmitting ? "Sending..." : "Send Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
