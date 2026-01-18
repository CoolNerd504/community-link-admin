import { AlertTriangle, Unlink } from "lucide-react"
import { ProviderConfig } from "./types"

interface UnlinkModalProps {
    isOpen: boolean
    provider: ProviderConfig | null
    onClose: () => void
    onConfirm: () => void
}

export function UnlinkModal({ isOpen, provider, onClose, onConfirm }: UnlinkModalProps) {
    if (!isOpen || !provider) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.98)] rounded-[24px] border border-[#eee] p-8 max-w-md w-full shadow-[0px_20px_60px_0px_rgba(0,0,0,0.3)]">
                <div className="text-center">
                    {/* Warning Icon */}
                    <div className="size-16 bg-[#fef3c7] rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="size-8 text-[#f59e0b]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-[24px] font-bold text-[#181818] mb-2">
                        Disconnect Account?
                    </h3>

                    {/* Message */}
                    <p className="text-[15px] text-[#767676] mb-6">
                        Are you sure you want to disconnect your {provider.name} account?
                        You'll need to reconnect it to use it for sign in.
                    </p>

                    {/* Provider Display */}
                    <div className="bg-[#f5f5f5] rounded-[16px] p-4 mb-6">
                        <div className="flex items-center justify-center gap-3">
                            <div className="size-6 text-black/80">{provider.icon}</div>
                            <p className="text-[16px] font-semibold text-[#181818]">
                                {provider.name}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[#f5f5f5] text-[#181818] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#eee] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-[#ef4444] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#dc2626] transition-colors flex items-center justify-center gap-2"
                        >
                            <Unlink className="size-4" />
                            Disconnect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
