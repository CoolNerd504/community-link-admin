import { Clock, Unlink, Link } from "lucide-react"
import { ProviderConfig, LinkedAccount } from "./types"

interface ProviderCardProps {
    provider: ProviderConfig
    isLinked: boolean
    account?: LinkedAccount
    onLink?: (providerId: string) => void
    onUnlink?: (providerId: string) => void
}

export function ProviderCard({ provider, isLinked, account, onLink, onUnlink }: ProviderCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="size-12 rounded-[12px] flex items-center justify-center text-white"
                        style={{ backgroundColor: provider.bgColor }}
                    >
                        {provider.icon}
                    </div>
                    <div>
                        <p className="text-[16px] font-semibold text-[#181818] mb-1">
                            {provider.name}
                        </p>
                        {isLinked ? (
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] rounded-full text-[11px] font-semibold">
                                    CONNECTED
                                </span>
                            </div>
                        ) : (
                            <p className="text-[13px] text-[#767676]">
                                {provider.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {isLinked && account && (
                <div className="flex items-center gap-2 text-[13px] text-[#767676] mb-4">
                    <Clock className="size-4" />
                    <span>Connected on {formatDate(account.createdAt)}</span>
                </div>
            )}

            {isLinked ? (
                <button
                    onClick={() => onUnlink?.(provider.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-[#ef4444] text-[#ef4444] rounded-[12px] font-semibold text-[14px] hover:bg-[#fef2f2] transition-colors"
                >
                    <Unlink className="size-4" />
                    Disconnect
                </button>
            ) : (
                <button
                    onClick={() => onLink?.(provider.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-[#2563eb] text-white rounded-[12px] font-semibold text-[14px] hover:bg-[#1d4ed8] transition-colors"
                >
                    <Link className="size-4" />
                    Connect
                </button>
            )}
        </div>
    )
}
