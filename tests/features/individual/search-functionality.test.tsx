"use client"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { AdvancedSearch } from "../../../components/advanced-search"
import { getActiveCategories } from "../../../lib/firebase-queries"
import type { Category } from "../../../types/firebase-types"

export default function SearchFunctionalityTest() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTown, setSelectedTown] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Loading categories for search test...")
      const fetchedCategories = await getActiveCategories()
      console.log("Categories loaded:", fetchedCategories)
      setCategories(fetchedCategories)
    } catch (err: any) {
      console.error("Error loading categories:", err)
      setError(err.message || "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedTown("all")
    setSelectedCountry("all")
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Search Functionality Test</h1>
      
      <div className="flex space-x-4 mb-6">
        <Button onClick={loadCategories} disabled={loading}>
          {loading ? "Loading..." : "Reload Categories"}
        </Button>
        <Button onClick={handleClearFilters} variant="outline">
          Clear Filters
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories Available ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-gray-500">No categories found</p>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Search State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Search Term:</span> {searchTerm || "None"}
              </div>
              <div>
                <span className="font-medium">Selected Category:</span> {selectedCategory}
              </div>
              <div>
                <span className="font-medium">Selected Town:</span> {selectedTown}
              </div>
              <div>
                <span className="font-medium">Selected Country:</span> {selectedCountry}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Advanced Search Component Test</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTown={selectedTown}
            onTownChange={setSelectedTown}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>
    </div>
  )
} 