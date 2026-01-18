import { Clock, Zap } from "lucide-react"
import { BookingResponse } from "./types"

interface InstantRequestCardProps {
    booking: BookingResponse
    onCancel: (id: string) => void
}

export function InstantRequestCard({ booking, onCancel }: InstantRequestCardProps) {
    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] mb-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Searching Animation */}
                <div className="size-16 bg-[#f0f4ff] rounded-[16px] flex items-center justify-center shrink-0">
                    <div className="size-8 bg-[#2563eb] rounded-full flex items-center justify-center animate-pulse">
                        <div className="size-3 bg-white rounded-full"></div>
                    </div>
                </div>

                {/* Request Info */}
                <div className="flex-1 w-full">
                    {/* Title & Category */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                        <div>
                            <h3 className="text-[18px] font-semibold text-[#181818] mb-1">
                                {booking.service.title}
                            </h3>
                            <p className="text-[14px] text-[#767676]">
                                Category: {booking.service.category}
                            </p>
                        </div>

                        {/* Cancel Button */}
                        <button
                            onClick={() => onCancel(booking.id)}
                            className="text-[14px] font-semibold text-[#ef4444] hover:text-[#dc2626] self-start mt-2 sm:mt-0"
                        >
                            Cancel Request
                        </button>
                    </div>

                    {/* Status & Wait Time */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-[#dcfce7] text-[#16a34a] rounded-full text-[13px] font-semibold">
                            WAITING FOR PROVIDER
                        </span>
                        {/* Mock Wait Time */}
                        <div className="flex items-center gap-2 text-[13px] text-[#767676]">
                            <Clock className="size-4" />
                            <span>EST. WAIT: 2-5 MINS</span>
                        </div>
                    </div>

                    {/* Notes Display */}
                    {booking.notes && (
                        <div className="bg-[#f5f5f5] rounded-[12px] p-3 mb-3">
                            <p className="text-[13px] text-[#767676]">
                                <span className="font-semibold text-[#181818]">Your message:</span> {booking.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
