import { Camera, CheckCircle, XCircle, Mail, Phone, MapPin, Edit, Clock, AlertCircle, LogOut } from "lucide-react"
import { VerificationIcon } from "../profile/verification-icon"

interface ProfileCardProps {
    user: any
    onEdit: () => void
    onLogout: () => void
}

export function ProfileCard({ user, onEdit, onLogout }: ProfileCardProps) {
    const isVerified = user.kycStatus === "VERIFIED"
    const isOnline = user.profile?.isOnline || false

    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-8 lg:sticky lg:top-8 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
            {/* 2.1 Profile Image Section */}
            <div className="relative w-32 h-32 mx-auto mb-6">
                <img
                    src={user.image || "/placeholder-user.jpg"}
                    alt={user.name || "User"}
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />

                {isVerified && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-1">
                        <div className="transform scale-110">
                            <VerificationIcon />
                        </div>
                    </div>
                )}

                {isOnline && (
                    <div className="absolute top-2 right-2 size-4 bg-[#22c55e] border-2 border-white rounded-full" />
                )}

                <button
                    onClick={onEdit}
                    className="absolute bottom-0 right-0 size-10 bg-[#2563eb] rounded-full flex items-center justify-center text-white hover:bg-[#1d4ed8] transition-colors shadow-md"
                >
                    <Camera className="size-5" />
                </button>
            </div>

            {/* 2.2 User Info Section */}
            <div className="text-center mb-8">
                <h1 className="text-[24px] font-bold text-[#181818] mb-1">
                    {user.name}
                </h1>
                <p className="text-[15px] text-[#767676] mb-2 font-medium">
                    @{user.username || user.email?.split('@')[0]}
                </p>
                {user.profile?.headline && (
                    <p className="text-[14px] text-[#181818] mb-4">
                        {user.profile.headline}
                    </p>
                )}

                <div className="flex items-center justify-center gap-2 mt-4">
                    <span className={`px-3 py-1 rounded-full text-[13px] font-semibold ${user.role === "PROVIDER" ? "bg-[#f3e8ff] text-[#9333ea]" :
                        user.role === "ADMIN" ? "bg-[#fee2e2] text-[#ef4444]" :
                            "bg-[#dbeafe] text-[#2563eb]"
                        }`}>
                        {user.role || "USER"}
                    </span>
                    {user.isActive && (
                        <span className="px-3 py-1 bg-[#dcfce7] text-[#16a34a] rounded-full text-[13px] font-semibold">
                            Active
                        </span>
                    )}
                </div>
            </div>

            {/* 2.3 Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#f5f5f5] rounded-[16px] p-4 text-center">
                    <p className="text-[24px] font-bold text-[#181818] mb-1">{user.stats?.totalSessions || 0}</p>
                    <p className="text-[12px] text-[#767676] font-medium">Sessions</p>
                </div>
                <div className="bg-[#f5f5f5] rounded-[16px] p-4 text-center">
                    <p className="text-[24px] font-bold text-[#181818] mb-1">{user.stats?.savedProviders || 0}</p>
                    <p className="text-[12px] text-[#767676] font-medium">Saved</p>
                </div>
            </div>

            {/* 2.4 Contact Information */}
            <div className="space-y-3 mb-8">
                {/* Email */}
                <div className="flex items-center gap-3 p-3 bg-[#f5f5f5] rounded-[12px]">
                    <Mail className="size-5 text-[#767676]" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-[#181818] truncate break-all">{user.email}</p>
                    </div>
                    {user.emailVerified ? (
                        <CheckCircle className="size-5 text-[#16a34a]" />
                    ) : (
                        <XCircle className="size-5 text-[#ef4444]" />
                    )}
                </div>

                {/* Phone */}
                {user.phoneNumber && (
                    <div className="flex items-center gap-3 p-3 bg-[#f5f5f5] rounded-[12px]">
                        <Phone className="size-5 text-[#767676]" />
                        <p className="text-[13px] text-[#181818]">{user.phoneNumber}</p>
                        {user.phoneVerified ? (
                            <CheckCircle className="size-5 text-[#16a34a]" />
                        ) : (
                            <XCircle className="size-5 text-[#ef4444]" />
                        )}
                    </div>
                )}

                {/* Location */}
                {user.profile?.location && (
                    <div className="flex items-center gap-3 p-3 bg-[#f5f5f5] rounded-[12px]">
                        <MapPin className="size-5 text-[#767676]" />
                        <p className="text-[13px] text-[#181818]">{user.profile.location}</p>
                    </div>
                )}
            </div>

            {/* 2.5 Edit Profile Button */}
            <button
                onClick={onEdit}
                className="w-full bg-[#2563eb] text-white rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#1d4ed8] flex items-center justify-center gap-2 transition-colors"
            >
                <Edit className="size-5" />
                Edit Profile
            </button>
            <button
                onClick={onLogout}
                className="w-full mt-3 bg-white border border-[#fee2e2] text-[#ef4444] rounded-[12px] py-3 font-semibold text-[15px] hover:bg-[#fef2f2] flex items-center justify-center gap-2 transition-colors"
            >
                <LogOut className="size-5" />
                Log Out
            </button>
        </div>
    )
}
