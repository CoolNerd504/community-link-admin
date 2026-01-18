import { ChevronRight, Calendar, Clock, Video } from "lucide-react"
import { VerificationIcon } from "../profile/verification-icon"
import { format, formatDistanceToNow, isBefore, addMinutes } from "date-fns"
import { useRouter } from "next/navigation"

interface Session {
    id: string
    requestedTime: string
    duration: number
    status: string
    service: {
        title: string
        provider: {
            name: string
            image: string | null
            kycStatus: string
            profile?: {
                headline?: string
            }
        }
    }
}

interface UpcomingSessionsProps {
    sessions: Session[]
}

export function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
    const router = useRouter()

    const canJoinCall = (session: Session) => {
        if (!session.requestedTime) return false
        const sessionTime = new Date(session.requestedTime)
        const now = new Date()
        const fifteenMinsBefore = addMinutes(sessionTime, -15)
        return session.status === "ACCEPTED" && now >= fifteenMinsBefore && isBefore(now, sessionTime)
    }

    const getTimeUntilSession = (session: Session) => {
        if (!session.requestedTime) return null
        const sessionTime = new Date(session.requestedTime)
        const now = new Date()
        if (isBefore(sessionTime, now)) return "Active now"
        return `Active in ${formatDistanceToNow(sessionTime, { addSuffix: false })}`
    }

    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[24px] font-bold text-[#181818]">Upcoming Sessions</h2>
                <button
                    onClick={() => router.push("/user/schedule")}
                    className="text-[15px] font-semibold text-[#2563eb] flex items-center gap-1 hover:underline"
                >
                    View all
                    <ChevronRight className="size-4" />
                </button>
            </div>

            <div className="space-y-4">
                {sessions.length === 0 ? (
                    <div className="p-8 text-center bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee]">
                        <p className="text-[#767676]">No upcoming sessions available.</p>
                        <button
                            onClick={() => router.push("/user/discover")}
                            className="mt-4 text-[#2563eb] font-semibold hover:underline"
                        >
                            Book your first session
                        </button>
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] transition-shadow duration-200"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Provider Image */}
                                <div className="relative shrink-0">
                                    <img
                                        src={session.service.provider.image || "/placeholder-user.jpg"}
                                        alt={session.service.provider.name}
                                        className="size-16 rounded-[16px] object-cover"
                                    />
                                    {session.service.provider.kycStatus === "VERIFIED" && (
                                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                                            <div className="transform scale-75">
                                                <VerificationIcon />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Session Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="text-[18px] font-semibold text-[#181818] truncate pr-4">
                                            {session.service.title}
                                        </h3>
                                        <div className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap ${session.status === "ACCEPTED"
                                            ? "bg-[#dcfce7] text-[#16a34a]"
                                            : "bg-[#dbeafe] text-[#2563eb]"
                                            }`}>
                                            {session.status === "ACCEPTED" ? "Confirmed" : "Upcoming"}
                                        </div>
                                    </div>

                                    <p className="text-[14px] text-[#767676] mb-4">
                                        {session.service.provider.name}
                                        {session.service.provider.profile?.headline && ` • ${session.service.provider.profile.headline}`}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-[14px] text-[#767676] mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="size-4" />
                                            <span>
                                                {format(new Date(session.requestedTime), 'MMMM d, yyyy')} • {format(new Date(session.requestedTime), 'h:mm a')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-4" />
                                            <span>{session.duration} mins</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {canJoinCall(session) ? (
                                        <button
                                            onClick={() => router.push(`/call/${session.id}`)}
                                            className="w-full bg-[#2563eb] text-white rounded-[12px] py-3 px-4 font-semibold text-[15px] hover:bg-[#1d4ed8] flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Video className="size-5" />
                                            Join Call
                                        </button>
                                    ) : (
                                        <div className="bg-[#f5f5f5] rounded-[12px] py-3 px-4 text-center">
                                            <p className="text-[14px] text-[#767676]">
                                                Link {getTimeUntilSession(session)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
