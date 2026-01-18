import { BarChart2, DollarSign, TrendingUp, ArrowRight } from "lucide-react"

export function EarningsSummaryCard() {
    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-[12px] bg-green-50 flex items-center justify-center text-green-600">
                        <DollarSign className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-bold text-gray-900">Earnings</h3>
                        <p className="text-[13px] text-gray-500">Last 30 Days</p>
                    </div>
                </div>
                <button className="text-[13px] font-semibold text-blue-600 hover:text-blue-700">
                    View Details
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-[16px]">
                    <p className="text-[13px] font-medium text-gray-500 mb-1">Total Earned</p>
                    <h4 className="text-[24px] font-bold text-gray-900">ZMW 2,450</h4>
                    <div className="flex items-center gap-1 mt-1 text-green-600 text-[12px] font-bold">
                        <TrendingUp className="size-3" />
                        <span>+12.5%</span>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-[16px]">
                    <p className="text-[13px] font-medium text-gray-500 mb-1">Pending Payout</p>
                    <h4 className="text-[24px] font-bold text-gray-900">ZMW 450</h4>
                    <p className="text-[12px] text-gray-400 mt-1">Due in 2 days</p>
                </div>
            </div>

            {/* Simple Bar Chart Visualization Mock */}
            <div className="h-32 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full bg-blue-50 rounded-t-[4px] relative group">
                        <div
                            className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-[4px] opacity-80 group-hover:opacity-100 transition-all"
                            style={{ height: `${h}%` }}
                        ></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-[11px] text-gray-400 font-medium">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
            </div>
        </div>
    )
}
