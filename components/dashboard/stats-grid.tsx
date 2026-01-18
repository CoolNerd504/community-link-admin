import { Calendar, TrendingUp, Zap, DollarSign, Heart } from "lucide-react"

interface StatsGridProps {
    stats: {
        totalSessions: number
        upcomingSessions: number
        totalSpent: number
        savedProviders: number
    }
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 1. Total Sessions */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-[#e3f2fd] rounded-[12px] flex items-center justify-center">
                        <Calendar className="size-6 text-[#2563eb]" />
                    </div>
                    <div className="flex items-center gap-1 text-[#16a34a] text-[12px] font-semibold bg-[#dcfce7] px-2 py-1 rounded-full">
                        <TrendingUp className="size-3" />
                        +12%
                    </div>
                </div>
                <p className="text-[13px] text-[#767676] mb-1">Total Sessions</p>
                <p className="text-[28px] font-bold text-[#181818]">{stats.totalSessions}</p>
            </div>

            {/* 2. Upcoming Sessions */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-[#f3e8ff] rounded-[12px] flex items-center justify-center">
                        <ClockIcon className="size-6 text-[#9333ea]" />
                    </div>
                    <div className="flex items-center gap-1 text-[#2563eb] text-[12px] font-semibold bg-[#dbeafe] px-2 py-1 rounded-full">
                        <Zap className="size-3 fill-current" />
                        Active
                    </div>
                </div>
                <p className="text-[13px] text-[#767676] mb-1">Upcoming</p>
                <p className="text-[28px] font-bold text-[#181818]">{stats.upcomingSessions}</p>
            </div>

            {/* 3. Total Spent */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-[#dcfce7] rounded-[12px] flex items-center justify-center">
                        <DollarSign className="size-6 text-[#16a34a]" />
                    </div>
                    <p className="text-[12px] text-[#767676] font-medium">This year</p>
                </div>
                <p className="text-[13px] text-[#767676] mb-1">Total Spent</p>
                <p className="text-[28px] font-bold text-[#181818]">
                    ZMW {stats.totalSpent.toLocaleString()}
                </p>
            </div>

            {/* 4. Saved Providers */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-[#fee2e2] rounded-[12px] flex items-center justify-center">
                        <Heart className="size-6 text-[#ef4444]" />
                    </div>
                </div>
                <p className="text-[13px] text-[#767676] mb-1">Saved Providers</p>
                <p className="text-[28px] font-bold text-[#181818]">{stats.savedProviders}</p>
            </div>
        </div>
    )
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
