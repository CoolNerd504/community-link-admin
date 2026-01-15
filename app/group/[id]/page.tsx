"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { GroupDetailsPage } from "@/components/group-details-page"
import { sampleGroups } from "@/lib/sample-data"
// import { Timestamp } from "firebase/firestore" 

export default function GroupDetailsPageRoute() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  // State for group data
  const [group, setGroup] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [panelists, setPanelists] = useState<any[]>([])
  const [speakingQueue, setSpeakingQueue] = useState<any[]>([])
  const [reportedMembers, setReportedMembers] = useState<any[]>([])
  const [currentUserRole, setCurrentUserRole] = useState<"owner" | "admin" | "moderator" | "member" | "panelist">("member")
  const [isMember, setIsMember] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading group data
    const loadGroupData = async () => {
      setIsLoading(true)

      // Find the group
      const foundGroup = sampleGroups.find(g => g.id === groupId)
      if (!foundGroup) {
        router.push('/') // Redirect if group not found
        return
      }

      setGroup(foundGroup)

      // Initialize sample data for the group
      setMembers([
        {
          id: "member-1",
          userId: "user-1",
          userName: "John Doe",
          userAvatar: "/placeholder-user.jpg",
          role: "owner" as const,
          joinedAt: new Date("2024-01-01"),
          isPanelist: true,
          canSpeak: true,
          isMuted: false,
          isSuspended: false,
          reportCount: 0,
        },
        {
          id: "member-2",
          userId: "user-2",
          userName: "Jane Smith",
          userAvatar: "/placeholder-user.jpg",
          role: "admin" as const,
          joinedAt: new Date("2024-01-05"),
          isPanelist: true,
          canSpeak: true,
          isMuted: false,
          isSuspended: false,
          reportCount: 0,
        },
        {
          id: "member-3",
          userId: "user-3",
          userName: "Mike Johnson",
          userAvatar: "/placeholder-user.jpg",
          role: "member" as const,
          joinedAt: new Date("2024-01-10"),
          isPanelist: false,
          canSpeak: false,
          isMuted: false,
          isSuspended: false,
          reportCount: 2,
        },
        {
          id: "member-4",
          userId: "user-4",
          userName: "Sarah Wilson",
          userAvatar: "/placeholder-user.jpg",
          role: "member" as const,
          joinedAt: new Date("2024-01-12"),
          isPanelist: false,
          canSpeak: false,
          isMuted: true,
          isSuspended: false,
          reportCount: 0,
        },
      ])

      setPanelists([
        {
          id: "panelist-1",
          userId: "user-1",
          userName: "John Doe",
          userAvatar: "/placeholder-user.jpg",
          role: "host" as const,
          permissions: {
            canModerate: true,
            canApproveHands: true,
            canRemoveMembers: true,
            canManagePanelists: true,
          },
        },
        {
          id: "panelist-2",
          userId: "user-2",
          userName: "Jane Smith",
          userAvatar: "/placeholder-user.jpg",
          role: "co-host" as const,
          permissions: {
            canModerate: true,
            canApproveHands: true,
            canRemoveMembers: false,
            canManagePanelists: false,
          },
        },
      ])

      setSpeakingQueue([
        {
          id: "queue-1",
          userId: "user-3",
          userName: "Mike Johnson",
          raisedAt: new Date(Date.now() - 5 * 60 * 1000),
          status: "waiting" as const,
          priority: 1,
        },
        {
          id: "queue-2",
          userId: "user-6",
          userName: "Emily Davis",
          raisedAt: new Date(Date.now() - 3 * 60 * 1000),
          status: "approved" as const,
          priority: 2,
        },
      ])

      setReportedMembers([
        {
          id: "report-1",
          groupId: groupId,
          reportedUserId: "user-5",
          reportedUserName: "David Brown",
          reportedBy: "user-3",
          reportedByUserName: "Mike Johnson",
          reason: "inappropriate_behavior" as const,
          description: "User was being disruptive during group discussions",
          status: "pending" as const,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ])

      // Check if current user is a member (mock logic)
      setIsMember(Math.random() > 0.5) // Random for demo

      // Set current user role based on group ownership
      // In a real app, this would check if the current user created the group
      const isGroupOwner = foundGroup.createdBy === "1" // Mock: assume user "1" is the owner
      setCurrentUserRole(isGroupOwner ? "owner" : "member")

      setIsLoading(false)
    }

    loadGroupData()
  }, [groupId, router])

  // Event handlers
  const handleBack = () => {
    router.push('/')
  }

  const handleJoinGroup = async (groupId: string) => {
    setIsMember(true)
    console.log("Joined group:", groupId)
  }

  const handleLeaveGroup = async (groupId: string) => {
    setIsMember(false)
    console.log("Left group:", groupId)
  }

  const handleStartGroupCall = (groupId: string) => {
    console.log("Starting group call:", groupId)
    // In a real app, this would navigate to the group call page
  }

  const handleRaiseHand = (groupId: string) => {
    const newQueueItem = {
      id: Date.now().toString(),
      userId: "current-user-id",
      userName: "Current User",
      raisedAt: new Date(),
      status: "waiting" as const,
      priority: speakingQueue.length + 1,
    }
    setSpeakingQueue(prev => [...prev, newQueueItem])
  }

  const handleLowerHand = (groupId: string) => {
    setSpeakingQueue(prev => prev.filter(item => item.userId !== "current-user-id"))
  }

  const handleReportMember = (groupId: string, memberId: string, reason: string, description: string) => {
    const newReport = {
      id: Date.now().toString(),
      groupId,
      reportedUserId: memberId,
      reportedUserName: "Reported User",
      reportedBy: "current-user-id",
      reportedByUserName: "Current User",
      reason: reason as any,
      description,
      status: "pending" as const,
      createdAt: new Date(),
    }
    setReportedMembers(prev => [...prev, newReport])
  }

  const handleApproveHand = (queueItemId: string) => {
    setSpeakingQueue(prev =>
      prev.map(item =>
        item.id === queueItemId
          ? { ...item, status: "approved" as const }
          : item
      )
    )
  }

  const handleDenyHand = (queueItemId: string) => {
    setSpeakingQueue(prev =>
      prev.map(item =>
        item.id === queueItemId
          ? { ...item, status: "cancelled" as const }
          : item
      )
    )
  }

  const handleStartSpeaking = (queueItemId: string) => {
    const item = speakingQueue.find(q => q.id === queueItemId)
    if (item) {
      setSpeakingQueue(prev =>
        prev.map(q =>
          q.id === queueItemId
            ? { ...q, status: "speaking" as const }
            : q
        )
      )
    }
  }

  const handleEndSpeaking = (queueItemId: string) => {
    setSpeakingQueue(prev =>
      prev.map(q =>
        q.id === queueItemId
          ? { ...q, status: "completed" as const }
          : q
      )
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading group details...</p>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Group Not Found</h1>
          <p className="text-gray-600 mb-4">The group you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GroupDetailsPage
        group={group}
        members={members}
        panelists={panelists}
        speakingQueue={speakingQueue}
        isMember={isMember}
        currentUserRole={currentUserRole}
        onBack={handleBack}
        onJoinGroup={handleJoinGroup}
        onLeaveGroup={handleLeaveGroup}
        onStartGroupCall={handleStartGroupCall}
        onRaiseHand={handleRaiseHand}
        onLowerHand={handleLowerHand}
        onReportMember={handleReportMember}
        onApproveHand={handleApproveHand}
        onDenyHand={handleDenyHand}
        onStartSpeaking={handleStartSpeaking}
        onEndSpeaking={handleEndSpeaking}
      />
    </div>
  )
} 