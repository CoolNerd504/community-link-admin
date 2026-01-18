import { Shield, Check, X, Info, Zap, RefreshCw, ShieldCheck } from "lucide-react"

interface SecurityScoreSidebarProps {
    securityScore: number
    twoFactorEnabled: boolean
    phoneVerified: boolean
    emailVerified: boolean
}

export function SecurityScoreSidebar({ securityScore, twoFactorEnabled, phoneVerified, emailVerified }: SecurityScoreSidebarProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "#16a34a"
        if (score >= 60) return "#f59e0b"
        return "#ef4444"
    }

    const strokeColor = getScoreColor(securityScore)
    const dasharray = `${(securityScore / 100) * 339.292} 339.292`

    return (
        <div className="sticky top-[120px] space-y-6">
            {/* Security Score Card */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="size-5 text-[#2563eb]" />
                    <h3 className="text-[18px] font-semibold text-[#181818]">Security Score</h3>
                </div>

                {/* Circular Progress */}
                <div className="relative size-32 mx-auto mb-4">
                    <svg className="transform -rotate-90 size-32" viewBox="0 0 120 120">
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#eee"
                            strokeWidth="8"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="8"
                            strokeDasharray={dasharray}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[32px] font-bold text-[#181818]">{securityScore}%</span>
                    </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[13px]">
                        {twoFactorEnabled ? (
                            <Check className="size-4 text-[#16a34a]" />
                        ) : (
                            <X className="size-4 text-[#ef4444]" />
                        )}
                        <span className="text-[#767676]">Two-factor authentication</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px]">
                        {phoneVerified ? (
                            <Check className="size-4 text-[#16a34a]" />
                        ) : (
                            <X className="size-4 text-[#ef4444]" />
                        )}
                        <span className="text-[#767676]">Phone verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px]">
                        {emailVerified ? (
                            <Check className="size-4 text-[#16a34a]" />
                        ) : (
                            <X className="size-4 text-[#ef4444]" />
                        )}
                        <span className="text-[#767676]">Email verified</span>
                    </div>
                </div>
            </div>

            {/* Security Tips Card */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-4">
                    <Info className="size-5 text-[#2563eb]" />
                    <h3 className="text-[18px] font-semibold text-[#181818]">Security Tips</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
                            <Zap className="size-4 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] text-[#181818] font-semibold mb-1">Strong Password</p>
                            <p className="text-[13px] text-[#767676]">Use at least 12 characters</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
                            <RefreshCw className="size-4 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] text-[#181818] font-semibold mb-1">Regular Updates</p>
                            <p className="text-[13px] text-[#767676]">Change password every 90 days</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="size-4 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] text-[#181818] font-semibold mb-1">Enable 2FA</p>
                            <p className="text-[13px] text-[#767676]">Add extra layer of security</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
