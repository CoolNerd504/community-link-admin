import { ShieldCheck } from "lucide-react"

export function SecurityHeader({ securityScore }: { securityScore: number }) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-[#16a34a]"
        if (score >= 60) return "text-[#f59e0b]"
        return "text-[#ef4444]"
    }

    return (
        <div className="bg-white border-b border-[#eee] sticky top-0 z-10 w-full">
            <div className="max-w-[1400px] mx-auto px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-bold text-[#181818] mb-1">
                            Privacy & Security
                        </h1>
                        <p className="text-[15px] text-[#767676]">
                            Manage your account security and privacy preferences
                        </p>
                    </div>

                    {/* Security Score Badge */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] rounded-[12px]">
                            <ShieldCheck className={`size-4 ${getScoreColor(securityScore)}`} />
                            <span className="text-[14px] font-semibold text-[#181818]">
                                Security: {securityScore}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
