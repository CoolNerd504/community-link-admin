"use client"
import { useEffect, useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useAuth } from "../../hooks/use-auth"
import {
  getUserProfileAction,
  updateUserProfileAction,
  getProviderServicesAction,
  // getAllProvidersAction 
} from "@/app/actions"
import { Star, Clock, MapPin, Users, DollarSign, Calendar, CheckCircle, AlertCircle, Edit, Save, X } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userType, setUserType] = useState<"individual" | "provider">("individual")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [availabilityStatus, setAvailabilityStatus] = useState({
    isOnline: true,
    availableForInstant: true,
  })

  // Provider profile state for editing
  const [providerProfile, setProviderProfile] = useState({
    name: "",
    email: "",
    bio: "",
    specialization: "",
    experience: "",
    education: "",
    certifications: "",
    location: "",
    phone: "",
    website: "",
    languages: [] as string[],
    availability: {
      isAvailable: true,
      availableForInstant: true,
      workingHours: {
        monday: { start: "09:00", end: "17:00", available: true },
        tuesday: { start: "09:00", end: "17:00", available: true },
        wednesday: { start: "09:00", end: "17:00", available: true },
        thursday: { start: "09:00", end: "17:00", available: true },
        friday: { start: "09:00", end: "17:00", available: true },
        saturday: { start: "10:00", end: "15:00", available: false },
        sunday: { start: "10:00", end: "15:00", available: false },
      }
    }
  })

  const [individualAnalytics, setIndividualAnalytics] = useState({
    totalSessions: 8,
    totalMinutes: 120,
    averageRating: 4.8,
    totalSpent: 240,
  })
  const [providerAnalytics, setProviderAnalytics] = useState({
    totalSessions: 127,
    totalMinutes: 2540,
    averageRating: 4.9,
    monthlyEarnings: 2340,
    totalClients: 45,
    completionRate: 98,
  })
  const [providerServices, setProviderServices] = useState<any[]>([])
  const [upcoming, setUpcoming] = useState([
    { name: "Session with Sarah Johnson", time: "Tomorrow, 2:00 PM", type: "Life Coaching" },
    { name: "Session with Mike Lee", time: "Friday, 10:00 AM", type: "Therapy" },
  ])
  const [past, setPast] = useState([
    { name: "Session with Sarah Johnson", time: "Last week", type: "Life Coaching" },
    { name: "Session with Mike Lee", time: "2 weeks ago", type: "Therapy" },
  ])

  // Fetch full user profile from DB
  useEffect(() => {
    const fetchProfile = async () => {
      if (authUser?.id) {
        try {
          const profile = await getUserProfileAction(authUser.id)
          if (profile) {
            // Merge auth user with db profile
            setCurrentUser({
              ...profile,
              name: profile.name || authUser.name,
              email: profile.email || authUser.email,
              image: profile.image || authUser.image
            })
            setUserType((profile.role as any) === "PROVIDER" ? "provider" : "individual")
            // TODO: Load real analytics
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    fetchProfile()
  }, [authUser])

  const handleRefreshAvailability = async () => {
    setIsLoadingAvailability(true)
    try {
      // Refresh profile data
      const profile = await getUserProfileAction(authUser?.email || "")
      if (profile && profile.role === "PROVIDER") {
        setAvailabilityStatus({
          isOnline: profile.profile?.isOnline || false,
          availableForInstant: profile.profile?.isAvailableForInstant || false,
        })
      }
    } catch (error) {
      console.error("Failed to refresh availability", error)
    } finally {
      setIsLoadingAvailability(false)
    }
  }

  // Fetch provider services
  useEffect(() => {
    const fetchServices = async () => {
      if (userType !== "provider" || !authUser?.id) return

      try {
        setIsLoadingServices(true)
        const services = await getProviderServicesAction(authUser.id)
        setProviderServices(services)
      } catch (error) {
        console.error("Error fetching provider services:", error)
      } finally {
        setIsLoadingServices(false)
      }
    }

    fetchServices()
  }, [userType, authUser])


  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Edit modal handlers
  const handleOpenEditModal = () => {
    // Populate the form with current user data
    setProviderProfile({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      bio: currentUser?.bio || "Certified life coach with 8+ years of experience",
      specialization: currentUser?.specialization || "Life Coaching",
      experience: currentUser?.experience || "8+ years",
      education: currentUser?.education || "Master's in Psychology",
      certifications: currentUser?.certifications || "Certified Life Coach, ICF Member",
      location: currentUser?.location || "Lusaka, Zambia",
      phone: currentUser?.phone || "+260 955 123 456",
      website: currentUser?.website || "https://sarahjohnson.com",
      languages: currentUser?.languages || ["English", "Bemba"],
      availability: {
        isAvailable: currentUser?.availability?.isAvailable ?? true,
        availableForInstant: currentUser?.availability?.availableForInstant ?? true,
        workingHours: currentUser?.availability?.workingHours || {
          monday: { start: "09:00", end: "17:00", available: true },
          tuesday: { start: "09:00", end: "17:00", available: true },
          wednesday: { start: "09:00", end: "17:00", available: true },
          thursday: { start: "09:00", end: "17:00", available: true },
          friday: { start: "09:00", end: "17:00", available: true },
          saturday: { start: "10:00", end: "15:00", available: false },
          sunday: { start: "10:00", end: "15:00", available: false },
        }
      }
    })
    setIsEditModalOpen(true)
  }

  const handleSaveProfile = async () => {
    // Basic validation
    if (!providerProfile.name.trim()) {
      alert("Name is required")
      return
    }

    if (!providerProfile.email.trim()) {
      alert("Email is required")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(providerProfile.email)) {
      alert("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      if (!authUser?.id) {
        throw new Error("No authenticated user found")
      }

      // Prepare the updates object
      const updates = {
        name: providerProfile.name.trim(),
        // email: providerProfile.email.trim(), // Don't allow email update easily
        image: currentUser?.image, // Preserve image
        // Flatten other profile fields as needed or pass separate Profile object
        // For this action we passed 'data' which maps to updateUserProfile
        // Prisma updateUserProfile needs to match the structure in lib/db-operations
        bio: providerProfile.bio.trim(),
        // ... include other fields
      }

      // We need to match what db.updateUserProfile expects.
      await updateUserProfileAction(authUser.id, {
        name: providerProfile.name,
        bio: providerProfile.bio,
        // location: providerProfile.location, 
        // ... map other fields
      })

      // Update local state
      setCurrentUser((prev: any) => ({
        ...prev,
        ...updates
      }))

      setIsEditModalOpen(false)
      console.log("Profile updated successfully")

    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
      // You could add error toast here
      // toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditModalOpen(false)
  }



  const isProvider = userType === "provider"

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:underline" onClick={() => router.back()}>&larr; Back</button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Profile Details Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Profile Details</CardTitle>
            {isProvider && (
              <Button onClick={handleOpenEditModal} variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:w-1/3">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={currentUser?.avatar || "/placeholder-user.jpg"} alt="Profile" />
                  <AvatarFallback>{(currentUser?.name || "John Doe").split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-gray-900">{currentUser?.name || "John Doe"}</h3>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
                <Badge className="mt-2" variant={isProvider ? "default" : "secondary"}>
                  {isProvider ? "Service Provider" : "Client"}
                </Badge>
                {isProvider && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">{currentUser?.specialization || "Certified Life Coach"}</p>
                    <p className="text-xs text-gray-500">{currentUser?.experience || "8+ years experience"}</p>
                  </div>
                )}
              </div>
              <div className="md:w-2/3">
                <h4 className="font-semibold text-lg mb-4">Analytics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{isProvider ? providerAnalytics.totalSessions : individualAnalytics.totalSessions}</div>
                    <div className="text-sm text-gray-600">Total Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{isProvider ? providerAnalytics.totalMinutes : individualAnalytics.totalMinutes}</div>
                    <div className="text-sm text-gray-600">Total Minutes</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{isProvider ? providerAnalytics.averageRating : individualAnalytics.averageRating}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  {isProvider && (
                    <>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">ZMW {providerAnalytics.monthlyEarnings}</div>
                        <div className="text-sm text-gray-600">Monthly Earnings</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">{providerAnalytics.totalClients}</div>
                        <div className="text-sm text-gray-600">Total Clients</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">{providerAnalytics.completionRate}%</div>
                        <div className="text-sm text-gray-600">Completion Rate</div>
                      </div>
                    </>
                  )}
                  {!isProvider && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">ZMW {individualAnalytics.totalSpent}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Services Section */}
        {isProvider && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900">My Services</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    if (!authUser?.id) return

                    setIsLoadingServices(true)
                    const services = await getProviderServicesAction(authUser.id)
                    setProviderServices(services)
                    console.log("Services refreshed")
                  } catch (error) {
                    console.error("Error refreshing services:", error)
                  } finally {
                    setIsLoadingServices(false)
                  }
                }}
                disabled={isLoadingServices}
                className="flex items-center gap-2"
              >
                <div className={`w-4 h-4 ${isLoadingServices ? 'animate-spin' : ''}`}>
                  {!isLoadingServices && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </div>
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingServices ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-800">Loading services...</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providerServices.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{service.name}</h5>
                        <Badge variant={service.isActive ? "default" : "secondary"} className="text-xs">
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="text-xs text-gray-500 capitalize">{service.category}</p>
                        <p className="text-sm">{service.description}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            {service.analytics?.sessionsCompleted || 0} sessions
                          </span>
                          <span className="text-xs text-gray-500">
                            {service.analytics?.averageRating ? `${service.analytics.averageRating.toFixed(1)}★` : 'No rating'}
                          </span>
                        </div>
                        {service.analytics?.totalEarnings && (
                          <p className="text-xs text-green-600 font-medium mt-1">
                            ZMW {service.analytics.totalEarnings} earned
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {providerServices.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No services listed yet. Add some to showcase your expertise!</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Availability Status (Provider Only) */}
        {isProvider && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900">Availability Status</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshAvailability}
                disabled={isLoadingAvailability}
                className="gap-2"
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
            <CardContent>
              {/* Loading State */}
              {isLoadingAvailability && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-800">Loading availability status...</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className={`h-5 w-5 ${availabilityStatus.isOnline ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                      <p className="font-medium">Currently Available</p>
                      <p className="text-sm text-gray-600">
                        {availabilityStatus.isOnline ? 'Accepting new sessions' : 'Not accepting sessions'}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className={availabilityStatus.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {availabilityStatus.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className={`h-5 w-5 ${availabilityStatus.availableForInstant ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-medium">Instant Sessions</p>
                      <p className="text-sm text-gray-600">
                        {availabilityStatus.availableForInstant ? 'Available for immediate calls' : 'Scheduled sessions only'}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className={availabilityStatus.availableForInstant ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {availabilityStatus.availableForInstant ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isProvider ? "Sessions" : "Appointments"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              <div>
                <h4 className="font-semibold text-lg mb-4 text-green-700 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming {isProvider ? "Sessions" : "Appointments"}
                </h4>
                <div className="space-y-4">
                  {upcoming.map((appt, i) => (
                    <div key={i} className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{appt.name}</h5>
                          <p className="text-sm text-gray-600">{appt.type}</p>
                        </div>
                        <span className="text-sm text-green-700 font-medium">{appt.time}</span>
                      </div>
                    </div>
                  ))}
                  {upcoming.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No upcoming {isProvider ? "sessions" : "appointments"}</p>
                  )}
                </div>
              </div>

              {/* Past Appointments */}
              <div>
                <h4 className="font-semibold text-lg mb-4 text-gray-700 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Past {isProvider ? "Sessions" : "Appointments"}
                </h4>
                <div className="space-y-4">
                  {past.map((appt, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{appt.name}</h5>
                          <p className="text-sm text-gray-600">{appt.type}</p>
                        </div>
                        <span className="text-sm text-gray-500">{appt.time}</span>
                      </div>
                    </div>
                  ))}
                  {past.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No past {isProvider ? "sessions" : "appointments"}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={providerProfile.name}
                      onChange={(e) => setProviderProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={providerProfile.email}
                      onChange={(e) => setProviderProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={providerProfile.phone}
                      onChange={(e) => setProviderProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={providerProfile.location}
                      onChange={(e) => setProviderProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Professional Information</h3>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={providerProfile.bio}
                    onChange={(e) => setProviderProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell clients about yourself, your approach, and what you can help them with..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Languages</h3>
                <div>
                  <Label htmlFor="languages">Languages Spoken (comma separated)</Label>
                  <Input
                    id="languages"
                    value={providerProfile.languages.join(", ")}
                    onChange={(e) => setProviderProfile(prev => ({
                      ...prev,
                      languages: e.target.value.split(",").map(lang => lang.trim()).filter(lang => lang)
                    }))}
                    placeholder="e.g., English, Bemba, Nyanja"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  )
} 