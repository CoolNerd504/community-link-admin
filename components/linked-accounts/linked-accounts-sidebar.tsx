import { Shield, Zap, Lock, Check, Info, ExternalLink, AlertCircle, ChevronRight } from "lucide-react"

export function LinkedAccountsSidebar() {
    return (
        <div className="sticky top-[120px] space-y-6">
            {/* Why Link Accounts? */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="size-5 text-[#2563eb]" />
                    <h3 className="text-[18px] font-semibold text-[#181818]">
                        Why Link Accounts?
                    </h3>
                </div>

                <div className="space-y-4">
                    {/* Benefit 1 */}
                    <div className="flex gap-3">
                        <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
                            <Zap className="size-4 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] text-[#181818] font-semibold mb-1">
                                Quick Sign In
                            </p>
                            <p className="text-[13px] text-[#767676]">
                                Access your account with one click
                            </p>
                        </div>
                    </div>

                    {/* Benefit 2 */}
                    <div className="flex gap-3">
                        <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
                            <Lock className="size-4 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] text-[#181818] font-semibold mb-1">
                                Enhanced Security
                            </p>
                            <p className="text-[13px] text-[#767676]">
                                Two-factor authentication support
                            </p>
                        </div>
                    </div>

                    {/* Benefit 3 */}
                    <div className="flex gap-3">
                        <div className="size-8 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="size-4 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] text-[#181818] font-semibold mb-1">
                                Verified Identity
                            </p>
                            <p className="text-[13px] text-[#767676]">
                                Build trust with verified accounts
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Notice */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-3">
                    <Info className="size-5 text-[#767676]" />
                    <h3 className="text-[16px] font-semibold text-[#181818]">
                        Security Notice
                    </h3>
                </div>

                <p className="text-[13px] text-[#767676] mb-4 leading-relaxed">
                    We use industry-standard OAuth 2.0 to securely connect your accounts.
                    We never store your passwords.
                </p>

                <button className="w-full flex items-center justify-center gap-2 py-2 border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors">
                    Learn More
                    <ExternalLink className="size-4" />
                </button>
            </div>

            {/* Need Help? */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="size-5 text-[#767676]" />
                    <h3 className="text-[16px] font-semibold text-[#181818]">
                        Need Help?
                    </h3>
                </div>

                <p className="text-[13px] text-[#767676] mb-4">
                    Having trouble linking accounts? Our support team is here to help.
                </p>

                <button className="w-full flex items-center justify-center gap-2 py-2 border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors">
                    Contact Support
                    <ChevronRight className="size-4" />
                </button>
            </div>
        </div>
    )
}
