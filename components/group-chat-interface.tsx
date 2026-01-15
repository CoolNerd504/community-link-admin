"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Flag, 
  Trash2,
  Edit,
  Mic,
  MicOff,
  Hand,
  Crown,
  Shield,
  Star
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Timestamp } from "firebase/firestore"

interface GroupChatMessage {
  id: string
  groupId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  senderRole: "owner" | "admin" | "moderator" | "member" | "panelist"
  message: string
  type: "text" | "image" | "file" | "system" | "hand_raise"
  timestamp: Timestamp
  isRead: boolean
  readBy: string[]
  fileUrl?: string
  fileName?: string
  fileSize?: number
  isModerated: boolean
  moderatedBy?: string
  moderatedAt?: Timestamp
  moderationReason?: string
}

interface GroupChatInterfaceProps {
  groupId: string
  messages: GroupChatMessage[]
  currentUserId: string
  currentUserRole: "owner" | "admin" | "moderator" | "member" | "panelist"
  canModerate: boolean
  isMuted: boolean
  onSendMessage: (message: string, type?: "text" | "image" | "file") => void
  onModerateMessage: (messageId: string, action: "delete" | "warn", reason?: string) => void
  onReportMessage: (messageId: string, reason: string, description: string) => void
  onRaiseHand: () => void
  onLowerHand: () => void
  isHandRaised: boolean
}

export function GroupChatInterface({
  groupId,
  messages,
  currentUserId,
  currentUserRole,
  canModerate,
  isMuted,
  onSendMessage,
  onModerateMessage,
  onReportMessage,
  onRaiseHand,
  onLowerHand,
  isHandRaised,
}: GroupChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportingMessageId, setReportingMessageId] = useState("")
  const [showModerationDialog, setShowModerationDialog] = useState(false)
  const [moderationAction, setModerationAction] = useState<"delete" | "warn">("delete")
  const [moderationReason, setModerationReason] = useState("")
  const [moderatingMessageId, setModeratingMessageId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && !isMuted) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReportMessage = (messageId: string) => {
    setReportingMessageId(messageId)
    setShowReportDialog(true)
  }

  const submitReport = () => {
    if (reportReason && reportDescription) {
      onReportMessage(reportingMessageId, reportReason, reportDescription)
      setShowReportDialog(false)
      setReportReason("")
      setReportDescription("")
      setReportingMessageId("")
    }
  }

  const handleModerateMessage = (messageId: string) => {
    setModeratingMessageId(messageId)
    setShowModerationDialog(true)
  }

  const submitModeration = () => {
    onModerateMessage(moderatingMessageId, moderationAction, moderationReason)
    setShowModerationDialog(false)
    setModerationAction("delete")
    setModerationReason("")
    setModeratingMessageId("")
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-500" />
      case "admin":
        return <Shield className="h-3 w-3 text-blue-500" />
      case "moderator":
        return <Shield className="h-3 w-3 text-green-500" />
      case "panelist":
        return <Star className="h-3 w-3 text-purple-500" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isOwnMessage = (message: GroupChatMessage) => message.senderId === currentUserId

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Group Chat</span>
          <div className="flex items-center gap-2">
            {isMuted && <MicOff className="h-4 w-4 text-red-500" />}
            <Button
              variant={isHandRaised ? "default" : "outline"}
              size="sm"
              onClick={isHandRaised ? onLowerHand : onRaiseHand}
            >
              <Hand className="h-4 w-4 mr-1" />
              {isHandRaised ? "Lower" : "Raise"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage(message) ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                  <AvatarFallback className="text-xs">
                    {message.senderName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 max-w-[70%] ${isOwnMessage(message) ? "text-right" : ""}`}>
                  <div className={`flex items-center gap-2 mb-1 ${isOwnMessage(message) ? "justify-end" : ""}`}>
                    <span className="text-sm font-medium">{message.senderName}</span>
                    {getRoleIcon(message.senderRole)}
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp.toDate())}</span>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "system"
                        ? "bg-gray-100 text-gray-700 text-sm"
                        : message.type === "hand_raise"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : isOwnMessage(message)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    } ${message.isModerated ? "opacity-50" : ""}`}
                  >
                    {message.type === "hand_raise" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Hand className="h-4 w-4" />
                        <span className="font-medium">Raised hand to speak</span>
                      </div>
                    )}
                    
                    {message.type === "system" ? (
                      <span className="italic">{message.message}</span>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.message}</p>
                    )}

                    {message.fileUrl && (
                      <div className="mt-2">
                        <a
                          href={message.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-1"
                        >
                          <Paperclip className="h-3 w-3" />
                          {message.fileName || "Attachment"}
                        </a>
                      </div>
                    )}

                    {message.isModerated && (
                      <div className="mt-2 text-xs text-red-500">
                        Message moderated: {message.moderationReason}
                      </div>
                    )}
                  </div>

                  {/* Message Actions */}
                  <div className={`flex items-center gap-1 mt-1 ${isOwnMessage(message) ? "justify-end" : ""}`}>
                    {!isOwnMessage(message) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReportMessage(message.id)}
                        className="h-6 px-2 text-xs"
                      >
                        <Flag className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {canModerate && !isOwnMessage(message) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleModerateMessage(message.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleModerateMessage(message.id)}>
                            <Flag className="h-4 w-4 mr-2" />
                            Warn User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          {isMuted ? (
            <div className="text-center text-red-500 py-2">
              <MicOff className="h-4 w-4 inline mr-2" />
              You are muted and cannot send messages
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
                disabled={isMuted}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isMuted}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Report Message Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
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

      {/* Moderation Dialog */}
      <Dialog open={showModerationDialog} onOpenChange={setShowModerationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Action</label>
              <Select value={moderationAction} onValueChange={(value: "delete" | "warn") => setModerationAction(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Delete Message</SelectItem>
                  <SelectItem value="warn">Warn User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Reason</label>
              <Textarea
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                placeholder="Reason for moderation..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={submitModeration}>
                {moderationAction === "delete" ? "Delete Message" : "Warn User"}
              </Button>
              <Button variant="outline" onClick={() => setShowModerationDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 