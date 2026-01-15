"use client"

import { useState } from "react"
import { AdvancedSearch } from "@/components/advanced-search"
import { ProviderDetails } from "@/components/provider-details"
import { GroupCard } from "@/components/group-card"
import { GroupManagement } from "@/components/group-management"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for demo
const sampleProvider = {
  id: "1",
  name: "Sarah Johnson",
  specialty: "Life Coach",
  rating: 4.8,
  reviewCount: 127,
  
  location: {
    town: "San Francisco",
    country: "United States",
    fullAddress: "San Francisco, CA, United States",
  },
  avatar: "/placeholder-user.jpg",
  isOnline: true,
  responseTime: "5 minutes",
  description: "Certified life coach with 8+ years of experience helping individuals achieve their personal and professional goals. Specializing in career transitions, work-life balance, and personal development.",
  skills: ["Career Coaching", "Personal Development", "Work-Life Balance", "Goal Setting"],
  isSponsored: true,
  isVerified: true,
  vettingStatus: "approved" as const,
  availableForInstant: true,
  analytics: {
    totalSessions: 127,
    averageRating: 4.8,
    completionRate: 95,
    responseTime: 5,
    totalEarnings: 10800,
    groupSessions: 12,
    individualSessions: 115,
  },
}

const sampleGroups = [
  {
    id: "1",
    name: "Life Coaching Community",
    description: "A supportive community for personal development and life coaching discussions.",
    createdBy: "1",
    category: "Life Coaching",
    privacy: "public" as const,
    maxMembers: 50,
    currentMembers: 23,
    location: {
      town: "San Francisco",
      country: "United States",
    },
    tags: ["personal development", "coaching", "wellness"],
    isActive: true,
    lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    name: "Fitness & Wellness Group",
    description: "Group sessions for fitness training, nutrition advice, and wellness tips.",
    createdBy: "3",
    category: "Fitness & Wellness",
    privacy: "public" as const,
    maxMembers: 30,
    currentMembers: 18,
    location: {
      town: "Los Angeles",
      country: "United States",
    },
    tags: ["fitness", "nutrition", "wellness"],
    isActive: true,
    lastActivityAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "3",
    name: "Business Strategy Network",
    description: "Professional networking and business strategy discussions for entrepreneurs.",
    createdBy: "2",
    category: "Business & Career",
    privacy: "invite_only" as const,
    maxMembers: 25,
    currentMembers: 12,
    location: {
      town: "New York",
      country: "United States",
    },
    tags: ["business", "strategy", "networking"],
    isActive: true,
    lastActivityAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
]

export default function DemoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTown, setSelectedTown] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [showProviderDetails, setShowProviderDetails] = useState(false)

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedTown("all")
    setSelectedCountry("all")
  }

  const handleJoinGroup = async (groupId: string) => {
    console.log("Joining group:", groupId)
  }

  const handleLeaveGroup = async (groupId: string) => {
    console.log("Leaving group:", groupId)
  }

  const handleViewGroup = (groupId: string) => {
    console.log("Viewing group:", groupId)
  }

  const handleStartGroupCall = (groupId: string) => {
    console.log("Starting group call:", groupId)
  }

  const handleBookSession = (providerId: string) => {
    console.log("Booking session with:", providerId)
  }

  const handleStartCall = (providerId: string) => {
    console.log("Starting call with:", providerId)
  }

  const handleSendMessage = (providerId: string) => {
    console.log("Sending message to:", providerId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CommLink UI Demo</h1>
          <p className="text-gray-600">Showcasing the new features and components</p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Advanced Search</TabsTrigger>
            <TabsTrigger value="provider">Provider Details</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="management">Group Management</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Search Component</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="provider" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Provider Details Page</CardTitle>
              </CardHeader>
              <CardContent>
                {!showProviderDetails ? (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">Click the button below to view the provider details page</p>
                    <Button onClick={() => setShowProviderDetails(true)}>
                      View Provider Details
                    </Button>
                  </div>
                ) : (
                  <ProviderDetails
                    provider={sampleProvider}
                    onBack={() => setShowProviderDetails(false)}
                    onBookSession={handleBookSession}
                    onStartCall={handleStartCall}
                    onSendMessage={handleSendMessage}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      isMember={false}
                      onJoinGroup={handleJoinGroup}
                      onLeaveGroup={handleLeaveGroup}
                      onViewGroup={handleViewGroup}
                      onStartGroupCall={handleStartGroupCall}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Management (Service Provider View)</CardTitle>
              </CardHeader>
              <CardContent>
                <GroupManagement
                  groups={sampleGroups.filter(group => group.createdBy === "1")}
                  onCreateGroup={(groupData) => {
                    console.log("Creating group:", groupData)
                  }}
                  onEditGroup={(groupId, groupData) => {
                    console.log("Editing group:", groupId, groupData)
                  }}
                  onDeleteGroup={(groupId) => {
                    console.log("Deleting group:", groupId)
                  }}
                  onStartGroupCall={handleStartGroupCall}
                  onViewGroup={handleViewGroup}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 