"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  DollarSign, 
  Clock, 
  Users,
  Settings,
  TrendingUp,
  Crown,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { AdminProviderForm, AdminServiceForm } from "../types/firebase-types"
import { getActiveCategories } from "@/lib/firebase-queries"
import type { Category } from "@/types/firebase-types"

interface AdminProviderManagementProps {
  providers: any[]
  onAddProvider: (provider: AdminProviderForm) => void
  onUpdateProvider: (id: string, provider: Partial<AdminProviderForm>) => void
  onDeleteProvider: (id: string) => void
  onToggleProviderStatus: (id: string, isActive: boolean) => void
  onToggleProviderSponsorship: (id: string, isSponsored: boolean) => void
  onToggleServiceStatus: (providerId: string, serviceId: string, isActive: boolean) => void
  onToggleServiceSponsorship: (providerId: string, serviceId: string, isSponsored: boolean) => void
  onUpdateService: (providerId: string, serviceId: string, service: Partial<AdminServiceForm>) => void
  onDeleteService: (providerId: string, serviceId: string) => void
  onAddService: (providerId: string, service: Omit<AdminServiceForm, 'id'>) => void
}

export function AdminProviderManagement({
  providers,
  onAddProvider,
  onUpdateProvider,
  onDeleteProvider,
  onToggleProviderStatus,
  onToggleProviderSponsorship,
  onToggleServiceStatus,
  onToggleServiceSponsorship,
  onUpdateService,
  onDeleteService,
  onAddService
}: AdminProviderManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [serviceCategories, setServiceCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [newProvider, setNewProvider] = useState<AdminProviderForm>({
    name: "",
    email: "",
    specialty: "",
    location: "",
    description: "",
    skills: "",
    vettingStatus: "pending",
    isSponsored: false,
    isVerified: false,
    availableForInstant: false,
    services: []
  })

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const categories = await getActiveCategories()
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

  const handleAddProvider = () => {
    onAddProvider(newProvider)
    setNewProvider({
      name: "",
      email: "",
      specialty: "",
      location: "",
      description: "",
      skills: "",
      vettingStatus: "pending",
      isSponsored: false,
      isVerified: false,
      availableForInstant: false,
      services: []
    })
    setShowAddDialog(false)
  }

  const handleEditProvider = (provider: any) => {
    setSelectedProvider(provider)
    setShowEditDialog(true)
  }

  const handleViewDetails = (provider: any) => {
    setSelectedProvider(provider)
    setShowDetailsDialog(true)
  }

  const getVettingStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getVettingStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Provider Management</h3>
          <p className="text-sm text-gray-600">Manage service providers and their services</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    {provider.isVerified && (
                      <Shield className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{provider.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getVettingStatusColor(provider.vettingStatus)}>
                    {getVettingStatusIcon(provider.vettingStatus)}
                    <span className="ml-1 capitalize">{provider.vettingStatus}</span>
                  </Badge>
                  {provider.isSponsored && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      <Crown className="h-3 w-3 mr-1" />
                      Sponsored
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">{provider.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Bundle Pricing</span>
                  <span className="text-sm text-gray-500">/hour</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{provider.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-sm text-gray-500">({provider.reviewCount || 0})</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{provider.sessionsCompleted || 0} sessions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>${provider.totalEarnings || 0}</span>
                </div>
              </div>

              {/* Services Summary */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Services</span>
                  <Badge variant="outline">{provider.services?.length || 0} active</Badge>
                </div>
                <div className="space-y-1">
                  {provider.services?.slice(0, 2).map((service: any) => (
                    <div key={service.id} className="flex items-center justify-between text-xs">
                      <span className="truncate">{service.name}</span>
                      <div className="flex items-center space-x-1">
                        {service.isActive && <Badge variant="outline" className="text-xs">Active</Badge>}
                        {service.isSponsored && <Badge variant="outline" className="text-xs bg-yellow-50">Sponsored</Badge>}
                      </div>
                    </div>
                  ))}
                  {provider.services?.length > 2 && (
                    <p className="text-xs text-gray-500">+{provider.services.length - 2} more services</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(provider)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProvider(provider)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteProvider(provider.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Provider Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Provider</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider-name">Name *</Label>
                <Input
                  id="provider-name"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter provider name"
                />
              </div>
              <div>
                <Label htmlFor="provider-email">Email *</Label>
                <Input
                  id="provider-email"
                  type="email"
                  value={newProvider.email}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider-specialty">Primary Specialty</Label>
                <Input
                  id="provider-specialty"
                  value={newProvider.specialty}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, specialty: e.target.value }))}
                  placeholder="Enter primary specialty"
                />
              </div>

            </div>

            <div>
              <Label htmlFor="provider-location">Location</Label>
              <Input
                id="provider-location"
                value={newProvider.location}
                onChange={(e) => setNewProvider(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>

            <div>
              <Label htmlFor="provider-description">Description</Label>
              <Textarea
                id="provider-description"
                value={newProvider.description}
                onChange={(e) => setNewProvider(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter provider description..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="provider-skills">Skills (comma separated)</Label>
              <Input
                id="provider-skills"
                value={newProvider.skills}
                onChange={(e) => setNewProvider(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="e.g., Career Development, Stress Management"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider-vetting">Vetting Status</Label>
                <Select
                  value={newProvider.vettingStatus}
                  onValueChange={(value: "pending" | "approved" | "rejected") => 
                    setNewProvider(prev => ({ ...prev, vettingStatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Provider Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="provider-verified">Verified Provider</Label>
                  <Switch
                    id="provider-verified"
                    checked={newProvider.isVerified}
                    onCheckedChange={(checked) => setNewProvider(prev => ({ ...prev, isVerified: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="provider-sponsored">Sponsored Listing</Label>
                  <Switch
                    id="provider-sponsored"
                    checked={newProvider.isSponsored}
                    onCheckedChange={(checked) => setNewProvider(prev => ({ ...prev, isSponsored: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="provider-instant">Available for Instant Booking</Label>
                  <Switch
                    id="provider-instant"
                    checked={newProvider.availableForInstant}
                    onCheckedChange={(checked) => setNewProvider(prev => ({ ...prev, availableForInstant: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddProvider}
                disabled={!newProvider.name || !newProvider.email}
              >
                Add Provider
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Provider Details Dialog */}
      {selectedProvider && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>{selectedProvider.name}</span>
                {selectedProvider.isVerified && <Shield className="h-5 w-5 text-blue-600" />}
                <Badge className={getVettingStatusColor(selectedProvider.vettingStatus)}>
                  {getVettingStatusIcon(selectedProvider.vettingStatus)}
                  <span className="ml-1 capitalize">{selectedProvider.vettingStatus}</span>
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p className="text-sm">{selectedProvider.email || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Specialty</Label>
                        <p className="text-sm">{selectedProvider.specialty || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Location</Label>
                        <p className="text-sm">{selectedProvider.location || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Description</Label>
                        <p className="text-sm">{selectedProvider.description || "No description available"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Skills</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedProvider.skills ? (
                            typeof selectedProvider.skills === 'string' ? 
                              selectedProvider.skills.split(",").map((skill: string) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill.trim()}
                                </Badge>
                              )) :
                              selectedProvider.skills.map((skill: string) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))
                          ) : (
                            <span className="text-sm text-gray-500">No skills listed</span>
                          )}
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
                        <span className="text-sm">Verified Provider</span>
                        <Switch
                          checked={selectedProvider.isVerified || false}
                          onCheckedChange={(checked) => onUpdateProvider(selectedProvider.id, { isVerified: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sponsored Listing</span>
                        <Switch
                          checked={selectedProvider.isSponsored || false}
                          onCheckedChange={(checked) => onToggleProviderSponsorship(selectedProvider.id, checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Instant Booking</span>
                        <Switch
                          checked={selectedProvider.availableForInstant || false}
                          onCheckedChange={(checked) => onUpdateProvider(selectedProvider.id, { availableForInstant: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Vetting Status</span>
                        <Select
                          value={selectedProvider.vettingStatus || "pending"}
                          onValueChange={(value: "pending" | "approved" | "rejected") => 
                            onUpdateProvider(selectedProvider.id, { vettingStatus: value })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Services Management</h4>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProvider.services && selectedProvider.services.length > 0 ? (
                    selectedProvider.services.map((service: any) => (
                    <Card key={service.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{service.name}</CardTitle>
                            <p className="text-sm text-gray-600">{service.category}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {service.isSponsored && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                <Crown className="h-3 w-3 mr-1" />
                                Sponsored
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">Bundle Pricing</span>
                            <span className="text-sm text-gray-500">/hour</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{service.analytics?.averageRating?.toFixed(1) || "0.0"}</span>
                            <span className="text-sm text-gray-500">({service.analytics?.reviewCount || 0})</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{service.analytics?.sessionsCompleted || 0} sessions</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>${service.analytics?.totalEarnings || 0}</span>
                          </div>
                        </div>

                        {/* Service Controls */}
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`service-active-${service.id}`} className="text-sm">Active</Label>
                            <Switch
                              id={`service-active-${service.id}`}
                              checked={service.isActive}
                              onCheckedChange={(checked) => onToggleServiceStatus(selectedProvider.id, service.id, checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`service-sponsored-${service.id}`} className="text-sm">Sponsored</Label>
                            <Switch
                              id={`service-sponsored-${service.id}`}
                              checked={service.isSponsored}
                              onCheckedChange={(checked) => onToggleServiceSponsorship(selectedProvider.id, service.id, checked)}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* Handle edit service */}}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteService(selectedProvider.id, service.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500">No services found for this provider</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedProvider.analytics?.totalSessions || 0}</div>
                        <div className="text-sm text-gray-600">Total Sessions</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">${selectedProvider.analytics?.totalEarnings || 0}</div>
                        <div className="text-sm text-gray-600">Total Earnings</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{selectedProvider.analytics?.averageRating?.toFixed(1) || "0.0"}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedProvider.analytics?.completionRate?.toFixed(1) || "0"}%</div>
                        <div className="text-sm text-gray-600">Completion Rate</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="groups" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProvider.groupsCreated && selectedProvider.groupsCreated.length > 0 ? (
                    selectedProvider.groupsCreated.map((group: any) => (
                    <Card key={group.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{group.name}</CardTitle>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{group.memberCount || 0} members</span>
                          </div>
                          <Badge variant={group.isActive ? "default" : "secondary"}>
                            {group.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500">No groups found for this provider</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 