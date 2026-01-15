"use client"
import { IndividualDashboard } from "./features/individual/IndividualDashboard"
import { ProviderDashboard } from "./features/provider/ProviderDashboard"
import { AdminDashboard } from "./features/admin/AdminDashboard"
import { useAuth } from "@/hooks/use-auth"
import { LandingPage } from "./features/shared/LandingPage"

export default function CommunityApp() {
  const { user: currentUser, loading: isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!currentUser) {
    return <LandingPage />
  }

  if ((currentUser as any).userType === "provider") {
    return <ProviderDashboard currentUser={currentUser} />
  }

  if ((currentUser as any).userType === "admin") {
    return <AdminDashboard currentUser={currentUser} />
  }

  // Default to individual dashboard
  return <IndividualDashboard currentUser={currentUser} />
}
