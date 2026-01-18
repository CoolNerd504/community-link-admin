import { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: string
        isPositive: boolean
    }
    subtitle?: string
    color: "blue" | "green" | "purple" | "orange"
}

export function StatCard({ title, value, icon: Icon, trend, subtitle, color }: StatCardProps) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    }

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`size-12 rounded-[16px] flex items-center justify-center ${colorStyles[color]}`}>
                    <Icon className="size-6" />
                </div>
                {trend && (
                    <div className={`px-2.5 py-1 rounded-full text-[12px] font-bold ${trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {trend.isPositive ? "+" : ""}{trend.value}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-[14px] font-medium text-gray-500">{title}</p>
                <h3 className="text-[28px] font-bold text-gray-900 tracking-tight">{value}</h3>
                {subtitle && (
                    <p className="text-[13px] text-gray-400">{subtitle}</p>
                )}
            </div>
        </div>
    )
}
