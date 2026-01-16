"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Switch } from "../../../components/ui/switch"
import { AdminProviderManagement } from "../../../components/admin-provider-management"
import { SharedNavigation } from "../../../components/shared-navigation"
import { AdminProviderSearch } from "../../../components/admin-provider-search"
import { PackagesRatesTab } from "../../../components/packages-rates-tab"
import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { useAuth } from "../../../hooks/use-auth"
import {
  getAdminStatsAction,
  getPendingProvidersAction,
  updateProviderVettingStatusAction,
  getAllIndividualUsersAction,
  getAllServiceProvidersAction,
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  getCategoriesWithStatsAction,
  getPricingTiersAction,
  createPricingTierAction,
  updatePricingTierAction,
  deletePricingTierAction,
  getBundlePricingAction,
  updateBundlePricingAction,
  getDisputesAction,
  updateDisputeStatusAction,
  getAdminAnalyticsAction
} from "../../../app/actions"
// Types
import { sampleServiceProviders, sampleDisputes } from "../shared/data"

export function AdminDashboard({ currentUser }: { currentUser: any }) {
  // Admin state - Pending providers will be loaded from Firebase
  const [serviceProviders, setServiceProviders] = useState(sampleServiceProviders as any[])
  const [disputes, setDisputes] = useState<any[]>([])
  const [selectedDispute, setSelectedDispute] = useState<any>(null)
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null)
  const [showUserProfileDialog, setShowUserProfileDialog] = useState(false)

  // User registrations
  const [userRegistrations, setUserRegistrations] = useState<{
    individuals: any[]
    providers: any[]
  }>({
    individuals: [],
    providers: [],
  })
  const [usersLoading, setUsersLoading] = useState(true)
  const [pendingProviders, setPendingProviders] = useState<any[]>([])
  const [pendingProvidersLoading, setPendingProvidersLoading] = useState(true)

  // Pricing and deals state - Updated to match Firebase schema
  const [pricingTiers, setPricingTiers] = useState<any[]>([])
  const [bundlePricing, setBundlePricing] = useState<any[]>([])
  const [discountDeals, setDiscountDeals] = useState<any[]>([])



  // Dialog states
  const [showAddProviderDialog, setShowAddProviderDialog] = useState(false)
  const [showAddPricingTierDialog, setShowAddPricingTierDialog] = useState(false)
  const [showAddBundleDialog, setShowAddBundleDialog] = useState(false)
  const [showAddDiscountDealDialog, setShowAddDiscountDealDialog] = useState(false)
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [addProviderForm, setAddProviderForm] = useState({
    name: "",
    email: "",
    specialty: "",
    location: "",
    description: "",
    skills: "",
    vettingStatus: "pending" as "pending" | "approved" | "rejected",
    isSponsored: false,
    isVerified: false,
    availableForInstant: false,
  })
  const [newPricingTier, setNewPricingTier] = useState({
    name: "",
    pricePerMinute: 0,
    description: "",
    isActive: true,
    maxSessionsPerDay: 5,
    features: [] as string[],
    bundleDiscounts: {
      "10_min": 0,
      "15_min": 0,
      "30_min": 0,
      "60_min": 0
    }
  })
  const [newBundle, setNewBundle] = useState({
    id: "",
    name: "",
    minutes: 0,
    price: 0,
    isActive: true,
  })

  const [newDiscountDeal, setNewDiscountDeal] = useState({
    name: "",
    discountValue: 0,
    isActive: true,
    validUntil: "",
  })

  // Categories management state
  const [categories, setCategories] = useState<any[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "📋",
    isActive: true,
    parentCategoryId: "none" as string | null,
    subcategories: [] as string[],
  })
  const [showProviderSearch, setShowProviderSearch] = useState(false)

  // Load categories from DB
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true)
      console.log("Admin: Loading categories from DB...")
      const fetchedCategories = await getCategoriesWithStatsAction()
      console.log("Admin: Categories loaded")
      setCategories(fetchedCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }




  useEffect(() => {
    loadCategories()
  }, [])

  // Load users from DB
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsersLoading(true)
        const [individuals, providers, fetchedDisputes] = await Promise.all([
          getAllIndividualUsersAction(),
          getAllServiceProvidersAction(),
          getDisputesAction({})
        ])

        setDisputes(fetchedDisputes.map((d: any) => ({
          id: d.id,
          clientName: d.creator?.name || "Unknown",
          providerName: d.provider?.name || "Unknown",
          issue: d.reason,
          description: d.description || d.reason,
          status: d.status.toLowerCase(),
          createdAt: new Date(d.createdAt),
          resolution: d.resolution,
          notes: d.notes
        })))

        setUserRegistrations({
          individuals: individuals.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            registeredAt: user.createdAt, // This is a Date object from Prisma
            status: "active", // Default status, or implement status logic
            sessionsCompleted: user.sessionsCompleted || 0, // Need to implement counters
          })),
          providers: providers.map((provider: any) => ({
            id: provider.id,
            name: provider.name,
            email: provider.email,
            registeredAt: provider.createdAt,
            status: "active",
            sessionsCompleted: provider.sessionsCompleted || 0,
            specialty: provider.profile?.headline || "General",
            vettingStatus: provider.profile?.vettingStatus?.toLowerCase(),
            location: { town: provider.profile?.location || "Unknown", country: "Zambia" },
            experience: provider.profile?.bio || "No details available",
            monthlyEarnings: provider.monthlyEarnings || 0,
            idFrontUrl: provider.profile?.idFrontUrl,
            idBackUrl: provider.profile?.idBackUrl,
            selfieUrl: provider.profile?.selfieUrl,
          }))
        })
      } catch (error) {
        console.error("Error loading users:", error)
        setUserRegistrations({ individuals: [], providers: [] })
      } finally {
        setUsersLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Load pending providers from DB
  useEffect(() => {
    const loadPendingProviders = async () => {
      try {
        setPendingProvidersLoading(true)
        const pending = await getPendingProvidersAction()

        // Map to UI shape
        const pendingMapped = pending.map((p: any) => ({
          ...p,
          specialty: p.profile?.headline || "General",
          location: { town: p.profile?.location || "Unknown", country: "" }, // Simplified
          experience: p.profile?.bio ? "Bio available" : "No bio", // Simplified
        }))

        setPendingProviders(pendingMapped)
      } catch (error) {
        console.error("Error loading pending providers:", error)
        setPendingProviders([])
      } finally {
        setPendingProvidersLoading(false)
      }
    }

    loadPendingProviders()
  }, [])

  // Handlers
  const handleApprovalClick = (provider: any, action: "approve" | "reject") => {
    setSelectedProvider(provider)
    setApprovalAction(action)
    setShowApprovalDialog(true)
  }

  const handleApprovalConfirm = async () => {
    if (!selectedProvider || !approvalAction) return

    try {
      setApprovalLoading(true)

      // Update the provider's vetting status via Server Action
      await updateProviderVettingStatusAction(selectedProvider.id, approvalAction === "approve" ? "APPROVED" : "REJECTED")

      // Update local state
      setPendingProviders(prev => prev.filter(p => p.id !== selectedProvider.id))
      setUserRegistrations(prev => ({
        ...prev,
        providers: prev.providers.map(p =>
          p.id === selectedProvider.id
            ? { ...p, vettingStatus: approvalAction === "approve" ? "APPROVED" : "REJECTED" }
            : p
        )
      }))

      // Show success message
      console.log(`Provider ${approvalAction === "approve" ? "approved" : "rejected"} successfully`)

    } catch (error) {
      console.error(`Error ${approvalAction === "approve" ? "approving" : "rejecting"} provider:`, error)
      // You could add a toast notification here
    } finally {
      setApprovalLoading(false)
      setShowApprovalDialog(false)
      setSelectedProvider(null)
      setApprovalAction(null)
    }
  }

  const handleApprovalCancel = () => {
    setShowApprovalDialog(false)
    setSelectedProvider(null)
    setApprovalAction(null)
  }
  const openUserProfile = (user: any, isProvider: boolean) => {
    setSelectedUserProfile({ ...user, isProvider })
    setShowUserProfileDialog(true)
  }
  const handleAddProvider = () => setShowAddProviderDialog(true)
  const handleSubmitAddProvider = () => {
    // TODO: Implement provider creation
    console.log("Adding provider:", addProviderForm)
    setShowAddProviderDialog(false)
  }
  const handleCancelAddProvider = () => setShowAddProviderDialog(false)
  const handleAddPricingTier = () => setShowAddPricingTierDialog(true)
  const handleAddBundle = () => setShowAddBundleDialog(true)
  const handleAddDiscountDeal = () => setShowAddDiscountDealDialog(true)
  const handleAddCategory = () => setShowAddCategoryDialog(true)
  const handleTogglePricingTierStatus = (tierId: string, isActive: boolean) => {
    setPricingTiers(prev => prev.map(t => t.id === tierId ? { ...t, isActive } : t))
  }
  const handleToggleDiscountDealStatus = (dealId: string, isActive: boolean) => {
    setDiscountDeals(prev => prev.map(d => d.id === dealId ? { ...d, isActive } : d))
  }
  const handleDeletePricingTier = (tierId: string) => {
    setPricingTiers(prev => prev.filter(t => t.id !== tierId))
  }
  const handleDeleteDiscountDeal = (dealId: string) => {
    setDiscountDeals(prev => prev.filter(d => d.id !== dealId))
  }

  const handleToggleBundleStatus = (bundleId: string, isActive: boolean) => {
    setBundlePricing(prev => prev.map(b => b.id === bundleId ? { ...b, isActive } : b))
  }

  const handleDeleteBundle = (bundleId: string) => {
    setBundlePricing(prev => prev.filter(b => b.id !== bundleId))
  }

  const handleToggleCategoryStatus = async (categoryId: string, isActive: boolean) => {
    try {
      await updateCategoryAction(categoryId, { isActive })
      setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, isActive } : c))
    } catch (error) {
      console.error("Error updating category status:", error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategoryAction(categoryId)
      setCategories(prev => prev.filter(c => c.id !== categoryId))
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const handleEditCategory = (category: any) => {
    setEditingCategoryId(category.id)
    setNewCategory({
      name: category.name,
      description: category.description,
      icon: category.icon,
      isActive: category.isActive,
      parentCategoryId: category.parentCategoryId || "none" as string | null,
      subcategories: category.subcategories || [],
    })
    setShowAddCategoryDialog(true)
  }

  // Navigation handlers
  const handleFindProviders = () => {
    setShowProviderSearch(true)
  }

  const handleBackFromProviderSearch = () => {
    setShowProviderSearch(false)
  }

  const handleViewProvider = (provider: any) => {
    console.log("Viewing provider:", provider)
    // TODO: Navigate to provider details page
  }

  const handleEditProvider = (provider: any) => {
    console.log("Editing provider:", provider)
    // TODO: Navigate to provider edit page
  }

  const handleDeleteProvider = (providerId: string) => {
    console.log("Deleting provider:", providerId)
    // TODO: Implement provider deletion
  }

  const handleToggleVerification = (providerId: string, isVerified: boolean) => {
    console.log("Toggling verification:", providerId, isVerified)
    // TODO: Implement verification toggle
  }

  const handleToggleSponsorship = (providerId: string, isSponsored: boolean) => {
    console.log("Toggling sponsorship:", providerId, isSponsored)
    // TODO: Implement sponsorship toggle
  }

  const handleViewProfile = () => {
    // TODO: Navigate to profile page
    console.log("View Profile clicked")
  }

  const handleViewAnalytics = () => {
    // TODO: Navigate to analytics page
    console.log("View Analytics clicked")
  }

  const handleViewSettings = () => {
    // TODO: Navigate to settings page
    console.log("View Settings clicked")
  }

  const handleViewMessages = () => {
    // TODO: Navigate to messages page
    console.log("View Messages clicked")
  }

  const handleViewNotifications = () => {
    // TODO: Navigate to notifications page
    console.log("View Notifications clicked")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <SharedNavigation
        currentUser={currentUser}
        onFindProviders={handleFindProviders}
        onViewProfile={handleViewProfile}
        onViewAnalytics={handleViewAnalytics}
        onViewSettings={handleViewSettings}
        onViewMessages={handleViewMessages}
        onViewNotifications={handleViewNotifications}
      />

      {showProviderSearch ? (
        <AdminProviderSearch
          onBack={handleBackFromProviderSearch}
          onViewProvider={handleViewProvider}
          onEditProvider={handleEditProvider}
          onDeleteProvider={handleDeleteProvider}
          onToggleVerification={handleToggleVerification}
          onToggleSponsorship={handleToggleSponsorship}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h2>
            <p className="text-gray-600">Manage providers, disputes, and platform analytics</p>
          </div>

          <Tabs defaultValue="vetting" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-2">
              <TabsTrigger value="vetting" className="text-xs md:text-sm">Service Providers</TabsTrigger>
              <TabsTrigger value="users" className="text-xs md:text-sm">Users</TabsTrigger>
              <TabsTrigger value="disputes" className="text-xs md:text-sm">Disputes</TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs md:text-sm">Pricing</TabsTrigger>
              <TabsTrigger value="categories" className="text-xs md:text-sm">Categories</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
              <TabsTrigger value="packages-rates" className="text-xs md:text-sm">Packages & Rates</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs md:text-sm">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="vetting" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Service Providers</h3>
                <Button onClick={handleAddProvider}>Add Provider</Button>
              </div>

              {/* Pending Providers Section */}
              <Card>
                <CardHeader>
                  <h4 className="font-semibold">Pending Approvals</h4>
                  <p className="text-sm text-gray-600">Providers awaiting approval</p>
                </CardHeader>
                <CardContent>
                  {pendingProvidersLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : pendingProviders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">✅</div>
                      <p className="text-gray-600">No pending approvals</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pendingProviders.map((provider) => (
                        <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-lg font-semibold text-gray-600">
                                  {provider.name.split(" ").map((n: string) => n[0]).join("")}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold">{provider.name}</h4>
                                <p className="text-sm text-gray-600">{provider.specialty}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="text-sm text-gray-600">
                              <p>Email: {provider.email}</p>
                              <p>Location: {provider.location?.town}, {provider.location?.country}</p>
                              <p>Experience: {provider.experience}</p>
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs font-semibold mb-1">KYC Documents:</p>
                                <div className="flex gap-2 text-xs">
                                  {provider.idFrontUrl ? <a href={provider.idFrontUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ID Front</a> : <span className="text-gray-400">No ID Front</span>}
                                  {provider.idBackUrl ? <a href={provider.idBackUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ID Back</a> : <span className="text-gray-400">No ID Back</span>}
                                  {provider.selfieUrl ? <a href={provider.selfieUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Selfie</a> : <span className="text-gray-400">No Selfie</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprovalClick(provider, "approve")}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprovalClick(provider, "reject")}
                                className="flex-1 text-red-600 hover:text-red-700"
                              >
                                Reject
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Approved Service Providers Section */}
              <Card>
                <CardHeader>
                  <h4 className="font-semibold">Approved Service Providers</h4>
                  <p className="text-sm text-gray-600">All approved providers from users table (filtered by userType: "provider" and vettingStatus: "approved")</p>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : userRegistrations.providers.filter(provider => provider.vettingStatus === "approved").length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">👨‍⚕️</div>
                      <p className="text-gray-600">No approved service providers found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userRegistrations.providers
                        .filter(provider => provider.vettingStatus === "approved")
                        .map((provider) => (
                          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-lg font-semibold text-gray-600">
                                    {provider.name.split(" ").map((n: string) => n[0]).join("")}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold">{provider.name}</h4>
                                  <p className="text-sm text-gray-600">{provider.specialty}</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="text-sm text-gray-600">
                                <p>Email: {provider.email}</p>
                                <p>Specialty: {provider.specialty || "Not specified"}</p>
                                <p>Registered: {provider.registeredAt && provider.registeredAt.toDate ? provider.registeredAt.toDate().toLocaleDateString() : "N/A"}</p>
                                <p>Sessions: {provider.sessionsCompleted || 0}</p>
                                <p>Earnings: ${provider.monthlyEarnings || 0}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewProvider(provider)}
                                  className="flex-1"
                                >
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditProvider(provider)}
                                  className="flex-1"
                                >
                                  Edit
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <h3 className="text-lg font-semibold">Individual Users</h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* List Column (1/4) */}
                <div className="lg:col-span-1 border rounded-lg overflow-hidden h-[600px] overflow-y-auto bg-white">
                  {usersLoading ? (
                    <div className="p-4 space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse flex flex-col gap-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : userRegistrations.individuals.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 flex flex-col items-center">
                      <div className="text-2xl mb-2">👥</div>
                      <p className="text-gray-500 text-sm">No users found</p>
                    </div>
                  ) : (
                    userRegistrations.individuals.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedUserProfile?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                        onClick={() => setSelectedUserProfile(user)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm truncate w-3/4">{user.name}</h4>
                          <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-[10px] px-1 py-0 h-5">
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Details Column (3/4) */}
                <div className="lg:col-span-3">
                  {selectedUserProfile ? (
                    <Card className="h-full">
                      <CardHeader className="border-b bg-gray-50/50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                              {selectedUserProfile.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <CardTitle>{selectedUserProfile.name}</CardTitle>
                              <p className="text-sm text-gray-500">{selectedUserProfile.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Reset Password</Button>
                            <Button variant="destructive" size="sm">Suspend User</Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {/* Stats Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg border">
                              <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sessions</h5>
                              <p className="text-2xl font-bold">{selectedUserProfile.sessionsCompleted || 0}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border">
                              <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Registration Date</h5>
                              <p className="text-lg font-medium">
                                {selectedUserProfile.registeredAt && new Date(selectedUserProfile.registeredAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border">
                              <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</h5>
                              <Badge variant={selectedUserProfile.status === "active" ? "default" : "secondary"}>
                                {selectedUserProfile.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          {/* Contact / Bio if available */}
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">About User</h5>
                            <div className="border rounded-md p-4 bg-white">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">Phone</p>
                                  <p className="text-sm">{selectedUserProfile.phone || "Not provided"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">User ID</p>
                                  <p className="text-sm font-mono text-gray-600">{selectedUserProfile.id}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Recent Activity (Placeholder) */}
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">Recent System Activity</h5>
                            <div className="bg-gray-50 rounded-md p-4 text-center text-sm text-gray-500 border border-dashed">
                              No recent activity logs available.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <div className="text-4xl mb-4">👤</div>
                      <h3 className="text-lg font-medium text-gray-900">No User Selected</h3>
                      <p className="text-gray-500">Select a user from the list to view their profile</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="disputes" className="space-y-6">
              <h3 className="text-lg font-semibold">Active Disputes</h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* List Column (1/4) */}
                <div className="lg:col-span-1 border rounded-lg overflow-hidden h-[600px] overflow-y-auto bg-white">
                  {disputes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No disputes found</div>
                  ) : (
                    disputes.map((dispute) => (
                      <div
                        key={dispute.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedDispute?.id === dispute.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                        onClick={() => setSelectedDispute(dispute)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm truncate w-3/4">{dispute.clientName}</h4>
                          <Badge variant={dispute.status === "open" ? "destructive" : "secondary"} className="text-[10px] px-1 py-0 h-5">
                            {dispute.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">vs {dispute.providerName}</p>
                        <p className="text-xs text-gray-400">
                          {dispute.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Details Column (3/4) */}
                <div className="lg:col-span-3">
                  {selectedDispute ? (
                    <Card className="h-full">
                      <CardHeader className="border-b bg-gray-50/50">
                        <div className="flex justify-between items-center">
                          <CardTitle>Dispute Details</CardTitle>
                          <Badge variant={selectedDispute.status === "open" ? "destructive" : "outline"}>
                            {selectedDispute.status.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {/* Participants */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Complainant</h5>
                              <p className="font-medium">{selectedDispute.clientName}</p>
                              <p className="text-xs text-gray-500">Client ID: {selectedDispute.id.substring(0, 8)}...</p>
                            </div>
                            <div>
                              <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Service Provider</h5>
                              <p className="font-medium">{selectedDispute.providerName}</p>
                            </div>
                          </div>

                          {/* Issue Details */}
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">Issue Type</h5>
                            <p className="text-gray-700 bg-white border p-3 rounded-md">{selectedDispute.issue}</p>
                          </div>

                          {selectedDispute.description && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-900 mb-2">Description</h5>
                              <p className="text-gray-600 leading-relaxed">{selectedDispute.description}</p>
                            </div>
                          )}

                          {/* Actions Placeholder */}
                          {selectedDispute.status === 'open' && (
                            <div className="pt-4 border-t flex gap-3">
                              <Button size="sm" onClick={() => updateDisputeStatusAction(selectedDispute.id, 'INVESTIGATING')}>Start Investigation</Button>
                              <Button size="sm" variant="secondary" onClick={() => updateDisputeStatusAction(selectedDispute.id, 'RESOLVED')}>Mark Resolved</Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <div className="text-4xl mb-4">⚖️</div>
                      <h3 className="text-lg font-medium text-gray-900">No Dispute Selected</h3>
                      <p className="text-gray-500">Select a dispute from the list to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pricing Management</h3>
                <div className="space-x-2">
                  <Button onClick={() => setShowAddPricingTierDialog(true)}>Add Pricing Tier</Button>
                  <Button onClick={() => setShowAddBundleDialog(true)}>Add Bundle</Button>
                  <Button onClick={() => setShowAddDiscountDealDialog(true)}>Add Discount Deal</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                {/* Pricing Tiers */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">Pricing Tiers</h4>
                    <p className="text-sm text-gray-600">Provider pricing tiers with bundle discounts</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pricingTiers.map((tier) => (
                        <div key={tier.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{tier.name}</h5>
                              <p className="text-sm text-gray-600">{tier.description}</p>
                              <p className="text-sm font-medium">ZMW {tier.pricePerMinute}/minute</p>
                              <p className="text-xs text-gray-500">Max {tier.maxSessionsPerDay} sessions/day</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={tier.isActive}
                                onCheckedChange={(checked) => handleTogglePricingTierStatus(tier.id, checked)}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeletePricingTier(tier.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>

                          {/* Bundle Discounts */}
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs font-medium text-gray-700 mb-2">Bundle Discounts:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>10min: {tier.bundleDiscounts["10_min"]}%</div>
                              <div>15min: {tier.bundleDiscounts["15_min"]}%</div>
                              <div>30min: {tier.bundleDiscounts["30_min"]}%</div>
                              <div>60min: {tier.bundleDiscounts["60_min"]}%</div>
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {tier.features.map((feature: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Bundle Pricing */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">Bundle Pricing</h4>
                    <p className="text-sm text-gray-600">Time-based bundles for clients</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bundlePricing.map((bundle) => (
                        <div key={bundle.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium">{bundle.name}</h5>
                            <p className="text-sm text-gray-600">{bundle.minutes} minutes</p>
                            <p className="text-sm font-medium">ZMW {bundle.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={bundle.isActive}
                              onCheckedChange={(checked) => handleToggleBundleStatus(bundle.id, checked)}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteBundle(bundle.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Discount Deals */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">Discount Deals</h4>
                    <p className="text-sm text-gray-600">Promotional discounts and offers</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {discountDeals.map((deal) => (
                        <div key={deal.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{deal.name}</h5>
                              <p className="text-sm text-gray-600">{deal.discountValue}% off</p>
                              <p className="text-xs text-gray-500">Valid until: {deal.validUntil}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={deal.isActive}
                                onCheckedChange={(checked) => handleToggleDiscountDealStatus(deal.id, checked)}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteDiscountDeal(deal.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Category Management</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        // Simplified sample generation
                        alert("Sample categories generation not implemented in this version")
                        // Reload categories after creating samples
                        await loadCategories()
                        alert("Sample categories created successfully!")
                      } catch (error) {
                        console.error("Error creating sample categories:", error)
                        alert("Failed to create sample categories. Please try again.")
                      }
                    }}
                  >
                    Create Sample Categories
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </div>
              </div>

              {categoriesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                              <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Found</h3>
                  <p className="text-gray-600 mb-6">Get started by creating your first category.</p>
                  <Button onClick={handleAddCategory}>
                    Create First Category
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{category.icon}</div>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={category.isActive}
                              onCheckedChange={(checked) => handleToggleCategoryStatus(category.id, checked)}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCategory(category)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Providers</span>
                          <Badge variant="outline">{category.providerCount}</Badge>
                        </div>

                        {category.parentCategoryId && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Parent Category</span>
                            <span className="text-sm font-medium">
                              {categories.find(c => c.id === category.parentCategoryId)?.name || "Unknown"}
                            </span>
                          </div>
                        )}

                        {category.subcategories && category.subcategories.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Subcategories:</p>
                            <div className="flex flex-wrap gap-1">
                              {category.subcategories.map((subcategory: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {subcategory}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>
                            Created: {
                              category.createdAt
                                ? (category.createdAt.toDate
                                  ? category.createdAt.toDate().toLocaleDateString()
                                  : new Date(category.createdAt).toLocaleDateString())
                                : "N/A"
                            }
                          </span>
                          <span>
                            Updated: {
                              category.updatedAt
                                ? (category.updatedAt.toDate
                                  ? category.updatedAt.toDate().toLocaleDateString()
                                  : new Date(category.updatedAt).toLocaleDateString())
                                : "N/A"
                            }
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Key Metrics Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <h4 className="font-semibold text-sm text-gray-600">Total Users</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {userRegistrations.individuals.length + userRegistrations.providers.length}
                    </p>
                    <p className="text-sm text-gray-600">Active users</p>
                    <div className="mt-2 text-xs text-green-600">+12% from last month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <h4 className="font-semibold text-sm text-gray-600">Service Providers</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{userRegistrations.providers.length}</p>
                    <p className="text-sm text-gray-600">Verified providers</p>
                    <div className="mt-2 text-xs text-blue-600">{pendingProviders.length} pending approval</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <h4 className="font-semibold text-sm text-gray-600">Total Revenue</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">ZMW 45,230</p>
                    <p className="text-sm text-gray-600">This month</p>
                    <div className="mt-2 text-xs text-green-600">+8.5% from last month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <h4 className="font-semibold text-sm text-gray-600">Active Sessions</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">1,247</p>
                    <p className="text-sm text-gray-600">Completed this month</p>
                    <div className="mt-2 text-xs text-green-600">+15% from last month</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Management Analytics */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">User Management Analytics</h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{userRegistrations.individuals.length}</p>
                        <p className="text-sm text-gray-600">Individual Users</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{userRegistrations.providers.length}</p>
                        <p className="text-sm text-gray-600">Service Providers</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending Verifications</span>
                        <span className="text-sm font-medium">{pendingProviders.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Suspended Users</span>
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">New Registrations (7d)</span>
                        <span className="text-sm font-medium">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">User Retention Rate</span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Provider Analytics */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">Provider Analytics</h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">89%</p>
                        <p className="text-sm text-gray-600">Approval Rate</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">4.7</p>
                        <p className="text-sm text-gray-600">Avg Rating</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Verified Providers</span>
                        <span className="text-sm font-medium">{userRegistrations.providers.filter(p => p.vettingStatus === "approved").length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sponsored Providers</span>
                        <span className="text-sm font-medium">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active This Week</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Sessions/Month</span>
                        <span className="text-sm font-medium">23</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Analytics */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">Financial Analytics</h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">ZMW 45,230</p>
                        <p className="text-sm text-gray-600">Monthly Revenue</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">ZMW 3,420</p>
                        <p className="text-sm text-gray-600">Platform Fees</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Bundle Sales</span>
                        <span className="text-sm font-medium">ZMW 28,450</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sponsored Revenue</span>
                        <span className="text-sm font-medium">ZMW 8,230</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Transaction Value</span>
                        <span className="text-sm font-medium">ZMW 36</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Payment Success Rate</span>
                        <span className="text-sm font-medium">98.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Session & Engagement Analytics */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">Session & Engagement Analytics</h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">1,247</p>
                        <p className="text-sm text-gray-600">Sessions This Month</p>
                      </div>
                      <div className="text-center p-3 bg-pink-50 rounded-lg">
                        <p className="text-2xl font-bold text-pink-600">42min</p>
                        <p className="text-sm text-gray-600">Avg Duration</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completion Rate</span>
                        <span className="text-sm font-medium">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Bundle Usage</span>
                        <span className="text-sm font-medium">67%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Instant Sessions</span>
                        <span className="text-sm font-medium">23%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Scheduled Sessions</span>
                        <span className="text-sm font-medium">77%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Health & Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dispute Management */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">Dispute Management</h4>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Open Disputes</span>
                      <Badge variant="destructive">{disputes.filter(d => d.status === "open").length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Progress</span>
                      <Badge variant="secondary">{disputes.filter(d => d.status === "in-progress").length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolved This Month</span>
                      <Badge variant="default">18</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Resolution Time</span>
                      <span className="text-sm font-medium">2.3 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Dispute Rate</span>
                      <span className="text-sm font-medium">1.2%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Group Analytics */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">Group Analytics</h4>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Groups</span>
                      <span className="text-sm font-medium">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Groups</span>
                      <span className="text-sm font-medium">142</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Members</span>
                      <span className="text-sm font-medium">3,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Group Sessions</span>
                      <span className="text-sm font-medium">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Speaking Queue Usage</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* System Performance */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">System Performance</h4>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Uptime</span>
                      <Badge variant="default">99.8%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="text-sm font-medium">245ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Video Calls</span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage Used</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database Connections</span>
                      <span className="text-sm font-medium">1,234</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">Recent Activity</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New provider approved</p>
                          <p className="text-xs text-gray-600">Dr. Sarah Johnson - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">High-value bundle purchased</p>
                          <p className="text-xs text-gray-600">60-minute bundle - ZMW 20 - 3 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Dispute opened</p>
                          <p className="text-xs text-gray-600">Session #1234 - 5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New group created</p>
                          <p className="text-xs text-gray-600">Anxiety Support Group - 6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Alerts */}
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold">System Alerts</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 bg-red-50 rounded border-l-4 border-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800">High dispute rate detected</p>
                          <p className="text-xs text-red-600">Dispute rate increased to 2.1% this week</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-800">Storage usage warning</p>
                          <p className="text-xs text-orange-600">Storage at 85% capacity</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-green-50 rounded border-l-4 border-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800">Performance optimal</p>
                          <p className="text-xs text-green-600">All systems running smoothly</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800">New user registration spike</p>
                          <p className="text-xs text-blue-600">15 new users in the last hour</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="packages-rates">
              <PackagesRatesTab />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <h4 className="font-semibold">Platform Settings</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenance">Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Temporarily disable the platform</p>
                    </div>
                    <Switch id="maintenance" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="registrations">New Registrations</Label>
                      <p className="text-sm text-gray-600">Allow new user registrations</p>
                    </div>
                    <Switch id="registrations" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Enhanced Pricing Tier Dialog */}
          {showAddPricingTierDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Add Pricing Tier</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tierName">Tier Name</Label>
                    <Input
                      id="tierName"
                      value={newPricingTier.name}
                      onChange={(e) => setNewPricingTier(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Basic, Premium, Enterprise"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tierDescription">Description</Label>
                    <Textarea
                      id="tierDescription"
                      value={newPricingTier.description}
                      onChange={(e) => setNewPricingTier(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the tier and its benefits"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pricePerMinute">Price per Minute (ZMW)</Label>
                      <Input
                        id="pricePerMinute"
                        type="number"
                        value={newPricingTier.pricePerMinute}
                        onChange={(e) => setNewPricingTier(prev => ({ ...prev, pricePerMinute: Number(e.target.value) }))}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxSessionsPerDay">Max Sessions per Day</Label>
                      <Input
                        id="maxSessionsPerDay"
                        type="number"
                        value={newPricingTier.maxSessionsPerDay}
                        onChange={(e) => setNewPricingTier(prev => ({ ...prev, maxSessionsPerDay: Number(e.target.value) }))}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  {/* Bundle Discounts */}
                  <div>
                    <Label>Bundle Discounts (%)</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="discount10min" className="text-sm">10 Minutes</Label>
                        <Input
                          id="discount10min"
                          type="number"
                          value={newPricingTier.bundleDiscounts["10_min"]}
                          onChange={(e) => setNewPricingTier(prev => ({
                            ...prev,
                            bundleDiscounts: { ...prev.bundleDiscounts, "10_min": Number(e.target.value) }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount15min" className="text-sm">15 Minutes</Label>
                        <Input
                          id="discount15min"
                          type="number"
                          value={newPricingTier.bundleDiscounts["15_min"]}
                          onChange={(e) => setNewPricingTier(prev => ({
                            ...prev,
                            bundleDiscounts: { ...prev.bundleDiscounts, "15_min": Number(e.target.value) }
                          }))}
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount30min" className="text-sm">30 Minutes</Label>
                        <Input
                          id="discount30min"
                          type="number"
                          value={newPricingTier.bundleDiscounts["30_min"]}
                          onChange={(e) => setNewPricingTier(prev => ({
                            ...prev,
                            bundleDiscounts: { ...prev.bundleDiscounts, "30_min": Number(e.target.value) }
                          }))}
                          placeholder="10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount60min" className="text-sm">60 Minutes</Label>
                        <Input
                          id="discount60min"
                          type="number"
                          value={newPricingTier.bundleDiscounts["60_min"]}
                          onChange={(e) => setNewPricingTier(prev => ({
                            ...prev,
                            bundleDiscounts: { ...prev.bundleDiscounts, "60_min": Number(e.target.value) }
                          }))}
                          placeholder="15"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tierActive"
                      checked={newPricingTier.isActive}
                      onCheckedChange={(checked) => setNewPricingTier(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="tierActive">Active</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowAddPricingTierDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // TODO: Implement pricing tier creation
                    console.log("Creating pricing tier:", newPricingTier)
                    setShowAddPricingTierDialog(false)
                  }}>
                    Create Tier
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bundle Dialog */}
          {showAddBundleDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add Bundle</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bundleName">Bundle Name</Label>
                    <Input
                      id="bundleName"
                      value={newBundle.name}
                      onChange={(e) => setNewBundle(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., 15 Minutes"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bundleMinutes">Minutes</Label>
                      <Input
                        id="bundleMinutes"
                        type="number"
                        value={newBundle.minutes}
                        onChange={(e) => setNewBundle(prev => ({ ...prev, minutes: Number(e.target.value) }))}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bundlePrice">Price (ZMW)</Label>
                      <Input
                        id="bundlePrice"
                        type="number"
                        value={newBundle.price}
                        onChange={(e) => setNewBundle(prev => ({ ...prev, price: Number(e.target.value) }))}
                        placeholder="7"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bundleActive"
                      checked={newBundle.isActive}
                      onCheckedChange={(checked) => setNewBundle(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="bundleActive">Active</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowAddBundleDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // TODO: Implement bundle creation
                    console.log("Creating bundle:", newBundle)
                    setShowAddBundleDialog(false)
                  }}>
                    Create Bundle
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Discount Deal Dialog */}
          {showAddDiscountDealDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add Discount Deal</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dealName">Deal Name</Label>
                    <Input
                      id="dealName"
                      value={newDiscountDeal.name}
                      onChange={(e) => setNewDiscountDeal(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., New User Discount"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dealDiscount">Discount (%)</Label>
                      <Input
                        id="dealDiscount"
                        type="number"
                        value={newDiscountDeal.discountValue}
                        onChange={(e) => setNewDiscountDeal(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dealValidUntil">Valid Until</Label>
                      <Input
                        id="dealValidUntil"
                        type="date"
                        value={newDiscountDeal.validUntil}
                        onChange={(e) => setNewDiscountDeal(prev => ({ ...prev, validUntil: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dealActive"
                      checked={newDiscountDeal.isActive}
                      onCheckedChange={(checked) => setNewDiscountDeal(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="dealActive">Active</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowAddDiscountDealDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // TODO: Implement discount deal creation
                    console.log("Creating discount deal:", newDiscountDeal)
                    setShowAddDiscountDealDialog(false)
                  }}>
                    Create Deal
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Category Dialog */}
          {showAddCategoryDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Add/Edit Category</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Life Coaching"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryIcon">Icon (Emoji)</Label>
                      <Input
                        id="categoryIcon"
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="🎯"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea
                      id="categoryDescription"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the category and its services"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="parentCategory">Parent Category (Optional)</Label>
                    <Select
                      value={newCategory.parentCategoryId || "none"}
                      onValueChange={(value) => setNewCategory(prev => ({ ...prev, parentCategoryId: value === "none" ? null : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Parent Category</SelectItem>
                        {categories.filter(c => !c.parentCategoryId).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Subcategories (Optional)</Label>
                    <div className={`space-y-2 ${newCategory.parentCategoryId && newCategory.parentCategoryId !== "none" ? "opacity-50 pointer-events-none" : ""}`}>
                      <div className="text-sm text-gray-500 mb-2">
                        {newCategory.parentCategoryId && newCategory.parentCategoryId !== "none"
                          ? "Subcategories are not available for child categories"
                          : "Add subcategories for this category"
                        }
                      </div>
                      {newCategory.subcategories.map((subcategory: string, index: number) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            value={subcategory}
                            onChange={(e) => {
                              const updatedSubcategories = [...newCategory.subcategories]
                              updatedSubcategories[index] = e.target.value
                              setNewCategory(prev => ({ ...prev, subcategories: updatedSubcategories }))
                            }}
                            placeholder="Subcategory name"
                            disabled={Boolean(newCategory.parentCategoryId && newCategory.parentCategoryId !== "none")}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updatedSubcategories = newCategory.subcategories.filter((_: string, i: number) => i !== index)
                              setNewCategory(prev => ({ ...prev, subcategories: updatedSubcategories }))
                            }}
                            disabled={Boolean(newCategory.parentCategoryId && newCategory.parentCategoryId !== "none")}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewCategory(prev => ({
                            ...prev,
                            subcategories: [...prev.subcategories, ""]
                          }))
                        }}
                        disabled={Boolean(newCategory.parentCategoryId && newCategory.parentCategoryId !== "none")}
                      >
                        Add Subcategory
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="categoryActive"
                      checked={newCategory.isActive}
                      onCheckedChange={(checked) => setNewCategory(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="categoryActive">Active</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowAddCategoryDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={async () => {
                    try {
                      if (editingCategoryId) {
                        // Update existing category
                        // Update existing category
                        await updateCategoryAction(editingCategoryId, {
                          name: newCategory.name,
                          description: newCategory.description,
                          icon: newCategory.icon,
                          isActive: newCategory.isActive,
                          // subcategories not supported in simple update yet
                        })
                        setCategories(prev => prev.map(c =>
                          c.id === editingCategoryId
                            ? {
                              ...c,
                              name: newCategory.name,
                              description: newCategory.description,
                              icon: newCategory.icon,
                              isActive: newCategory.isActive,
                              parentCategoryId: (newCategory.parentCategoryId && newCategory.parentCategoryId !== "none") ? newCategory.parentCategoryId : null,
                              subcategories: newCategory.subcategories.filter(s => s.trim() !== ""),
                            }
                            : c
                        ))
                      } else {
                        // Create new category
                        const categoryData = {
                          name: newCategory.name,
                          description: newCategory.description,
                          icon: newCategory.icon,
                          // isActive: newCategory.isActive, // DB default is true
                          parentId: (newCategory.parentCategoryId && newCategory.parentCategoryId !== "none") ? newCategory.parentCategoryId : undefined,
                        }
                        const newCategoryResult = await createCategoryAction(categoryData)
                        const newCategoryId = newCategoryResult.id
                        const newCategoryWithId = {
                          id: newCategoryId,
                          ...categoryData,
                          providerCount: 0,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        }
                        setCategories(prev => [...prev, newCategoryWithId])
                      }

                      setShowAddCategoryDialog(false)
                      setEditingCategoryId(null)
                      // Reset form
                      setNewCategory({
                        name: "",
                        description: "",
                        icon: "📋",
                        isActive: true,
                        parentCategoryId: "none" as string | null,
                        subcategories: [],
                      })
                    } catch (error) {
                      console.error("Error saving category:", error)
                    }
                  }}>
                    {editingCategoryId ? "Update Category" : "Create Category"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Approval Confirmation Dialog */}
          {showApprovalDialog && selectedProvider && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  {approvalAction === "approve" ? "Approve Provider" : "Reject Provider"}
                </h3>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to {approvalAction === "approve" ? "approve" : "reject"} this provider?
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {selectedProvider.name.split(" ").map((n: string) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{selectedProvider.name}</h4>
                        <p className="text-sm text-gray-600">{selectedProvider.specialty}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Email: {selectedProvider.email}</p>
                      <p>Location: {selectedProvider.location?.town}, {selectedProvider.location?.country}</p>
                      {selectedProvider.experience && <p>Experience: {selectedProvider.experience}</p>}
                    </div>
                  </div>

                  {approvalAction === "approve" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Approval will:</strong>
                      </p>
                      <ul className="text-sm text-green-700 mt-1 space-y-1">
                        <li>• Allow the provider to accept sessions</li>
                        <li>• Make their profile visible to clients</li>
                        <li>• Enable them to create groups</li>
                      </ul>
                    </div>
                  )}

                  {approvalAction === "reject" && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Rejection will:</strong>
                      </p>
                      <ul className="text-sm text-red-700 mt-1 space-y-1">
                        <li>• Prevent the provider from accepting sessions</li>
                        <li>• Hide their profile from clients</li>
                        <li>• Require them to reapply for approval</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleApprovalCancel}
                    disabled={approvalLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApprovalConfirm}
                    disabled={approvalLoading}
                    className={approvalAction === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                    }
                  >
                    {approvalLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      approvalAction === "approve" ? "Approve Provider" : "Reject Provider"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 