import { Star, Shield, ArrowRight, TrendingUp } from "lucide-react"

export function ProviderSidebar() {
    return (
        <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[24px] p-6 text-white shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                    <div className="size-10 bg-white/20 rounded-[12px] flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp className="size-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-[16px] font-bold mb-1">Boost Your Visibility</h4>
                        <p className="text-[13px] text-blue-100 leading-relaxed">
                            Providers who maintain 95% response rate appear higher in search results.
                        </p>
                    </div>
                </div>
                <button className="w-full py-2.5 bg-white text-blue-600 rounded-[12px] text-[13px] font-bold hover:bg-blue-50 transition-colors">
                    View Insights
                </button>
            </div>

            {/* Performance Snapshot */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                <h3 className="text-[16px] font-bold text-gray-900 mb-4">Performance</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[16px]">
                        <div className="flex items-center gap-3">
                            <Star className="size-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-[14px] font-medium text-gray-700">Rating</span>
                        </div>
                        <span className="text-[14px] font-bold text-gray-900">4.9</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[16px]">
                        <div className="flex items-center gap-3">
                            <Shield className="size-4 text-green-500" />
                            <span className="text-[14px] font-medium text-gray-700">Response Rate</span>
                        </div>
                        <span className="text-[14px] font-bold text-gray-900">98%</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        All Analytics
                        <ArrowRight className="size-3" />
                    </button>
                </div>
            </div>
        </div>
    )
}
