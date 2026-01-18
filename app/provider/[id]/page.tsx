"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProviderByIdAction, toggleFollowAction, checkIsFollowingAction, startInquiryAction } from "@/app/actions"
import { BookingWizard } from "@/app/features/booking/BookingWizard"
import { Provider, TabItem } from "@/components/profile/types"
import { ProfileCard } from "@/components/profile/profile-card"
import { BookingSidebar } from "@/components/profile/booking-sidebar"
import { TabNavigation } from "@/components/profile/tab-navigation"
import { AboutTab } from "@/components/profile/about-tab"
import { ServicesTab } from "@/components/profile/services-tab"
import { ReviewsTab } from "@/components/profile/reviews-tab"
import { ExperienceTab } from "@/components/profile/experience-tab"

export default function ProviderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const providerId = params.id as string

  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("about")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Note: We're not using bookingService state here for the sidebar button, 
  // but if we need to support individual service booking from the Services tab later, 
  // we would pass a handler to ServicesTab.

  useEffect(() => {
    const loadProvider = async () => {
      try {
        setIsLoading(true)
        // Check follow status first
        let isFollowing = false
        try {
          const followResult = await checkIsFollowingAction(providerId)
          isFollowing = followResult.isFollowing
        } catch (e) {
          console.error("Error checking follow status", e)
        }

        const data = await getProviderByIdAction(providerId)

        if (data && data.role === "PROVIDER") {
          const reviews = data.providerReviews || []
          const rating = reviews.length > 0
            ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
            : 0

          // Safe access to profile data with fallback
          const profileData = data.profile as any || {}

          setProvider({
            id: data.id,
            name: data.name || "Provider",
            email: data.email || "",
            image: data.image || null,
            rating: Math.round(rating * 10) / 10,
            reviewCount: reviews.length,
            sessions: 0, // Default to 0 since _count is not currently available
            experience: 5, // Mock data
            kycStatus: data.kycStatus,
            isFavorite: false,
            isFollowing: isFollowing,
            profile: {
              bio: profileData.bio,
              headline: profileData.headline,
              location: profileData.location,
              languages: profileData.languages || [],
              interests: profileData.interests || [],
              timezone: profileData.timezone || "CAT (GMT+2)",
              hourlyRate: profileData.hourlyRate,
              isOnline: profileData.isOnline || false,
              isVerified: data.kycStatus === 'VERIFIED' || profileData.isVerified || false,
            },
            services: data.providerServices?.map((s: any) => ({
              id: s.id,
              title: s.title,
              description: s.description,
              price: s.price,
              duration: s.duration,
              category: s.category,
              deliveryType: s.deliveryType || "both", // Assuming field exists or default
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

  const handleToggleFollow = async () => {
    if (!provider) return
    try {
      const result = await toggleFollowAction(providerId)
      setProvider(prev => prev ? ({ ...prev, isFollowing: result.isFollowing }) : null)
    } catch (error) {
      console.error("Error toggling follow:", error)
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
    }
  }

  const handleSchedule = () => {
    setActiveTab("services")
    // Ideally scroll to services section or open booking wizard directly
    // setIsBookingModalOpen(true) 
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#181818]"></div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5]">
        <p className="text-[#767676] mb-4">Provider not found</p>
        <Button onClick={() => router.push("/user/discover")}>Back to Discover</Button>
      </div>
    )
  }

  const tabs: TabItem[] = [
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "reviews", label: "Reviews" },
    { id: "experience", label: "Experience" },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-10">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#eee] sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center gap-2 text-[14px]">
            <button
              onClick={() => router.push('/user/discover')}
              className="text-[#767676] hover:text-[#181818]"
            >
              Home
            </button>
            <span className="text-[#a2a2a2]">/</span>
            <span className="text-[#767676]">{provider.services[0]?.category || "Provider"}</span>
            <span className="text-[#a2a2a2]">/</span>
            <span className="text-[#181818] font-semibold">{provider.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_340px] gap-8">

          {/* Left Sidebar - Profile Card */}
          <ProfileCard provider={provider} />

          {/* Center - Tabbed Content */}
          <div className="min-w-0"> {/* min-w-0 ensures flex/grid children don't overflow */}
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="mt-6">
              {activeTab === "about" && <AboutTab provider={provider} />}
              {activeTab === "services" && <ServicesTab provider={provider} />}
              {activeTab === "reviews" && <ReviewsTab provider={provider} />}
              {activeTab === "experience" && <ExperienceTab provider={provider} />}
            </div>
          </div>

          {/* Right Sidebar - Booking */}
          <BookingSidebar
            provider={provider}
            onConnect={handleStartMessage}
            onSchedule={handleSchedule}
            onToggleFollow={handleToggleFollow}
          />
        </div>
      </div>

      {/* Booking Wizard (Hidden until triggered) */}
      <BookingWizard
        isOpen={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        providerId={providerId}
        services={provider?.services || []}
      />
    </div>
  )
}