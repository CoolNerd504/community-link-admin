import { Languages, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"

interface ProfileTabProps {
    user: any
}

export function ProfileTab({ user }: ProfileTabProps) {
    const kycStatusConfig = {
        VERIFIED: { color: "text-[#16a34a]", bg: "bg-[#dcfce7]", border: "border-[#16a34a]", icon: CheckCircle },
        SUBMITTED: { color: "text-[#f59e0b]", bg: "bg-[#fef3c7]", border: "border-[#f59e0b]", icon: Clock },
        REJECTED: { color: "text-[#ef4444]", bg: "bg-[#fee2e2]", border: "border-[#ef4444]", icon: XCircle },
        PENDING: { color: "text-[#767676]", bg: "bg-[#f5f5f5]", border: "border-[#767676]", icon: AlertCircle },
    }

    const currentKycConfig = kycStatusConfig[user.kycStatus as keyof typeof kycStatusConfig] || kycStatusConfig.PENDING
    const StatusIcon = currentKycConfig.icon

    return (
        <div className="space-y-8">
            {/* About Section */}
            <div>
                <h2 className="text-[20px] font-bold text-[#181818] mb-4">About</h2>
                {user.profile?.bio ? (
                    <p className="text-[15px] text-[#767676] leading-relaxed">
                        {user.profile.bio}
                    </p>
                ) : (
                    <div className="bg-[#f5f5f5] rounded-[16px] p-6 text-center border border-[#eee]">
                        <p className="text-[14px] text-[#a2a2a2]">No bio added yet</p>
                        <button className="mt-3 text-[14px] font-semibold text-[#2563eb] hover:underline">
                            Add Bio
                        </button>
                    </div>
                )}
            </div>

            {/* Languages Section */}
            <div>
                <h2 className="text-[20px] font-bold text-[#181818] mb-4">Languages</h2>
                {user.profile?.languages?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {user.profile.languages.map((language: string, index: number) => (
                            <span key={index} className="px-4 py-2 bg-[#f5f5f5] text-[#181818] rounded-[12px] text-[14px] font-medium flex items-center gap-2">
                                <Languages className="size-4 text-[#767676]" />
                                {language}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-[14px] text-[#767676]">No languages specified</p>
                )}
            </div>

            {/* Interests Section */}
            <div>
                <h2 className="text-[20px] font-bold text-[#181818] mb-4">Interests</h2>
                {user.profile?.interests?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {user.profile.interests.map((interest: string, index: number) => (
                            <span key={index} className="px-4 py-2 bg-[#f0f4ff] text-[#2563eb] rounded-[12px] text-[14px] font-medium">
                                {interest}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-[14px] text-[#767676]">No interests added</p>
                )}
            </div>

            {/* KYC Verification Status */}
            <div>
                <h2 className="text-[20px] font-bold text-[#181818] mb-4">Verification Status</h2>
                <div className={`p-4 rounded-[16px] border-2 ${currentKycConfig.border} ${currentKycConfig.bg} bg-opacity-20`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <StatusIcon className={`size-6 ${currentKycConfig.color}`} />
                            <div>
                                <p className="text-[15px] font-semibold text-[#181818]">KYC Status</p>
                                <p className="text-[13px] text-[#767676]">Identity verification</p>
                            </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-[13px] font-semibold ${user.kycStatus === "VERIFIED" ? "bg-[#16a34a] text-white" :
                                user.kycStatus === "SUBMITTED" ? "bg-[#f59e0b] text-white" :
                                    user.kycStatus === "REJECTED" ? "bg-[#ef4444] text-white" :
                                        "bg-[#767676] text-white"
                            }`}>
                            {user.kycStatus}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
