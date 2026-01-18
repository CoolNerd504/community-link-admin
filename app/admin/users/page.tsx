"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Clock, Shield, User, AlertTriangle } from "lucide-react"
import {
    getAllServiceProvidersAction,
    getAllIndividualUsersAction,
    getPendingProvidersAction,
    updateProviderVettingStatusAction,
    getDisputesAction
} from "@/app/actions"

export default function AdminUsersPage() {
    const [providers, setProviders] = useState<any[]>([])
    const [clients, setClients] = useState<any[]>([])
    const [pendingProviders, setPendingProviders] = useState<any[]>([])
    const [disputes, setDisputes] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                const [providersData, clientsData, pendingData, disputesData] = await Promise.all([
                    getAllServiceProvidersAction(),
                    getAllIndividualUsersAction(),
                    getPendingProvidersAction(),
                    getDisputesAction({})
                ])
                setProviders(providersData)
                setClients(clientsData)
                setPendingProviders(pendingData)
                setDisputes(disputesData)
            } catch (error) {
                console.error("Error loading user data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    const handleApproveProvider = async (providerId: string) => {
        try {
            await updateProviderVettingStatusAction(providerId, "APPROVED")
            setPendingProviders(prev => prev.filter(p => p.id !== providerId))
            const providerToMove = pendingProviders.find(p => p.id === providerId)
            if (providerToMove) {
                setProviders(prev => [...prev, { ...providerToMove, vettingStatus: "APPROVED" }])
            }
        } catch (error) {
            console.error("Error approving provider:", error)
        }
    }

    const handleRejectProvider = async (providerId: string) => {
        try {
            await updateProviderVettingStatusAction(providerId, "REJECTED")
            setPendingProviders(prev => prev.filter(p => p.id !== providerId))
        } catch (error) {
            console.error("Error rejecting provider:", error)
        }
    }

    const filteredProviders = providers.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredClients = clients.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#181818] mb-1">User Management</h1>
                    <p className="text-[15px] text-[#767676]">Manage clients, providers, disputes, and verification requests.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl h-10 gap-2">
                        <Filter className="size-4" />
                        Filters
                    </Button>
                    <Button className="rounded-xl h-10 bg-blue-600 hover:bg-blue-700">
                        Export Data
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="providers" className="space-y-6">
                <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-gray-100 h-auto inline-flex overflow-x-auto max-w-full no-scrollbar">
                    <TabsTrigger value="providers" className="rounded-xl px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all whitespace-nowrap">
                        Service Providers
                        <Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{providers.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="clients" className="rounded-xl px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all whitespace-nowrap">
                        Clients
                        <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{clients.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="vetting" className="rounded-xl px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all whitespace-nowrap">
                        Verification Requests
                        {pendingProviders.length > 0 && (
                            <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{pendingProviders.length}</span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="disputes" className="rounded-xl px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all whitespace-nowrap">
                        Disputes
                        {disputes.length > 0 && (
                            <span className="ml-2 bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{disputes.length}</span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Common Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                        placeholder="Search users by name, email, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-[15px]"
                    />
                </div>

                <TabsContent value="providers">
                    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Specialty</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="py-8 text-center text-gray-500">Loading providers...</td></tr>
                                    ) : filteredProviders.length === 0 ? (
                                        <tr><td colSpan={5} className="py-8 text-center text-gray-500">No providers found</td></tr>
                                    ) : (
                                        filteredProviders.map((provider) => (
                                            <tr key={provider.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                            {provider.name?.charAt(0) || "P"}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-[14px]">{provider.name}</p>
                                                            <p className="text-gray-500 text-[13px]">{provider.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Badge className={`border-0 ${provider.vettingStatus === "APPROVED"
                                                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                            : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                                                        }`}>
                                                        {provider.vettingStatus || "Pending"}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-6 text-gray-600 text-[14px]">{provider.profile?.headline || "General"}</td>
                                                <td className="py-4 px-6 text-gray-500 text-[14px]">
                                                    {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-gray-100">
                                                        <MoreHorizontal className="size-4 text-gray-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="clients">
                    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="py-8 text-center text-gray-500">Loading clients...</td></tr>
                                    ) : filteredClients.length === 0 ? (
                                        <tr><td colSpan={4} className="py-8 text-center text-gray-500">No clients found</td></tr>
                                    ) : (
                                        filteredClients.map((client) => (
                                            <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                                            <User className="size-5" />
                                                        </div>
                                                        <p className="font-semibold text-gray-900 text-[14px]">{client.name}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-600 text-[14px]">{client.email}</td>
                                                <td className="py-4 px-6 text-gray-500 text-[14px]">
                                                    {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-gray-100">
                                                        <MoreHorizontal className="size-4 text-gray-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="vetting">
                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading requests...</div>
                    ) : pendingProviders.length === 0 ? (
                        <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center shadow-sm">
                            <div className="mx-auto size-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="size-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                            <p className="text-gray-500">No pending verification requests.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {pendingProviders.map((provider) => (
                                <div key={provider.id} className="bg-white rounded-[24px] border border-gray-100 p-6 flex flex-col md:flex-row gap-6 shadow-sm">
                                    <div className="size-16 bg-gray-100 rounded-2xl shrink-0 overflow-hidden">
                                        {provider.image ? (
                                            <img src={provider.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User className="size-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{provider.name}</h3>
                                                <p className="text-gray-500 text-sm">{provider.profile?.headline || "No Headline"}</p>
                                            </div>
                                            <Badge variant="outline" className="gap-1 border-orange-200 text-orange-600 bg-orange-50">
                                                <Clock className="size-3" />
                                                Pending
                                            </Badge>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {provider.profile?.bio || "No bio provided."}
                                        </p>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => handleApproveProvider(provider.id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl h-10"
                                            >
                                                <CheckCircle className="size-4 mr-2" />
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleRejectProvider(provider.id)}
                                                className="flex-1 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl h-10"
                                            >
                                                <XCircle className="size-4 mr-2" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="disputes">
                    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Dispute ID</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="py-4 px-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="py-8 text-center text-gray-500">Loading disputes...</td></tr>
                                    ) : disputes.length === 0 ? (
                                        <tr><td colSpan={5} className="py-8 text-center text-gray-500">No disputes found</td></tr>
                                    ) : (
                                        disputes.map((dispute) => (
                                            <tr key={dispute.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6 text-gray-900 font-medium">#{dispute.id.substring(0, 8)}</td>
                                                <td className="py-4 px-6">
                                                    <Badge className={`border-0 ${dispute.status === "OPEN"
                                                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                                                            : "bg-gray-100 text-gray-700"
                                                        }`}>
                                                        {dispute.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-6 text-gray-600">{dispute.reason}</td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {dispute.createdAt ? new Date(dispute.createdAt).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-gray-100">
                                                        <MoreHorizontal className="size-4 text-gray-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
