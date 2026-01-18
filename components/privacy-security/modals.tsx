import { X, Eye, EyeOff, Smartphone } from "lucide-react"
import { useState } from "react"
import { ChangePasswordRequest } from "./types"

interface ChangePasswordModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: ChangePasswordRequest) => void
}

export function ChangePasswordModal({ isOpen, onClose, onSubmit }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Visibility toggles
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    if (!isOpen) return null

    const handleSubmit = () => {
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match")
            return
        }
        onSubmit({ currentPassword, newPassword })
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.98)] rounded-[24px] border border-[#eee] p-8 max-w-md w-full shadow-[0px_20px_60px_0px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[24px] font-bold text-[#181818]">Change Password</h3>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-[8px] hover:bg-[#f5f5f5]"
                    >
                        <X className="size-5 text-[#767676]" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-[14px] font-semibold text-[#181818] mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-[#eee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#2563eb]"
                                placeholder="Enter current password"
                            />
                            <button
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="size-5 text-[#767676]" />
                                ) : (
                                    <Eye className="size-5 text-[#767676]" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-[14px] font-semibold text-[#181818] mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-[#eee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#2563eb]"
                                placeholder="Enter new password"
                            />
                            <button
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showNewPassword ? (
                                    <EyeOff className="size-5 text-[#767676]" />
                                ) : (
                                    <Eye className="size-5 text-[#767676]" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-[14px] font-semibold text-[#181818] mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-[#eee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#2563eb]"
                            placeholder="Confirm new password"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#f5f5f5] text-[#181818] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#eee]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8]"
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    )
}

interface Enable2FAModalProps {
    isOpen: boolean
    onClose: () => void
    onEnable: () => void
}

export function Enable2FAModal({ isOpen, onClose, onEnable }: Enable2FAModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.98)] rounded-[24px] border border-[#eee] p-8 max-w-md w-full shadow-[0px_20px_60px_0px_rgba(0,0,0,0.3)]">
                <div className="text-center">
                    <div className="size-16 bg-[#f0f4ff] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="size-8 text-[#2563eb]" />
                    </div>

                    <h3 className="text-[24px] font-bold text-[#181818] mb-2">
                        Enable Two-Factor Authentication
                    </h3>

                    <p className="text-[15px] text-[#767676] mb-6">
                        Scan this QR code with your authenticator app to set up 2FA.
                    </p>

                    <div className="bg-[#f5f5f5] rounded-[16px] p-6 mb-6">
                        <div className="size-48 mx-auto bg-white rounded-[12px] flex items-center justify-center">
                            <p className="text-[13px] text-[#767676]">[QR CODE]</p>
                        </div>
                        <p className="text-[12px] font-mono text-[#767676] mt-3">
                            JBSWY3DPEHPK3PXP
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[#f5f5f5] text-[#181818] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#eee]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onEnable}
                            className="flex-1 bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8]"
                        >
                            Enable 2FA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
