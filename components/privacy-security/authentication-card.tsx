import { Lock, Key, Smartphone, Check, X } from "lucide-react"

interface AuthenticationCardProps {
    twoFactorEnabled: boolean
    emailVerified: boolean
    phoneVerified: boolean
    onChangePassword: () => void
    onToggle2FA: () => void
}

export function AuthenticationCard({
    twoFactorEnabled,
    emailVerified,
    phoneVerified,
    onChangePassword,
    onToggle2FA
}: AuthenticationCardProps) {
    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-6">
                <Lock className="size-5 text-[#2563eb]" />
                <h2 className="text-[20px] font-bold text-[#181818]">
                    Password & Authentication
                </h2>
            </div>

            <div className="space-y-4">
                {/* Change Password */}
                <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                            <Key className="size-5 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-[#181818] mb-1">Password</p>
                            <p className="text-[13px] text-[#767676]">Last changed 3 months ago</p>
                        </div>
                    </div>
                    <button
                        onClick={onChangePassword}
                        className="px-4 py-2 bg-[#2563eb] text-white rounded-[12px] font-semibold text-[14px] hover:bg-[#1d4ed8]"
                    >
                        Change Password
                    </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                            <Smartphone className="size-5 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-[#181818] mb-1">
                                Two-Factor Authentication
                            </p>
                            <p className="text-[13px] text-[#767676]">
                                {twoFactorEnabled ? "Extra security enabled" : "Add an extra layer of security"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onToggle2FA}
                        className={`px-4 py-2 rounded-[12px] font-semibold text-[14px] ${twoFactorEnabled
                                ? "border border-[#ef4444] text-[#ef4444] hover:bg-[#fef2f2]"
                                : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                            }`}
                    >
                        {twoFactorEnabled ? "Disable" : "Enable"}
                    </button>
                </div>

                {/* Verification Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#f5f5f5] rounded-[16px]">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[14px] font-semibold text-[#181818]">
                                Email Verification
                            </p>
                            {emailVerified ? (
                                <Check className="size-5 text-[#16a34a]" />
                            ) : (
                                <X className="size-5 text-[#ef4444]" />
                            )}
                        </div>
                        <p className="text-[13px] text-[#767676]">
                            {emailVerified ? "Verified" : "Not verified"}
                        </p>
                    </div>

                    <div className="p-4 bg-[#f5f5f5] rounded-[16px]">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[14px] font-semibold text-[#181818]">
                                Phone Verification
                            </p>
                            {phoneVerified ? (
                                <Check className="size-5 text-[#16a34a]" />
                            ) : (
                                <X className="size-5 text-[#ef4444]" />
                            )}
                        </div>
                        <p className="text-[13px] text-[#767676]">
                            {phoneVerified ? "Verified" : "Not verified"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
