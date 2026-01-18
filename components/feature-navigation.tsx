"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Compass,
    Calendar,
    BookOpen,
    Wallet,
    User,
    Link,
    Shield,
    Briefcase,
    TrendingUp,
    Users,
    BarChart3,
    Settings,
} from "lucide-react"

interface NavigationItem {
    name: string
    href: string
    icon: any
}



const userNavigation: NavigationItem[] = [
    { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { name: "Discover", href: "/user/discover", icon: Compass },
    { name: "Bookings", href: "/client/bookings", icon: Calendar },
    { name: "Wallet", href: "/user/wallet", icon: Wallet },
    { name: "Profile", href: "/user/profile", icon: User },
    { name: "Linked Accounts", href: "/user/linked-accounts", icon: Link },
    { name: "Privacy", href: "/user/privacy", icon: Shield },
]

const providerNavigation: NavigationItem[] = [
    { name: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/provider/services", icon: Briefcase },
    { name: "Schedule", href: "/provider/schedule", icon: Calendar },
    { name: "Insights", href: "/provider/insights", icon: TrendingUp },
    { name: "Profile", href: "/provider/profile", icon: User },
]

const adminNavigation: NavigationItem[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Super Admin", href: "/superadmin", icon: Shield },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function FeatureNavigation() {
    const { user } = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    // Get user role from authenticated user, default to USER
    const userRole = user?.role || "USER"

    const getNavigation = (): NavigationItem[] => {
        switch (userRole) {
            case "PROVIDER":
                return providerNavigation
            case "ADMIN":
            case "SUPER_ADMIN":
                return adminNavigation
            default:
                return userNavigation
        }
    }

    const navigation = getNavigation()

    const isActive = (href: string) => {
        return pathname === href || pathname?.startsWith(href + "/")
    }

    return (
        <nav className="fixed bottom-0 left-0 w-full h-[10vh] flex items-center justify-center z-40 bg-white/30 backdrop-blur-md">
            <div className="bg-white/90 backdrop-blur-lg rounded-full shadow-lg border border-gray-200 px-4 py-3">
                <div className="flex items-center gap-2">
                    {navigation.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        const isHovered = hoveredItem === item.name

                        return (
                            <div key={item.name} className="relative">
                                <button
                                    onClick={() => router.push(item.href)}
                                    onMouseEnter={() => setHoveredItem(item.name)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={cn(
                                        "relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300",
                                        active
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                    )}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />

                                    {/* Label appears on hover */}
                                    <span
                                        className={cn(
                                            "font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden",
                                            isHovered || active
                                                ? "max-w-[200px] opacity-100 ml-1"
                                                : "max-w-0 opacity-0 ml-0"
                                        )}
                                    >
                                        {item.name}
                                    </span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
