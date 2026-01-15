import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, UserPlus, Users, X } from "lucide-react"
import { ServiceProvider, IndividualUser } from "@/types/firebase-types"
import type { Timestamp } from "firebase/firestore"
import { getActiveCategories } from "@/lib/firebase-queries"
import type { Category } from "@/types/firebase-types"

// Unified contact interface for both providers and individuals
interface Contact {
  id: string
  name: string
  email: string
  userType: "individual" | "provider"
  profileImage?: string
  isOnline: boolean
  lastActiveAt: Timestamp
  // Provider-specific fields
  specialty?: string

  location?: {
    town: string
    country: string
    fullAddress: string
  }
  skills?: string[]
  isVerified?: boolean
  isSponsored?: boolean
  // Individual-specific fields
  preferences?: {
    categories: string[]
    priceRange: {
      min: number
      max: number
    }
  }
  sessionsCompleted?: number
  totalSpent?: number
}

interface ContactSelectorProps {
  contacts: Contact[]
  selectedContacts: Contact[]
  onAddContact: (contact: Contact) => void
  onRemoveContact: (contactId: string) => void
  onClose: () => void
  maxParticipants?: number
}

export function ContactSelector({
  contacts,
  selectedContacts,
  onAddContact,
  onRemoveContact,
  onClose,
  maxParticipants = 10,
}: ContactSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

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

  // Filter contacts based on search and category
  const filteredContacts = contacts.filter((contact) => {
    const searchFields = [
      contact.name.toLowerCase(),
      contact.userType,
      ...(contact.specialty ? [contact.specialty.toLowerCase()] : []),
      ...(contact.skills ? contact.skills.map(skill => skill.toLowerCase()) : []),
      ...(contact.preferences?.categories ? contact.preferences.categories.map(cat => cat.toLowerCase()) : [])
    ]
    
    const matchesSearch = searchFields.some(field => 
      field.includes(searchTerm.toLowerCase())
    )

    const matchesCategory = selectedCategory === "all" || 
      (contact.userType === "provider" && contact.specialty?.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (contact.userType === "individual" && contact.preferences?.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase())))

    return matchesSearch && matchesCategory
  })

  // Get unique categories from contacts and Firebase categories
  const allCategories = Array.from(new Set([
    ...contacts.filter(c => c.userType === "provider").map(c => c.specialty).filter(Boolean),
    ...contacts.filter(c => c.userType === "individual").flatMap(c => c.preferences?.categories || []),
    ...categories.map(c => c.name),
    "Individuals" // Add a category for individuals
  ]))

  const handleAddContact = (contact: Contact) => {
    if (selectedContacts.length < maxParticipants && !selectedContacts.find(c => c.id === contact.id)) {
      onAddContact(contact)
    }
  }

  const handleRemoveContact = (contactId: string) => {
    onRemoveContact(contactId)
  }

  const isContactSelected = (contactId: string) => {
    return selectedContacts.some(contact => contact.id === contactId)
  }

  const canAddMore = selectedContacts.length < maxParticipants

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Add Contacts to Call
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{selectedContacts.length} of {maxParticipants} participants selected</span>
          {!canAddMore && (
            <Badge variant="destructive" className="text-xs">
              Max participants reached
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts by name, specialty, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            {allCategories.slice(0, 5).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category || "all")}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Contacts */}
        {selectedContacts.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selected Contacts</Label>
            <div className="flex flex-wrap gap-2">
              {selectedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                >
                                                            <Avatar className="h-6 w-6">
                       <AvatarImage src={contact.profileImage || "/placeholder.svg"} alt={contact.name} />
                       <AvatarFallback className="text-xs">
                         {contact.name.split(" ").map((n) => n[0]).join("")}
                       </AvatarFallback>
                     </Avatar>
                     <span className="text-sm font-medium">{contact.name}</span>
                     {contact.userType === "provider" && (
                       <Badge variant="secondary" className="text-xs">
                         Provider
                       </Badge>
                     )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Contacts */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Available Contacts ({filteredContacts.length})
          </Label>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No contacts found</p>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isSelected = isContactSelected(contact.id)
                const isDisabled = !canAddMore && !isSelected

                return (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-blue-50 border-blue-200"
                        : isDisabled
                        ? "bg-gray-50 border-gray-200 opacity-50"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => {
                        if (isSelected) {
                          handleRemoveContact(contact.id)
                        } else if (!isDisabled) {
                          handleAddContact(contact)
                        }
                      }}
                      disabled={isDisabled}
                    />
                    
                                         <Avatar className="h-10 w-10">
                       <AvatarImage src={contact.profileImage || "/placeholder.svg"} alt={contact.name} />
                       <AvatarFallback>
                         {contact.name.split(" ").map((n) => n[0]).join("")}
                       </AvatarFallback>
                     </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                        {contact.isOnline && (
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {contact.userType === "provider" && contact.specialty ? contact.specialty : "Individual User"}
                      </p>
                                             <div className="flex items-center gap-2 mt-1">
                                     {contact.userType === "provider" && contact.location && (
                           <span className="text-xs text-gray-500">•</span>
                         )}
                         {contact.location && (
                           <span className="text-xs text-gray-500">{contact.location.town}, {contact.location.country}</span>
                         )}
                         {contact.userType === "individual" && (
                           <span className="text-xs text-gray-500">Individual User</span>
                         )}
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {contact.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                      {contact.isSponsored && (
                        <Badge variant="default" className="text-xs bg-yellow-500">
                          Sponsored
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onClose}
            disabled={selectedContacts.length === 0}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add {selectedContacts.length} Contact{selectedContacts.length !== 1 ? 's' : ''} to Call
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 