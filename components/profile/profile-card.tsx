import { Star, MapPin, Globe, Clock, ShieldCheck } from "lucide-react"
import { Provider } from "./types"
import { VerificationIcon } from "./verification-icon"

interface ProfileCardProps {
    provider: Provider
}

export function ProfileCard({ provider }: ProfileCardProps) {
    return (
        <div className="lg:sticky lg:top-8 h-fit">
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[40px] border border-[#eee]">
                <div className="flex flex-col items-center p-8">
                    {/* Profile Image Section */}
                    <div className="relative mb-6">
                        <div className="h-[200px] w-[200px] rounded-[32px] overflow-hidden">
                            <img
                                alt={provider.name}
                                className="h-full w-full object-cover"
                                src={provider.image || "/placeholder-user.jpg"}
                            />
                        </div>
                        {provider.kycStatus === "VERIFIED" && (
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                                <VerificationIcon />
                            </div>
                        )}
                        {provider.profile?.isOnline && (
                            <div className="absolute top-4 right-4 bg-[#22c55e] text-white px-3 py-1 rounded-full text-[13px] font-medium">
                                Online
                            </div>
                        )}
                    </div>

                    {/* Name & Headline */}
                    <h1 className="text-[24px] font-bold text-[#181818] text-center mb-2">
                        {provider.name}
                    </h1>
                    <p className="text-[15px] text-[#767676] text-center mb-6">
                        {provider.profile?.headline || "Service Provider"}
                    </p>

                    {/* Badges Section */}
                    <div className="flex gap-2 mb-6 flex-wrap justify-center">
                        {provider.rating >= 4.5 && (
                            <div className="bg-[#e3f2fd] text-[#1976d2] px-3 py-1.5 rounded-full text-[13px] font-semibold flex items-center gap-1">
                                <Star className="size-3.5 fill-current" />
                                Top Rated
                            </div>
                        )}
                        {provider.profile?.isOnline && (
                            <div className="bg-[#e8f5e9] text-[#2e7d32] px-3 py-1.5 rounded-full text-[13px] font-semibold">
                                Fast Responder
                            </div>
                        )}
                    </div>

                    {/* Info Items */}
                    <div className="w-full space-y-4 mb-6">
                        <div className="flex items-center gap-3 text-[14px]">
                            <MapPin className="size-4 text-[#767676]" />
                            <span className="text-[#181818]">{provider.profile?.location || "Remote"}</span>
                        </div>
                        {provider.profile?.languages.length > 0 && (
                            <div className="flex items-center gap-3 text-[14px]">
                                <Globe className="size-4 text-[#767676]" />
                                <span className="text-[#181818]">{provider.profile.languages.join(", ")}</span>
                            </div>
                        )}
                        {provider.profile?.timezone && (
                            <div className="flex items-center gap-3 text-[14px]">
                                <Clock className="size-4 text-[#767676]" />
                                <span className="text-[#181818]">{provider.profile.timezone}</span>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-[#eee] mb-6"></div>

                    {/* Stats Grid */}
                    <div className="w-full grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-[20px] font-bold text-[#181818]">{provider.sessions}+</div>
                            <div className="text-[12px] text-[#767676]">Sessions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[20px] font-bold text-[#181818]">{provider.experience}</div>
                            <div className="text-[12px] text-[#767676]">Years</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[20px] font-bold text-[#181818] flex items-center justify-center gap-1">
                                {provider.rating.toFixed(1)}
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="text-[12px] text-[#767676]">Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
