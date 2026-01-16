"use client"
import { useEffect, useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { useAuth } from "../../../hooks/use-auth"
import { getClientSessionsAction } from "@/app/actions"
import { Calendar, Clock, Download, Eye, Bell, LayoutDashboard, BookOpen, History, Settings, LogOut } from "lucide-react"
import { ReviewModal } from "../reviews/ReviewModal"
import { signOut } from "next-auth/react"

interface Session {
    id: string
    provider: {
        name: string
        image?: string
        role?: string
    }
    startTime: Date
    endTime?: Date
    status: string
    price: number
    service?: {
        title: string
        duration: number
    }
}

export default function ClientDashboard() {
    const { user: authUser } = useAuth()
    const [sessions, setSessions] = useState<Session[]>([])
    const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
    const [recentActivity, setRecentActivity] = useState<Session[]>([])
    const [activeTab, setActiveTab] = useState("dashboard")
    const [reviewSessionId, setReviewSessionId] = useState<string | null>(null)

    useEffect(() => {
        const fetchSessions = async () => {
            if (!authUser?.id) return

            try {
                const data = await getClientSessionsAction(authUser.id)
                setSessions(data as any)

                const now = new Date()
                const upcoming = data.filter((s: any) =>
                    new Date(s.startTime) > now && s.status !== 'CANCELLED'
                )
                const recent = data.filter((s: any) =>
                    new Date(s.startTime) <= now || s.status === 'COMPLETED'
                ).slice(0, 5)

                setUpcomingSessions(upcoming as any)
                setRecentActivity(recent as any)
            } catch (error) {
                console.error("Failed to fetch sessions", error)
            }
        }

        fetchSessions()
    }, [authUser])

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-800" },
            SCHEDULED: { label: "Coming up", className: "bg-blue-100 text-blue-800" },
            COMPLETED: { label: "Completed", className: "bg-gray-100 text-gray-800" },
            CANCELLED: { label: "Refunded", className: "bg-red-100 text-red-800" },
            ACTIVE: { label: "Active", className: "bg-purple-100 text-purple-800" }
        }

        const config = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" }
        return <Badge className={config.className}>{config.label}</Badge>
    }

    const formatDateTime = (date: Date) => {
        const d = new Date(date)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        if (d.toDateString() === today.toDateString()) {
            return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
        } else if (d.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
        } else {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
        }
    }

    const getTimeUntilSession = (startTime: Date) => {
        const now = new Date()
        const start = new Date(startTime)
        const diff = start.getTime() - now.getTime()

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)

        if (days > 0) return `Link Active in ${days}d`
        if (hours > 0) return `Link Active in ${hours}h`
        return "Link Active Now"
    }

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "bookings", label: "Bookings", icon: BookOpen },
        { id: "history", label: "History", icon: History },
        { id: "settings", label: "Settings", icon: Settings }
    ]

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col relative">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">CommLink</h2>
                        <p className="text-xs text-gray-500">Marketplace</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        )
                    })}
                </nav>

                {/* User Profile at Bottom */}
                <div className="mt-auto pt-6 space-y-2 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={authUser?.image || ""} />
                            <AvatarFallback>{authUser?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{authUser?.name || "User"}</p>
                            <p className="text-xs text-gray-500">Pro Member</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => signOut({ callbackUrl: '/' })}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{authUser?.name || "User"}</span>
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={authUser?.image || ""} />
                                <AvatarFallback>{authUser?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                        <button className="text-sm text-blue-600 hover:underline">View all</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingSessions.map((session) => (
                            <Card key={session.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={session.provider.image || ""} />
                                            <AvatarFallback>{session.provider.name?.charAt(0) || "P"}</AvatarFallback>
                                        </Avatar>
                                        {getStatusBadge(session.status)}
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-1">
                                        {session.service?.title || "Session"}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {session.provider.name} • {session.provider.role || "Provider"}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-blue-600 mb-4">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDateTime(session.startTime)}</span>
                                    </div>

                                    {session.status === 'CONFIRMED' || session.status === 'ACTIVE' ? (
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Join Call
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="w-full" disabled>
                                            {getTimeUntilSession(session.startTime)}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                        {upcomingSessions.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No upcoming sessions
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Session Service
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Provider
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentActivity.map((session) => (
                                            <tr key={session.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {session.service?.title || "Session"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {session.service?.duration || 60} mins session
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(session.startTime).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={session.provider.image || ""} />
                                                            <AvatarFallback>{session.provider.name?.charAt(0) || "P"}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm text-gray-900">{session.provider.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(session.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {session.status === 'COMPLETED' && (
                                                            <>
                                                                <Button variant="ghost" size="sm" className="text-blue-600">
                                                                    <Download className="w-4 h-4 mr-1" />
                                                                    Download Receipt
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setReviewSessionId(session.id)}
                                                                    className="text-blue-600"
                                                                >
                                                                    Write Review
                                                                </Button>
                                                            </>
                                                        )}
                                                        {session.status === 'CANCELLED' && (
                                                            <Button variant="ghost" size="sm" className="text-blue-600">
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                View Details
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {recentActivity.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    No recent activity
                                </div>
                            )}

                            {recentActivity.length > 0 && (
                                <div className="p-4 text-center border-t border-gray-200">
                                    <button className="text-sm text-blue-600 hover:underline">
                                        Load more activity
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Review Modal */}
            {reviewSessionId && (
                <ReviewModal
                    sessionId={reviewSessionId}
                    isOpen={!!reviewSessionId}
                    onClose={() => setReviewSessionId(null)}
                    onSuccess={() => {
                        setReviewSessionId(null)
                        alert("Review submitted!")
                    }}
                />
            )}
        </div>
    )
}
