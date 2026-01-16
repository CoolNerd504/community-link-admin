"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Slider } from "../../components/ui/slider"
import { Checkbox } from "../../components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Search, MapPin, Star, Filter, ArrowRight } from "lucide-react"
import { getCategoriesAction, searchProvidersAction } from "../actions"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // URL Params
    const initialQuery = searchParams.get('q') || ""
    const initialCategory = searchParams.get('category') || ""

    // State
    const [query, setQuery] = useState(initialQuery)
    const [providers, setProviders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState<any[]>([])

    // Filters
    const [selectedCategory, setSelectedCategory] = useState(initialCategory)
    const [priceRange, setPriceRange] = useState([0, 1000]) // Max arbitrary

    // Fetch Initial Data
    useEffect(() => {
        getCategoriesAction().then(setCategories).catch(console.error)
    }, [])

    // Search Effect
    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true)
            try {
                const results = await searchProvidersAction(query, {
                    category: selectedCategory || undefined,
                    minPrice: undefined, // Implement price slider later if needed
                    maxPrice: undefined
                })
                setProviders(results)
            } catch (error) {
                console.error("Search failed:", error)
            } finally {
                setLoading(false)
            }
        }

        // Debounce simple implementation
        const timeoutId = setTimeout(() => {
            fetchProviders()
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query, selectedCategory]) // Add priceRange dependencies when ready

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // URL update logic could go here
    }

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(prev => prev === catId ? "" : catId)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Search Bar */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search for providers, services..."
                                className="pl-10"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </h3>

                        <div className="space-y-4">
                            {/* Categories */}
                            <div>
                                <h4 className="text-sm font-medium mb-2">Categories</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto pl-1">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={cat.id}
                                                checked={selectedCategory === cat.name}
                                                onCheckedChange={() => handleCategoryChange(cat.name)}
                                            />
                                            <label
                                                htmlFor={cat.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {cat.name}
                                            </label>
                                        </div>
                                    ))}
                                    {categories.length === 0 && <p className="text-sm text-gray-400">Loading categories...</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            {loading ? "Searching..." : `${providers.length} Providers Found`}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : providers.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No providers found</h3>
                            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {providers.map((provider) => (
                                <Card key={provider.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/provider/${provider.id}`)}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={provider.image} />
                                                <AvatarFallback>{provider.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg truncate pr-2">{provider.name}</h3>
                                                        <p className="text-sm text-blue-600 font-medium mb-1">{provider.profile?.headline || "General Provider"}</p>
                                                    </div>
                                                    {provider.kycStatus === 'APPROVED' && (
                                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Verified</Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                                    <MapPin className="h-3 w-3" />
                                                    {provider.profile?.location || "Unknown Location"}
                                                </div>

                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-semibold text-gray-900">{provider.rating?.toFixed(1) || "New"}</span>
                                                        <span className="text-gray-500">({provider.reviewCount})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Services Preview */}
                                        <div className="mt-4 pt-4 border-t space-y-2">
                                            {provider.providerServices && provider.providerServices.slice(0, 2).map((svc: any) => (
                                                <div key={svc.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                                    <span className="font-medium text-gray-700 truncate flex-1 pr-2">{svc.title}</span>
                                                    <span className="font-bold text-gray-900">ZMW {svc.price}</span>
                                                </div>
                                            ))}
                                            {provider.providerServices && provider.providerServices.length > 2 && (
                                                <p className="text-xs text-center text-gray-500 mt-1">
                                                    +{provider.providerServices.length - 2} more services
                                                </p>
                                            )}
                                            {(!provider.providerServices || provider.providerServices.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">No services listed yet</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
