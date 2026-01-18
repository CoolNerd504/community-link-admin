import { Calendar, Clock, Globe, Video, ExternalLink } from "lucide-react"
import { BookingResponse } from "./types"
import { Badge } from "@/components/ui/badge"

interface ScheduledSessionCardProps {
    booking: BookingResponse
    onJoin: (id: string) => void
    onReschedule: (id: string) => void
    onCancel: (id: string) => void
}

export function ScheduledSessionCard({ booking, onJoin, onReschedule, onCancel }: ScheduledSessionCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }

    const isLive = booking.status === "ACCEPTED" // In real app, check time window too

    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] mb-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Provider Image */}
                <div className="relative">
                    <img
                        src={booking.service.provider.image || "/placeholder-user.jpg"}
                        alt={booking.service.provider.name}
                        className="size-16 rounded-[16px] object-cover bg-gray-200"
                    />
                    {booking.service.provider.profile?.isVerified && (
                        <div className="absolute -top-1 -right-1 size-4 bg-blue-500 rounded-full border-2 border-white" />
                    )}
                </div>

                {/* Booking Info */}
                <div className="flex-1 w-full">
                    {/* Title & Provider */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                        <div>
                            <h3 className="text-[18px] font-semibold text-[#181818] mb-1">
                                {booking.service.title}
                            </h3>
                            <p className="text-[14px] text-[#767676]">
                                {booking.service.provider.name} • {booking.service.provider.profile?.headline || "Service Provider"}
                            </p>
                        </div>

                        {/* Status Badge */}
                        {isLive ? (
                            <span className="px-3 py-1 bg-[#fee2e2] text-[#ef4444] rounded-full text-[13px] font-bold self-start">
                                LIVE NOW
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-[#dbeafe] text-[#2563eb] rounded-full text-[13px] font-semibold self-start">
                                SCHEDULED
                            </span>
                        )}
                    </div>

                    {/* Time & Duration Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-[14px] text-[#181818]">
                            <Calendar className="size-4 text-[#767676]" />
                            <span className="font-semibold">
                                {booking.requestedTime ? formatDate(booking.requestedTime) : "TBD"}, {booking.requestedTime ? formatTime(booking.requestedTime) : ""}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[14px] text-[#767676]">
                            <Clock className="size-4" />
                            <span>{booking.duration} MINS</span>
                        </div>
                        <div className="flex items-center gap-2 text-[14px] text-[#767676]">
                            <Globe className="size-4" />
                            <span>VIDEO CALL</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {/* Join Session (when live or confirmed) */}
                        <button
                            onClick={() => onJoin(booking.id)}
                            className="w-full sm:flex-1 bg-[#2563eb] text-white rounded-[12px] py-3 px-4 font-semibold text-[15px] hover:bg-[#1d4ed8] flex items-center justify-center gap-2"
                        >
                            <Video className="size-5" />
                            Join Session
                        </button>

                        {/* Reschedule */}
                        <button
                            onClick={() => onReschedule(booking.id)}
                            className="w-full sm:flex-1 bg-[#f5f5f5] text-[#181818] rounded-[12px] py-3 px-4 font-semibold text-[14px] hover:bg-[#efefef]"
                        >
                            Reschedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
