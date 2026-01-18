import { Eye, Globe, Users, UserCheck, Lock } from "lucide-react"
import { ProfileVisibility } from "./types"

interface PrivacySettingsCardProps {
    isOnline: boolean
    profileVisibility: ProfileVisibility
    onUpdatePrivacy: (key: 'isOnline' | 'profileVisibility', value: any) => void
}

export function PrivacySettingsCard({ isOnline, profileVisibility, onUpdatePrivacy }: PrivacySettingsCardProps) {
    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-6">
                <Eye className="size-5 text-[#2563eb]" />
                <h2 className="text-[20px] font-bold text-[#181818]">Privacy Settings</h2>
            </div>

            <div className="space-y-4">
                {/* Online Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                            <Globe className="size-5 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-[#181818] mb-1">
                                Show Online Status
                            </p>
                            <p className="text-[13px] text-[#767676]">
                                Let others see when you're online
                            </p>
                        </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                        onClick={() => onUpdatePrivacy('isOnline', !isOnline)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${isOnline ? 'bg-[#16a34a]' : 'bg-[#d1d5db]'
                            }`}
                    >
                        <span className={`absolute top-1 left-1 size-6 bg-white rounded-full transition-transform ${isOnline ? 'translate-x-6' : ''
                            }`} />
                    </button>
                </div>

                {/* Profile Visibility */}
                <div className="p-4 bg-[#f5f5f5] rounded-[16px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                            <Users className="size-5 text-[#2563eb]" />
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-[#181818] mb-1">
                                Profile Visibility
                            </p>
                            <p className="text-[13px] text-[#767676]">
                                Control who can see your profile
                            </p>
                        </div>
                    </div>

                    {/* Visibility Options */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => onUpdatePrivacy('profileVisibility', 'PUBLIC')}
                            className={`p-3 rounded-[12px] border-2 transition-all ${profileVisibility === 'PUBLIC'
                                    ? 'border-[#2563eb] bg-[#f0f4ff]'
                                    : 'border-[#eee] hover:border-[#2563eb]'
                                }`}
                        >
                            <Globe className={`size-5 mx-auto mb-2 ${profileVisibility === 'PUBLIC' ? 'text-[#2563eb]' : 'text-[#767676]'
                                }`} />
                            <p className="text-[13px] font-semibold text-[#181818]">Public</p>
                        </button>

                        <button
                            onClick={() => onUpdatePrivacy('profileVisibility', 'CONTACTS_ONLY')}
                            className={`p-3 rounded-[12px] border-2 transition-all ${profileVisibility === 'CONTACTS_ONLY'
                                    ? 'border-[#2563eb] bg-[#f0f4ff]'
                                    : 'border-[#eee] hover:border-[#2563eb]'
                                }`}
                        >
                            <UserCheck className={`size-5 mx-auto mb-2 ${profileVisibility === 'CONTACTS_ONLY' ? 'text-[#2563eb]' : 'text-[#767676]'
                                }`} />
                            <p className="text-[13px] font-semibold text-[#181818]">Contacts</p>
                        </button>

                        <button
                            onClick={() => onUpdatePrivacy('profileVisibility', 'PRIVATE')}
                            className={`p-3 rounded-[12px] border-2 transition-all ${profileVisibility === 'PRIVATE'
                                    ? 'border-[#2563eb] bg-[#f0f4ff]'
                                    : 'border-[#eee] hover:border-[#2563eb]'
                                }`}
                        >
                            <Lock className={`size-5 mx-auto mb-2 ${profileVisibility === 'PRIVATE' ? 'text-[#2563eb]' : 'text-[#767676]'
                                }`} />
                            <p className="text-[13px] font-semibold text-[#181818]">Private</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
