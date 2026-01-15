"use client"
import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { MultiServiceManagement } from "../../../components/multi-service-management"
import { getActiveCategories } from "../../../lib/firebase-queries"
import { getProviderServices, addProviderService, updateProviderService } from "../../../lib/firebase-operations"
import { auth } from "../../../lib/firebase-config"
import type { Category } from "../../../types/firebase-types"

// Use the same interface as the MultiServiceManagement component
interface ProviderService {
  id: string
  name: string
  category: string
  description: string
  isActive: boolean
  isSponsored: boolean
  isAvailableForInstant: boolean
  skills: string[]
  portfolio: {
    images: string[]
    videos: string[]
    documents: string[]
    testimonials: string[]
  }
  availability: {
    schedule: {
      [key: string]: {
        start: string
        end: string
        isAvailable: boolean
      }
    }
  }
  analytics: {
    sessionsCompleted: number
    totalEarnings: number
    averageRating: number
    reviewCount: number
    lastSessionAt?: Date
  }
  sponsoredMetrics?: {
    isCurrentlySponsored: boolean
    totalLeadsGenerated: number
    totalClicksGenerated: number
    conversionRate: number
    monthlySpend: number
    averageCostPerLead: number
    averageCostPerClick: number
    sponsoredListingHistory: {
      id: string
      startDate: Date
      endDate?: Date
      isActive: boolean
      hoursActive: number
      leadsGenerated: number
      clicksGenerated: number
    }[]
  }
  createdAt: Date
  updatedAt: Date
}

export default function ServiceManagementTest() {
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<ProviderService[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Convert Firebase ProviderService to component ProviderService
  const convertFirebaseService = (firebaseService: any): ProviderService => {
    return {
      ...firebaseService,
      lastSessionAt: firebaseService.analytics?.lastSessionAt?.toDate?.() || undefined,
      createdAt: firebaseService.createdAt?.toDate?.() || new Date(),
      updatedAt: firebaseService.updatedAt?.toDate?.() || new Date(),
      sponsoredMetrics: firebaseService.sponsoredMetrics ? {
        ...firebaseService.sponsoredMetrics,
        sponsoredListingHistory: firebaseService.sponsoredMetrics.sponsoredListingHistory?.map((item: any) => ({
          ...item,
          startDate: item.startDate?.toDate?.() || new Date(),
          endDate: item.endDate?.toDate?.() || undefined,
        })) || []
      } : undefined
    }
  }

  const loadTestData = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Loading test data for service management...")
      
      // Load categories
      const fetchedCategories = await getActiveCategories()
      console.log("Categories loaded:", fetchedCategories)
      setCategories(fetchedCategories)
      
      // Load services if user is authenticated
      const user = auth.currentUser
      if (user) {
        const fetchedServices = await getProviderServices(user.uid)
        console.log("Services loaded:", fetchedServices)
        // Convert Firebase services to component services
        const convertedServices = fetchedServices.map(convertFirebaseService)
        setServices(convertedServices)
      } else {
        console.log("No authenticated user found")
      }
      
    } catch (err: any) {
      console.error("Error loading test data:", err)
      setError(err.message || "Failed to load test data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async (serviceData: Omit<ProviderService, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No authenticated user found")
      }

      // Convert component service data to Firebase format
      const firebaseServiceData = {
        ...serviceData,
        analytics: {
          ...serviceData.analytics,
          lastSessionAt: serviceData.analytics.lastSessionAt ? 
            { toDate: () => serviceData.analytics.lastSessionAt } as any : undefined
        }
      }

      console.log("Adding service:", firebaseServiceData)
      const serviceId = await addProviderService(user.uid, firebaseServiceData as any)
      console.log("Service added with ID:", serviceId)
      
      // Reload services
      await loadTestData()
      
    } catch (err: any) {
      console.error("Error adding service:", err)
      setError(err.message || "Failed to add service")
    }
  }

  const handleUpdateService = async (id: string, service: Partial<ProviderService>) => {
    console.log("Update service:", id, service)
    // TODO: Implement update functionality
  }

  const handleDeleteService = async (id: string) => {
    console.log("Delete service:", id)
    // TODO: Implement delete functionality
  }

  const handleToggleServiceStatus = async (id: string, isActive: boolean) => {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No authenticated user found")
      }

      console.log("Toggling service status:", id, isActive)
      await updateProviderService(user.uid, id, { isActive })
      
      // Reload services to reflect changes
      await loadTestData()
      console.log("Service status updated successfully")
    } catch (err: any) {
      console.error("Error updating service status:", err)
      setError(err.message || "Failed to update service status")
    }
  }

  const handleToggleServiceSponsorship = async (id: string, isSponsored: boolean) => {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No authenticated user found")
      }

      console.log("Toggling service sponsorship:", id, isSponsored)
      await updateProviderService(user.uid, id, { isSponsored })
      
      // Reload services to reflect changes
      await loadTestData()
      console.log("Service sponsorship updated successfully")
    } catch (err: any) {
      console.error("Error updating service sponsorship:", err)
      setError(err.message || "Failed to update service sponsorship")
    }
  }

  const handleToggleInstantAvailability = async (id: string, isAvailable: boolean) => {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No authenticated user found")
      }

      console.log("Toggling service instant availability:", id, isAvailable)
      await updateProviderService(user.uid, id, { isAvailableForInstant: isAvailable })
      
      // Reload services to reflect changes
      await loadTestData()
      console.log("Service instant availability updated successfully")
    } catch (err: any) {
      console.error("Error updating service instant availability:", err)
      setError(err.message || "Failed to update service instant availability")
    }
  }

  useEffect(() => {
    loadTestData()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Service Management Test</h1>
      
      <div className="flex space-x-4 mb-6">
        <Button onClick={loadTestData} disabled={loading}>
          {loading ? "Loading..." : "Reload Test Data"}
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
            <CardTitle>Current Services ({services.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-gray-500">No services found</p>
            ) : (
              <div className="space-y-2">
                {services.map((service) => (
                  <div key={service.id} className="p-2 border rounded">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.category}</p>
                      <p className="text-xs text-gray-500">
                        Status: {service.isActive ? "Active" : "Inactive"} | 
                        Sponsored: {service.isSponsored ? "Yes" : "No"} | 
                        Instant: {service.isAvailableForInstant ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Service Management Component Test</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiServiceManagement
            services={services}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            onToggleServiceStatus={handleToggleServiceStatus}
            onToggleServiceSponsorship={handleToggleServiceSponsorship}
            onToggleInstantAvailability={handleToggleInstantAvailability}
          />
        </CardContent>
      </Card>
    </div>
  )
} 