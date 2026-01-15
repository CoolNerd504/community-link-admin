"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Users, 
  Settings, 
  Calendar, 
  Video, 
  MessageCircle, 
  Edit, 
  Trash2,
  Eye,
  UserPlus,
  Lock,
  Globe,
  MoreVertical,
  ImageIcon,
  FileText,
  Phone,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Timestamp } from "firebase/firestore"
import { getActiveCategories } from "@/lib/firebase-queries"
import type { Category } from "@/types/firebase-types"

interface GroupManagementProps {
  groups: Array<{
    id: string
    name: string
    description: string
    category: string
    privacy: "public" | "private" | "invite_only"
    maxMembers: number
    currentMembers: number
    location: {
      town: string
      country: string
    }
    tags: string[]
    isActive: boolean
    lastActivityAt: Timestamp
    groupImage?: string
  }>
  onCreateGroup: (groupData: any) => void
  onEditGroup: (groupId: string, groupData: any) => void
  onDeleteGroup: (groupId: string) => void
  onStartGroupCall: (groupId: string) => void
  onViewGroup: (groupId: string) => void
}

export function GroupManagement({
  groups,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  onStartGroupCall,
  onViewGroup,
}: GroupManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "",
    privacy: "public" as "public" | "private" | "invite_only",
    maxMembers: 20,
    location: {
      town: "",
      country: "",
    },
    tags: [] as string[],
  })

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const fetchedCategories = await getActiveCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Error loading categories:", error)
        // Fallback to empty array if Firebase fails
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleCreateGroup = () => {
    onCreateGroup(newGroup)
    setNewGroup({
      name: "",
      description: "",
      category: "",
      privacy: "public" as "public" | "private" | "invite_only",
      maxMembers: 20,
      location: {
        town: "",
        country: "",
      },
      tags: [],
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditGroup = (group: any) => {
    setEditingGroup(group)
    setNewGroup({
      name: group.name,
      description: group.description,
      category: group.category,
      privacy: group.privacy,
      maxMembers: group.maxMembers,
      location: group.location,
      tags: group.tags,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    onEditGroup(editingGroup.id, newGroup)
    setIsEditDialogOpen(false)
    setEditingGroup(null)
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
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

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Group Management</h2>
          <p className="text-gray-600">Create and manage your groups</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Group Name</label>
                <Input
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="Enter group name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Describe your group"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newGroup.category} onValueChange={(value) => setNewGroup({ ...newGroup, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter(category => category.name && category.name.trim() !== '')
                        .map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Privacy</label>
                  <Select value={newGroup.privacy} onValueChange={(value: any) => setNewGroup({ ...newGroup, privacy: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="invite_only">Invite Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Town</label>
                  <Input
                    value={newGroup.location.town}
                    onChange={(e) => setNewGroup({ 
                      ...newGroup, 
                      location: { ...newGroup.location, town: e.target.value }
                    })}
                    placeholder="Enter town"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Select 
                    value={newGroup.location.country} 
                    onValueChange={(value) => setNewGroup({ 
                      ...newGroup, 
                      location: { ...newGroup.location, country: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Countries are not loaded from Firebase, so this will be empty */}
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Max Members</label>
                <Input
                  type="number"
                  value={newGroup.maxMembers}
                  onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) })}
                  min="1"
                  max="100"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateGroup} className="flex-1">
                  Create Group
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={group.groupImage} alt={group.name} />
                    <AvatarFallback className="text-sm">
                      {group.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{group.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getPrivacyIcon(group.privacy)}
                      <span>{getPrivacyLabel(group.privacy)}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewGroup(group.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Group
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStartGroupCall(group.id)}>
                      <Video className="h-4 w-4 mr-2" />
                      Start Call
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDeleteGroup(group.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-gray-600 text-sm line-clamp-2">
                {group.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{group.currentMembers}/{group.maxMembers} members</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{group.category}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewGroup(group.id)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStartGroupCall(group.id)}
                  disabled={!group.isActive}
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>

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
        ))}
      </div>

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Group Name</label>
              <Input
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="Enter group name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                placeholder="Describe your group"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={newGroup.category} onValueChange={(value) => setNewGroup({ ...newGroup, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                                      <SelectContent>
                      {categories
                        .filter(category => category.name && category.name.trim() !== '')
                        .map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Privacy</label>
                <Select value={newGroup.privacy} onValueChange={(value: any) => setNewGroup({ ...newGroup, privacy: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="invite_only">Invite Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Town</label>
                <Input
                  value={newGroup.location.town}
                  onChange={(e) => setNewGroup({ 
                    ...newGroup, 
                    location: { ...newGroup.location, town: e.target.value }
                  })}
                  placeholder="Enter town"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Country</label>
                <Select 
                  value={newGroup.location.country} 
                  onValueChange={(value) => setNewGroup({ 
                    ...newGroup, 
                    location: { ...newGroup.location, country: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Countries are not loaded from Firebase, so this will be empty */}
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Max Members</label>
              <Input
                type="number"
                value={newGroup.maxMembers}
                onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) })}
                min="1"
                max="100"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 