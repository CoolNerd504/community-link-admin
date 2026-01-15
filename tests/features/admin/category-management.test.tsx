"use client"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Switch } from "../../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { getAllCategories, getActiveCategories } from "../../../lib/firebase-queries"
import { createCategory, updateCategory, deleteCategory, createSampleCategories } from "../../../lib/firebase-operations"
import type { Category } from "../../../types/firebase-types"

export default function CategoryManagementTest() {
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [activeCategories, setActiveCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "📋",
    isActive: true,
    parentCategoryId: "none" as string | null,
    subcategories: [] as string[],
  })

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Loading categories for admin test...")
      
      const [all, active] = await Promise.all([
        getAllCategories(),
        getActiveCategories()
      ])
      
      console.log("All categories loaded:", all)
      console.log("Active categories loaded:", active)
      
      setAllCategories(all)
      setActiveCategories(active)
      
    } catch (err: any) {
      console.error("Error loading categories:", err)
      setError(err.message || "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    try {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        icon: newCategory.icon,
        isActive: newCategory.isActive,
        parentCategoryId: (newCategory.parentCategoryId && newCategory.parentCategoryId !== "none") ? newCategory.parentCategoryId : null,
        subcategories: newCategory.subcategories.filter(s => s.trim() !== ""),
        providerCount: 0,
      }
      
      console.log("Creating category:", categoryData)
      const categoryId = await createCategory(categoryData)
      console.log("Category created with ID:", categoryId)
      
      // Reset form and reload
      setNewCategory({
        name: "",
        description: "",
        icon: "📋",
        isActive: true,
        parentCategoryId: "none",
        subcategories: [],
      })
      setShowCreateForm(false)
      await loadCategories()
      
    } catch (err: any) {
      console.error("Error creating category:", err)
      setError(err.message || "Failed to create category")
    }
  }

  const handleUpdateCategory = async (category: Category) => {
    try {
      console.log("Updating category:", category)
      await updateCategory(category.id, {
        name: category.name,
        description: category.description,
        icon: category.icon,
        isActive: category.isActive,
      })
      console.log("Category updated successfully")
      await loadCategories()
      setEditingCategory(null)
      
    } catch (err: any) {
      console.error("Error updating category:", err)
      setError(err.message || "Failed to update category")
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      console.log("Deleting category:", categoryId)
      await deleteCategory(categoryId)
      console.log("Category deleted successfully")
      await loadCategories()
      
    } catch (err: any) {
      console.error("Error deleting category:", err)
      setError(err.message || "Failed to delete category")
    }
  }

  const handleCreateSamples = async () => {
    try {
      console.log("Creating sample categories...")
      await createSampleCategories()
      console.log("Sample categories created successfully")
      await loadCategories()
      
    } catch (err: any) {
      console.error("Error creating sample categories:", err)
      setError(err.message || "Failed to create sample categories")
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Category Management Test</h1>
      
      <div className="flex space-x-4 mb-6">
        <Button onClick={loadCategories} disabled={loading}>
          {loading ? "Loading..." : "Reload Categories"}
        </Button>
        <Button onClick={handleCreateSamples} variant="outline">
          Create Sample Categories
        </Button>
        <Button onClick={() => setShowCreateForm(true)} variant="outline">
          Create New Category
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
            <CardTitle>All Categories ({allCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {allCategories.length === 0 ? (
              <p className="text-gray-500">No categories found</p>
            ) : (
              <div className="space-y-2">
                {allCategories.map((category) => (
                  <div key={category.id} className="p-3 border rounded">
                    <div className="flex items-center justify-between">
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
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCategory(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600"
                        >
                          Delete
                        </Button>
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
      </div>

      {/* Create Category Form */}
      {showCreateForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Life Coaching"
                />
              </div>
              <div>
                <Label htmlFor="categoryIcon">Icon (Emoji)</Label>
                <Input
                  id="categoryIcon"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="🎯"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="categoryDescription">Description</Label>
              <Textarea
                id="categoryDescription"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the category and its services"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="categoryActive"
                checked={newCategory.isActive}
                onCheckedChange={(checked) => setNewCategory(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="categoryActive">Active</Label>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleCreateCategory} disabled={!newCategory.name}>
                Create Category
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Category Form */}
      {editingCategory && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Edit Category: {editingCategory.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editCategoryName">Category Name</Label>
                <Input
                  id="editCategoryName"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="editCategoryIcon">Icon (Emoji)</Label>
                <Input
                  id="editCategoryIcon"
                  value={editingCategory.icon}
                  onChange={(e) => setEditingCategory(prev => prev ? { ...prev, icon: e.target.value } : null)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="editCategoryDescription">Description</Label>
              <Textarea
                id="editCategoryDescription"
                value={editingCategory.description}
                onChange={(e) => setEditingCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="editCategoryActive"
                checked={editingCategory.isActive}
                onCheckedChange={(checked) => setEditingCategory(prev => prev ? { ...prev, isActive: checked } : null)}
              />
              <Label htmlFor="editCategoryActive">Active</Label>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={() => editingCategory && handleUpdateCategory(editingCategory)}>
                Update Category
              </Button>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 