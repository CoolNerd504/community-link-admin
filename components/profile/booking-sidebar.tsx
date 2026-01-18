import { MessageCircle, Calendar, Heart, Share2, UserPlus } from "lucide-react"
import { Provider } from "./types"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface BookingSidebarProps {
    provider: Provider
    onConnect: () => void
    onSchedule: () => void
    onToggleFollow: () => void
}

export function BookingSidebar({ provider, onConnect, onSchedule, onToggleFollow }: BookingSidebarProps) {
    const [isSaved, setIsSaved] = useState(provider.isFavorite)

    const handleSave = () => {
        setIsSaved(!isSaved)
        // In a real app, this would call an API
    }

    return (
        <div className="lg:sticky lg:top-8 h-fit space-y-6">
            {/* Availability Card */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className={`size-3 ${provider.profile?.isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
                    <span className="text-[15px] font-semibold text-[#181818]">
                        {provider.profile?.isOnline ? 'Available Now' : 'Offline'}
                    </span>
                </div>
                <p className="text-[14px] text-[#767676] mb-6">
                    {provider.profile?.isOnline
                        ? `${provider.name.split(" ")[0]} is currently online and typically responds in less than 5 minutes.`
                        : `${provider.name.split(" ")[0]} is currently offline but will respond when they return.`
                    }
                </p>
                <button
                    onClick={onConnect}
                    className="w-full bg-[#181818] text-white rounded-[16px] py-4 px-6 font-semibold text-[15px] hover:bg-[#2d2d2d] transition-colors flex items-center justify-center gap-2"
                >
                    <MessageCircle className="size-5" />
                    Connect Instantly
                </button>
            </div>

            {/* Booking Card */}
            <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6">
                <h3 className="text-[18px] font-semibold text-[#181818] mb-4">Book a Session</h3>
                <p className="text-[14px] text-[#767676] mb-6">
                    Pick a time that works best for you and your schedule.
                </p>
                <button
                    onClick={onSchedule}
                    className="w-full bg-white border-2 border-[#181818] text-[#181818] rounded-[16px] py-4 px-6 font-semibold text-[15px] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
                >
                    <Calendar className="size-5" />
                    Schedule Call
                </button>
                <p className="text-[12px] text-[#a2a2a2] text-center mt-4">
                    SECURE CHECKOUT VIA EXPERTMARKET
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    className="flex-1 bg-white border border-[#eee] text-[#181818] rounded-[16px] py-3 px-4 font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
                >
                    <Heart className={`size-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                </button>
                <button className="flex-1 bg-white border border-[#eee] text-[#181818] rounded-[16px] py-3 px-4 font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2">
                    <Share2 className="size-4" />
                    Share
                </button>
            </div>

            {/* Follow Button */}
            <button
                onClick={onToggleFollow}
                className="w-full bg-white border border-[#eee] text-[#181818] rounded-[16px] py-3 px-4 font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
            >
                <UserPlus className="size-4" />
                {provider.isFollowing ? "Following" : "Follow Provider"}
            </button>
        </div>
    )
}
