import { Check, X, Clock, User, Calendar } from "lucide-react"

interface RequestActionCardProps {
    requests: any[]
    onAccept: (id: string) => void
    onDecline: (id: string) => void
}

export function RequestActionCard({ requests, onAccept, onDecline }: RequestActionCardProps) {
    if (requests.length === 0) return null

    return (
        <div className="mb-8">
            <h3 className="text-[18px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                Pending Requests
                <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[12px]">
                    {requests.length}
                </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((req) => (
                    <div key={req.id} className="bg-white rounded-[20px] border border-red-100 p-5 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-[16px] font-bold text-gray-900 mb-1">
                                    {req.service?.title || "Service Request"}
                                </h4>
                                <div className="flex items-center gap-2 text-[13px] text-gray-500">
                                    <User className="size-3.5" />
                                    {req.client?.name || "Client"}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1.5 text-[13px] font-bold text-gray-900">
                                    <Clock className="size-3.5 text-blue-500" />
                                    {req.requestedTime ? new Date(req.requestedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now"}
                                </div>
                                <div className="text-[12px] text-gray-400">
                                    {req.requestedTime ? new Date(req.requestedTime).toLocaleDateString() : "Instant"}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => onAccept(req.id)}
                                className="flex-1 py-2.5 bg-green-600 text-white rounded-[12px] font-semibold text-[14px] hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Check className="size-4" />
                                Accept
                            </button>
                            <button
                                onClick={() => onDecline(req.id)}
                                className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-[12px] font-semibold text-[14px] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <X className="size-4" />
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
