"use client"

import { useState, useEffect } from "react"
import { Calendar } from "../../../components/ui/calendar"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { createScheduledBookingAction, getBookingQuoteAction } from "../../../app/actions"
import { format } from "date-fns"
import { Clock, CheckCircle, Calendar as CalendarIcon, DollarSign, ChevronRight, ChevronLeft } from "lucide-react"
import { Badge } from "../../../components/ui/badge"

interface BookingWizardProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    providerId: string
    services: any[]
}

const STEPS = {
    SERVICE: 1,
    DURATION: 2,
    DATETIME: 3,
    CONFIRM: 4
}

export function BookingWizard({ isOpen, onOpenChange, providerId, services }: BookingWizardProps) {
    const [step, setStep] = useState(STEPS.SERVICE)

    // Form State
    const [selectedServiceId, setSelectedServiceId] = useState<string>("")
    const [duration, setDuration] = useState<number>(30)
    const [customDuration, setCustomDuration] = useState<string>("")
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [time, setTime] = useState("09:00")
    const [notes, setNotes] = useState("")

    // Async State
    const [quotePrice, setQuotePrice] = useState<number | null>(null)
    const [isQuoteLoading, setIsQuoteLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    // Reset when closed
    useEffect(() => {
        if (!isOpen) {
            setStep(STEPS.SERVICE)
            setSuccess(false)
            setNotes("")
        }
    }, [isOpen])

    // Get Quote when entering Confirm step
    useEffect(() => {
        if (step === STEPS.CONFIRM && selectedServiceId && duration) {
            const fetchQuote = async () => {
                setIsQuoteLoading(true)
                try {
                    const price = await getBookingQuoteAction(providerId, selectedServiceId, duration)
                    setQuotePrice(price)
                } catch (error) {
                    console.error("Failed to get quote", error)
                } finally {
                    setIsQuoteLoading(false)
                }
            }
            fetchQuote()
        }
    }, [step, selectedServiceId, duration, providerId])

    const handleNext = () => {
        if (step === STEPS.SERVICE && !selectedServiceId) return
        setStep(prev => prev + 1)
    }

    const handleBack = () => {
        setStep(prev => prev - 1)
    }

    const handleSubmit = async () => {
        if (!date || !selectedServiceId) return

        setIsSubmitting(true)
        try {
            const [hours, minutes] = time.split(':').map(Number)
            const scheduledDate = new Date(date)
            scheduledDate.setHours(hours, minutes)

            await createScheduledBookingAction(providerId, selectedServiceId, {
                date: scheduledDate,
                duration,
                notes
            })
            setSuccess(true)
        } catch (error) {
            console.error("Booking failed:", error)
            alert("Booking failed. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedService = services.find(s => s.id === selectedServiceId)

    if (success) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-center">Booking Requested!</h3>
                        <p className="text-center text-gray-500">
                            Your request to {services[0]?.provider?.name || "the provider"} has been sent.
                        </p>
                        <Button onClick={() => onOpenChange(false)} className="mt-4 w-full">Done</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>
                        {step === STEPS.SERVICE && "Select Service"}
                        {step === STEPS.DURATION && "Select Duration"}
                        {step === STEPS.DATETIME && "Select Date & Time"}
                        {step === STEPS.CONFIRM && "Confirm Booking"}
                    </DialogTitle>
                    <div className="flex gap-1 mt-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        ))}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 pt-2">
                    {/* STEP 1: SERVICE */}
                    {step === STEPS.SERVICE && (
                        <div className="space-y-3">
                            {services.map(service => (
                                <div
                                    key={service.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedServiceId === service.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:border-gray-300'}`}
                                    onClick={() => {
                                        setSelectedServiceId(service.id)
                                        // Set default duration from service if available, else 30
                                        setDuration(service.duration || 30)
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{service.title || service.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                                        </div>
                                        <div className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">
                                            From ${service.price}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 2: DURATION */}
                    {step === STEPS.DURATION && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                {[15, 30, 45, 60].map(mins => (
                                    <Button
                                        key={mins}
                                        variant={duration === mins ? "default" : "outline"}
                                        className="h-12 text-lg"
                                        onClick={() => {
                                            setDuration(mins)
                                            setCustomDuration("")
                                        }}
                                    >
                                        {mins} mins
                                    </Button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label>Custom Duration (minutes)</Label>
                                <input
                                    type="number"
                                    min="15"
                                    placeholder="Enter minutes (min 15)"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={customDuration}
                                    onChange={(e) => {
                                        setCustomDuration(e.target.value)
                                        setDuration(Number(e.target.value))
                                    }}
                                />
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-md text-sm text-yellow-800">
                                <p>Note: Pricing is dynamic and calculated based on demand and time of booking. You will see the estimated total in the confirmation step.</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: DATE & TIME */}
                    {step === STEPS.DATETIME && (
                        <div className="space-y-6">
                            <div className="flex justify-center border rounded-lg p-4 bg-white">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="rounded-md"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Select Start Time</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="time"
                                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: CONFIRM */}
                    {step === STEPS.CONFIRM && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{selectedService?.title || selectedService?.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {date?.toLocaleDateString()} at {time}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Duration: {duration} minutes
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Add Notes (Optional)</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any specific topics you want to cover?"
                                    className="resize-none"
                                />
                            </div>

                            <div className="border-t pt-4 mt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Dynamic Rate</span>
                                    {isQuoteLoading ? (
                                        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                                    ) : (
                                        <span className="font-medium text-gray-900">
                                            ≈ ${(quotePrice! / (duration / 60)).toFixed(2)} / hr
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total Estimated</span>
                                    {isQuoteLoading ? (
                                        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                                    ) : (
                                        <span className="text-blue-600">${quotePrice?.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 pt-2 border-t mt-auto flex justify-between bg-white z-10 rounded-b-lg">
                    {step > STEPS.SERVICE ? (
                        <Button variant="outline" onClick={handleBack}>
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < STEPS.CONFIRM ? (
                        <Button onClick={handleNext} disabled={step === STEPS.SERVICE && !selectedServiceId}>
                            Continue
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting || isQuoteLoading}>
                            {isSubmitting ? "Confirming..." : "Confirm Booking"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
