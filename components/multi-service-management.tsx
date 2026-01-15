"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  DollarSign,
  Clock,
  Users,
  Image as ImageIcon,
  Video,
  FileText,
  MessageSquare,
  Settings,
  TrendingUp
} from "lucide-react"
import { getCategoriesAction } from "@/app/actions"
// import type { Category } from "@/types/firebase-types"
import type { Category } from "@prisma/client"

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

interface MultiServiceManagementProps {
  services: ProviderService[]
  onAddService: (service: Omit<ProviderService, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateService: (id: string, service: Partial<ProviderService>) => void
  onDeleteService: (id: string) => void
  onToggleServiceStatus: (id: string, isActive: boolean) => void
  onToggleServiceSponsorship: (id: string, isSponsored: boolean) => void
  onToggleInstantAvailability: (id: string, isAvailable: boolean) => void
}

export function MultiServiceManagement({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  onToggleServiceStatus,
  onToggleServiceSponsorship,
  onToggleInstantAvailability
}: MultiServiceManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedService, setSelectedService] = useState<ProviderService | null>(null)
  const [serviceCategories, setServiceCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    description: "",
    skills: "",
    isActive: true,
    isSponsored: false,
    isAvailableForInstant: false
  })

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        console.log("Loading categories from Firebase...")
        console.log("Loading categories from Server Action...")
        const categories: any = await getCategoriesAction()
        console.log("Categories loaded from Server Action:", categories)
        setServiceCategories(categories)
      } catch (error) {
        console.error("Error loading categories:", error)
        // Fallback to empty array if Firebase fails
        setServiceCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleAddService = () => {
    const serviceData = {
      name: newService.name,
      category: newService.category,
      description: newService.description,

      skills: newService.skills.split(",").map(skill => skill.trim()).filter(skill => skill.length > 0),
      isActive: newService.isActive,
      isSponsored: newService.isSponsored,
      isAvailableForInstant: newService.isAvailableForInstant,
      portfolio: {
        images: [],
        videos: [],
        documents: [],
        testimonials: []
      },
      availability: {
        schedule: {
          monday: { start: "09:00", end: "17:00", isAvailable: true },
          tuesday: { start: "09:00", end: "17:00", isAvailable: true },
          wednesday: { start: "09:00", end: "17:00", isAvailable: true },
          thursday: { start: "09:00", end: "17:00", isAvailable: true },
          friday: { start: "09:00", end: "17:00", isAvailable: true },
          saturday: { start: "10:00", end: "15:00", isAvailable: false },
          sunday: { start: "10:00", end: "15:00", isAvailable: false }
        }
      },
      analytics: {
        sessionsCompleted: 0,
        totalEarnings: 0,
        averageRating: 0,
        reviewCount: 0
      }
    }

    onAddService(serviceData)
    setNewService({
      name: "",
      category: "",
      description: "",
      skills: "",
      isActive: true,
      isSponsored: false,
      isAvailableForInstant: false
    })
    setShowAddDialog(false)
  }

  const handleEditService = (service: ProviderService) => {
    setSelectedService(service)
    setShowEditDialog(true)
  }

  const handleViewDetails = (service: ProviderService) => {
    setSelectedService(service)
    setShowDetailsDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Service Management</h3>
          <p className="text-sm text-gray-600">Manage your services, pricing, and availability</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <p className="text-sm text-gray-600">{service.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {service.isSponsored && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Sponsored
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Bundle Pricing</span>
                  <span className="text-sm text-gray-500">/hour</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{service.analytics.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({service.analytics.reviewCount})</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{service.analytics.sessionsCompleted} sessions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>${service.analytics.totalEarnings}</span>
                </div>
              </div>

              {/* Service Controls */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`active-${service.id}`} className="text-sm">Active</Label>
                  <Switch
                    id={`active-${service.id}`}
                    checked={service.isActive}
                    onCheckedChange={(checked) => onToggleServiceStatus(service.id, checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`sponsored-${service.id}`} className="text-sm">Sponsored</Label>
                  <Switch
                    id={`sponsored-${service.id}`}
                    checked={service.isSponsored}
                    onCheckedChange={(checked) => onToggleServiceSponsorship(service.id, checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`instant-${service.id}`} className="text-sm">Instant Booking</Label>
                  <Switch
                    id={`instant-${service.id}`}
                    checked={service.isAvailableForInstant}
                    onCheckedChange={(checked) => onToggleInstantAvailability(service.id, checked)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(service)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditService(service)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteService(service.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service-name">Service Name *</Label>
                <Input
                  id="service-name"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <Label htmlFor="service-category">Category *</Label>
                <Select
                  value={newService.category}
                  onValueChange={(value) => setNewService(prev => ({ ...prev, category: value }))}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                    ) : serviceCategories.length === 0 ? (
                      <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                    ) : (
                      serviceCategories
                        .filter(category => category.name && category.name.trim() !== '')
                        .map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                {categoriesLoading && (
                  <p className="text-xs text-gray-500 mt-1">Loading categories from Firebase...</p>
                )}
                {!categoriesLoading && serviceCategories.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No categories found. Please add categories in the admin panel.</p>
                )}
                {!categoriesLoading && serviceCategories.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{serviceCategories.length} categories loaded</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="service-description">Description *</Label>
              <Textarea
                id="service-description"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your service..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>

              </div>
              <div>
                <Label htmlFor="service-skills">Skills (comma separated)</Label>
                <Input
                  id="service-skills"
                  value={newService.skills}
                  onChange={(e) => setNewService(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="e.g., Career Development, Stress Management"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Service Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="service-active">Active Service</Label>
                  <Switch
                    id="service-active"
                    checked={newService.isActive}
                    onCheckedChange={(checked) => setNewService(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="service-sponsored">Sponsored Listing</Label>
                  <Switch
                    id="service-sponsored"
                    checked={newService.isSponsored}
                    onCheckedChange={(checked) => setNewService(prev => ({ ...prev, isSponsored: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="service-instant">Available for Instant Booking</Label>
                  <Switch
                    id="service-instant"
                    checked={newService.isAvailableForInstant}
                    onCheckedChange={(checked) => setNewService(prev => ({ ...prev, isAvailableForInstant: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddService}
                disabled={!newService.name || !newService.category || !newService.description}
              >
                Add Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Details Dialog */}
      {selectedService && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedService.name} - Service Details</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="sponsored">Sponsored</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Category</Label>
                        <p className="text-sm">{selectedService.category}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Description</Label>
                        <p className="text-sm">{selectedService.description}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Hourly Rate</Label>
                        <p className="text-sm font-semibold">Bundle Pricing</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Skills</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedService.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Status & Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Service</span>
                        <Badge variant={selectedService.isActive ? "default" : "secondary"}>
                          {selectedService.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sponsored Listing</span>
                        <Badge variant={selectedService.isSponsored ? "outline" : "secondary"}>
                          {selectedService.isSponsored ? "Sponsored" : "Not Sponsored"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Instant Booking</span>
                        <Badge variant={selectedService.isAvailableForInstant ? "default" : "secondary"}>
                          {selectedService.isAvailableForInstant ? "Available" : "Not Available"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedService.analytics.sessionsCompleted}</div>
                        <div className="text-sm text-gray-600">Total Sessions</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">${selectedService.analytics.totalEarnings}</div>
                        <div className="text-sm text-gray-600">Total Earnings</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{selectedService.analytics.averageRating.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedService.analytics.reviewCount}</div>
                        <div className="text-sm text-gray-600">Reviews</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <ImageIcon className="h-5 w-5 mr-2" />
                        Images ({selectedService.portfolio.images.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedService.portfolio.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {selectedService.portfolio.images.map((image, index) => (
                            <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">Image {index + 1}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No images uploaded</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Video className="h-5 w-5 mr-2" />
                        Videos ({selectedService.portfolio.videos.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedService.portfolio.videos.length > 0 ? (
                        <div className="space-y-2">
                          {selectedService.portfolio.videos.map((video, index) => (
                            <div key={index} className="p-2 bg-gray-100 rounded-lg">
                              <span className="text-sm">Video {index + 1}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No videos uploaded</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="availability" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedService.availability.schedule).map(([day, schedule]) => (
                        <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium capitalize">{day}</span>
                            <Badge variant={schedule.isAvailable ? "default" : "secondary"}>
                              {schedule.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          {schedule.isAvailable && (
                            <span className="text-sm text-gray-600">
                              {schedule.start} - {schedule.end}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sponsored" className="space-y-4">
                {selectedService.sponsoredMetrics ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{selectedService.sponsoredMetrics.totalLeadsGenerated}</div>
                          <div className="text-sm text-gray-600">Total Leads</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{selectedService.sponsoredMetrics.totalClicksGenerated}</div>
                          <div className="text-sm text-gray-600">Total Clicks</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{selectedService.sponsoredMetrics.conversionRate.toFixed(1)}%</div>
                          <div className="text-sm text-gray-600">Conversion Rate</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No sponsored listing data available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 