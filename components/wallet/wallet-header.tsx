import { History } from "lucide-react"

interface WalletHeaderProps {
    onViewHistory: () => void
}

export function WalletHeader({ onViewHistory }: WalletHeaderProps) {
    return (
        <div className="bg-white border-b border-[#eee] sticky top-0 z-10">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-bold text-[#181818] mb-1">
                            Wallet & Minutes
                        </h1>
                        <p className="text-[15px] text-[#767676]">
                            Manage your session minutes and top-up packages
                        </p>
                    </div>
                    <button
                        onClick={onViewHistory}
                        className="flex items-center gap-2 px-4 h-[44px] border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors"
                    >
                        <History className="size-4" />
                        View History
                    </button>
                </div>
            </div>
        </div>
    )
}
