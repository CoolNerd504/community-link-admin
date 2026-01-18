import { Clock, Calendar, DollarSign } from "lucide-react"
import { BookingStats as StatsType } from "./types"

interface BookingStatsProps {
    stats: StatsType
}

export function BookingStats({ stats }: BookingStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Hours */}
            <div className="bg-[#f5f5f5] rounded-[16px] p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[13px] text-[#767676] mb-1">TOTAL HOURS</p>
                        <p className="text-[28px] font-bold text-[#181818]">{stats.totalHours.toFixed(1)}</p>
                    </div>
                    <div className="size-12 bg-[#e3f2fd] rounded-[12px] flex items-center justify-center">
                        <Clock className="size-6 text-[#2563eb]" />
                    </div>
                </div>
            </div>

            {/* Active Bookings */}
            <div className="bg-[#f5f5f5] rounded-[16px] p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[13px] text-[#767676] mb-1">ACTIVE BOOKINGS</p>
                        <p className="text-[28px] font-bold text-[#181818]">{stats.activeBookings}</p>
                    </div>
                    <div className="size-12 bg-[#f3e8ff] rounded-[12px] flex items-center justify-center">
                        <Calendar className="size-6 text-[#9333ea]" />
                    </div>
                </div>
            </div>

            {/* Wallet Credits */}
            <div className="bg-[#f5f5f5] rounded-[16px] p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[13px] text-[#767676] mb-1">WALLET CREDITS</p>
                        <p className="text-[28px] font-bold text-[#181818]">{stats.currency} {stats.walletCredits.toLocaleString()}</p>
                    </div>
                    <div className="size-12 bg-[#dcfce7] rounded-[12px] flex items-center justify-center">
                        <DollarSign className="size-6 text-[#16a34a]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
