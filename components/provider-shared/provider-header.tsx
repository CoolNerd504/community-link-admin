import { Bell, Search, LayoutDashboard, Calendar, Video, BarChart2, User, Settings, Menu, X, CommLinkLogo } from "lucide-react" // Assuming CommLinkLogo might be a custom component or just text for now
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function ProviderHeader() {
    const { user, signOut } = useAuth()
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

    const isActive = (path: string) => pathname === path

    const navigation = [
        { name: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
        { name: "Schedule", href: "/provider/schedule", icon: Calendar },
        { name: "Services", href: "/provider/services", icon: Video },
        { name: "Insights", href: "/provider/insights", icon: BarChart2 },
        { name: "Profile", href: "/provider/profile", icon: User },
    ]

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                {/* Logo and Desktop Nav */}
                <div className="flex items-center gap-12">
                    <Link href="/provider/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        CommLink
                    </Link>

                    <nav className="hidden lg:flex items-center gap-2">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold transition-all ${isActive(item.href)
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="size-4" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
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
                                {user?.name || "Provider"}
                            </p>
                            <p className="text-[12px] text-gray-500 leading-none">
                                Service Provider
                            </p>
                        </div>
                        <img
                            src={user?.image || "https://github.com/shadcn.png"}
                            alt="Profile"
                            className="size-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
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
                            onClick={() => signOut()}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-red-500 hover:bg-red-50"
                        >
                            Log Out
                        </button>
                    </nav>
                </div>
            )}
        </header>
    )
}
