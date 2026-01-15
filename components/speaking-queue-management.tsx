"use client"

import { useState } from "react"
import { 
  Hand, 
  Mic, 
  MicOff, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUp, 
  ArrowDown,
  Crown,
  Star,
  MoreVertical,
  Timer
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Timestamp } from "firebase/firestore"

interface SpeakingQueueItem {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  userRole: "owner" | "admin" | "moderator" | "member" | "panelist"
  raisedAt: Timestamp
  status: "waiting" | "approved" | "speaking" | "completed" | "cancelled"
  priority: number
  speakingTime?: number
  maxSpeakingTime: number
  notes?: string
}

interface SpeakingQueueManagementProps {
  queueItems: SpeakingQueueItem[]
  currentSpeaker?: SpeakingQueueItem
  canModerate: boolean
  isPanelist: boolean
  onApproveHand: (itemId: string) => void
  onDenyHand: (itemId: string) => void
  onStartSpeaking: (itemId: string) => void
  onEndSpeaking: (itemId: string) => void
  onMoveUp: (itemId: string) => void
  onMoveDown: (itemId: string) => void
  onRemoveFromQueue: (itemId: string) => void
  onSetSpeakingTime: (itemId: string, time: number) => void
  onAddNote: (itemId: string, note: string) => void
}

export function SpeakingQueueManagement({
  queueItems,
  currentSpeaker,
  canModerate,
  isPanelist,
  onApproveHand,
  onDenyHand,
  onStartSpeaking,
  onEndSpeaking,
  onMoveUp,
  onMoveDown,
  onRemoveFromQueue,
  onSetSpeakingTime,
  onAddNote,
}: SpeakingQueueManagementProps) {
  const [showTimeDialog, setShowTimeDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SpeakingQueueItem | null>(null)
  const [speakingTime, setSpeakingTime] = useState(5)
  const [note, setNote] = useState("")

  const waitingItems = queueItems.filter(item => item.status === "waiting")
  const approvedItems = queueItems.filter(item => item.status === "approved")
  const completedItems = queueItems.filter(item => item.status === "completed")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return <Hand className="h-4 w-4 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "speaking":
        return <Mic className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Hand className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "speaking":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-500" />
      case "admin":
        return <Star className="h-3 w-3 text-blue-500" />
      case "moderator":
        return <Star className="h-3 w-3 text-green-500" />
      case "panelist":
        return <Star className="h-3 w-3 text-purple-500" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSetTime = (item: SpeakingQueueItem) => {
    setSelectedItem(item)
    setSpeakingTime(item.maxSpeakingTime)
    setShowTimeDialog(true)
  }

  const submitTime = () => {
    if (selectedItem) {
      onSetSpeakingTime(selectedItem.id, speakingTime)
      setShowTimeDialog(false)
      setSelectedItem(null)
    }
  }

  const handleAddNote = (item: SpeakingQueueItem) => {
    setSelectedItem(item)
    setNote(item.notes || "")
    setShowNoteDialog(true)
  }

  const submitNote = () => {
    if (selectedItem) {
      onAddNote(selectedItem.id, note)
      setShowNoteDialog(false)
      setSelectedItem(null)
      setNote("")
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Speaker */}
      {currentSpeaker && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-blue-600" />
              Currently Speaking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentSpeaker.userAvatar} alt={currentSpeaker.userName} />
                  <AvatarFallback>
                    {currentSpeaker.userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{currentSpeaker.userName}</p>
                    {getRoleIcon(currentSpeaker.userRole)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Started at {formatTime(currentSpeaker.raisedAt.toDate())}
                  </p>
                  {currentSpeaker.speakingTime && (
                    <p className="text-sm text-blue-600">
                      Time: {formatDuration(currentSpeaker.speakingTime)} / {formatDuration(currentSpeaker.maxSpeakingTime)}
                    </p>
                  )}
                </div>
              </div>
              {canModerate && (
                <Button
                  variant="outline"
                  onClick={() => onEndSpeaking(currentSpeaker.id)}
                >
                  End Speaking
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waiting Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5" />
            Waiting to Speak ({waitingItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {waitingItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hands raised</p>
            ) : (
              waitingItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.userAvatar} alt={item.userName} />
                      <AvatarFallback>
                        {item.userName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.userName}</p>
                        {getRoleIcon(item.userRole)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Raised {formatTime(item.raisedAt.toDate())}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canModerate && (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {canModerate && (
                          <>
                            <DropdownMenuItem onClick={() => onMoveUp(item.id)}>
                              <ArrowUp className="h-4 w-4 mr-2" />
                              Move Up
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onMoveDown(item.id)}>
                              <ArrowDown className="h-4 w-4 mr-2" />
                              Move Down
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSetTime(item)}>
                              <Timer className="h-4 w-4 mr-2" />
                              Set Time Limit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRemoveFromQueue(item.id)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => handleAddNote(item)}>
                          <MoreVertical className="h-4 w-4 mr-2" />
                          Add Note
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approved Queue */}
      {approvedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Approved ({approvedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {approvedItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.userAvatar} alt={item.userName} />
                      <AvatarFallback>
                        {item.userName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.userName}</p>
                        {getRoleIcon(item.userRole)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Approved at {formatTime(item.raisedAt.toDate())}
                      </p>
                      {item.maxSpeakingTime && (
                        <p className="text-sm text-green-600">
                          Time limit: {formatDuration(item.maxSpeakingTime)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canModerate && !currentSpeaker && (
                      <Button
                        size="sm"
                        onClick={() => onStartSpeaking(item.id)}
                      >
                        <Mic className="h-4 w-4 mr-1" />
                        Start Speaking
                      </Button>
                    )}
                    {item.notes && (
                      <Badge variant="outline" className="text-xs">
                        Has Note
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Queue */}
      {completedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-gray-600" />
              Completed ({completedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg opacity-75">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.userAvatar} alt={item.userName} />
                      <AvatarFallback>
                        {item.userName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.userName}</p>
                        {getRoleIcon(item.userRole)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Completed at {formatTime(item.raisedAt.toDate())}
                      </p>
                      {item.speakingTime && (
                        <p className="text-sm text-gray-600">
                          Spoke for {formatDuration(item.speakingTime)}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.notes && (
                    <Badge variant="outline" className="text-xs">
                      Has Note
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Set Time Dialog */}
      <Dialog open={showTimeDialog} onOpenChange={setShowTimeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Speaking Time Limit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedItem.userAvatar} alt={selectedItem.userName} />
                  <AvatarFallback>
                    {selectedItem.userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedItem.userName}</p>
                  <p className="text-sm text-gray-600">Set time limit in minutes</p>
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="speaking-time">Speaking Time (minutes)</Label>
              <Input
                id="speaking-time"
                type="number"
                min="1"
                max="60"
                value={speakingTime}
                onChange={(e) => setSpeakingTime(parseInt(e.target.value) || 5)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={submitTime}>
                Set Time Limit
              </Button>
              <Button variant="outline" onClick={() => setShowTimeDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedItem.userAvatar} alt={selectedItem.userName} />
                  <AvatarFallback>
                    {selectedItem.userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedItem.userName}</p>
                  <p className="text-sm text-gray-600">Add a note about this speaker</p>
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="note">Note</Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this speaker..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={submitNote}>
                Add Note
              </Button>
              <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 