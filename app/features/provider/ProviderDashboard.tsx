"use client"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Switch } from "../../../components/ui/switch"
import { MultiServiceManagement } from "../../../components/multi-service-management"
import { GroupManagement } from "../../../components/group-management"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useAuth } from "../../../hooks/use-auth"
import {
  updateUserProfileAction,
  getProviderServicesAction,
  addProviderServiceAction,
  updateProviderServiceAction,
  deleteProviderServiceAction,
  getProviderBookingRequestsAction,
  respondToBookingRequestAction,
  getProviderEarningsAction
} from "../../../app/actions"
// Data/Schema imports if needed
// Data/Schema imports if needed
import { sampleGroups, sampleBookingRequests } from "../shared/data"
import { KycUploadFlow } from "./KycUploadFlow"
import { WalletPage } from "../wallet/WalletPage"
import { CheckCircle, XCircle, AlertCircle, Clock, Calendar, DollarSign, Users, TrendingUp, Plus, Edit, Trash2, LogOut } from "lucide-react"

export function ProviderDashboard({ currentUser }: { currentUser: any }) {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()

  // Provider profile state
  const [providerProfile, setProviderProfile] = useState({
    name: currentUser?.name || "Sarah Johnson",
    bio: "Certified life coach with 8+ years of experience",
    skills: ["Career Development", "Stress Management"],
    isAvailable: true,
    availableForInstant: true,
  })

  // Loading state for availability
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)

  // Fetch availability status
  useEffect(() => {
    // In migration Phase 3, we don't have real-time availability sync yet.
    // We assume data passed in `currentUser` or `providerProfile` is initial state.
    // Ideally we fetch from DB via action if needed to refresh.
  }, [])

  // Services state
  const [providerServices, setProviderServices] = useState<any[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)

  // Load services from DB
  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (!authUser?.id) return

        setIsLoadingServices(true)
        const services = await getProviderServicesAction(authUser.id)
        // Map services to ensure all expected UI fields exist (handling potential nulls from DB/Schema)
        const formattedServices = services.map((s: any) => ({
          ...s,
          analytics: s.analytics || {
            sessionsCompleted: 0,
            totalEarnings: 0,
            averageRating: 0,
            reviewCount: 0
          },
          availability: s.availability || {
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
          portfolio: s.portfolio || {
            images: [],
            videos: [],
            documents: [],
            testimonials: []
          },
          skills: s.skills || [] // Ensure skills is an array
        }))
        setProviderServices(formattedServices)
        console.log("Services loaded from DB")
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setIsLoadingServices(false)
      }
    }

    fetchServices()
  }, [authUser])

  // Bookings state
  const [bookingRequests, setBookingRequests] = useState<any[]>([])

  // Group management state
  const [groups, setGroups] = useState<any[]>(sampleGroups.filter(group => group.createdBy === "1"))

  // Instant booking requests state
  const [instantBookingRequests, setInstantBookingRequests] = useState<any[]>([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [requestTimers, setRequestTimers] = useState<{ [key: string]: number }>({})

  // Earnings state
  const [earnings, setEarnings] = useState<{ totalEarningsPaid: number, totalMinutesServiced: number, pendingPayouts: number } | null>(null)

  // Load instant booking requests from DB
  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        if (!authUser?.id) return

        setIsLoadingRequests(true)
        const requests = await getProviderBookingRequestsAction(authUser.id)

        // Format requests
        const formattedRequests = requests.map(req => ({
          ...req,
          clientName: "Client " + req.clientId.substring(0, 4), // TODO: Fetch client details
          serviceName: req.service.title,
          amount: req.service.price,
          duration: req.service.duration,
          preferredContactMethod: "video_call", // fallback
          urgency: "medium", // fallback
          date: req.requestedTime ? new Date(req.requestedTime).toLocaleDateString() : 'N/A',
          time: req.requestedTime ? new Date(req.requestedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
        }))


        // Separate Instant vs Scheduled
        // Use explicit isInstant flag or fallback to !requestedTime for legacy/compat
        const instant = formattedRequests.filter(req => req.isInstant || !req.requestedTime)
        const scheduled = formattedRequests.filter(req => !req.isInstant && req.requestedTime)

        setInstantBookingRequests(instant)
        setBookingRequests(scheduled)
      } catch (error) {
        console.error("Error fetching booking requests:", error)
      } finally {
        setIsLoadingRequests(false)
      }
    }

    fetchBookingRequests()
  }, [authUser])

  // Fetch Earnings
  useEffect(() => {
    const fetchEarnings = async () => {
      if (!authUser?.id) return
      try {
        const data = await getProviderEarningsAction(authUser.id)
        if (data) {
          setEarnings({
            totalEarningsPaid: data.totalEarningsZMW,
            totalMinutesServiced: data.totalMinutesServiced,
            pendingPayouts: data.pendingPayoutZMW
          })
        }
      } catch (e) {
        console.error("Failed to fetch earnings", e)
      }
    }
    fetchEarnings()
  }, [authUser])

  // Manage countdown timers for accepted requests
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const updatedTimers: { [key: string]: number } = {}

      instantBookingRequests.forEach((request) => {
        if (request.status === "accepted") {
          const timeRemaining = calculateAcceptedTimeRemaining(request)
          updatedTimers[request.id] = timeRemaining

          // If expired, update the request status locally
          if (timeRemaining <= 0) {
            setInstantBookingRequests(prev => prev.map(req =>
              req.id === request.id ? { ...req, status: "expired" } : req
            ))
          }
        }
      })

      setRequestTimers(updatedTimers)
    }, 1000) // Update every second

    return () => clearInterval(timerInterval)
  }, [instantBookingRequests])

  // Handlers for services
  const handleAddService = async (service: any) => {
    try {
      if (!authUser?.id) throw new Error("No authenticated user")

      // Add service via Server Action
      const newService = await addProviderServiceAction(authUser.id, service)

      // Update local state
      setProviderServices(prev => [...prev, newService])

      console.log("Service added successfully")
    } catch (error) {
      console.error("Error adding service:", error)
      alert("Failed to add service. Please try again.")
    }
  }

  const handleUpdateService = async (id: string, service: any) => {
    try {
      if (!authUser?.id) throw new Error("No authenticated user")

      // Update service
      await updateProviderServiceAction(authUser.id, id, service)

      // Update local state
      setProviderServices(prev => prev.map(s => s.id === id ? { ...s, ...service } : s))

      console.log("Service updated successfully")
    } catch (error) {
      console.error("Error updating service:", error)
      alert("Failed to update service. Please try again.")
    }
  }

  const handleDeleteService = async (id: string) => {
    try {
      if (!authUser?.id) throw new Error("No authenticated user")

      // Delete service
      await deleteProviderServiceAction(authUser.id, id)

      // Update local state
      setProviderServices(prev => prev.filter(s => s.id !== id))

      console.log("Service deleted successfully")
    } catch (error) {
      console.error("Error deleting service:", error)
      alert("Failed to delete service. Please try again.")
    }
  }

  const handleToggleServiceStatus = async (id: string, isActive: boolean) => {
    try {
      if (!authUser?.id) throw new Error("No authenticated user")

      await updateProviderServiceAction(authUser.id, id, { isActive })

      setProviderServices(prev => prev.map(s => s.id === id ? { ...s, isActive } : s))
    } catch (error) {
      console.error("Error updating service status:", error)
      alert("Failed to update service status.")
    }
  }

  const handleToggleServiceSponsorship = async (id: string, isSponsored: boolean) => {
    // Sponsorship might not be in basic updates, assume logic is handled
    alert("Sponsorship feature pending migration")
  }

  const handleToggleInstantAvailability = async (id: string, isAvailable: boolean) => {
    // Pending implementation in DB/Schema
    alert("Instant availability logic pending")
  }

  // Availability
  const toggleAvailability = async () => {
    try {
      if (!authUser?.id) throw new Error("No authenticated user")

      const newAvailability = !providerProfile.isAvailable

      // Update local state immediately for responsive UI
      setProviderProfile(prev => ({ ...prev, isAvailable: newAvailability }))

      // Update DB
      await updateUserProfileAction(authUser.id, {
        // We're maping 'isAvailable' to 'isOnline' in the DB/Schema conceptually for now
        // But schema has isVerified etc, not isOnline. 
        // We might need to handle this if we added isOnline to schema or mocked it.
        // For now, assuming we added it or reusing existing fields or accepting it won't persist if field missing
        isOnline: newAvailability
      })

      console.log("Availability updated successfully")
    } catch (error) {
      console.error("Error updating availability:", error)
      // Revert local state on error
      setProviderProfile(prev => ({ ...prev, isAvailable: !prev.isAvailable }))
      alert("Failed to update availability. Please try again.")
    }
  }

  const toggleInstantAvailability = async (checked: boolean) => {
    try {
      if (!authUser?.id) throw new Error("No authenticated user")

      // Update local state immediately
      setProviderProfile(prev => ({ ...prev, availableForInstant: checked }))

      // Update DB
      await updateUserProfileAction(authUser.id, {
        availableForInstant: checked
      })

      console.log("Instant availability updated successfully")
    } catch (error) {
      console.error("Error updating instant availability:", error)
      // Revert local state
      setProviderProfile(prev => ({ ...prev, availableForInstant: !prev.availableForInstant }))
      alert("Failed to update instant availability. Please try again.")
    }
  }

  // Group handlers
  const handleStartGroupCall = (groupId: string) => {
    alert(`Starting group call for group ${groupId}`)
  }
  const handleViewGroup = (groupId: string) => {
    alert(`Viewing group ${groupId}`)
  }

  // Profile
  const handleViewProfile = () => {
    router.push('/profile')
  }

  // Handlers for instant booking requests
  const handleRespondToRequest = async (serviceId: string, requestId: string, status: "accepted" | "declined" | "completed") => {
    try {
      if (!authUser?.id) throw new Error("No authenticated user")

      if (status === "completed") {
        // Completed isn't a response action in our current flow, maybe just local update or different action
        // For now treating as valid UI update but action only supports accepted/declined
        console.log("Marking as completed not yet sync'd to DB")
        return
      }

      await respondToBookingRequestAction(authUser.id, requestId, status as "accepted" | "declined")

      // Update local state
      setInstantBookingRequests(prev => prev.map(req =>
        req.id === requestId ? { ...req, status, respondedAt: new Date() } : req
      ))

      console.log(`Instant booking request ${status} successfully`)
    } catch (error) {
      console.error("Error responding to instant booking request:", error)
      alert("Failed to respond to request. Please try again.")
    }
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

  // Check for KYC Status - show banner but don't block access
  const kycStatus = currentUser?.kycStatus || "PENDING"
  const showKycBanner = kycStatus === "PENDING" || kycStatus === "SUBMITTED"

  // Only show KYC rejection message, don't block for PENDING
  if (kycStatus === "REJECTED") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Rejected</h2>
          <p className="text-gray-600 mb-6">
            Unfortunately, we couldn't verify your documents. Please resubmit with clear, valid identification.
          </p>
          <Button onClick={() => window.location.reload()}>Resubmit Documents</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Container with proper constraints */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">

        {/* KYC Status Banner */}
        {showKycBanner && (
          <div className={`mb-6 p-4 rounded-lg border ${kycStatus === "PENDING"
            ? "bg-blue-50 border-blue-200"
            : "bg-yellow-50 border-yellow-200"
            }`}>
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${kycStatus === "PENDING" ? "text-blue-600" : "text-yellow-600"
                }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${kycStatus === "PENDING" ? "text-blue-900" : "text-yellow-900"
                  }`}>
                  {kycStatus === "PENDING" ? "Complete Your Verification" : "Verification Under Review"}
                </h3>
                <p className={`text-sm mt-1 ${kycStatus === "PENDING" ? "text-blue-700" : "text-yellow-700"
                  }`}>
                  {kycStatus === "PENDING"
                    ? "To unlock all provider features and start earning, please complete your identity verification."
                    : "Your documents are being reviewed. This usually takes 24-48 hours. You'll be notified once approved."
                  }
                </p>
              </div>
              {kycStatus === "PENDING" && (
                <Button
                  size="sm"
                  onClick={() => window.location.href = '/kyc'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Complete KYC
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="flex items-center justify-between mb-8 p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser?.avatar || "/placeholder-user.jpg"} alt="Profile" />
              <AvatarFallback>{(currentUser?.name || "John Doe").split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentUser?.name || "John Doe"}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm">
                  Service Provider
                </Badge>
                <span className="text-sm text-gray-500">• Active member</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}!</p>
              <p className="text-xs text-gray-500">Ready to help clients today?</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleViewProfile}>
                View Profile
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h2>
          <p className="text-gray-600">Manage your profile, availability, and bookings</p>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="services" onClick={() => router.push("/provider/services")}>Services</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            {authUser?.kycStatus === 'APPROVED' && <TabsTrigger value="wallet">Wallet</TabsTrigger>}
            <TabsTrigger value="instant-requests">
              Instant Requests ({instantBookingRequests.filter(req => req.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>



          <TabsContent value="services" className="space-y-6">
            {isLoadingServices ? (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading services...</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <MultiServiceManagement
                services={providerServices}
                onAddService={handleAddService}
                onUpdateService={handleUpdateService}
                onDeleteService={handleDeleteService}
                onToggleServiceStatus={handleToggleServiceStatus}
                onToggleServiceSponsorship={handleToggleServiceSponsorship}
                onToggleInstantAvailability={handleToggleInstantAvailability}
              />
            )}
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Availability Settings</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Mock refresh or just re-fetch profile if needed
                    // For now simply toggle loading state to show interaction
                    setIsLoadingAvailability(true)
                    setTimeout(() => setIsLoadingAvailability(false), 800)
                  }}
                  disabled={isLoadingAvailability}
                  className="flex items-center gap-2"
                >
                  <div className={`w-4 h-4 ${isLoadingAvailability ? 'animate-spin' : ''}`}>
                    {!isLoadingAvailability && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </div>
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Loading State */}
                {isLoadingAvailability && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-800">Loading availability status...</span>
                    </div>
                  </div>
                )}

                {/* Current Status Display */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${providerProfile.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium">
                        {providerProfile.isAvailable ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    {providerProfile.isAvailable && (
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${providerProfile.availableForInstant ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm font-medium">
                          {providerProfile.availableForInstant ? 'Instant Sessions Enabled' : 'Instant Sessions Disabled'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Toggle Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="available" className="text-base font-medium">Currently Available</Label>
                      <p className="text-sm text-gray-600 mt-1">Toggle your online status to appear in provider listings</p>
                    </div>
                    <Switch
                      id="available"
                      checked={providerProfile.isAvailable}
                      onCheckedChange={toggleAvailability}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="instant" className="text-base font-medium">Available for Instant Sessions</Label>
                      <p className="text-sm text-gray-600 mt-1">Allow clients to start sessions immediately without booking</p>
                    </div>
                    <Switch
                      id="instant"
                      checked={providerProfile.availableForInstant}
                      onCheckedChange={toggleInstantAvailability}
                      disabled={!providerProfile.isAvailable}
                    />
                  </div>
                </div>

                {/* Status Messages */}
                {!providerProfile.isAvailable && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      You are currently offline. Clients won't be able to see you in provider listings or book sessions.
                    </p>
                  </div>
                )}

                {providerProfile.isAvailable && !providerProfile.availableForInstant && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      You are online but instant sessions are disabled. Clients can only book scheduled sessions.
                    </p>
                  </div>
                )}

                {providerProfile.isAvailable && providerProfile.availableForInstant && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      You are fully available! Clients can see you in listings and start instant sessions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
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

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Recent Bookings</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingRequests.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{booking.clientName}</h4>
                        <p className="text-sm text-gray-600">{booking.service}</p>
                        <p className="text-sm text-gray-500">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                        <p className="text-sm font-medium">ZMW {booking.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            {authUser?.id ? <WalletPage providerId={authUser.id} /> : <div>Please log in</div>}
          </TabsContent>

          <TabsContent value="instant-requests" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Instant Booking Requests</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (authUser?.id) {
                      try {
                        setIsLoadingRequests(true)
                        const requests = await getProviderBookingRequestsAction(authUser.id)
                        // Re-map logic duplicatiion... ideally shared function
                        const formattedRequests = requests.map(req => ({
                          ...req,
                          clientName: "Client " + req.clientId.substring(0, 4),
                          serviceName: req.service.title,
                          amount: req.service.price,
                          duration: req.service.duration,
                          preferredContactMethod: "video_call",
                          urgency: "medium",
                        }))
                        setInstantBookingRequests(formattedRequests)
                      } catch (e) { console.error(e) }
                      finally { setIsLoadingRequests(false) }
                    }
                  }}
                  disabled={isLoadingRequests}
                  className="flex items-center gap-2"
                >
                  <div className={`w-4 h-4 ${isLoadingRequests ? 'animate-spin' : ''}`}>
                    {!isLoadingRequests && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </div>
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingRequests ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading instant booking requests...</p>
                  </div>
                ) : instantBookingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Instant Requests</h4>
                    <p className="text-gray-600">You haven't received any instant booking requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {instantBookingRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={request.clientProfileImage || "/placeholder-user.jpg"} alt={request.clientName} />
                              <AvatarFallback>
                                {request.clientName.split(" ").map((n: string) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-gray-900">{request.clientName}</h4>
                              <p className="text-sm text-gray-600">{request.serviceName}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(request.createdAt.seconds * 1000).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                request.status === "pending" ? "default" :
                                  request.status === "accepted" ? "secondary" :
                                    request.status === "completed" ? "outline" : "destructive"
                              }
                            >
                              {request.status}
                            </Badge>
                            <p className="text-sm font-medium mt-1">ZMW {request.amount}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-2 font-medium">{request.duration} minutes</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Contact:</span>
                            <span className="ml-2 font-medium capitalize">{request.preferredContactMethod?.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Urgency:</span>
                            <span className="ml-2 font-medium capitalize">{request.urgency}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Call Time:</span>
                            <span className="ml-2 font-medium">
                              {request.status === "accepted" ? (
                                <span className="text-orange-600 font-medium">
                                  {formatTimeRemaining(requestTimers[request.id] || calculateAcceptedTimeRemaining(request))}
                                </span>
                              ) : (
                                "Not accepted"
                              )}
                            </span>
                          </div>
                        </div>

                        {request.message && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{request.message}</p>
                          </div>
                        )}

                        {request.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleRespondToRequest(request.serviceId, request.id, "accepted")}
                              className="flex-1"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRespondToRequest(request.serviceId, request.id, "declined")}
                              className="flex-1"
                            >
                              Decline
                            </Button>
                          </div>
                        )}

                        {request.status === "accepted" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleRespondToRequest(request.serviceId, request.id, "completed")}
                              className="flex-1"
                              disabled={isAcceptedRequestExpired(request)}
                            >
                              Mark Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              disabled={isAcceptedRequestExpired(request)}
                            >
                              {isAcceptedRequestExpired(request) ? "Time Expired" : "Start Session"}
                            </Button>
                          </div>
                        )}

                        {request.status === "expired" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="flex-1 cursor-not-allowed"
                            >
                              Request Expired
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Total Sessions</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">127</p>
                  <p className="text-sm text-gray-600">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Average Rating</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">4.9</p>
                  <p className="text-sm text-gray-600">Based on 127 reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Monthly Earnings</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">ZMW 2,340</p>
                  <p className="text-sm text-gray-600">+8% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div >
  )
} 