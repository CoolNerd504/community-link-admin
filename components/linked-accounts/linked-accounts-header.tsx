export function LinkedAccountsHeader({ connectedCount }: { connectedCount: number }) {
    return (
        <div className="bg-white border-b border-[#eee] sticky top-0 z-10">
            <div className="max-w-[1400px] mx-auto px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-bold text-[#181818] mb-1">
                            Linked Accounts
                        </h1>
                        <p className="text-[15px] text-[#767676]">
                            Connect your accounts for easier access and enhanced security
                        </p>
                    </div>

                    {/* Connected Count Badge */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] rounded-[12px]">
                            <div className="size-2 bg-[#16a34a] rounded-full"></div>
                            <span className="text-[14px] font-semibold text-[#181818]">
                                {connectedCount} Connected
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
