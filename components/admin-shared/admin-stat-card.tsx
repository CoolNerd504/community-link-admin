import { ArrowRight, Users, Shield, DollarSign, Activity } from "lucide-react"

interface AdminStatCardProps {
    title: string
    value: string
    icon: any
    color: "blue" | "green" | "purple" | "orange"
    trend?: {
        value: string
        isPositive: boolean
    }
}

export function AdminStatCard({ title, value, icon: Icon, color, trend }: AdminStatCardProps) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    }

    return (
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`size-12 rounded-[16px] flex items-center justify-center ${colorStyles[color]}`}>
                    <Icon className="size-6" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[13px] font-bold px-2 py-1 rounded-full ${trend.isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                        }`}>
                        {trend.isPositive ? "+" : ""}{trend.value}
                    </div>
                )}
            </div>
            <div>
                <p className="text-[14px] font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-[28px] font-bold text-gray-900 tracking-tight">{value}</h3>
            </div>
        </div>
    )
}
