"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Shield, 
  Crown, 
  Star,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { sampleServiceProviders } from "../app/features/shared/data"

interface AdminProviderSearchProps {
  onBack: () => void
  onViewProvider: (provider: any) => void
  onEditProvider: (provider: any) => void
  onDeleteProvider: (providerId: string) => void
  onToggleVerification: (providerId: string, isVerified: boolean) => void
  onToggleSponsorship: (providerId: string, isSponsored: boolean) => void
}

export function AdminProviderSearch({
  onBack,
  onViewProvider,
  onEditProvider,
  onDeleteProvider,
  onToggleVerification,
  onToggleSponsorship
}: AdminProviderSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [filteredProviders, setFilteredProviders] = useState(sampleServiceProviders)

  useEffect(() => {
    let providers = sampleServiceProviders

    // Filter by search term
    if (searchTerm.trim()) {
      providers = providers.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (selectedStatus !== "all") {
      providers = providers.filter((p) => p.vettingStatus === selectedStatus)
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      providers = providers.filter((p) => p.specialty === selectedSpecialty)
    }

    setFilteredProviders(providers)
  }, [searchTerm, selectedStatus, selectedSpecialty])

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

  const specialties = Array.from(new Set(sampleServiceProviders.map(p => p.specialty)))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            ← Back to Admin Panel
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Find Providers</h2>
          <p className="text-gray-600">Search and manage service providers</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredProviders.length} providers found
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search providers by name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                    <AvatarFallback>
                      {provider.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <p className="text-sm text-gray-600">{provider.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {provider.isVerified && (
                    <Shield className="h-4 w-4 text-blue-600" />
                  )}
                  {provider.isSponsored && (
                    <Crown className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getVettingStatusColor(provider.vettingStatus)}>
                  {getVettingStatusIcon(provider.vettingStatus)}
                  <span className="ml-1 capitalize">{provider.vettingStatus}</span>
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{provider.rating}</span>
                  <span className="text-sm text-gray-500">({provider.reviewCount})</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{provider.responseTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{(provider as any).sessionsCompleted || 0} sessions</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">{provider.description}</p>

              <div className="flex flex-wrap gap-1">
                {provider.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Admin Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProvider(provider)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProvider(provider)}
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

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
} 