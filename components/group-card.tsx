"use client"

import { useState } from "react"
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
  Eye
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Timestamp } from "firebase/firestore"

interface GroupCardProps {
  group: {
    id: string
    name: string
    description: string
    createdBy: string
    category: string
    privacy?: "public" | "private" | "invite_only"
    maxMembers: number
    currentMembers: number
    location?: {
      town: string
      country: string
    }
    tags?: string[]
    isActive: boolean
    lastActivityAt?: Timestamp
    coverImage?: string
    groupImage?: string
  }
  isMember?: boolean
  onJoinGroup: (groupId: string) => void
  onLeaveGroup: (groupId: string) => void
  onViewGroup: (groupId: string) => void
  onStartGroupCall: (groupId: string) => void
}

export function GroupCard({
  group,
  isMember = false,
  onJoinGroup,
  onLeaveGroup,
  onViewGroup,
  onStartGroupCall,
}: GroupCardProps) {
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinLeave = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setIsJoining(true)
    try {
      if (isMember) {
        await onLeaveGroup(group.id)
      } else {
        await onJoinGroup(group.id)
      }
    } finally {
      setIsJoining(false)
    }
  }

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

  const formatLastActivity = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return `${Math.floor(diffInHours / 168)}w ago`
  }

  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onViewGroup(group.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={group.groupImage || "/placeholder.svg"} alt={group.name} />
              <AvatarFallback className="text-sm font-semibold">
                {group.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getPrivacyIcon()}
                <span>{getPrivacyLabel()}</span>
                <span>•</span>
                <span>{group.category}</span>
              </div>
            </div>
          </div>
          <Badge variant={group.isActive ? "default" : "secondary"}>
            {group.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {group.description}
        </p>

        {/* Location */}
        {group.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{group.location.town}, {group.location.country}</span>
          </div>
        )}

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {group.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {group.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{group.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{group.currentMembers}/{group.maxMembers} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{group.lastActivityAt ? formatLastActivity(group.lastActivityAt.toDate()) : "Recently"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation() // Prevent card click
              onViewGroup(group.id)
            }}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          {isMember ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation() // Prevent card click
                  onStartGroupCall(group.id)
                }}
                disabled={!group.isActive}
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleJoinLeave}
                disabled={isJoining}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={handleJoinLeave}
              disabled={isJoining || group.currentMembers >= group.maxMembers}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {group.currentMembers >= group.maxMembers ? "Full" : "Join Group"}
            </Button>
          )}
        </div>

        {/* Member Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Members</span>
            <span>{group.currentMembers}/{group.maxMembers}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(group.currentMembers / group.maxMembers) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 