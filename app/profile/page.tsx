"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { signOut } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Heart, Users, Wallet, Calendar, Settings, LogOut, ChevronRight } from "lucide-react"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push("/")
  }, [loading, user, router])

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

  // Redirect providers to their dedicated profile
  if (user?.role === "PROVIDER") {
    router.push("/provider/profile")
    return null
  }

  const menuItems = [
    { icon: Calendar, label: "My Bookings", href: "/client/bookings", description: "View your sessions" },
    { icon: Wallet, label: "Wallet", href: "/client/wallet", description: "Balance and purchases" },
    { icon: Heart, label: "Favorites", href: "/client/favorites", description: "Saved providers" },
    { icon: Users, label: "Following", href: "/client/following", description: "Providers you follow" },
    { icon: Settings, label: "Settings", href: "/settings", description: "Account settings" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>

        {/* User Info Card */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="text-2xl">{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">Client</Badge>
            </div>
            <Button variant="outline" onClick={() => router.push("/profile/edit")}>
              Edit
            </Button>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map(item => (
            <Card
              key={item.href}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => router.push(item.href)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-red-600 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}