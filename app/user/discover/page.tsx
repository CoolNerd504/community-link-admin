"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Star, Grid, List, SlidersHorizontal, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function UserDiscoverPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [categories, setCategories] = useState<any[]>([])
    const [providers, setProviders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filters, setFilters] = useState({ minPrice: "", maxPrice: "" })

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories")
                if (res.ok) {
                    const data = await res.json()
                    setCategories(data)
                }
            } catch (error) {
                console.error("Error fetching categories:", error)
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
                    const data = await res.json()
                    setProviders(data.providers || data)
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

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Discover Providers</h1>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search providers..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
                        <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                    </Button>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <Badge
                        variant={selectedCategory === null ? "default" : "outline"}
                        className="cursor-pointer px-4 py-2 whitespace-nowrap"
                        onClick={() => setSelectedCategory(null)}
                    >
                        All
                    </Badge>
                    {categories.map(cat => (
                        <Badge
                            key={cat.id}
                            variant={selectedCategory === cat.name ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2 whitespace-nowrap"
                            onClick={() => setSelectedCategory(cat.name)}
                        >
                            {cat.name}
                        </Badge>
                    ))}
                </div>

                {/* Provider Grid/List */}
                {isLoading ? (
                    <div className="text-center py-12">Loading providers...</div>
                ) : providers.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">No providers found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                        </CardContent>
                    </Card>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {providers.map(provider => (
                            <Card
                                key={provider.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => router.push(`/provider/${provider.id}`)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar className="w-14 h-14">
                                            <AvatarImage src={provider.image || ""} />
                                            <AvatarFallback>{provider.name?.[0] || "P"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{provider.name}</p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {provider.profile?.headline || "Provider"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium">{provider.rating || "4.8"}</span>
                                            <span className="text-gray-400 text-sm">({provider.reviewCount || 0})</span>
                                        </div>
                                        <Badge variant="secondary">
                                            From ZMW {provider.services?.[0]?.price || "50"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {providers.map(provider => (
                            <Card
                                key={provider.id}
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => router.push(`/provider/${provider.id}`)}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={provider.image || ""} />
                                            <AvatarFallback>{provider.name?.[0] || "P"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{provider.name}</p>
                                            <p className="text-sm text-gray-500">{provider.profile?.headline || "Provider"}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm">{provider.rating || "4.8"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button>View Profile</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Filter Modal */}
                <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Filters</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Min Price (ZMW)</Label>
                                    <Input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label>Max Price (ZMW)</Label>
                                    <Input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setFilters({ minPrice: "", maxPrice: "" })}>
                                Clear
                            </Button>
                            <Button onClick={() => setIsFilterOpen(false)}>Apply</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
