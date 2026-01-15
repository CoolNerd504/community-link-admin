"use client"

import { useState } from "react"
import { 
  Users, 
  Flag, 
  Shield, 
  Ban, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Crown,
  Star,
  MoreVertical,
  Eye,
  MessageSquare,
  Video,
  Settings
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Timestamp } from "firebase/firestore"

interface GroupModerationDashboardProps {
  group: {
    id: string
    name: string
    currentMembers: number
    maxMembers: number
    reportCount: number
    lastModeratedAt?: Timestamp
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
    suspensionEndDate?: Timestamp
    reportCount: number
    lastReportedAt?: Timestamp
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
  reportedMembers: Array<{
    id: string
    groupId: string
    reportedUserId: string
    reportedUserName: string
    reportedBy: string
    reportedByUserName: string
    reason: "inappropriate_behavior" | "spam" | "harassment" | "violence" | "other"
    description: string
    status: "pending" | "reviewed" | "resolved" | "dismissed"
    createdAt: Timestamp
    reviewedAt?: Timestamp
    resolution?: {
      action: "warning" | "suspension" | "ban" | "no_action"
      duration?: number
      reason: string
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
  onApproveHand: (queueItemId: string) => void
  onDenyHand: (queueItemId: string) => void
  onSuspendMember: (memberId: string, duration: number, reason: string) => void
  onBanMember: (memberId: string, reason: string) => void
  onWarnMember: (memberId: string, reason: string) => void
  onMuteMember: (memberId: string, duration: number) => void
  onRemovePanelist: (memberId: string) => void
  onAddPanelist: (memberId: string, role: "host" | "co-host" | "panelist") => void
  onResolveReport: (reportId: string, action: "warning" | "suspension" | "ban" | "no_action", duration?: number, reason?: string) => void
}

export function GroupModerationDashboard({
  group,
  members,
  panelists,
  reportedMembers,
  speakingQueue,
  onApproveHand,
  onDenyHand,
  onSuspendMember,
  onBanMember,
  onWarnMember,
  onMuteMember,
  onRemovePanelist,
  onAddPanelist,
  onResolveReport,
}: GroupModerationDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showModerationDialog, setShowModerationDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [moderationAction, setModerationAction] = useState<"suspend" | "ban" | "warn" | "mute">("warn")
  const [moderationDuration, setModerationDuration] = useState(1)
  const [moderationReason, setModerationReason] = useState("")
  const [reportAction, setReportAction] = useState<"warning" | "suspension" | "ban" | "no_action">("warning")
  const [reportDuration, setReportDuration] = useState(1)
  const [reportResolutionReason, setReportResolutionReason] = useState("")

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleModerateMember = (member: any, action: "suspend" | "ban" | "warn" | "mute") => {
    setSelectedMember(member)
    setModerationAction(action)
    setShowModerationDialog(true)
  }

  const submitModeration = () => {
    if (selectedMember && moderationReason) {
      switch (moderationAction) {
        case "suspend":
          onSuspendMember(selectedMember.id, moderationDuration, moderationReason)
          break
        case "ban":
          onBanMember(selectedMember.id, moderationReason)
          break
        case "warn":
          onWarnMember(selectedMember.id, moderationReason)
          break
        case "mute":
          onMuteMember(selectedMember.id, moderationDuration)
          break
      }
      setShowModerationDialog(false)
      setSelectedMember(null)
      setModerationReason("")
    }
  }

  const handleResolveReport = (report: any) => {
    setSelectedReport(report)
    setShowReportDialog(true)
  }

  const submitReportResolution = () => {
    if (selectedReport && reportResolutionReason) {
      onResolveReport(selectedReport.id, reportAction, reportDuration, reportResolutionReason)
      setShowReportDialog(false)
      setSelectedReport(null)
      setReportResolutionReason("")
    }
  }

  const pendingReports = reportedMembers.filter(r => r.status === "pending")
  const suspendedMembers = members.filter(m => m.isSuspended)
  const bannedMembers = members.filter(m => !m.isActive)

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold">{group.currentMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingReports.length}</p>
              </div>
              <Flag className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-orange-600">{suspendedMembers.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Banned</p>
                <p className="text-2xl font-bold text-red-600">{bannedMembers.length}</p>
              </div>
              <Ban className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="panelists">Panelists</TabsTrigger>
          <TabsTrigger value="queue">Speaking Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Moderation Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportedMembers.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{report.reportedUserName}</p>
                        <p className="text-sm text-gray-600">Reported for {report.reason}</p>
                        <p className="text-xs text-gray-500">{report.createdAt.toDate().toLocaleDateString()}</p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Flag className="h-4 w-4 mr-2" />
                    Review Pending Reports
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Panelists
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Group Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Member Reports ({reportedMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportedMembers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No reports found</p>
                ) : (
                  reportedMembers.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={report.reportedUserName} alt={report.reportedUserName} />
                          <AvatarFallback>
                            {report.reportedUserName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{report.reportedUserName}</p>
                          <p className="text-sm text-gray-600">Reported by {report.reportedByUserName}</p>
                          <p className="text-sm text-gray-500">Reason: {report.reason}</p>
                          <p className="text-xs text-gray-500">{report.createdAt.toDate().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        {report.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleResolveReport(report)}
                          >
                            Review
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

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.userAvatar} alt={member.userName} />
                        <AvatarFallback>
                          {member.userName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.userName}</p>
                          {getRoleIcon(member.role)}
                          {member.isPanelist && <Badge variant="outline">Panelist</Badge>}
                          {member.isSuspended && <Badge variant="destructive">Suspended</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">Joined {member.joinedAt.toDate().toLocaleDateString()}</p>
                        {member.reportCount > 0 && (
                          <p className="text-sm text-red-500">{member.reportCount} reports</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleModerateMember(member, "warn")}>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Warn
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleModerateMember(member, "mute")}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Mute
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleModerateMember(member, "suspend")}>
                            <Clock className="h-4 w-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleModerateMember(member, "ban")}>
                            <Ban className="h-4 w-4 mr-2" />
                            Ban
                          </DropdownMenuItem>
                          {member.isPanelist && (
                            <DropdownMenuItem onClick={() => onRemovePanelist(member.id)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Remove Panelist
                            </DropdownMenuItem>
                          )}
                          {!member.isPanelist && (
                            <DropdownMenuItem onClick={() => onAddPanelist(member.id, "panelist")}>
                              <Star className="h-4 w-4 mr-2" />
                              Make Panelist
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              <CardTitle>Panelists ({panelists.length}/{group.maxMembers})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {panelists.map((panelist) => (
                  <div key={panelist.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={panelist.userAvatar} alt={panelist.userName} />
                        <AvatarFallback>
                          {panelist.userName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{panelist.userName}</p>
                          <Badge variant="outline">{panelist.role}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {Object.entries(panelist.permissions)
                            .filter(([_, hasPermission]) => hasPermission)
                            .map(([permission]) => permission.replace(/([A-Z])/g, ' $1').toLowerCase())
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onAddPanelist(panelist.userId, "co-host")}>
                          <Crown className="h-4 w-4 mr-2" />
                          Make Co-Host
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRemovePanelist(panelist.userId)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Remove Panelist
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Speaking Queue ({speakingQueue.filter(q => q.status === "waiting").length} waiting)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {speakingQueue.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hands raised</p>
                ) : (
                  speakingQueue.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{item.userName}</p>
                          <p className="text-sm text-gray-500">
                            Raised {item.raisedAt.toDate().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.status === "waiting" ? "secondary" : "default"}>
                          {item.status}
                        </Badge>
                        {item.status === "waiting" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => onApproveHand(item.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDenyHand(item.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                          </>
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

      {/* Moderation Dialog */}
      <Dialog open={showModerationDialog} onOpenChange={setShowModerationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {moderationAction === "suspend" ? "Suspend Member" :
               moderationAction === "ban" ? "Ban Member" :
               moderationAction === "warn" ? "Warn Member" :
               "Mute Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMember && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedMember.userAvatar} alt={selectedMember.userName} />
                  <AvatarFallback>
                    {selectedMember.userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedMember.userName}</p>
                  <p className="text-sm text-gray-600">{selectedMember.reportCount} reports</p>
                </div>
              </div>
            )}
            
            {(moderationAction === "suspend" || moderationAction === "mute") && (
              <div>
                <label className="text-sm font-medium">Duration (days)</label>
                <Select value={moderationDuration.toString()} onValueChange={(value) => setModerationDuration(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Reason</label>
              <Textarea
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                placeholder="Reason for this action..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={submitModeration}>
                {moderationAction === "suspend" ? "Suspend" :
                 moderationAction === "ban" ? "Ban" :
                 moderationAction === "warn" ? "Warn" :
                 "Mute"}
              </Button>
              <Button variant="outline" onClick={() => setShowModerationDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Resolution Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReport && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Report against {selectedReport.reportedUserName}</p>
                  <p className="text-sm text-gray-600">Reason: {selectedReport.reason}</p>
                  <p className="text-sm text-gray-600">Description: {selectedReport.description}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Action</label>
                  <Select value={reportAction} onValueChange={(value: any) => setReportAction(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_action">No Action</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="suspension">Suspension</SelectItem>
                      <SelectItem value="ban">Ban</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(reportAction === "suspension") && (
                  <div>
                    <label className="text-sm font-medium">Duration (days)</label>
                    <Select value={reportDuration.toString()} onValueChange={(value) => setReportDuration(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">1 week</SelectItem>
                        <SelectItem value="30">1 month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Resolution Notes</label>
                  <Textarea
                    value={reportResolutionReason}
                    onChange={(e) => setReportResolutionReason(e.target.value)}
                    placeholder="Notes about this resolution..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={submitReportResolution}>
                Resolve Report
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