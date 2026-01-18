import { Zap, Calendar, MessageCircle, TrendingUp, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function BookingsSidebar() {
    const router = useRouter()

    return (
        <div className="sticky top-[120px] space-y-6">
            {/* Need Help Now Card */}
            <div className="bg-gradient-to-br from-[#181818] to-[#2c2c2c] rounded-[24px] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="size-5 text-[#f59e0b]" />
                    <h3 className="text-[18px] font-semibold text-white">Need Help Now?</h3>
                </div>
                <p className="text-[14px] text-white/80 mb-6 leading-relaxed">
                    Connect with available experts in under 5 minutes for urgent roadblocks.
                </p>
                <button
                    onClick={() => router.push("/user/instant")}
                    className="w-full bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8]"
                >
                    Start Instant Request
                </button>
            </div>

            {/* Quick Actions Card */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                <h3 className="text-[16px] font-semibold text-[#181818] mb-4">Quick Actions</h3>

                <div className="space-y-2">
                    {/* View Calendar - simplified to link to scheduled tab logically */}
                    <button className="w-full flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#f5f5f5] transition-colors text-left">
                        <div className="size-10 bg-[#f0f4ff] rounded-[12px] flex items-center justify-center">
                            <Calendar className="size-5 text-[#2563eb]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] font-semibold text-[#181818]">View Calendar</p>
                            <p className="text-[12px] text-[#767676]">See all sessions</p>
                        </div>
                        <ChevronRight className="size-5 text-[#767676]" />
                    </button>

                    {/* Messages */}
                    <button
                        onClick={() => router.push("/messages")}
                        className="w-full flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#f5f5f5] transition-colors text-left"
                    >
                        <div className="size-10 bg-[#f3e8ff] rounded-[12px] flex items-center justify-center">
                            <MessageCircle className="size-5 text-[#9333ea]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] font-semibold text-[#181818]">Messages</p>
                            <p className="text-[12px] text-[#767676]">Chat with providers</p>
                        </div>
                        <ChevronRight className="size-5 text-[#767676]" />
                    </button>

                    {/* Learning Path */}
                    <button className="w-full flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#f5f5f5] transition-colors text-left">
                        <div className="size-10 bg-[#dcfce7] rounded-[12px] flex items-center justify-center">
                            <TrendingUp className="size-5 text-[#16a34a]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] font-semibold text-[#181818]">Learning Path</p>
                            <p className="text-[12px] text-[#767676]">Track your progress</p>
                        </div>
                        <ChevronRight className="size-5 text-[#767676]" />
                    </button>
                </div>
            </div>
        </div>
    )
}
