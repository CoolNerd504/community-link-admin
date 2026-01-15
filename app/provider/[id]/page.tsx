"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  MessageCircle,
  Video,
  Phone,
  CheckCircle,
  Award,
  BookOpen,
  ArrowLeft,
  Share2,
  Heart,
  Search,
  DollarSign,
  Users,
  TrendingUp
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { getProviderByIdAction } from "../../../app/actions"
// import type { ServiceProvider, ProviderService } from "../../../types/firebase-types" // using Prisma types
// Local types for UI
interface ProviderService {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  isActive: boolean
  isSponsored?: boolean
  isAvailableForInstant?: boolean
  analytics?: any
  skills?: string[]
}

interface ServiceProvider {
  id: string
  name: string
  profileImage?: string | null
  bio?: string
  specialty?: string
  location?: { town: string; country: string }
  rating?: number
  reviewCount?: number
  isOnline?: boolean
  isVerified?: boolean
  isSponsored?: boolean
  availableForInstant?: boolean
  services?: ProviderService[]
  skills?: string[]
  portfolio?: any
  responseTime?: string
  analytics?: any
}

export default function ProviderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const providerId = params.id as string
  const selectedServiceId = searchParams.get('service')

  const [provider, setProvider] = useState<ServiceProvider | null>(null)
  const [selectedService, setSelectedService] = useState<ProviderService | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  // Load provider data
  useEffect(() => {
    const loadProvider = async () => {
      try {
        setIsLoading(true)
        const providerData = await getProviderByIdAction(providerId)

        if (providerData && providerData.role === "PROVIDER") {
          // Map Prisma data to component state
          const mappedProvider: any = {
            id: providerData.id,
            name: providerData.name,
            profileImage: providerData.image,
            bio: providerData.profile?.bio,
            specialty: providerData.profile?.headline,
            location: providerData.profile?.location ? { town: providerData.profile.location } : undefined,
            rating: 5.0, // Mock
            reviewCount: 0, // Mock
            isOnline: providerData.profile?.isOnline,
            isVerified: providerData.profile?.isVerified,
            services: providerData.providerServices?.map((s: any) => ({
              ...s,
              name: s.title,
              isActive: s.isActive,
              isAvailableForInstant: true, // Mock or add to schema
            })) || [],
            // Other fields...
          }

          setProvider(mappedProvider)

          // Set selected service if serviceId is provided
          if (selectedServiceId && mappedProvider.services) {
            const service = mappedProvider.services.find((s: any) => s.id === selectedServiceId)
            if (service) {
              setSelectedService(service)
            }
          }
        } else {
          // It's a mapped service provider (from DB) - logic simplified
          setProvider(providerData as ServiceProvider)
        }
      } catch (error) {
        console.error("Error loading provider:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    if (providerId) {
      loadProvider()
    }
  }, [providerId, selectedServiceId, router])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
      />
    ))
  }

  const handleBookSession = (providerId: string, serviceId?: string) => {
    alert(`Booking session with provider ${providerId}${serviceId ? ` for service ${serviceId}` : ''}`)
  }

  const handleStartCall = (providerId: string, serviceId?: string) => {
    alert(`Starting call with provider ${providerId}${serviceId ? ` for service ${serviceId}` : ''}`)
  }

  const handleSendMessage = (providerId: string) => {
    alert(`Sending message to provider ${providerId}`)
  }

  const handleServiceSelect = (service: ProviderService) => {
    setSelectedService(service)
    // Update URL with selected service
    const url = new URL(window.location.href)
    url.searchParams.set('service', service.id)
    window.history.replaceState({}, '', url.toString())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider details...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Provider not found</h3>
          <p className="text-gray-600 mb-4">The provider you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            {isFavorite ? "Saved" : "Save"}
          </Button>
        </div>

        {/* Main Content with 4:8 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Selected Service Card - 4 columns */}
          <div className="lg:col-span-4">
            {selectedService ? (
              <Card className="sticky top-6">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{selectedService.name}</CardTitle>
                      <p className="text-sm text-gray-600 capitalize mt-1">{selectedService.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={selectedService.isActive ? "default" : "secondary"}>
                        {selectedService.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {selectedService.isSponsored && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          Sponsored
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedService.description}</p>
                  </div>

                  {/* Service Analytics */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedService.analytics?.sessionsCompleted || 0}
                      </div>
                      <div className="text-xs text-gray-500">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedService.analytics?.averageRating?.toFixed(1) || "0.0"}
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>

                  {/* Service Skills */}
                  {selectedService.skills && selectedService.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Actions */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {selectedService.isAvailableForInstant && provider.isOnline ? (
                      <Button
                        onClick={() => handleStartCall(provider.id, selectedService.id)}
                        className="w-full"
                        size="lg"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Start Now
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleBookSession(provider.id, selectedService.id)}
                        className="w-full"
                        size="lg"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book This Service
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => handleSendMessage(provider.id)}
                      className="w-full"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Service</h3>
                  <p className="text-gray-600 mb-4">Choose a service from the list below to view details and book a session.</p>
                  {provider.services && provider.services.length > 0 && (
                    <div className="space-y-2">
                      {provider.services
                        .filter(service => service.isActive)
                        .slice(0, 3)
                        .map((service) => (
                          <Button
                            key={service.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceSelect(service)}
                            className="w-full justify-start"
                          >
                            <div className="text-left">
                              <div className="font-medium">{service.name}</div>
                              <div className="text-xs text-gray-500 capitalize">{service.category}</div>
                            </div>
                          </Button>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Profile Section - 8 columns */}
          <div className="lg:col-span-8">
            {/* Main Profile Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex flex-col items-center lg:items-start space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={provider.profileImage || "/placeholder.svg"} alt={provider.name} />
                      <AvatarFallback className="text-lg">
                        {provider.name.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                        <h1 className="text-2xl font-bold">{provider.name}</h1>
                        {provider.isVerified && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>

                      <p className="text-gray-600 mb-2">{provider.specialty}</p>

                      <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {provider.location?.town}, {provider.location?.country}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {provider.responseTime || "5 min"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {renderStars(provider.rating || 0)}
                        <span className="ml-2 font-semibold">{provider.rating?.toFixed(1) || "0.0"}</span>
                        <span className="text-gray-500">({provider.reviewCount || 0} reviews)</span>
                      </div>
                      <Badge variant={provider.isOnline ? "default" : "secondary"}>
                        {provider.isOnline ? "Online" : "Offline"}
                      </Badge>
                      {provider.isSponsored && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          Sponsored
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{provider.analytics?.totalSessions || 0}</div>
                        <div className="text-sm text-gray-500">Total Sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{provider.analytics?.completionRate || 0}%</div>
                        <div className="text-sm text-gray-500">Completion Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{provider.analytics?.individualSessions || 0}</div>
                        <div className="text-sm text-gray-500">Individual</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{provider.analytics?.groupSessions || 0}</div>
                        <div className="text-sm text-gray-500">Group</div>
                      </div>
                    </div>

                    <div className="text-3xl font-bold text-green-600">
                      Bundle Pricing
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    {provider.availableForInstant && provider.isOnline ? (
                      <Button
                        onClick={() => handleStartCall(provider.id)}
                        className="w-full"
                        size="lg"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Start Now
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleBookSession(provider.id)}
                        className="w-full"
                        size="lg"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Session
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => handleSendMessage(provider.id)}
                      className="w-full"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="about" className="space-y-4 mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Other Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About {provider.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{provider.bio}</p>

                    <div>
                      <h4 className="font-semibold mb-2">Skills & Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.skills?.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Certifications & Awards</h4>
                      <div className="space-y-2">
                        {provider.portfolio?.certifications?.map((cert: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span>{cert}</span>
                          </div>
                        ))}
                        {provider.portfolio?.education && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span>{provider.portfolio.education}</span>
                          </div>
                        )}
                        {provider.portfolio?.experience && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-500" />
                            <span>{provider.portfolio.experience}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {provider.services && provider.services.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {provider.services
                          .filter(service => service.isActive)
                          .map((service) => (
                            <Card
                              key={service.id}
                              className={`border-2 hover:border-blue-200 transition-colors cursor-pointer ${selectedService?.id === service.id ? 'border-blue-500 bg-blue-50' : ''
                                }`}
                              onClick={() => handleServiceSelect(service)}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg">{service.name}</CardTitle>
                                    <p className="text-sm text-gray-600 capitalize">{service.category}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant={service.isActive ? "default" : "secondary"}>
                                      {service.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    {service.isSponsored && (
                                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                        Sponsored
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

                                {/* Service Analytics */}
                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">
                                      {service.analytics?.sessionsCompleted || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">Sessions</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">
                                      {service.analytics?.averageRating?.toFixed(1) || "0.0"}
                                    </div>
                                    <div className="text-xs text-gray-500">Rating</div>
                                  </div>
                                </div>

                                {/* Service Skills */}
                                {service.skills && service.skills.length > 0 && (
                                  <div className="pt-2">
                                    <div className="flex flex-wrap gap-1">
                                      {service.skills.slice(0, 3).map((skill: string, index: number) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                      {service.skills.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{service.skills.length - 3} more
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Service Actions */}
                                <div className="flex space-x-2 pt-3 border-t border-gray-100">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleBookSession(provider.id, service.id)
                                    }}
                                    className="flex-1"
                                  >
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    Book This Service
                                  </Button>
                                  {service.isAvailableForInstant && provider.isOnline && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleStartCall(provider.id, service.id)
                                      }}
                                    >
                                      <Video className="h-4 w-4" />
                                      Start Now
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No services available</h3>
                        <p className="text-gray-600">This provider hasn't added any services yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews & Ratings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Review Stats */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{provider.rating?.toFixed(1) || "0.0"}</div>
                          <div className="text-sm text-gray-500">Average Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{provider.reviewCount || 0}</div>
                          <div className="text-sm text-gray-500">Total Reviews</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">98%</div>
                          <div className="text-sm text-gray-500">Would Recommend</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">4.9</div>
                          <div className="text-sm text-gray-500">Response Rating</div>
                        </div>
                      </div>

                      {/* Sample Reviews */}
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(5)}
                            <span className="font-semibold">Amazing experience!</span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            "This provider was incredibly helpful and professional. Their insights really helped me
                            overcome my challenges and set clear goals for the future."
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>John D.</span>
                            <span>2 days ago</span>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(5)}
                            <span className="font-semibold">Highly recommended</span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            "Great session! This provider is very knowledgeable and creates a comfortable environment
                            for open discussion."
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Maria S.</span>
                            <span>1 week ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div >
      </div >
    </div >
  )
} 