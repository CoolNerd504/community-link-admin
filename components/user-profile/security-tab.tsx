import { Shield, Fingerprint, Lock, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface SecurityTabProps {
    user: any
}

export function SecurityTab({ user }: SecurityTabProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-6">
            {/* Two-Factor Authentication */}
            <div className="p-6 bg-[#f5f5f5] rounded-[16px]">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="size-12 bg-[#f3e8ff] rounded-[12px] flex items-center justify-center">
                            <Shield className="size-6 text-[#9333ea]" />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold text-[#181818] mb-1">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-[13px] text-[#767676] mb-2">
                                Add an extra layer of security to your account
                            </p>
                            {user.twoFactorEnabled && (
                                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#16a34a]">
                                    <CheckCircle className="size-4" />
                                    Enabled
                                </span>
                            )}
                        </div>
                    </div>
                    <button className={`px-4 py-2 rounded-[12px] text-[14px] font-semibold transition-colors ${user.twoFactorEnabled
                            ? "bg-[#fee2e2] text-[#ef4444] hover:bg-[#fecaca]"
                            : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                        }`}>
                        {user.twoFactorEnabled ? "Disable" : "Enable"}
                    </button>
                </div>
            </div>

            {/* Biometric Authentication */}
            <div className="p-6 bg-[#f5f5f5] rounded-[16px]">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="size-12 bg-[#e3f2fd] rounded-[12px] flex items-center justify-center">
                            <Fingerprint className="size-6 text-[#2563eb]" />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold text-[#181818] mb-1">
                                Biometric Authentication
                            </h3>
                            <p className="text-[13px] text-[#767676] mb-2">
                                Use FaceID or Fingerprint to sign in
                            </p>
                            {user.biometricEnabled && (
                                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#16a34a]">
                                    <CheckCircle className="size-4" />
                                    Enabled
                                </span>
                            )}
                        </div>
                    </div>
                    <button className={`px-4 py-2 rounded-[12px] text-[14px] font-semibold transition-colors ${user.biometricEnabled
                            ? "bg-[#fee2e2] text-[#ef4444] hover:bg-[#fecaca]"
                            : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                        }`}>
                        {user.biometricEnabled ? "Disable" : "Enable"}
                    </button>
                </div>
            </div>

            {/* Change Password Form */}
            <div className="p-6 bg-[#f5f5f5] rounded-[16px]">
                <div className="flex items-start gap-4 mb-6">
                    <div className="size-12 bg-[#dcfce7] rounded-[12px] flex items-center justify-center">
                        <Lock className="size-6 text-[#16a34a]" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-semibold text-[#181818] mb-1">
                            Change Password
                        </h3>
                        <p className="text-[13px] text-[#767676]">
                            Update your password regularly to keep your account secure
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="block text-[13px] font-semibold text-[#181818] mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-[12px] border border-[#eee] bg-white text-[14px] focus:outline-none focus:border-[#2563eb] transition-all"
                                placeholder="Enter current password"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767676] hover:text-[#181818]"
                            >
                                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-[13px] font-semibold text-[#181818] mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-[12px] border border-[#eee] bg-white text-[14px] focus:outline-none focus:border-[#2563eb] transition-all"
                            placeholder="Enter new password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-[13px] font-semibold text-[#181818] mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-[12px] border border-[#eee] bg-white text-[14px] focus:outline-none focus:border-[#2563eb] transition-all"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button className="w-full bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8] mt-2 transition-colors">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    )
}
