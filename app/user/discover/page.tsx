"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Search,
    Star,
    Grid3x3,
    List,
    MapPin,
    Heart,
    UserPlus,
    Check,
    X
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function UserDiscoverPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [categories, setCategories] = useState<any[]>([])
    const [providers, setProviders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        location: "",
        onlineOnly: false,
        verifiedOnly: false
    })

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories")
                if (res.ok) {
                    const data = await res.json()
                    setCategories(Array.isArray(data) ? data : [])
                } else {
                    setCategories([])
                }
            } catch (error) {
                console.error("Error fetching categories:", error)
                setCategories([])
            }
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        const searchProviders = async () => {
            setIsLoading(true)
            try {
                const params = new URLSearchParams()
                if (searchQuery) params.append("q", searchQuery)
                if (selectedCategory) params.append("category", selectedCategory)
                if (filters.minPrice) params.append("minPrice", filters.minPrice)
                if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)

                const res = await fetch(`/api/providers/search?${params.toString()}`)
                if (res.ok) {
                    let data = await res.json()
                    data = data.providers || data

                    // Client-side filtering
                    if (filters.location) {
                        data = data.filter((p: any) =>
                            p.profile?.location?.toLowerCase().includes(filters.location.toLowerCase())
                        )
                    }
                    if (filters.onlineOnly) {
                        data = data.filter((p: any) => p.profile?.isOnline === true)
                    }
                    if (filters.verifiedOnly) {
                        data = data.filter((p: any) => p.kycStatus === "APPROVED")
                    }

                    setProviders(data)
                }
            } catch (error) {
                console.error("Error searching providers:", error)
            } finally {
                setIsLoading(false)
            }
        }

        const debounce = setTimeout(searchProviders, 300)
        return () => clearTimeout(debounce)
    }, [searchQuery, selectedCategory, filters])

    const toggleFavorite = (providerId: string) => {
        setProviders(prev => prev.map(p =>
            p.id === providerId ? { ...p, isFavorite: !p.isFavorite } : p
        ))
    }

    const toggleFollow = (providerId: string) => {
        setProviders(prev => prev.map(p =>
            p.id === providerId ? { ...p, isFollowing: !p.isFollowing } : p
        ))
    }

    const clearFilters = () => {
        setFilters({ minPrice: "", maxPrice: "", location: "", onlineOnly: false, verifiedOnly: false })
        setSelectedCategory(null)
        setSearchQuery("")
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="h-screen flex flex-col bg-[#f5f5f5]">
            {/* Fixed Header - 10% */}
            <div className="h-[10vh] border-b border-gray-200 bg-white px-6 flex items-center justify-between flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-[#181818]">Service Providers</h1>
                    <p className="text-sm text-[#767676]">
                        {isLoading ? "Searching..." : `${providers.length} provider${providers.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        onClick={() => setViewMode("grid")}
                        size="sm"
                    >
                        <Grid3x3 className="w-4 h-4 mr-2" />
                        Grid
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        onClick={() => setViewMode("list")}
                        size="sm"
                    >
                        <List className="w-4 h-4 mr-2" />
                        List
                    </Button>
                </div>
            </div>

            {/* Scrollable Content Area - 80% */}
            <div className="h-[80vh] overflow-y-auto flex-shrink-0">
                <div className="flex h-full">
                    {/* Fixed Left Sidebar - Filters */}
                    <div className="w-[320px] flex-shrink-0">
                        <div className="fixed top-[12vh] left-6 w-[300px] bg-white rounded-[24px] shadow-lg p-6 space-y-6 max-h-[70vh] overflow-y-auto z-10">
                            {/* Search */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search providers..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-10 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Categories</Label>
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant={selectedCategory === null ? "default" : "outline"}
                                        className="cursor-pointer px-3 py-1 rounded-full text-xs"
                                        onClick={() => setSelectedCategory(null)}
                                    >
                                        All
                                    </Badge>
                                    {Array.isArray(categories) && categories.map(cat => (
                                        <Badge
                                            key={cat.id}
                                            variant={selectedCategory === cat.name ? "default" : "outline"}
                                            className="cursor-pointer px-3 py-1 rounded-full text-xs"
                                            onClick={() => setSelectedCategory(cat.name)}
                                        >
                                            {cat.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Price Range (ZMW)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                        className="h-10 rounded-lg"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                                        className="h-10 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Location</Label>
                                <Input
                                    type="text"
                                    placeholder="City or region"
                                    value={filters.location}
                                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                    className="h-10 rounded-lg"
                                />
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.onlineOnly}
                                        onChange={(e) => setFilters(prev => ({ ...prev, onlineOnly: e.target.checked }))}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm">Online only</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.verifiedOnly}
                                        onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm">Verified only</span>
                                </label>
                            </div>

                            {/* Clear Filters */}
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="w-full rounded-lg"
                                size="sm"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Clear All
                            </Button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6">
                        {isLoading ? (
                            <div className="text-center py-12">Loading providers...</div>
                        ) : providers.length === 0 ? (
                            <Card className="bg-white rounded-[40px]">
                                <CardContent className="p-12 text-center">
                                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500">No providers found</p>
                                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                                </CardContent>
                            </Card>
                        ) : viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {providers.map(provider => (
                                    <div
                                        key={provider.id}
                                        className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[40px] w-full max-w-[360px] relative shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                        onClick={() => router.push(`/provider/${provider.id}`)}
                                    >
                                        <div className="relative">
                                            <img
                                                src={provider.image || "/placeholder-user.jpg"}
                                                alt={provider.name}
                                                className="w-full h-[160px] object-cover rounded-t-[32px]"
                                            />

                                            {provider.profile?.isOnline && (
                                                <div className="absolute top-4 right-4 bg-[#22c55e] text-white px-3 py-1 rounded-full text-[13px] font-medium">
                                                    Online
                                                </div>
                                            )}

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleFavorite(provider.id)
                                                }}
                                                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                                            >
                                                <Heart className={cn(
                                                    "w-5 h-5",
                                                    provider.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                                                )} />
                                            </button>
                                        </div>

                                        <div className="px-4 py-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-[#181818]">
                                                    {provider.name}
                                                </h3>
                                                {provider.kycStatus === "APPROVED" && (
                                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-xs text-[#767676] mb-2 line-clamp-1">
                                                {provider.profile?.headline || "Service Provider"}
                                            </p>

                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-1 text-[#767676]">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="text-xs">{provider.profile?.location || "Remote"}</span>
                                                </div>
                                                {provider.rating > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-[#facc15] text-[#facc15]" />
                                                        <span className="font-medium text-sm">{provider.rating.toFixed(1)}</span>
                                                        <span className="text-[#a2a2a2] text-xs">({provider.reviewCount})</span>
                                                    </div>
                                                )}
                                            </div>

                                            {provider.profile?.hourlyRate && (
                                                <div className="text-sm font-medium text-[#181818] mb-3">
                                                    ZMW {provider.profile.hourlyRate}/hr
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-3 border-t border-[#eeeeee]">
                                                <span className="text-xs text-[#767676]">
                                                    {provider.providerServices?.length || 0} service{provider.providerServices?.length !== 1 ? 's' : ''}
                                                </span>
                                                <Button
                                                    variant={provider.isFollowing ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleFollow(provider.id)
                                                    }}
                                                    className="rounded-full text-xs h-8"
                                                >
                                                    {provider.isFollowing ? "Following" : (
                                                        <>
                                                            <UserPlus className="w-3 h-3 mr-1" />
                                                            Follow
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {providers.map(provider => (
                                    <Card
                                        key={provider.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow bg-white rounded-[24px]"
                                        onClick={() => router.push(`/provider/${provider.id}`)}
                                    >
                                        <CardContent className="p-5 flex gap-5">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={provider.image || "/placeholder-user.jpg"}
                                                    alt={provider.name}
                                                    className="w-[100px] h-[100px] object-cover rounded-[16px]"
                                                />
                                                {provider.profile?.isOnline && (
                                                    <div className="absolute top-2 right-2 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-white" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-semibold text-[#181818]">
                                                            {provider.name}
                                                        </h3>
                                                        {provider.kycStatus === "APPROVED" && (
                                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleFavorite(provider.id)
                                                        }}
                                                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                                    >
                                                        <Heart className={cn(
                                                            "w-5 h-5",
                                                            provider.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                                                        )} />
                                                    </button>
                                                </div>

                                                <p className="text-sm text-[#767676] mb-3">
                                                    {provider.profile?.headline || "Service Provider"}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {provider.providerServices?.slice(0, 3).map((service: any) => (
                                                        <span
                                                            key={service.id}
                                                            className="px-3 py-1 bg-[#efefef] rounded-full text-xs text-[#181818]"
                                                        >
                                                            {service.category}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-sm text-[#767676]">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="text-xs">{provider.profile?.location || "Remote"}</span>
                                                        </div>
                                                        {provider.rating > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-4 h-4 fill-[#facc15] text-[#facc15]" />
                                                                <span className="font-medium text-sm">{provider.rating.toFixed(1)}</span>
                                                                <span className="text-[#a2a2a2] text-xs">({provider.reviewCount})</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant={provider.isFollowing ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleFollow(provider.id)
                                                        }}
                                                        className="rounded-full text-xs h-8"
                                                    >
                                                        {provider.isFollowing ? "Following" : "Follow"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation Space - 10% */}
            <div className="h-[10vh] flex-shrink-0" />
        </div>
    )
}
