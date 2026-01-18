"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminStatCard } from "@/components/admin-shared/admin-stat-card"
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"

export default function AdminAnalyticsPage() {
    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-[28px] font-bold text-[#181818] mb-1">Analytics & Reports</h1>
                <p className="text-[15px] text-[#767676]">Deep dive into platform performance and user engagement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AdminStatCard
                    title="Gross Volume"
                    value="ZMW 450,200"
                    icon={DollarSign}
                    color="green"
                    trend={{ value: "15% vs last month", isPositive: true }}
                />
                <AdminStatCard
                    title="User Retention"
                    value="84%"
                    icon={Users}
                    color="blue"
                    trend={{ value: "2% vs last month", isPositive: true }}
                />
                <AdminStatCard
                    title="Avg. Session Time"
                    value="42 min"
                    icon={TrendingUp}
                    color="purple"
                    trend={{ value: "5m decrease", isPositive: false }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[24px] shadow-sm border-gray-100">
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl text-gray-400">
                            Revenue Chart Placeholder
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[24px] shadow-sm border-gray-100">
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl text-gray-400">
                            Growth Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
