"use client"

import { Bell, Search, LayoutDashboard, Shield, Users, BarChart2, Settings, Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function AdminHeader() {
    const { user, signOut, loading } = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Ensure only admins can see this
    useEffect(() => {
        if (!loading && (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN"))) {
            router.push("/")
        }
    }, [user, loading, router])

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

    const isActive = (path: string) => {
        if (path === "/admin" && pathname === "/admin") return true
        if (path !== "/admin" && pathname?.startsWith(path)) return true
        return false
    }

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Platform", href: "/admin/platform", icon: Shield },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                {/* Logo and Desktop Nav */}
                {/* Logo and Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <div className="lg:hidden">
                        {/* Mobile Logo */}
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Shield className="size-5" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Admin</span>
                        </Link>
                    </div>
                    <div className="hidden lg:block text-gray-400 text-sm font-medium">
                        Administration Console
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="hidden sm:flex items-center justify-center size-10 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <Search className="size-5" />
                    </button>
                    <button className="relative flex items-center justify-center size-10 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <Bell className="size-5" />
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

                    <div className="hidden sm:flex items-center gap-3 pl-2">
                        <div className="text-right">
                            <p className="text-[14px] font-semibold text-gray-900 leading-none mb-1">
                                {user?.name || "Admin"}
                            </p>
                            <p className="text-[12px] text-gray-500 leading-none">
                                Administrator
                            </p>
                        </div>
                        <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                            {user?.image ? (
                                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <Shield className="size-5 text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden flex items-center justify-center size-10 rounded-full hover:bg-gray-100 text-gray-900"
                    >
                        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-4 shadow-lg animate-in slide-in-from-top-10">
                    <nav className="flex flex-col gap-2">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${isActive(item.href)
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="size-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                        <div className="h-[1px] bg-gray-100 my-2"></div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-red-500 hover:bg-red-50 w-full text-left"
                        >
                            <LogOut className="size-5" />
                            Log Out
                        </button>
                    </nav>
                </div>
            )}
        </header>
    )
}
