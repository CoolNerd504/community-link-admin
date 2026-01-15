"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Video, 
  MessageCircle, 
  Lock, 
  Globe,
  UserPlus,
  UserMinus,
  ArrowLeft,
  Settings,
  Flag,
  LogOut,
  Hand,
  Mic,
  MicOff,
  Crown,
  Shield,
  Star,
  CheckCircle,
  X
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { Timestamp } from "firebase/firestore"

interface GroupDetailsPageProps {
  group: {
    id: string
    name: string
    description: string
    createdBy: string
    category: string
    privacy: "public" | "private" | "invite_only"
    maxMembers: number
    currentMembers: number
    location: {
      town: string
      country: string
    }
    tags: string[]
    rules: string[]
    guidelines: string[]
    isActive: boolean
    lastActivityAt: Timestamp
    coverImage?: string
    groupImage?: string
    settings: {
      allowMemberChat: boolean
      requireApprovalToJoin: boolean
      allowRaiseHand: boolean
      panelistMode: boolean
      autoModeration: boolean
      maxPanelists: number
    }
    reportCount?: number
  }
  members: Array<{
    id: string
    userId: string
    userName: string
    userAvatar?: string
    role: "owner" | "admin" | "moderator" | "member" | "panelist"
    joinedAt: Timestamp
    isPanelist: boolean
    canSpeak: boolean
    isMuted: boolean
    isSuspended: boolean
    reportCount: number
  }>
  panelists: Array<{
    id: string
    userId: string
    userName: string
    userAvatar?: string
    role: "host" | "co-host" | "panelist"
    permissions: {
      canModerate: boolean
      canApproveHands: boolean
      canRemoveMembers: boolean
      canManagePanelists: boolean
    }
  }>
  speakingQueue: Array<{
    id: string
    userId: string
    userName: string
    raisedAt: Timestamp
    status: "waiting" | "approved" | "speaking" | "completed" | "cancelled"
    priority: number
  }>
  isMember: boolean
  currentUserRole: "owner" | "admin" | "moderator" | "member" | "panelist"
  onBack: () => void
  onJoinGroup: (groupId: string) => void
  onLeaveGroup: (groupId: string) => void
  onStartGroupCall: (groupId: string) => void
  onRaiseHand: (groupId: string) => void
  onLowerHand: (groupId: string) => void
  onReportMember: (groupId: string, memberId: string, reason: string, description: string) => void
  onApproveHand?: (queueItemId: string) => void
  onDenyHand?: (queueItemId: string) => void
  onStartSpeaking?: (queueItemId: string) => void
  onEndSpeaking?: (queueItemId: string) => void
}

export function GroupDetailsPage({
  group,
  members,
  panelists,
  speakingQueue,
  isMember,
  currentUserRole,
  onBack,
  onJoinGroup,
  onLeaveGroup,
  onStartGroupCall,
  onRaiseHand,
  onLowerHand,
  onReportMember,
  onApproveHand,
  onDenyHand,
  onStartSpeaking,
  onEndSpeaking,
}: GroupDetailsPageProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportingMemberId, setReportingMemberId] = useState("")
  const [isHandRaised, setIsHandRaised] = useState(false)
  
  // Check if current user is in the speaking queue
  const currentUserInQueue = speakingQueue.some(item => item.userId === "current-user-id")
  
  // Update hand raised state based on queue
  useEffect(() => {
    setIsHandRaised(currentUserInQueue)
  }, [currentUserInQueue])

  const getPrivacyIcon = () => {
    switch (group.privacy) {
      case "public":
        return <Globe className="h-4 w-4 text-green-600" />
      case "private":
        return <Lock className="h-4 w-4 text-red-600" />
      case "invite_only":
        return <UserPlus className="h-4 w-4 text-orange-600" />
      default:
        return <Globe className="h-4 w-4 text-gray-600" />
    }
  }

  const getPrivacyLabel = () => {
    switch (group.privacy) {
      case "public":
        return "Public"
      case "private":
        return "Private"
      case "invite_only":
        return "Invite Only"
      default:
        return "Public"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "moderator":
        return <Shield className="h-4 w-4 text-green-500" />
      case "panelist":
        return <Star className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const handleRaiseHand = () => {
    if (!isHandRaised) {
      onRaiseHand(group.id)
      setIsHandRaised(true)
    } else {
      onLowerHand(group.id)
      setIsHandRaised(false)
    }
  }

  const handleReportMember = (memberId: string) => {
    setReportingMemberId(memberId)
    setShowReportDialog(true)
  }

  const submitReport = () => {
    if (reportReason && reportDescription) {
      onReportMember(group.id, reportingMemberId, reportReason, reportDescription)
      setShowReportDialog(false)
      setReportReason("")
      setReportDescription("")
      setReportingMemberId("")
    }
  }

  const handleApproveHand = (queueItemId: string) => {
    onApproveHand?.(queueItemId)
  }

  const handleDenyHand = (queueItemId: string) => {
    onDenyHand?.(queueItemId)
  }

  const handleStartSpeaking = (queueItemId: string) => {
    onStartSpeaking?.(queueItemId)
  }

  const handleEndSpeaking = (queueItemId: string) => {
    onEndSpeaking?.(queueItemId)
  }

  const canModerate = currentUserRole === "owner" || currentUserRole === "admin" || currentUserRole === "moderator"

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1" />
        {isMember && (
          <Button 
            variant="outline" 
            onClick={() => setShowLeaveDialog(true)}
            className="text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave Group
          </Button>
        )}
      </div>

      {/* Group Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Group Info */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={group.groupImage} alt={group.name} />
                <AvatarFallback className="text-lg">
                  {group.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{group.name}</h1>
                  {getPrivacyIcon()}
                  <Badge variant="outline">{getPrivacyLabel()}</Badge>
                  {canModerate && (
                    <Badge variant="default" className="bg-purple-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mb-2">{group.category}</p>
                
                <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {group.location.town}, {group.location.country}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.currentMembers}/{group.maxMembers} members
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{group.currentMembers}</div>
                  <div className="text-sm text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{panelists.length}</div>
                  <div className="text-sm text-gray-500">Panelists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{speakingQueue.filter(q => q.status === "waiting").length}</div>
                  <div className="text-sm text-gray-500">Hands Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{group.reportCount || 0}</div>
                  <div className="text-sm text-gray-500">Reports</div>
                </div>
              </div>

              <div className="text-gray-700">{group.description}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {!isMember ? (
                <Button 
                  onClick={() => onJoinGroup(group.id)}
                  className="w-full"
                  size="lg"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => onStartGroupCall(group.id)}
                    className="w-full"
                    size="lg"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Call
                  </Button>
                  
                  {group.settings.allowRaiseHand && (
                    <Button
                      variant={isHandRaised ? "default" : "outline"}
                      onClick={handleRaiseHand}
                      className="w-full"
                    >
                      <Hand className="h-4 w-4 mr-2" />
                      {isHandRaised ? "Lower Hand" : "Raise Hand"}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="panelists">Panelists</TabsTrigger>
          <TabsTrigger value="queue">Speaking Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Group Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Group Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">{rule}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.guidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">{guideline}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.userAvatar} alt={member.userName} />
                        <AvatarFallback>
                          {member.userName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.userName}</span>
                          {getRoleIcon(member.role)}
                          {member.isPanelist && <Badge variant="outline">Panelist</Badge>}
                          {member.isSuspended && <Badge variant="destructive">Suspended</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Joined {member.joinedAt.toDate().toLocaleDateString()}</span>
                          {member.reportCount > 0 && (
                            <span className="text-red-500">{member.reportCount} reports</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.isMuted && <MicOff className="h-4 w-4 text-red-500" />}
                      {member.canSpeak && <Mic className="h-4 w-4 text-green-500" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReportMember(member.id)}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="panelists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Panelists ({panelists.length}/{group.settings.maxPanelists})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {panelists.map((panelist) => (
                  <div key={panelist.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={panelist.userAvatar} alt={panelist.userName} />
                        <AvatarFallback>
                          {panelist.userName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{panelist.userName}</span>
                          <Badge variant="outline">{panelist.role}</Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {Object.entries(panelist.permissions)
                            .filter(([_, hasPermission]) => hasPermission)
                            .map(([permission]) => permission.replace(/([A-Z])/g, ' $1').toLowerCase())
                            .join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Speaking Queue ({speakingQueue.filter(q => q.status === "waiting").length} waiting)</span>
                {canModerate && speakingQueue.filter(q => q.status === "waiting").length > 0 && (
                  <Badge variant="outline" className="text-orange-600">
                    {speakingQueue.filter(q => q.status === "waiting").length} Pending Approval
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {speakingQueue.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hands raised</p>
                ) : (
                  speakingQueue.map((item, index) => (
                    <div key={item.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                      item.userId === "current-user-id" ? "bg-blue-50 border-blue-200" : ""
                    } ${item.status === "speaking" ? "bg-green-50 border-green-200" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          item.status === "speaking" ? "bg-green-100 text-green-700" : "bg-blue-100"
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.userName}</span>
                            <Badge variant={
                              item.status === "waiting" ? "secondary" : 
                              item.status === "approved" ? "default" :
                              item.status === "speaking" ? "default" :
                              "outline"
                            }>
                              {item.status === "speaking" ? "Currently Speaking" : item.status}
                            </Badge>
                            {item.userId === "current-user-id" && (
                              <Badge variant="outline" className="text-blue-600">You</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Raised {item.raisedAt.toDate().toLocaleTimeString()}
                            {item.status === "speaking" && (
                              <span className="ml-2 text-green-600">• Speaking now</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {canModerate && item.status === "waiting" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApproveHand(item.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDenyHand(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {canModerate && item.status === "approved" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStartSpeaking(item.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Mic className="h-4 w-4" />
                          </Button>
                        )}
                        {canModerate && item.status === "speaking" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEndSpeaking(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <MicOff className="h-4 w-4" />
                          </Button>
                        )}
                        {!canModerate && item.status === "waiting" && (
                          <Button variant="outline" size="sm">
                            <Hand className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Leave Group Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to leave "{group.name}"? You can rejoin later if the group is public.</p>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={() => {
                  onLeaveGroup(group.id)
                  setShowLeaveDialog(false)
                }}
              >
                Leave Group
              </Button>
              <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Member Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="violence">Violence</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please describe the issue..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={submitReport}>
                Submit Report
              </Button>
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 