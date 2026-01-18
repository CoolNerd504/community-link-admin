import { Plus, Search, MessageCircle, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
    const router = useRouter()

    return (
        <div className="bg-white rounded-[24px] border border-[#eee] p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Primary Action - Book Session */}
                <button
                    onClick={() => router.push("/user/discover")}
                    className="flex items-center gap-3 p-4 rounded-[16px] border-2 border-dashed border-[#eee] hover:border-[#2563eb] hover:bg-[#f0f4ff] group transition-all duration-200"
                >
                    <div className="size-10 bg-[#f5f5f5] rounded-[12px] flex items-center justify-center group-hover:bg-[#2563eb] transition-colors">
                        <Plus className="size-5 text-[#767676] group-hover:text-white" />
                    </div>
                    <span className="text-[15px] font-semibold text-[#181818]">Book Session</span>
                </button>

                {/* Find Provider */}
                <button
                    onClick={() => router.push("/user/discover")}
                    className="flex items-center gap-3 p-4 rounded-[16px] bg-[#f5f5f5] hover:bg-[#efefef] transition-colors"
                >
                    <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                        <Search className="size-5 text-[#767676]" />
                    </div>
                    <span className="text-[15px] font-semibold text-[#181818]">Find Provider</span>
                </button>

                {/* Messages */}
                <button
                    onClick={() => router.push("/user/messages")}
                    className="flex items-center gap-3 p-4 rounded-[16px] bg-[#f5f5f5] hover:bg-[#efefef] transition-colors"
                >
                    <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                        <MessageCircle className="size-5 text-[#767676]" />
                    </div>
                    <span className="text-[15px] font-semibold text-[#181818]">Messages</span>
                </button>

                {/* View Calendar */}
                <button
                    onClick={() => router.push("/user/schedule")}
                    className="flex items-center gap-3 p-4 rounded-[16px] bg-[#f5f5f5] hover:bg-[#efefef] transition-colors"
                >
                    <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                        <Calendar className="size-5 text-[#767676]" />
                    </div>
                    <span className="text-[15px] font-semibold text-[#181818]">View Calendar</span>
                </button>
            </div>
        </div>
    )
}
