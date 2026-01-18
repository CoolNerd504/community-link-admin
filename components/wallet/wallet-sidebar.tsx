import { HelpCircle, MessageCircle } from "lucide-react"

export function WalletSidebar() {
    return (
        <div className="sticky top-[120px] space-y-6">
            {/* How It Works */}
            <div className="bg-white rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                <h3 className="text-[18px] font-semibold text-[#181818] mb-4">
                    How It Works
                </h3>

                <div className="space-y-4 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-[#f5f5f5]"></div>

                    <div className="relative flex gap-4">
                        <div className="size-8 rounded-full bg-[#f0f4ff] border-2 border-white shadow-sm flex items-center justify-center z-10 text-[12px] font-bold text-[#2563eb]">
                            1
                        </div>
                        <div>
                            <p className="text-[14px] font-semibold text-[#181818]">Choose Package</p>
                            <p className="text-[12px] text-[#767676]">Select the minute bundle that fits</p>
                        </div>
                    </div>

                    <div className="relative flex gap-4">
                        <div className="size-8 rounded-full bg-[#f0f4ff] border-2 border-white shadow-sm flex items-center justify-center z-10 text-[12px] font-bold text-[#2563eb]">
                            2
                        </div>
                        <div>
                            <p className="text-[14px] font-semibold text-[#181818]">Secure Payment</p>
                            <p className="text-[12px] text-[#767676]">Pay via Mobile Money or Card</p>
                        </div>
                    </div>

                    <div className="relative flex gap-4">
                        <div className="size-8 rounded-full bg-[#f0f4ff] border-2 border-white shadow-sm flex items-center justify-center z-10 text-[12px] font-bold text-[#2563eb]">
                            3
                        </div>
                        <div>
                            <p className="text-[14px] font-semibold text-[#181818]">Start Booking</p>
                            <p className="text-[12px] text-[#767676]">Use minutes with any provider</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Need Help */}
            <div className="bg-[#2563eb] rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <HelpCircle className="size-24" />
                </div>

                <h3 className="text-[18px] font-bold mb-2 relative z-10">Need Help?</h3>
                <p className="text-[13px] text-white/80 mb-6 relative z-10">
                    Having trouble with payments or minutes? Our support team is here 24/7.
                </p>

                <button className="w-full bg-white text-[#2563eb] rounded-[12px] py-3 font-semibold text-[14px] hover:bg-white/90 transition-colors flex items-center justify-center gap-2 relative z-10 shadow-sm">
                    <MessageCircle className="size-4" />
                    Contact Support
                </button>
            </div>
        </div>
    )
}
