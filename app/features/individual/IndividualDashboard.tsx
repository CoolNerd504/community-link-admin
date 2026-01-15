"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  MessageCircle,
  Video,
  Phone,
  CheckCircle,
  BookOpen,
  ArrowRight,
  Search,
  Users,
  TrendingUp,
  DollarSign,
  X
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { AdvancedSearch } from "../../../components/advanced-search"
import { signOut } from "next-auth/react"
import { useAuth } from "../../../hooks/use-auth"
import {
  getAllProvidersAction,
  createInstantBookingAction,
  getUserBookingRequestsAction
} from "../../../app/actions"
// Types
import type { ServiceProvider, ProviderService } from "../../../types/firebase-types"
import { sampleGroups } from "../../../lib/sample-data"

export function IndividualDashboard({ currentUser }: { currentUser: any }) {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()

  // State for search/filter
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTown, setSelectedTown] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")

  // State for providers, services, and groups
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [allServices, setAllServices] = useState<Array<ProviderService & { provider: ServiceProvider }>>([])
  const [filteredServices, setFilteredServices] = useState<Array<ProviderService & { provider: ServiceProvider }>>([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [filteredGroups, setFilteredGroups] = useState<any[]>(sampleGroups)

  // State for reach out modal
  const [showReachOutModal, setShowReachOutModal] = useState(false)
  const [selectedService, setSelectedService] = useState<ProviderService & { provider: ServiceProvider } | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)
  const [requestMessage, setRequestMessage] = useState("")
  const [preferredContactMethod, setPreferredContactMethod] = useState<"video_call" | "voice_call" | "chat">("video_call")
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium")

  // State for tracking user's instant booking requests
  const [userRequests, setUserRequests] = useState<{ [key: string]: any }>({})
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [requestTimers, setRequestTimers] = useState<{ [key: string]: number }>({})

  // Duration options in minutes
  const durationOptions = [5, 10, 15, 30, 45, 60]

  // Load providers and services from DB
  useEffect(() => {
    const loadProvidersAndServices = async () => {
      try {
        setIsLoadingServices(true)
        const fetchedProviders = await getAllProvidersAction()
        setProviders(fetchedProviders as unknown as ServiceProvider[])

        // Flatten all services with provider information
        const servicesWithProviders = fetchedProviders.flatMap(provider =>
          (provider.services || [])
            .filter((service: any) => service.isActive)
            .map((service: any) => ({
              ...service,
              id: service.id,
              name: service.title, // Map title to name
              provider: provider as unknown as ServiceProvider,
              // Add missing fields expected by frontend
              isSponsored: false,
              isAvailableForInstant: true,
              skills: [],
              reviews: []
            }))
        )

        setAllServices(servicesWithProviders as Array<ProviderService & { provider: ServiceProvider }>)
        setFilteredServices(servicesWithProviders as Array<ProviderService & { provider: ServiceProvider }>)
        console.log("Services loaded from DB")
      } catch (error) {
        console.error("Error loading services:", error)
        setProviders([])
        setAllServices([])
        setFilteredServices([])
      } finally {
        setIsLoadingServices(false)
      }
    }

    loadProvidersAndServices()
  }, [])

  // Load user's instant booking requests
  useEffect(() => {
    const loadUserRequests = async () => {
      try {
        if (!authUser?.id) return

        setIsLoadingRequests(true)

        const requests = await getUserBookingRequestsAction(authUser.id)
        const userRequestsMap: { [key: string]: any } = {}

        requests.forEach(req => {
          const serviceKey = `${req.service.providerId}-${req.serviceId}`
          userRequestsMap[serviceKey] = req
        })

        setUserRequests(userRequestsMap)
        console.log("User requests loaded from DB")
      } catch (error) {
        console.error("Error loading user requests:", error)
      } finally {
        setIsLoadingRequests(false)
      }
    }

    loadUserRequests()
  }, [authUser])

  // Manage countdown timers for accepted requests
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date().getTime()
      const updatedTimers: { [key: string]: number } = {}

      Object.entries(userRequests).forEach(([serviceKey, request]) => {
        if (request.status === "accepted") {
          const timeRemaining = calculateAcceptedTimeRemaining(request)
          updatedTimers[serviceKey] = timeRemaining

          // If expired, update the request status locally
          if (timeRemaining <= 0) {
            setUserRequests(prev => ({
              ...prev,
              [serviceKey]: { ...request, status: "expired" }
            }))
          }
        }
      })

      setRequestTimers(updatedTimers)
    }, 1000) // Update every second

    return () => clearInterval(timerInterval)
  }, [userRequests])

  // Filtering logic for services
  useEffect(() => {
    let filtered = allServices

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) =>
        service.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setFilteredServices(filtered)
  }, [allServices, searchTerm, selectedCategory])

  // Filtering logic for groups
  useEffect(() => {
    let groups = sampleGroups
    if (searchTerm.trim()) {
      groups = groups.filter((g: any) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredGroups(groups)
  }, [searchTerm])

  // Handlers
  const handleViewServiceDetails = (service: ProviderService & { provider: ServiceProvider }) => {
    // Navigate to provider details page with the service pre-selected
    const url = `/provider/${service.provider.id}?service=${service.id}`
    router.push(url)
  }

  const handleReachOut = (service: ProviderService & { provider: ServiceProvider }, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Selected service for reach out:", service)
    console.log("Service ID:", service.id)
    console.log("Provider ID:", service.provider.id)
    setSelectedService(service)
    setSelectedDuration(null)
    setShowReachOutModal(true)
  }

  const handleConfirmReachOut = async () => {
    if (selectedService && selectedDuration) {
      try {
        if (!authUser?.id) {
          alert("Please log in")
          return
        }

        setIsSubmittingRequest(true)

        // Calculate amount based on duration (you can adjust this logic)
        const amount = selectedDuration * 2

        const requestData = {
          message: requestMessage.trim() || null,
          // other fields
        }

        await createInstantBookingAction(
          selectedService.provider.id,
          selectedService.id,
          requestData
        )

        console.log("Request sent successfully!")
        alert(`Instant booking request sent to ${selectedService.provider.name}!`)
        setShowReachOutModal(false)
        resetReachOutForm()

        // Refresh logic would be ideal here...
        // For now simple alert
      } catch (error) {
        console.error("Error sending instant booking request:", error)
        alert(`Failed to send request.`)
      } finally {
        setIsSubmittingRequest(false)
      }
    }
  }

  const handleJoinGroup = (groupId: string) => {
    alert(`Joining group ${groupId}`)
  }

  const handleLeaveGroup = (groupId: string) => {
    alert(`Leaving group ${groupId}`)
  }

  const handleViewGroup = (groupId: string) => {
    alert(`Viewing group ${groupId}`)
  }

  const handleStartGroupCall = (groupId: string) => {
    alert(`Starting group call for ${groupId}`)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedTown("all")
    setSelectedCountry("all")
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
      />
    ))
  }

  const formatDuration = (minutes: number) => {
    if (minutes === 60) return "1 Hour"
    return `${minutes} min`
  }

  const resetReachOutForm = () => {
    setSelectedService(null)
    setSelectedDuration(null)
    setRequestMessage("")
    setPreferredContactMethod("video_call")
    setUrgency("medium")
    setIsSubmittingRequest(false)
  }

  const getUserRequestStatus = (service: ProviderService & { provider: ServiceProvider }) => {
    const serviceKey = `${service.provider.id}-${service.id}`
    return userRequests[serviceKey]
  }

  const handleStartCall = (service: ProviderService & { provider: ServiceProvider }) => {
    // TODO: Implement call functionality
    alert(`Starting call with ${service.provider.name} for ${service.name}`)
  }

  const calculateTimeRemaining = (request: any) => {
    if (!request || !request.createdAt) return 0

    const now = new Date().getTime()
    const requestTime = request.createdAt.seconds ? request.createdAt.seconds * 1000 : new Date(request.createdAt).getTime()
    const elapsed = now - requestTime
    const maxWaitTime = 30 * 60 * 1000 // 30 minutes in milliseconds
    const remaining = Math.max(0, maxWaitTime - elapsed)

    return Math.floor(remaining / 1000) // Return seconds remaining
  }

  const calculateAcceptedTimeRemaining = (request: any) => {
    if (!request || !request.createdAt || !request.respondedAt) return 0

    const now = new Date().getTime()
    const requestTime = request.createdAt.seconds ? request.createdAt.seconds * 1000 : new Date(request.createdAt).getTime()
    const responseTime = request.respondedAt.seconds ? request.respondedAt.seconds * 1000 : new Date(request.respondedAt).getTime()

    // Calculate how long it took to accept the request
    const timeToAccept = responseTime - requestTime
    const minWaitTime = 5 * 60 * 1000 // 5 minutes minimum in milliseconds
    const countdownDuration = Math.max(timeToAccept, minWaitTime) // Use the longer of the two

    const elapsedSinceAccept = now - responseTime
    const remaining = Math.max(0, countdownDuration - elapsedSinceAccept)

    return Math.floor(remaining / 1000) // Return seconds remaining
  }

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return "Expired"

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${remainingSeconds}s`
  }

  const isRequestExpired = (request: any) => {
    if (!request || !request.createdAt) return false
    return calculateTimeRemaining(request) <= 0
  }

  const isAcceptedRequestExpired = (request: any) => {
    if (!request || !request.createdAt || !request.respondedAt) return false
    return calculateAcceptedTimeRemaining(request) <= 0
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.name || "User"}!</h1>
        <p className="text-gray-600">Find services and join groups to connect with your community.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border">
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
      </div>

      {/* Tabs for Services and Groups */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">
            Services ({filteredServices.length})
            {isLoadingServices && <span className="ml-2">...</span>}
          </TabsTrigger>
          <TabsTrigger value="groups" disabled className="cursor-not-allowed opacity-50">
            Groups ({filteredGroups.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {/* Loading State */}
          {isLoadingServices && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          )}

          {/* Services Grid */}
          {!isLoadingServices && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card
                  key={`${service.provider.id}-${service.id}`}
                  className="hover:shadow-lg transition-shadow duration-200 relative cursor-pointer group"
                  onClick={() => handleViewServiceDetails(service)}
                >
                  {service.isSponsored && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">Sponsored</Badge>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={service.provider.profileImage || "/placeholder.svg"} alt={service.provider.name} />
                            <AvatarFallback>
                              {service.provider.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {service.isAvailableForInstant && service.provider.isOnline && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                          {service.provider.isVerified && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{service.category}</p>
                        </div>
                      </div>
                      <Badge variant={service.isAvailableForInstant && service.provider.isOnline ? "default" : "secondary"} className="text-xs">
                        {service.isAvailableForInstant && service.provider.isOnline ? "Instant Available" : "Book Only"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Service Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

                    {/* Provider Details */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">{service.provider.name}</span>
                        <span className="text-gray-400">•</span>
                        <span>{service.provider.specialty}</span>
                      </div>
                    </div>

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
                          {service.skills.slice(0, 3).map((skill, index) => (
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
                          handleViewServiceDetails(service)
                        }}
                        className="flex-1 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {service.isAvailableForInstant && service.provider.isOnline && (() => {
                        const userRequest = getUserRequestStatus(service)

                        if (userRequest) {
                          if (userRequest.status === "pending") {
                            const serviceKey = `${service.provider.id}-${service.id}`
                            const timeRemaining = requestTimers[serviceKey] || calculateTimeRemaining(userRequest)
                            const isExpired = timeRemaining <= 0

                            return (
                              <div className="flex flex-col space-y-1">
                                <Button
                                  variant={isExpired ? "outline" : "secondary"}
                                  size="sm"
                                  disabled
                                  className="cursor-not-allowed"
                                >
                                  <Clock className="h-4 w-4 mr-1" />
                                  {isExpired ? "Request Expired" : "Request Sent"}
                                </Button>
                                {!isExpired && (
                                  <div className="text-xs text-center">
                                    <span className="text-orange-600 font-medium">
                                      {formatTimeRemaining(timeRemaining)}
                                    </span>
                                    <span className="text-gray-500 ml-1">to respond</span>
                                  </div>
                                )}
                              </div>
                            )
                          } else if (userRequest.status === "accepted") {
                            const serviceKey = `${service.provider.id}-${service.id}`
                            const timeRemaining = requestTimers[serviceKey] || calculateAcceptedTimeRemaining(userRequest)
                            const isExpired = timeRemaining <= 0

                            return (
                              <div className="flex flex-col space-y-1">
                                <Button
                                  variant={isExpired ? "outline" : "default"}
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (!isExpired) {
                                      handleStartCall(service)
                                    }
                                  }}
                                  disabled={isExpired}
                                  className={isExpired ? "cursor-not-allowed" : ""}
                                >
                                  <Video className="h-4 w-4 mr-1" />
                                  {isExpired ? "Time Expired" : "Start Call Now"}
                                </Button>
                                {!isExpired && (
                                  <div className="text-xs text-center">
                                    <span className="text-orange-600 font-medium">
                                      {formatTimeRemaining(timeRemaining)}
                                    </span>
                                    <span className="text-gray-500 ml-1">to start call</span>
                                  </div>
                                )}
                              </div>
                            )
                          } else if (userRequest.status === "completed") {
                            return (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="cursor-not-allowed"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Completed
                              </Button>
                            )
                          } else if (userRequest.status === "declined") {
                            return (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => handleReachOut(service, e)}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Try Again
                              </Button>
                            )
                          } else if (userRequest.status === "expired") {
                            return (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => handleReachOut(service, e)}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Request Expired
                              </Button>
                            )
                          }
                        }

                        return (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={(e) => handleReachOut(service, e)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Reach Out
                          </Button>
                        )
                      })()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoadingServices && filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or category filter</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Groups Coming Soon</h3>
            <p className="text-gray-600">Group functionality is currently under development.</p>
          </div>
        </TabsContent>
      </Tabs>



      {/* Reach Out Modal */}
      <Dialog open={showReachOutModal} onOpenChange={(open) => {
        setShowReachOutModal(open)
        if (!open) {
          resetReachOutForm()
        }
      }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Reach Out to Provider</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReachOutModal(false)
                  resetReachOutForm()
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-4">
              {/* Service Info */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedService.provider.profileImage || "/placeholder.svg"} alt={selectedService.provider.name} />
                  <AvatarFallback>
                    {selectedService.provider.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedService.provider.name}</h4>
                  <p className="text-sm text-gray-600">{selectedService.name}</p>
                </div>
              </div>

              {/* Duration Selection */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Select Session Duration</h4>
                <div className="grid grid-cols-2 gap-2">
                  {durationOptions.map((duration) => (
                    <Button
                      key={duration}
                      variant={selectedDuration === duration ? "default" : "outline"}
                      className="justify-start h-10"
                      onClick={() => setSelectedDuration(duration)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {formatDuration(duration)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contact Method Selection */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Preferred Contact Method</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={preferredContactMethod === "video_call" ? "default" : "outline"}
                    className="justify-start h-10"
                    onClick={() => setPreferredContactMethod("video_call")}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                  <Button
                    variant={preferredContactMethod === "voice_call" ? "default" : "outline"}
                    className="justify-start h-10"
                    onClick={() => setPreferredContactMethod("voice_call")}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Voice Call
                  </Button>
                  <Button
                    variant={preferredContactMethod === "chat" ? "default" : "outline"}
                    className="justify-start h-10"
                    onClick={() => setPreferredContactMethod("chat")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>

              {/* Urgency Selection */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Urgency Level</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={urgency === "low" ? "default" : "outline"}
                    className="justify-start h-10"
                    onClick={() => setUrgency("low")}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Low
                  </Button>
                  <Button
                    variant={urgency === "medium" ? "default" : "outline"}
                    className="justify-start h-10"
                    onClick={() => setUrgency("medium")}
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Medium
                  </Button>
                  <Button
                    variant={urgency === "high" ? "default" : "outline"}
                    className="justify-start h-10"
                    onClick={() => setUrgency("high")}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    High
                  </Button>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Additional Message (Optional)</h4>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Tell the provider about your specific needs or questions..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 text-right">
                  {requestMessage.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReachOutModal(false)
                    resetReachOutForm()
                  }}
                  disabled={isSubmittingRequest}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    console.log("Send Request button clicked")
                    console.log("Button disabled:", !selectedDuration || isSubmittingRequest)
                    console.log("selectedDuration:", selectedDuration)
                    console.log("isSubmittingRequest:", isSubmittingRequest)
                    e.preventDefault()
                    handleConfirmReachOut()
                  }}
                  disabled={!selectedDuration || isSubmittingRequest}
                  className="flex-1"
                >
                  {isSubmittingRequest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 