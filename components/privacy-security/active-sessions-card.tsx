import { Laptop, LogOut, MapPin } from "lucide-react"
import { ActiveSession } from "./types"

interface ActiveSessionsCardProps {
    sessions: ActiveSession[]
    onEndSession?: (sessionId: string) => void
    onEndAllSessions?: () => void
}

export function ActiveSessionsCard({ sessions, onEndSession, onEndAllSessions }: ActiveSessionsCardProps) {
    return (
        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Laptop className="size-5 text-[#2563eb]" />
                    <h2 className="text-[20px] font-bold text-[#181818]">Active Sessions</h2>
                </div>
                <button
                    onClick={onEndAllSessions}
                    className="flex items-center gap-2 px-3 py-2 border border-[#eee] text-[#181818] rounded-[12px] font-semibold text-[13px] hover:bg-[#f5f5f5]"
                >
                    <LogOut className="size-4" />
                    End All
                </button>
            </div>

            <div className="space-y-3">
                {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-[16px]">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-white rounded-[12px] flex items-center justify-center">
                                <Laptop className="size-5 text-[#2563eb]" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-[15px] font-semibold text-[#181818]">
                                        {session.device}
                                    </p>
                                    {session.isCurrent && (
                                        <span className="px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] rounded-full text-[11px] font-semibold">
                                            CURRENT
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-[13px] text-[#767676]">
                                    <span>{session.browser}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="size-3" />
                                        {session.location}
                                    </span>
                                    <span>•</span>
                                    <span>{session.lastActive}</span>
                                </div>
                            </div>
                        </div>

                        {!session.isCurrent && (
                            <button
                                onClick={() => onEndSession?.(session.id)}
                                className="px-3 py-2 border border-[#ef4444] text-[#ef4444] rounded-[12px] font-semibold text-[13px] hover:bg-[#fef2f2]"
                            >
                                End Session
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
