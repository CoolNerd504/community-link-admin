import { Star, MapPin, CheckCircle, Shield } from "lucide-react"

interface ProviderProfileCardProps {
    user: any
    onEdit: () => void
}

export function ProviderProfileCard({ user, onEdit }: ProviderProfileCardProps) {
    if (!user) return null

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            <div className="relative z-10">
                <div className="size-32 mx-auto rounded-full p-1 bg-white mb-4">
                    <img
                        src={user.image || "/placeholder.jpg"}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover border-4 border-gray-50"
                    />
                </div>

                <h2 className="text-[24px] font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
                    {user.name}
                    {user.kycStatus === "VERIFIED" && <CheckCircle className="size-5 text-blue-500 fill-blue-50" />}
                </h2>
                <p className="text-[15px] text-gray-500 font-medium mb-4">@{user.username || "username"}</p>

                {user.profile?.bio && (
                    <p className="text-[14px] text-gray-600 max-w-md mx-auto mb-6">
                        {user.profile.bio}
                    </p>
                )}

                <div className="flex justify-center gap-2 mb-8">
                    {user.profile?.headline && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[13px] font-medium">
                            {user.profile.headline}
                        </span>
                    )}
                    {user.profile?.location && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[13px] font-medium">
                            <MapPin className="size-3.5" />
                            {user.profile.location}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                    <div>
                        <div className="text-[20px] font-bold text-gray-900">4.9</div>
                        <div className="text-[13px] text-gray-500">Rating</div>
                    </div>
                    <div>
                        <div className="text-[20px] font-bold text-gray-900">120+</div>
                        <div className="text-[13px] text-gray-500">Sessions</div>
                    </div>
                    <div>
                        <div className="text-[20px] font-bold text-gray-900">98%</div>
                        <div className="text-[13px] text-gray-500">Response</div>
                    </div>
                </div>

                <button
                    onClick={onEdit}
                    className="w-full mt-8 py-3 border border-gray-200 text-gray-700 rounded-[12px] font-semibold text-[14px] hover:bg-gray-50 transition-colors"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    )
}
