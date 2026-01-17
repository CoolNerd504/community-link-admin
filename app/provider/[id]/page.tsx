"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  Award,
  ArrowLeft,
  Share2,
  Globe,
  MessageCircle
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { getProviderByIdAction, toggleFollowAction, checkIsFollowingAction, startInquiryAction } from "../../../app/actions"
import { BookingWizard } from "../../features/booking/BookingWizard"
import { Users } from "lucide-react"

interface ProviderService {
  id: string
  title: string
  description: string
  price: number
  duration: number
  category: string
  isActive: boolean
}

interface ServiceProvider {
  id: string
  name: string
  email: string
  image?: string | null
  bio?: string
  headline?: string
  location?: string
  languages: string[]
  rating: number
  reviewCount: number
  isOnline: boolean
  isVerified: boolean
  hourlyRate?: number
  services: ProviderService[]
  reviews: Array<{
    id: string
    rating: number
    comment: string
    createdAt: Date
    client: {
      name: string
      image?: string
    }
  }>
}

export default function ProviderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const providerId = params.id as string

  const [provider, setProvider] = useState<ServiceProvider | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookingService, setBookingService] = useState<{ id: string, name: string, price: number } | undefined>(undefined)

  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  // Load initial follow status
  useEffect(() => {
    async function checkFollowStatus() {
      if (!providerId) return
      try {
        const result = await checkIsFollowingAction(providerId)
        setIsFollowing(result.isFollowing)
      } catch (error) {
        console.error("Error checking follow status:", error)
      }
    }
    checkFollowStatus()
  }, [providerId])

  const handleToggleFollow = async () => {
    try {
      setIsFollowLoading(true)
      const result = await toggleFollowAction(providerId)
      setIsFollowing(result.isFollowing)
    } catch (error) {
      // Ideally show toast here
      console.error("Error toggling follow:", error)
      alert("Failed to update follow status. Please try again.")
    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleStartMessage = async () => {
    try {
      const result = await startInquiryAction(providerId)
      if (result.sessionId) {
        router.push(`/messages/${result.sessionId}`)
      }
    } catch (error) {
      console.error("Error starting message:", error)
      alert("Failed to start conversation. Please try again.")
    }
  }

  useEffect(() => {
    const loadProvider = async () => {
      try {
        setIsLoading(true)
        const data = await getProviderByIdAction(providerId)

        if (data && data.role === "PROVIDER") {
          const reviews = data.providerReviews || []
          const rating = reviews.length > 0
            ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
            : 0

          setProvider({
            id: data.id,
            name: data.name || "Provider",
            email: data.email || "",
            image: data.image || undefined,
            bio: data.profile?.bio || undefined,
            headline: data.profile?.headline || undefined,
            location: data.profile?.location || undefined,
            languages: data.profile?.languages || [],
            rating: Math.round(rating * 10) / 10,
            reviewCount: reviews.length,
            isOnline: data.profile?.isOnline || false,
            isVerified: data.kycStatus === 'VERIFIED' || data.profile?.isVerified || false,
            hourlyRate: data.profile?.hourlyRate || undefined,
            services: data.providerServices?.map((s: any) => ({
              id: s.id,
              title: s.title,
              description: s.description,
              price: s.price,
              duration: s.duration,
              category: s.category,
              isActive: s.isActive,
            })) || [],
            reviews: reviews.map((r: any) => ({
              id: r.id,
              rating: r.rating,
              comment: r.comment,
              createdAt: new Date(r.createdAt),
              client: {
                name: r.client?.name || "Anonymous",
                image: r.client?.image
              }
            }))
          })
        }
      } catch (error) {
        console.error("Error loading provider:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (providerId) {
      loadProvider()
    }
  }, [providerId])

  const handleBookService = (service: ProviderService) => {
    setBookingService({
      id: service.id,
      name: service.title,
      price: service.price
    })
    setIsBookingModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">Provider not found</p>
        <Button onClick={() => router.push("/search")}>Back to Search</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Provider Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={provider.image || ""} />
                    <AvatarFallback className="text-2xl">{provider.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{provider.name}</h1>
                    {provider.headline && (
                      <p className="text-gray-600">{provider.headline}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {provider.isVerified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {provider.isOnline && (
                      <Badge className="bg-green-100 text-green-800">
                        Available Now
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="w-full space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Reviews</span>
                      <span className="font-semibold">{provider.reviewCount}</span>
                    </div>
                    {provider.hourlyRate && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Hourly Rate</span>
                        <span className="font-semibold">ZMW {provider.hourlyRate}</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="w-full space-y-2 mb-6">
                    {provider.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                      </div>
                    )}
                    {provider.languages.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span>{provider.languages.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="w-full"
                      size="lg"
                      variant={isFollowing ? "outline" : "default"}
                      onClick={handleToggleFollow}
                      disabled={isFollowLoading}
                    >
                      {isFollowLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      ) : (
                        <Users className="w-4 h-4 mr-2" />
                      )}
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleStartMessage}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About {provider.name}</h2>
                    {provider.bio ? (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{provider.bio}</p>
                    ) : (
                      <p className="text-gray-500 italic">No bio available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services">
                <div className="space-y-4">
                  {provider.services.filter(s => s.isActive).map((service) => (
                    <Card key={service.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{service.title}</h3>
                            <Badge variant="outline" className="text-xs mb-2">{service.category}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">ZMW {service.price}</p>
                            <p className="text-sm text-gray-500">per session</p>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{service.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{service.duration} mins</span>
                            </div>
                          </div>
                          <Button onClick={() => handleBookService(service)}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Session
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {provider.services.filter(s => s.isActive).length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <p className="text-gray-500">No active services available</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-1">
                          {provider.rating.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${star <= Math.round(provider.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{provider.reviewCount} reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {provider.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={review.client.image || ""} />
                            <AvatarFallback>{review.client.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold text-gray-900">{review.client.name}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-gray-700">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {provider.reviews.length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <p className="text-gray-500">No reviews yet</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Booking Wizard */}
      <BookingWizard
        isOpen={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        providerId={providerId}
        services={provider?.services || []}
      />
    </div>
  )
}