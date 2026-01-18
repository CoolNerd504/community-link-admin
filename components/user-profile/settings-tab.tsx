import { Bell, Lock, Shield, Trash2 } from "lucide-react"

interface SettingsTabProps {
    user: any
}

export function SettingsTab({ user }: SettingsTabProps) {
    return (
        <div className="space-y-6">
            {/* Notification Preferences */}
            <div className="p-6 bg-[#f5f5f5] rounded-[16px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Bell className="size-5 text-[#767676]" />
                        <div>
                            <h3 className="text-[15px] font-semibold text-[#181818]">Email Notifications</h3>
                            <p className="text-[13px] text-[#767676]">Receive updates via email</p>
                        </div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-[#e5e7eb] peer-checked:bg-[#2563eb] rounded-full transition-colors cursor-pointer"></div>
                        <div className="absolute left-1 top-1 size-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="size-5 flex items-center justify-center">
                            <span className="text-[10px] font-bold bg-[#767676] text-white rounded px-1">SMS</span>
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-[#181818]">SMS Notifications</h3>
                            <p className="text-[13px] text-[#767676]">Receive updates via SMS</p>
                        </div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-full h-full bg-[#e5e7eb] peer-checked:bg-[#2563eb] rounded-full transition-colors cursor-pointer"></div>
                        <div className="absolute left-1 top-1 size-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </label>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="p-6 bg-[#f5f5f5] rounded-[16px]">
                <h3 className="text-[16px] font-semibold text-[#181818] mb-4 flex items-center gap-2">
                    <Lock className="size-4" />
                    Privacy
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#181818]">Show profile in search</span>
                        <label className="relative inline-block w-12 h-6">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-full h-full bg-[#e5e7eb] peer-checked:bg-[#2563eb] rounded-full transition-colors cursor-pointer"></div>
                            <div className="absolute left-1 top-1 size-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#181818]">Show online status</span>
                        <label className="relative inline-block w-12 h-6">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-full h-full bg-[#e5e7eb] peer-checked:bg-[#2563eb] rounded-full transition-colors cursor-pointer"></div>
                            <div className="absolute left-1 top-1 size-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 bg-[#fee2e2] rounded-[16px] border border-[#ef4444]">
                <h3 className="text-[16px] font-semibold text-[#ef4444] mb-2 flex items-center gap-2">
                    <Trash2 className="size-4" />
                    Danger Zone
                </h3>
                <p className="text-[13px] text-[#767676] mb-6">
                    These actions are permanent and cannot be undone
                </p>

                <div className="space-y-3">
                    <button className="w-full bg-white text-[#ef4444] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#fef2f2] border border-[#ef4444] transition-colors">
                        Deactivate Account
                    </button>
                    <button className="w-full bg-[#ef4444] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#dc2626] transition-colors shadow-sm">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}
