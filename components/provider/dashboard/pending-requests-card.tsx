import { Clock, User, Calendar } from "lucide-react"

export function PendingRequestsCard() {
    const requests = [
        { id: 1, client: "Alice M.", service: "Legal Consultation", time: "10:00 AM", date: "Today" },
        { id: 2, client: "John D.", service: "Therapy Session", time: "2:30 PM", date: "Tomorrow" },
    ]

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-[12px] bg-orange-50 flex items-center justify-center text-orange-600">
                        <Clock className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-bold text-gray-900">Pending Requests</h3>
                        <p className="text-[13px] text-gray-500">Action Required</p>
                    </div>
                </div>
                <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-[12px] font-bold">
                    2 New
                </span>
            </div>

            <div className="space-y-3">
                {requests.map((req) => (
                    <div key={req.id} className="p-4 bg-gray-50 rounded-[16px] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-10 bg-white rounded-full flex items-center justify-center text-gray-400 font-bold border border-gray-100">
                                <User className="size-5" />
                            </div>
                            <div>
                                <h5 className="text-[15px] font-bold text-gray-900">{req.client}</h5>
                                <p className="text-[13px] text-gray-500">{req.service}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-700 mb-1 justify-end">
                                <Clock className="size-3.5 text-gray-400" />
                                {req.time}
                            </div>
                            <div className="flex items-center gap-1.5 text-[12px] text-gray-500 justify-end">
                                <Calendar className="size-3 text-gray-400" />
                                {req.date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-3 bg-blue-600 text-white rounded-[12px] font-semibold text-[14px] hover:bg-blue-700 transition-colors">
                View All Requests
            </button>
        </div>
    )
}
