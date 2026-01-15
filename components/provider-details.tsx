"use client"

import { useState } from "react"
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  MessageCircle, 
  Video, 
  Phone,
  CheckCircle,
  Award,
  BookOpen,
  TrendingUp,
  DollarSign,
  ArrowLeft,
  Share2,
  Heart
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface ProviderDetailsProps {
  provider: {
    id: string
    name: string
    specialty: string
    rating: number
    reviewCount: number
  
    location: {
      town: string
      country: string
      fullAddress: string
    }
    avatar: string
    isOnline: boolean
    responseTime: string
    description: string
    skills: string[]
    isSponsored?: boolean
    isVerified?: boolean
    vettingStatus?: "pending" | "approved" | "rejected"
    availableForInstant?: boolean
    analytics: {
      totalSessions: number
      averageRating: number
      completionRate: number
      responseTime: number
      totalEarnings: number
      groupSessions: number
      individualSessions: number
    }
    services?: Array<{
      id: string
      name: string
      category: string
      description: string
      isActive: boolean
      isSponsored: boolean
      isAvailableForInstant: boolean
      skills: string[]
      analytics: {
        sessionsCompleted: number
        totalEarnings: number
        averageRating: number
        reviewCount: number
      }
    }>
  }
  onBack: () => void
  onBookSession: (providerId: string) => void
  onStartCall: (providerId: string) => void
  onSendMessage: (providerId: string) => void
}

export function ProviderDetails({
  provider,
  onBack,
  onBookSession,
  onStartCall,
  onSendMessage,
}: ProviderDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
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

      {/* Main Profile Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={provider.avatar} alt={provider.name} />
                <AvatarFallback className="text-lg">
                  {provider.name.split(" ").map(n => n[0]).join("")}
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
                    {provider.location.town}, {provider.location.country}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {provider.responseTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating and Stats */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(provider.rating)}
                  <span className="ml-2 font-semibold">{provider.rating}</span>
                  <span className="text-gray-500">({provider.reviewCount} reviews)</span>
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
                  <div className="text-2xl font-bold text-blue-600">{provider.analytics.totalSessions}</div>
                  <div className="text-sm text-gray-500">Total Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{provider.analytics.completionRate}%</div>
                  <div className="text-sm text-gray-500">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{provider.analytics.individualSessions}</div>
                  <div className="text-sm text-gray-500">Individual</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{provider.analytics.groupSessions}</div>
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
                  onClick={() => onStartCall(provider.id)}
                  className="w-full"
                  size="lg"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Start Now
                </Button>
              ) : (
                <Button 
                  onClick={() => onBookSession(provider.id)}
                  className="w-full"
                  size="lg"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Session
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => onSendMessage(provider.id)}
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
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About {provider.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{provider.description}</p>
              
              <div>
                <h4 className="font-semibold mb-2">Skills & Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Certifications & Awards</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Certified Life Coach (ICF)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span>Master's in Psychology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>8+ Years Experience</span>
                  </div>
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
                      <Card key={service.id} className="border-2 hover:border-blue-200 transition-colors">
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
                              onClick={() => onBookSession(provider.id)}
                              className="flex-1"
                            >
                              <BookOpen className="h-4 w-4 mr-1" />
                              Book This Service
                            </Button>
                            {service.isAvailableForInstant && provider.isOnline && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => onStartCall(provider.id)}
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
                    <div className="text-2xl font-bold">{provider.rating}</div>
                    <div className="text-sm text-gray-500">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{provider.reviewCount}</div>
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

                <Separator />

                {/* Sample Reviews */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(5)}
                      <span className="font-semibold">Amazing experience!</span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      "Sarah was incredibly helpful and professional. Her insights really helped me 
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
                      "Great session! Sarah is very knowledgeable and creates a comfortable environment 
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

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Session Statistics */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Session Statistics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>{provider.analytics.completionRate}%</span>
                      </div>
                      <Progress value={provider.analytics.completionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Time</span>
                        <span>{provider.analytics.responseTime} min</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Client Satisfaction</span>
                        <span>{provider.analytics.averageRating}/5</span>
                      </div>
                      <Progress value={provider.analytics.averageRating * 20} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Revenue Statistics */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Revenue Overview</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">Total Earnings</div>
                        <div className="text-xl font-bold text-green-600">
                          ZMW{provider.analytics.totalEarnings.toLocaleString()}
                        </div>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">This Month</div>
                        <div className="text-xl font-bold text-blue-600">ZMW 2,450</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability & Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Availability Status */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Current Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Online Status</span>
                      <Badge variant={provider.isOnline ? "default" : "secondary"}>
                        {provider.isOnline ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Instant Sessions</span>
                      <Badge variant={provider.availableForInstant ? "default" : "secondary"}>
                        {provider.availableForInstant ? "Available" : "Scheduled Only"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Response Time</span>
                      <span className="text-sm text-gray-600">{provider.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Booking */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Quick Booking</h4>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => onBookSession(provider.id)}
                      className="w-full"
                      size="lg"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Session
                    </Button>
                    {provider.availableForInstant && provider.isOnline && (
                      <Button 
                        onClick={() => onStartCall(provider.id)}
                        className="w-full"
                        variant="outline"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Start Instant Session
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => onSendMessage(provider.id)}
                      className="w-full"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 