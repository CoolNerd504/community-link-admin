import { TrendingUp } from "lucide-react"

interface ProgressCardProps {
    sessionCount: number
    monthlyGoal?: number
}

export function ProgressCard({ sessionCount, monthlyGoal = 5 }: ProgressCardProps) {
    const progressPercentage = Math.min((sessionCount / monthlyGoal) * 100, 100)

    return (
        <div className="w-full lg:w-[340px]">
            <div className="rounded-[24px] p-6 shadow-[0px_16px_35px_0px_rgba(37,99,235,0.3)] bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white">
                <div className="size-12 bg-white/20 rounded-[12px] flex items-center justify-center mb-4">
                    <TrendingUp className="size-6 text-white" />
                </div>

                <h3 className="text-[18px] font-semibold mb-2">Your Progress</h3>
                <p className="text-[14px] text-white/80 mb-6">
                    You've completed {sessionCount} sessions this month. Keep up the great work!
                </p>

                <div className="bg-white/20 rounded-[12px] p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[13px]">Monthly Goal</span>
                        <span className="text-[13px] font-semibold">{sessionCount}/{monthlyGoal} Sessions</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <button className="w-full bg-white text-[#2563eb] rounded-[12px] py-3 font-semibold text-[14px] hover:bg-white/90 transition-colors">
                    View Detailed Stats
                </button>
            </div>
        </div>
    )
}
