import { Switch } from "@/components/ui/switch"
import { Phone, Globe, AlertCircle } from "lucide-react"

interface StatusToggleProps {
    isOnline: boolean
    onToggleOnline: (value: boolean) => void
    isAvailableForInstant: boolean
    onToggleInstant: (value: boolean) => void
}

export function StatusToggle({ isOnline, onToggleOnline, isAvailableForInstant, onToggleInstant }: StatusToggleProps) {
    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm sticky top-[120px]">
            <h3 className="text-[18px] font-bold text-gray-900 mb-6">Availability Status</h3>

            <div className="space-y-6">
                {/* Online Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center ${isOnline ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                            }`}>
                            <Globe className="size-5" />
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-gray-900">Online Status</p>
                            <p className="text-[13px] text-gray-500">{isOnline ? "Visible to clients" : "Hidden from search"}</p>
                        </div>
                    </div>
                    <Switch checked={isOnline} onCheckedChange={onToggleOnline} />
                </div>

                <div className="h-[1px] bg-gray-100"></div>

                {/* Instant Sessions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center ${isAvailableForInstant ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                            }`}>
                            <Phone className="size-5" />
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-gray-900">Instant Calls</p>
                            <p className="text-[13px] text-gray-500">{isAvailableForInstant ? "Accepting calls" : "Not available"}</p>
                        </div>
                    </div>
                    <Switch checked={isAvailableForInstant} onCheckedChange={onToggleInstant} disabled={!isOnline} />
                </div>

                {!isOnline && (
                    <div className="flex gap-2 p-3 bg-yellow-50 rounded-[12px] text-yellow-800 text-[13px]">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <p>You must be online to accept instant calls.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
