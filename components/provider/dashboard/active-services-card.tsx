import { Video, ChevronRight, Plus } from "lucide-react"

export function ActiveServicesCard() {
    const services = [
        { id: 1, title: "Legal Consultation", price: "ZMW 20 / min", active: true },
        { id: 2, title: "Document Review", price: "ZMW 500 / doc", active: true },
    ]

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-[12px] bg-purple-50 flex items-center justify-center text-purple-600">
                        <Video className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-bold text-gray-900">Your Services</h3>
                        <p className="text-[13px] text-gray-500">Active Offerings</p>
                    </div>
                </div>
                <button className="size-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600">
                    <Plus className="size-4" />
                </button>
            </div>

            <div className="space-y-3">
                {services.map((service) => (
                    <div key={service.id} className="p-4 border border-gray-100 rounded-[16px] hover:border-blue-200 hover:shadow-sm transition-all group cursor-pointer bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="text-[15px] font-bold text-gray-900 mb-1">{service.title}</h5>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[11px] font-bold">
                                        Active
                                    </span>
                                    <span className="text-[13px] text-gray-500">{service.price}</span>
                                </div>
                            </div>
                            <ChevronRight className="size-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-3 border border-gray-200 text-gray-700 rounded-[12px] font-semibold text-[14px] hover:bg-gray-50 transition-colors">
                Manage Services
            </button>
        </div>
    )
}
