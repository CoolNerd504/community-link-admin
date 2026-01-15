"use client"
import { Button } from "./ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import {
  Search,
  Users,
  Settings,
  LogOut,
  User,
  Shield,
  BarChart3,
  MessageCircle,
  Bell
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface SharedNavigationProps {
  currentUser: any
  onFindProviders?: () => void
  onViewProfile?: () => void
  onViewAnalytics?: () => void
  onViewSettings?: () => void
  onViewMessages?: () => void
  onViewNotifications?: () => void
}

export function SharedNavigation({
  currentUser,
  onFindProviders,
  onViewProfile,
  onViewAnalytics,
  onViewSettings,
  onViewMessages,
  onViewNotifications
}: SharedNavigationProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getUserTypeLabel = () => {
    switch (currentUser?.userType) {
      case "admin":
        return "Admin"
      case "provider":
        return "Service Provider"
      case "individual":
        return "Client"
      default:
        return "User"
    }
  }

  const getUserTypeIcon = () => {
    switch (currentUser?.userType) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "provider":
        return <Users className="h-4 w-4" />
      case "individual":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and main navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CommLink</h1>
            </div>

            {/* Main Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {currentUser?.userType !== "provider" && onFindProviders && (
                <Button
                  variant="ghost"
                  onClick={onFindProviders}
                  className="flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Find Providers</span>
                </Button>
              )}

              {currentUser?.userType === "admin" && (
                <Button
                  variant="ghost"
                  onClick={onViewAnalytics}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={onViewMessages}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Messages</span>
              </Button>
            </div>
          </div>

          {/* Right side - User menu and actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onViewNotifications}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name || "User"}</p>
                <div className="flex items-center space-x-1">
                  {getUserTypeIcon()}
                  <span className="text-xs text-gray-500">{getUserTypeLabel()}</span>
                </div>
              </div>

              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatar || "/placeholder-user.jpg"} alt="Profile" />
                <AvatarFallback>
                  {(currentUser?.name || "U").split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Settings and Logout */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewSettings}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 