"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ProviderHeader } from "@/components/provider-shared/provider-header"
import { ProviderSidebar } from "@/components/provider-shared/provider-sidebar"
import { StatCard } from "@/components/provider-shared/stat-card"
import { DollarSign, TrendingUp, Users, Calendar, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

function EarningsChart() {
    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-[18px] font-bold text-gray-900">Earnings Overview</h3>
                    <p className="text-[13px] text-gray-500">Last 30 Days</p>
                </div>
                <select className="px-3 py-1.5 rounded-[8px] bg-gray-50 border border-gray-100 text-[13px] text-gray-600 focus:outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                </select>
            </div>

            {/* Mock Chart Area */}
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                {[35, 55, 40, 70, 45, 90, 60, 75, 50, 80, 65, 95].map((h, i) => (
                    <div key={i} className="w-full bg-blue-50 rounded-t-[6px] relative group transition-all hover:bg-blue-100 cursor-pointer">
                        <div
                            className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-[6px] group-hover:bg-blue-600 transition-all"
                            style={{ height: `${h}%` }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-bold py-1 px-2 rounded-[6px] shadow-lg pointer-events-none transition-opacity whitespace-nowrap z-10">
                                ZMW {h * 10}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-4 text-[12px] text-gray-400 font-medium px-2">
                <span>1 Nov</span>
                <span>5 Nov</span>
                <span>10 Nov</span>
                <span>15 Nov</span>
                <span>20 Nov</span>
                <span>25 Nov</span>
            </div>
        </div>
    )
}

function RecentTransactions() {
    const transactions = [
        { id: 1, type: "Payout", amount: "ZMW 1,250", status: "COMPLETED", date: "Today, 10:23 AM" },
        { id: 2, type: "Session", amount: "+ ZMW 200", status: "COMPLETED", date: "Yesterday, 2:30 PM" },
        { id: 3, type: "Session", amount: "+ ZMW 150", status: "COMPLETED", date: "Yesterday, 11:00 AM" },
        { id: 4, type: "Payout", amount: "ZMW 850", status: "COMPLETED", date: "23 Oct, 2024" },
    ]

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-bold text-gray-900">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="text-blue-600">View All</Button>
            </div>

            <div className="space-y-4">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-[16px] transition-colors rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className={`size-10 rounded-full flex items-center justify-center ${tx.type === "Payout" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                                }`}>
                                {tx.type === "Payout" ? <DollarSign className="size-5" /> : <Activity className="size-5" />}
                            </div>
                            <div>
                                <p className="text-[14px] font-bold text-gray-900">{tx.type}</p>
                                <p className="text-[12px] text-gray-500">{tx.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-[14px] font-bold ${tx.type === "Payout" ? "text-gray-900" : "text-green-600"
                                }`}>
                                {tx.type === "Payout" ? "-" : "+"} {tx.amount.replace("ZMW ", "ZMW ")}
                            </p>
                            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {tx.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ProviderInsightsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <ProviderHeader />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-[28px] font-bold text-[#181818] mb-1">
                        Insights & Earnings
                    </h1>
                    <p className="text-[15px] text-[#767676]">
                        Track your performance and manage your payouts.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content (3/4) */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Net Income"
                                value="ZMW 12,450"
                                icon={DollarSign}
                                color="green"
                                trend={{ value: "18.2%", isPositive: true }}
                            />
                            <StatCard
                                title="Total Sessions"
                                value="142"
                                icon={Activity}
                                color="blue"
                                subtitle="Last 30 days"
                            />
                            <StatCard
                                title="Active Clients"
                                value="38"
                                icon={Users}
                                color="purple"
                                trend={{ value: "5 New", isPositive: true }}
                            />
                        </div>

                        <EarningsChart />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RecentTransactions />

                            {/* Tips / Optimization */}
                            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[24px] p-6 text-white shadow-lg">
                                <h3 className="text-[18px] font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="size-5 text-yellow-400" />
                                    Pro Tips
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-white/10 rounded-[16px] p-4 backdrop-blur-sm">
                                        <h4 className="font-bold text-[14px] mb-1">Peak Hours</h4>
                                        <p className="text-[13px] text-blue-100">
                                            Your services are most viewed between 6PM - 9PM. Try enabling instant sessions during this time.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 rounded-[16px] p-4 backdrop-blur-sm">
                                        <h4 className="font-bold text-[14px] mb-1">Response Time</h4>
                                        <p className="text-[13px] text-blue-100">
                                            Responding under 5 mins increases booking conversion by 40%.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar (1/4) */}
                    <div className="lg:col-span-1 space-y-6">
                        <ProviderSidebar />

                        {/* Payout Card */}
                        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-[16px] font-bold text-gray-900 mb-4">Payout Balance</h3>
                            <div className="mb-6">
                                <p className="text-[13px] text-gray-500 mb-1">Available for Withdrawal</p>
                                <h2 className="text-[32px] font-bold text-gray-900">ZMW 850.00</h2>
                            </div>
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-[12px] h-12 text-[15px] font-bold">
                                Request Payout
                            </Button>
                            <p className="text-[12px] text-gray-400 text-center mt-3">
                                processed within 24 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
