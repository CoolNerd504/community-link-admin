"use client"

import NextLink from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Shield,
    AlertCircle,
    Tag,
    CreditCard,
    Package,
    BarChart2,
    Settings,
    LogOut
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
    const pathname = usePathname()
    const { signOut } = useAuth()

    const navItems = [
        {
            group: "Overview",
            items: [
                { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
                { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
            ]
        },
        {
            group: "User Management",
            items: [
                { name: "Service Providers", href: "/admin/users?tab=providers", activePath: "/admin/users", icon: Shield },
                { name: "Users", href: "/admin/users?tab=clients", activePath: "/admin/users", icon: Users },
                { name: "Disputes", href: "/admin/users?tab=disputes", activePath: "/admin/users", icon: AlertCircle },
            ]
        },
        {
            group: "Platform Configuration",
            items: [
                { name: "Categories", href: "/admin/platform?tab=categories", activePath: "/admin/platform", icon: Tag },
                { name: "Pricing", href: "/admin/platform?tab=pricing", activePath: "/admin/platform", icon: CreditCard },
                { name: "Packages & Rates", href: "/admin/platform?tab=packages", activePath: "/admin/platform", icon: Package },
            ]
        },
        {
            group: "System",
            items: [
                { name: "Settings", href: "/admin/settings", icon: Settings },
            ]
        }
    ]

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50 hidden lg:flex">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 border-b border-gray-50">
                <div className="flex items-center gap-2 text-blue-600">
                    <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <Shield className="size-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                {navItems.map((group, idx) => (
                    <div key={idx}>
                        <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            {group.group}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                // Logic for active state
                                const activePath = (item as any).activePath
                                const exact = (item as any).exact
                                const isActive = exact
                                    ? pathname === item.href
                                    : (activePath ? pathname?.startsWith(activePath) : pathname?.startsWith(item.href))

                                return (
                                    <NextLink
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all group",
                                            isActive
                                                ? "bg-blue-50 text-blue-600 shadow-sm"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "size-5 transition-colors",
                                            isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                        )} />
                                        {item.name}
                                    </NextLink>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                    <LogOut className="size-5" />
                    Log Out
                </button>
            </div>
        </aside>
    )
}
