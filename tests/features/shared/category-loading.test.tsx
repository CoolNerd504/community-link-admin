"use client"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { getActiveCategories, getAllCategories } from "../../../lib/firebase-queries"
import { createSampleCategories } from "../../../lib/firebase-operations"
import type { Category } from "../../../types/firebase-types"

export default function CategoryLoadingTest() {
  const [activeCategories, setActiveCategories] = useState<Category[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Testing category loading...")
      
      const active = await getActiveCategories()
      console.log("Active categories:", active)
      setActiveCategories(active)
      
      const all = await getAllCategories()
      console.log("All categories:", all)
      setAllCategories(all)
      
    } catch (err: any) {
      console.error("Error loading categories:", err)
      setError(err.message || "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const createSamples = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Creating sample categories...")
      await createSampleCategories()
      console.log("Sample categories created successfully")
      await loadCategories() // Reload after creating
    } catch (err: any) {
      console.error("Error creating sample categories:", err)
      setError(err.message || "Failed to create sample categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Category Loading Test</h1>
      
      <div className="flex space-x-4 mb-6">
        <Button onClick={loadCategories} disabled={loading}>
          {loading ? "Loading..." : "Reload Categories"}
        </Button>
        <Button onClick={createSamples} disabled={loading} variant="outline">
          {loading ? "Creating..." : "Create Sample Categories"}
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Categories ({activeCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {activeCategories.length === 0 ? (
              <p className="text-gray-500">No active categories found</p>
            ) : (
              <div className="space-y-2">
                {activeCategories.map((category) => (
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
            <CardTitle>All Categories ({allCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {allCategories.length === 0 ? (
              <p className="text-gray-500">No categories found</p>
            ) : (
              <div className="space-y-2">
                {allCategories.map((category) => (
                  <div key={category.id} className="p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <p className="text-xs text-gray-500">
                          Status: {category.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 