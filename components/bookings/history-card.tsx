import { FileText, Star } from "lucide-react"
import { BookingResponse } from "./types"

interface HistoryCardProps {
    booking: BookingResponse
}

export function HistoryCard({ booking }: HistoryCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "ACCEPTED":
            case "COMPLETED":
            case "CONFIRMED":
                return "bg-[#dcfce7] text-[#16a34a]"
            case "DECLINED":
            case "CANCELLED":
                return "bg-[#fee2e2] text-[#ef4444]"
            default:
                return "bg-[#fef3c7] text-[#f59e0b]"
        }
    }

    const getDisplayStatus = (status: string) => {
        if (status === "ACCEPTED" || status === "CONFIRMED") return "COMPLETED"
        return status
    }

    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] mb-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Provider Image */}
                <img
                    src={booking.service.provider.image || "/placeholder-user.jpg"}
                    alt={booking.service.provider.name}
                    className="size-16 rounded-[16px] object-cover bg-gray-200"
                />

                {/* Booking Info */}
                <div className="flex-1 w-full">
                    {/* Title & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                        <div>
                            <h3 className="text-[18px] font-semibold text-[#181818] mb-1">
                                {booking.service.title}
                            </h3>
                            <p className="text-[14px] text-[#767676]">
                                {booking.service.provider.name} • {booking.requestedTime ? formatDate(booking.requestedTime) : "N/A"}
                            </p>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-[13px] font-semibold self-start mt-2 sm:mt-0 ${getStatusStyle(booking.status)}`}>
                            {getDisplayStatus(booking.status)}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4">
                        {(booking.status === "ACCEPTED" || booking.status === "CONFIRMED" || booking.status === "COMPLETED") ? (
                            <>
                                <button className="px-4 py-2 bg-[#f5f5f5] text-[#181818] rounded-[12px] font-semibold text-[13px] hover:bg-[#efefef] flex items-center gap-2">
                                    <FileText className="size-4" />
                                    Receipt
                                </button>
                                <button className="px-4 py-2 bg-[#f5f5f5] text-[#181818] rounded-[12px] font-semibold text-[13px] hover:bg-[#efefef] flex items-center gap-2">
                                    <Star className="size-4" />
                                    Rate Provider
                                </button>
                            </>
                        ) : (
                            <button className="px-4 py-2 bg-[#f5f5f5] text-[#767676] rounded-[12px] font-semibold text-[13px] hover:bg-[#efefef]">
                                View Details
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
