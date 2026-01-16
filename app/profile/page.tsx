"use client"
import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/use-auth"
import { getUserProfileAction } from "@/app/actions"
import ClientDashboard from "../features/client/ClientDashboard"
import { ProviderDashboard } from "../features/provider/ProviderDashboard"

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth()
  const [userType, setUserType] = useState<"individual" | "provider" | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (authUser?.id) {
        try {
          const profile = await getUserProfileAction(authUser.id)
          if (profile) {
            setUserType((profile.role as any) === "PROVIDER" ? "provider" : "individual")
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    fetchProfile()
  }, [authUser])

  if (authLoading || userType === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Route to appropriate dashboard based on user type
  if (userType === "provider") {
    return <ProviderDashboard />
  }

  return <ClientDashboard />
}