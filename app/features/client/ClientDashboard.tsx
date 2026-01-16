"use client"
import { useEffect, useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { useAuth } from "../../../hooks/use-auth"
import { searchProvidersAction } from "@/app/actions"
import { Search, Star, Bell, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Provider {
    id: string
    name: string
    email: string
    image?: string
    role: string
    username?: string
    kycStatus?: string
    providerServices?: Array<{
        id: string
        title: string
        description: string
        price: number
        duration: number
        category: string
    }>
}

export default function ClientDashboard() {
    const { user: authUser } = useAuth()
    const [providers, setProviders] = useState<Provider[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const categories = ["All", "Consulting", "Coaching", "Design", "Development", "Marketing"]
    const priceRanges = ["$0 - $50", "$50 - $150", "$150+"]

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true)
                const data = await searchProvidersAction("", {})
                setProviders(data as any)
            } catch (error) {
                console.error("Failed to fetch providers", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProviders()
    }, [])

    const filteredProviders = providers.filter(provider => {
        const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            provider.providerServices?.some(s =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s?.category?.toLowerCase().includes(searchQuery.toLowerCase())
            )

        const matchesCategory = !selectedCategory || selectedCategory === "All" ||
            provider.providerServices?.some(s => s?.category === selectedCategory)

        return matchesSearch && matchesCategory
    })

    const totalPages = Math.ceil(filteredProviders.length / itemsPerPage)
    const paginatedProviders = filteredProviders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const formatPrice = (price: number) => {
        return `$${price}`
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">C</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">CommLink</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6 text-sm">
                            <Link href="/search" className="text-gray-700 hover:text-gray-900">Find Providers</Link>
                            <Link href="/how-it-works" className="text-gray-700 hover:text-gray-900">How It Works</Link>
                            <Link href="/resources" className="text-gray-700 hover:text-gray-900">Resources</Link>
                            <Link href="/messages" className="text-gray-700 hover:text-gray-900">Messages</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </Button>
                        <Avatar className="w-9 h-9 cursor-pointer">
                            <AvatarImage src={authUser?.image || ""} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                                {authUser?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Provider Discovery</h1>
                    <p className="text-gray-600 mt-1">Browse {providers.length}+ top-rated professionals for services and support</p>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search by name, skill, or industry"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 border-gray-300"
                        />
                    </div>
                    <select
                        className="h-11 px-4 border border-gray-300 rounded-md text-sm bg-white"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <Button
                        className="h-11 bg-blue-600 hover:bg-blue-700 px-8"
                        onClick={() => setCurrentPage(1)}
                    >
                        Search
                    </Button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading providers...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredProviders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No providers found. Try adjusting your search.</p>
                    </div>
                )}

                {/* Provider Grid */}
                {!loading && filteredProviders.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {paginatedProviders.map((provider) => {
                                const mainService = provider.providerServices?.[0]
                                const avgPrice = provider.providerServices?.reduce((sum, s) => sum + s.price, 0) / (provider.providerServices?.length || 1)

                                return (
                                    <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative">
                                            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <Avatar className="w-32 h-32">
                                                    <AvatarImage src={provider.image} />
                                                    <AvatarFallback className="text-4xl bg-blue-100 text-blue-700">
                                                        {provider.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            {provider.kycStatus === "APPROVED" && (
                                                <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                                                    VERIFIED
                                                </Badge>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                                                        {provider.kycStatus === "APPROVED" && (
                                                            <span className="text-blue-600">✓</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {mainService?.title || "Service Provider"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 uppercase mt-1">
                                                        {provider.providerServices?.length || 0} Services
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-gray-900">
                                                        {formatPrice(Math.round(avgPrice || 0))}
                                                    </div>
                                                    <div className="text-xs text-gray-500">PER SESSION</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 mb-3">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">4.8</span>
                                                <span className="text-sm text-gray-500">(126 reviews)</span>
                                            </div>

                                            <Link href={`/provider/${provider.id}`}>
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                                    View Profile
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let page;
                                    if (totalPages <= 5) {
                                        page = i + 1
                                    } else if (currentPage <= 3) {
                                        page = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                        page = totalPages - 4 + i
                                    } else {
                                        page = currentPage - 2 + i
                                    }
                                    return (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "ghost"}
                                            className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    )
                                })}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">C</span>
                                </div>
                                <span className="font-bold text-gray-900">CommLink</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Empowering professional growth through accessible, high-quality services and support.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Explore</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href="/search">Find a Provider</Link></li>
                                <li><Link href="/become-provider">Become a Provider</Link></li>
                                <li><Link href="/pricing">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href="/help">Help Center</Link></li>
                                <li><Link href="/safety">Safety</Link></li>
                                <li><Link href="/contact">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Newsletter</h4>
                            <div className="flex gap-2">
                                <Input placeholder="Your email" className="text-sm" />
                                <Button className="bg-blue-600 hover:bg-blue-700">Join</Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                        © 2026 CommLink. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
