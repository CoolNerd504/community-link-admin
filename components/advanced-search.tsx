"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { getCategoriesAction } from "@/app/actions"
// import type { Category } from "@/types/firebase-types"
import type { Category } from "@prisma/client"

interface AdvancedSearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedTown: string
  onTownChange: (town: string) => void
  selectedCountry: string
  onCountryChange: (country: string) => void
  onClearFilters: () => void
}

const countries = [
  { value: "all", label: "All Countries" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
]

const popularTowns = [
  { value: "all", label: "All Towns" },
  { value: "new-york", label: "New York" },
  { value: "los-angeles", label: "Los Angeles" },
  { value: "chicago", label: "Chicago" },
  { value: "houston", label: "Houston" },
  { value: "phoenix", label: "Phoenix" },
  { value: "philadelphia", label: "Philadelphia" },
  { value: "san-antonio", label: "San Antonio" },
]

export function AdvancedSearch({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTown,
  onTownChange,
  selectedCountry,
  onCountryChange,
  onClearFilters,
}: AdvancedSearchProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [selectedBundle, setSelectedBundle] = useState<string>("15")
  const bundleOptions = [
    { label: "10 Minutes", value: "10", price: 5 },
    { label: "15 Minutes", value: "15", price: 7 },
    { label: "30 Minutes", value: "30", price: 12 },
    { label: "60 Minutes", value: "60", price: 20 },
  ]
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        // setCategoriesLoading(true)
        const fetchedCategories: any = await getCategoriesAction()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Error loading categories:", error)
        // Fallback to empty array if Firebase fails
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Placeholder: Replace with real user bundle data from context or props
  const totalMinutesBought = 120
  const minutesUsed = 45
  const minutesLeft = totalMinutesBought - minutesUsed

  const handleBuyMinutes = () => {
    // TODO: Implement purchase minutes flow/modal
    alert('Open buy minutes flow/modal')
  }

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Geolocation error:", error)
        }
      )
    }
  }, [])

  const hasActiveFilters = selectedCategory !== "all" || selectedTown !== "all" || selectedCountry !== "all"

  const handleClearFilters = () => {
    onCategoryChange("all")
    onTownChange("all")
    onCountryChange("all")
    onClearFilters()
  }

  const router = useRouter()

  return (
    <>
      <Dialog>
        {/* Minutes Summary & CTA */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-200 rounded-lg p-4 mb-2 shadow-sm">
          <div className="flex flex-row items-center gap-8 w-full sm:w-auto justify-center sm:justify-start">
            <div className="flex flex-col items-center px-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Total Bought</span>
              <span className="text-2xl font-extrabold text-black leading-tight">{totalMinutesBought}</span>
              <span className="text-xs text-gray-400">minutes</span>
            </div>
            <div className="h-10 w-px bg-gray-200 mx-2 hidden sm:block" />
            <div className="flex flex-col items-center px-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Used</span>
              <span className="text-2xl font-extrabold text-black leading-tight">{minutesUsed}</span>
              <span className="text-xs text-gray-400">minutes</span>
            </div>
            <div className="h-10 w-px bg-gray-200 mx-2 hidden sm:block" />
            <div className="flex flex-col items-center px-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Left</span>
              <span className="text-2xl font-extrabold text-black leading-tight">{minutesLeft}</span>
              <span className="text-xs text-gray-400">minutes</span>
            </div>
          </div>
          <DialogTrigger asChild>
            <Button
              className="mt-4 sm:mt-0 bg-black hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded shadow"
              style={{ minWidth: 140 }}
            >
              Buy Minutes
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Minutes</DialogTitle>
            <DialogDescription>
              Select a bundle to purchase. Minutes can be used across multiple sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {bundleOptions.map((option) => (
                <button
                  key={option.value}
                  className={`flex flex-col items-center border rounded-lg p-4 transition-all duration-150 focus:outline-none ${selectedBundle === option.value ? "border-black bg-gray-100" : "border-gray-200 bg-white"}`}
                  onClick={() => setSelectedBundle(option.value)}
                >
                  <span className="text-lg font-bold text-black">{option.label}</span>
                  <span className="text-xs text-gray-500 mt-1">${option.price}</span>
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold mt-4"
              onClick={() => {
                const bundle = bundleOptions.find(b => b.value === selectedBundle)
                router.push(`/checkout?minutes=${bundle?.value}&price=${bundle?.price}`)
              }}
            >
              Continue to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            {/* Main Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search providers, services, or keywords..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories
                    .filter(category => category.name && category.name.trim() !== '')
                    .map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Country Filter */}
              <Select value={selectedCountry} onValueChange={onCountryChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Town Filter */}
              <Select value={selectedTown} onValueChange={onTownChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Town" />
                </SelectTrigger>
                <SelectContent>
                  {popularTowns.map((town) => (
                    <SelectItem key={town.value} value={town.value}>
                      {town.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Button */}
              {userLocation && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement location-based search
                    console.log("Search near user location:", userLocation)
                  }}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Near Me
                </Button>
              )}

              {/* Advanced Filters Popover */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium">Advanced Filters</h4>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <div className="flex gap-2">
                        <Input placeholder="Min" type="number" />
                        <Input placeholder="Max" type="number" />
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Minimum Rating</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4.5">4.5+ stars</SelectItem>
                          <SelectItem value="4.0">4.0+ stars</SelectItem>
                          <SelectItem value="3.5">3.5+ stars</SelectItem>
                          <SelectItem value="3.0">3.0+ stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Availability Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Availability</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online Now</SelectItem>
                          <SelectItem value="instant">Available for Instant</SelectItem>
                          <SelectItem value="scheduled">Scheduled Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Verified Only */}
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="verified-only" className="rounded" />
                      <label htmlFor="verified-only" className="text-sm">
                        Verified providers only
                      </label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {selectedCategory}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => onCategoryChange("all")}
                    />
                  </Badge>
                )}
                {selectedCountry !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Country: {countries.find(c => c.value === selectedCountry)?.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => onCountryChange("all")}
                    />
                  </Badge>
                )}
                {selectedTown !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Town: {popularTowns.find(t => t.value === selectedTown)?.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => onTownChange("all")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
} 