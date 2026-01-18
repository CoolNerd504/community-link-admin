import { Clock, Gift } from "lucide-react"

interface WalletStats {
    availableMinutes: number
    totalPurchased: number
    totalSpent: number
    avgSessionLength: number
    currency: string
}

interface BalanceCardProps {
    stats: WalletStats
}

export function BalanceCard({ stats }: BalanceCardProps) {
    const hours = Math.floor(stats.availableMinutes / 60)
    const minutes = stats.availableMinutes % 60

    return (
        <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-[24px] p-8 mb-8 shadow-[0px_16px_35px_0px_rgba(37,99,235,0.3)]">
            {/* Top Section - Available Minutes */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-[14px] text-white/80 mb-2">Available Minutes</p>
                    <p className="text-[48px] font-bold text-white leading-none mb-2">
                        {stats.availableMinutes}
                    </p>
                    <p className="text-[14px] text-white/80">
                        ≈ {hours} hours {minutes} minutes
                    </p>
                </div>
                <div className="size-16 bg-white/20 rounded-[16px] flex items-center justify-center">
                    <Clock className="size-8 text-white" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-[16px] p-4 backdrop-blur-sm">
                    <p className="text-[10px] sm:text-[12px] text-white/80 mb-1 uppercase">Total Purchased</p>
                    <p className="text-[18px] sm:text-[20px] font-bold text-white">{stats.totalPurchased}</p>
                </div>
                <div className="bg-white/10 rounded-[16px] p-4 backdrop-blur-sm">
                    <p className="text-[10px] sm:text-[12px] text-white/80 mb-1 uppercase">Total Spent</p>
                    <p className="text-[18px] sm:text-[20px] font-bold text-white uppercase">{stats.currency} {stats.totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded-[16px] p-4 backdrop-blur-sm">
                    <p className="text-[10px] sm:text-[12px] text-white/80 mb-1 uppercase">Avg Session</p>
                    <p className="text-[18px] sm:text-[20px] font-bold text-white">{stats.avgSessionLength} min</p>
                </div>
            </div>

            {/* Special Offer - Integrated */}
            <div className="bg-white/15 backdrop-blur-sm rounded-[20px] p-5 border border-white/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Left: Icon + Text */}
                    <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                        <div className="size-10 bg-[#9333ea] rounded-[12px] flex items-center justify-center flex-shrink-0">
                            <Gift className="size-5 text-white" />
                        </div>
                        <div>
                            <p className="text-[16px] sm:text-[18px] font-bold text-white mb-1">
                                Get 10% Bonus Minutes
                            </p>
                            <p className="text-[12px] sm:text-[13px] text-white/80">
                                Purchase 300+ minutes and receive extra 10% bonus!
                            </p>
                        </div>
                    </div>

                    {/* Right: Promo Code + Button */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <div className="bg-white/20 rounded-[12px] px-4 py-2.5 backdrop-blur-sm border border-white/30 hidden sm:block">
                            <p className="text-[10px] text-white/80 mb-0.5 tracking-wide">PROMO CODE</p>
                            <p className="text-[16px] font-mono font-bold text-white">WELCOME10</p>
                        </div>
                        <button className="bg-white text-[#2563eb] rounded-[12px] px-5 py-2.5 font-semibold text-[14px] hover:bg-white/90 transition-colors whitespace-nowrap w-full sm:w-auto">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
