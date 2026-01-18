import { Clock, Video, FileText, MessageCircle } from "lucide-react"
import { Provider } from "./types"

interface ServicesTabProps {
    provider: Provider
}

export function ServicesTab({ provider }: ServicesTabProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-[28px] font-bold text-[#181818]">Services Offered</h2>
            {provider.services.filter(s => s.isActive).map((service) => (
                <div
                    key={service.id}
                    className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="text-[20px] font-semibold text-[#181818] mb-2">
                                {service.title}
                            </h3>
                            <p className="text-[15px] text-[#767676]">{service.description}</p>
                        </div>
                        <div className="text-right ml-6">
                            <div className="text-[24px] font-bold text-[#181818]">
                                ZMW {service.price}
                                <span className="text-[16px] font-normal text-[#767676]">/hr</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-[14px]">
                        <div className="flex items-center gap-2 text-[#767676]">
                            <Clock className="size-4" />
                            <span>{service.duration} mins</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#767676]">
                            {service.deliveryType === "video" ? (
                                <>
                                    <Video className="size-4" />
                                    <span>Video Call</span>
                                </>
                            ) : service.deliveryType === "written" ? (
                                <>
                                    <FileText className="size-4" />
                                    <span>Written Feedback</span>
                                </>
                            ) : (
                                <>
                                    <MessageCircle className="size-4" />
                                    <span>Sessions</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {provider.services.length === 0 && (
                <p className="text-center text-gray-500 py-8">No active services.</p>
            )}
        </div>
    )
}
