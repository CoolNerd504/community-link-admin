import { Calendar, Clock, User, Video, MessageCircle, MoreVertical } from "lucide-react"

interface SessionListProps {
    sessions: any[]
    type: "upcoming" | "past"
    onJoin?: (id: string) => void
    onView?: (id: string) => void
}

export function SessionList({ sessions, type, onJoin, onView }: SessionListProps) {
    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[24px] border border-gray-100 text-center">
                <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="size-8 text-gray-400" />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-2">
                    No {type} sessions
                </h3>
                <p className="text-[14px] text-gray-500 max-w-xs">
                    {type === "upcoming"
                        ? "You don't have any upcoming sessions scheduled at the moment."
                        : "You haven't completed any sessions yet."
                    }
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Session Info */}
                        <div className="flex items-start gap-4">
                            <div className="size-12 bg-blue-50 rounded-[16px] flex items-center justify-center text-blue-600 font-bold text-[18px]">
                                {new Date(session.startTime).getDate()}
                            </div>
                            <div>
                                <h4 className="text-[16px] font-bold text-gray-900 mb-1">
                                    {session.service?.title || "Session"}
                                </h4>
                                <div className="flex items-center gap-3 text-[13px] text-gray-500 mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="size-3.5" />
                                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="size-3.5" />
                                        {session.client?.name || "Client"}
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${session.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                                        session.status === "COMPLETED" ? "bg-gray-100 text-gray-700" :
                                            "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {session.status}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {type === "upcoming" && (
                                <button
                                    onClick={() => onJoin?.(session.id)}
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-[12px] font-semibold text-[14px] hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <Video className="size-4" />
                                    Join Call
                                </button>
                            )}
                            <button
                                onClick={() => onView?.(session.id)}
                                className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-[12px] font-semibold text-[14px] hover:bg-gray-100 transition-colors"
                            >
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
