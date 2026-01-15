"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupDetailsPage } from "@/components/group-details-page"
import { GroupChatInterface } from "@/components/group-chat-interface"
import { GroupModerationDashboard } from "@/components/group-moderation-dashboard"
import { SpeakingQueueManagement } from "@/components/speaking-queue-management"

// Sample data for the demo
const sampleGroup = {
  id: "demo-group-1",
  name: "Life Coaching Community",
  description: "A supportive community for personal development and life coaching discussions.",
  createdBy: "provider-1",
  category: "Life Coaching",
  privacy: "public" as const,
  maxMembers: 50,
  currentMembers: 23,
  location: {
    town: "San Francisco",
    country: "United States",
  },
  tags: ["personal development", "coaching", "wellness"],
  rules: [
    "Be respectful and supportive of all members",
    "No spam or self-promotion without permission",
    "Keep discussions relevant to life coaching topics",
    "Respect privacy and confidentiality"
  ],
  guidelines: [
    "Share your experiences to help others",
    "Ask questions to learn from the community",
    "Support fellow members in their journey",
    "Provide constructive feedback when appropriate"
  ],
  isActive: true,
  lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  coverImage: "/placeholder.jpg",
  groupImage: "/placeholder-user.jpg",
  settings: {
    allowMemberChat: true,
    requireApprovalToJoin: false,
    allowRaiseHand: true,
    panelistMode: true,
    autoModeration: true,
    maxPanelists: 5,
  },
  reportCount: 2,
}

const sampleMembers = [
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
  {
    id: "member-5",
    userId: "user-5",
    userName: "David Brown",
    userAvatar: "/placeholder-user.jpg",
    role: "member" as const,
    joinedAt: new Date("2024-01-15"),
    isPanelist: false,
    canSpeak: false,
    isMuted: false,
    isSuspended: true,
    reportCount: 3,
  },
]

const samplePanelists = [
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
]

const sampleSpeakingQueue = [
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
  {
    id: "queue-3",
    userId: "user-7",
    userName: "Alex Thompson",
    raisedAt: new Date(Date.now() - 10 * 60 * 1000),
    status: "speaking" as const,
    priority: 3,
  },
]

const sampleReportedMembers = [
  {
    id: "report-1",
    groupId: "demo-group-1",
    reportedUserId: "user-5",
    reportedUserName: "David Brown",
    reportedBy: "user-3",
    reportedByUserName: "Mike Johnson",
    reason: "inappropriate_behavior" as const,
    description: "User was being disruptive during group discussions",
    status: "pending" as const,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "report-2",
    groupId: "demo-group-1",
    reportedUserId: "user-8",
    reportedUserName: "Lisa Chen",
    reportedBy: "user-2",
    reportedByUserName: "Jane Smith",
    reason: "spam" as const,
    description: "User was posting promotional content repeatedly",
    status: "resolved" as const,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    reviewedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    resolution: {
      action: "warning" as const,
      reason: "User was warned about spam policy",
    },
  },
]

const sampleChatMessages = [
  {
    id: "msg-1",
    groupId: "demo-group-1",
    senderId: "user-1",
    senderName: "John Doe",
    senderRole: "owner" as const,
    message: "Welcome everyone to today's session!",
    type: "text" as const,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true,
    readBy: ["user-2", "user-3", "user-4"],
    isModerated: false,
  },
  {
    id: "msg-2",
    groupId: "demo-group-1",
    senderId: "user-2",
    senderName: "Jane Smith",
    senderRole: "admin" as const,
    message: "Thanks John! I'm excited to discuss goal setting today.",
    type: "text" as const,
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    isRead: true,
    readBy: ["user-1", "user-3"],
    isModerated: false,
  },
  {
    id: "msg-3",
    groupId: "demo-group-1",
    senderId: "user-3",
    senderName: "Mike Johnson",
    senderRole: "member" as const,
    message: "I have a question about setting realistic goals...",
    type: "text" as const,
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    isRead: true,
    readBy: ["user-1", "user-2"],
    isModerated: false,
  },
]

export default function EnhancedGroupDemo() {
  const [activeTab, setActiveTab] = useState("details")
  const [currentUserRole, setCurrentUserRole] = useState<"owner" | "admin" | "moderator" | "member" | "panelist">("member")
  const [isMember, setIsMember] = useState(true)

  const handleBack = () => {
    console.log("Back to main app")
  }

  const handleJoinGroup = (groupId: string) => {
    setIsMember(true)
    console.log("Joined group:", groupId)
  }

  const handleLeaveGroup = (groupId: string) => {
    setIsMember(false)
    console.log("Left group:", groupId)
  }

  const handleStartGroupCall = (groupId: string) => {
    console.log("Starting group call:", groupId)
  }

  const handleRaiseHand = (groupId: string) => {
    console.log("Raised hand in group:", groupId)
  }

  const handleLowerHand = (groupId: string) => {
    console.log("Lowered hand in group:", groupId)
  }

  const handleReportMember = (groupId: string, memberId: string, reason: string, description: string) => {
    console.log("Reported member:", memberId, "Reason:", reason, "Description:", description)
  }

  const handleApproveHand = (queueItemId: string) => {
    console.log("Approved hand:", queueItemId)
  }

  const handleDenyHand = (queueItemId: string) => {
    console.log("Denied hand:", queueItemId)
  }

  const handleStartSpeaking = (queueItemId: string) => {
    console.log("Started speaking:", queueItemId)
  }

  const handleEndSpeaking = (queueItemId: string) => {
    console.log("Ended speaking:", queueItemId)
  }

  const handleSuspendMember = (memberId: string, duration: number, reason: string) => {
    console.log("Suspended member:", memberId, "Duration:", duration, "Reason:", reason)
  }

  const handleBanMember = (memberId: string, reason: string) => {
    console.log("Banned member:", memberId, "Reason:", reason)
  }

  const handleWarnMember = (memberId: string, reason: string) => {
    console.log("Warned member:", memberId, "Reason:", reason)
  }

  const handleMuteMember = (memberId: string, duration: number) => {
    console.log("Muted member:", memberId, "Duration:", duration)
  }

  const handleAddPanelist = (memberId: string, role: "host" | "co-host" | "panelist") => {
    console.log("Added panelist:", memberId, "Role:", role)
  }

  const handleRemovePanelist = (memberId: string) => {
    console.log("Removed panelist:", memberId)
  }

  const handleResolveReport = (reportId: string, action: "warning" | "suspension" | "ban" | "no_action", duration?: number, reason?: string) => {
    console.log("Resolved report:", reportId, "Action:", action, "Duration:", duration, "Reason:", reason)
  }

  const handleSendGroupMessage = (message: string, type: "text" | "image" | "file" = "text") => {
    console.log("Sent message:", message, "Type:", type)
  }

  const handleModerateMessage = (messageId: string, action: "delete" | "warn", reason?: string) => {
    console.log("Moderated message:", messageId, "Action:", action, "Reason:", reason)
  }

  const handleReportMessage = (messageId: string, reason: string, description: string) => {
    console.log("Reported message:", messageId, "Reason:", reason, "Description:", description)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Group Features Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleBack}>
                Back to App
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Role:</span>
                <select
                  value={currentUserRole}
                  onChange={(e) => setCurrentUserRole(e.target.value as any)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="member">Member</option>
                  <option value="panelist">Panelist</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Group Details</TabsTrigger>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="queue">Speaking Queue</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Group Details Page (Individual User View)</CardTitle>
              </CardHeader>
              <CardContent>
                <GroupDetailsPage
                  group={sampleGroup}
                  members={sampleMembers}
                  panelists={samplePanelists}
                  speakingQueue={sampleSpeakingQueue}
                  isMember={isMember}
                  currentUserRole={currentUserRole}
                  onBack={handleBack}
                  onJoinGroup={handleJoinGroup}
                  onLeaveGroup={handleLeaveGroup}
                  onStartGroupCall={handleStartGroupCall}
                  onRaiseHand={handleRaiseHand}
                  onLowerHand={handleLowerHand}
                  onReportMember={handleReportMember}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Live Chat Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <GroupChatInterface
                  groupId={sampleGroup.id}
                  messages={sampleChatMessages}
                  currentUserId="current-user-id"
                  currentUserRole={currentUserRole}
                  canModerate={currentUserRole === "owner" || currentUserRole === "admin" || currentUserRole === "moderator"}
                  isMuted={false}
                  onSendMessage={handleSendGroupMessage}
                  onModerateMessage={handleModerateMessage}
                  onReportMessage={handleReportMessage}
                  onRaiseHand={handleRaiseHand}
                  onLowerHand={handleLowerHand}
                  isHandRaised={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <Card>
              <CardHeader>
                <CardTitle>Group Moderation Dashboard (Provider View)</CardTitle>
              </CardHeader>
              <CardContent>
                <GroupModerationDashboard
                  group={sampleGroup}
                  members={sampleMembers}
                  panelists={samplePanelists}
                  reportedMembers={sampleReportedMembers}
                  speakingQueue={sampleSpeakingQueue}
                  onApproveHand={handleApproveHand}
                  onDenyHand={handleDenyHand}
                  onStartSpeaking={handleStartSpeaking}
                  onEndSpeaking={handleEndSpeaking}
                  onSuspendMember={handleSuspendMember}
                  onBanMember={handleBanMember}
                  onWarnMember={handleWarnMember}
                  onMuteMember={handleMuteMember}
                  onAddPanelist={handleAddPanelist}
                  onRemovePanelist={handleRemovePanelist}
                  onResolveReport={handleResolveReport}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queue">
            <Card>
              <CardHeader>
                <CardTitle>Speaking Queue Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SpeakingQueueManagement
                  queueItems={sampleSpeakingQueue}
                  currentSpeaker={sampleSpeakingQueue.find(q => q.status === "speaking") || undefined}
                  canModerate={currentUserRole === "owner" || currentUserRole === "admin" || currentUserRole === "moderator"}
                  isPanelist={currentUserRole === "panelist" || currentUserRole === "admin" || currentUserRole === "owner"}
                  onApproveHand={handleApproveHand}
                  onDenyHand={handleDenyHand}
                  onStartSpeaking={handleStartSpeaking}
                  onEndSpeaking={handleEndSpeaking}
                  onMoveUp={() => {}}
                  onMoveDown={() => {}}
                  onRemoveFromQueue={() => {}}
                  onSetSpeakingTime={() => {}}
                  onAddNote={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 