"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ProviderHeader } from "@/components/provider-shared/provider-header"
import { ProviderSidebar } from "@/components/provider-shared/provider-sidebar"
import { ServiceCard } from "@/components/provider/services/service-card"
import { CreateServiceModal } from "@/components/provider/services/create-service-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ProviderServicesPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [services, setServices] = useState<any[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingService, setEditingService] = useState<any>(null)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    const fetchData = async () => {
        setIsLoadingData(true)
        try {
            const [servicesRes, categoriesRes] = await Promise.all([
                fetch("/api/services"),
                fetch("/api/categories")
            ])

            if (servicesRes.ok) {
                const data = await servicesRes.json()
                setServices(data)
            }
            if (categoriesRes.ok) {
                const data = await categoriesRes.json()
                setCategories(data.map((c: any) => c.name || c))
            }
        } catch (error) {
            console.error("Error fetching services", error)
        } finally {
            setIsLoadingData(false)
        }
    }

    useEffect(() => {
        if (user) fetchData()
    }, [user])

    const handleSubmitService = async (data: any) => {
        try {
            const url = editingService
                ? `/api/services/${editingService.id}`
                : "/api/services"
            const method = editingService ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                fetchData() // Refresh list
            }
        } catch (error) {
            console.error("Error saving service", error)
        }
    }

    const handleDeleteService = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return

        try {
            await fetch(`/api/services/${id}`, { method: "DELETE" })
            setServices(prev => prev.filter(s => s.id !== id))
        } catch (error) {
            console.error("Error deleting service", error)
        }
    }

    const openCreateModal = () => {
        setEditingService(null)
        setIsModalOpen(true)
    }

    const openEditModal = (service: any) => {
        setEditingService(service)
        setIsModalOpen(true)
    }

    if (loading || isLoadingData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <ProviderHeader />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-[28px] font-bold text-[#181818] mb-1">
                            My Services
                        </h1>
                        <p className="text-[15px] text-[#767676]">
                            Manage the services you offer to clients.
                        </p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 rounded-[12px]">
                        <Plus className="size-4 mr-2" />
                        Add New Service
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content (3/4) */}
                    <div className="lg:col-span-3">
                        {services.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[24px] border border-gray-100 text-center min-h-[400px]">
                                <h3 className="text-[18px] font-bold text-gray-900 mb-2">
                                    No services added yet
                                </h3>
                                <p className="text-[14px] text-gray-500 mb-6">
                                    Start by adding your first service to get booked.
                                </p>
                                <Button onClick={openCreateModal} variant="outline">
                                    Create Service
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {services.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        onEdit={openEditModal}
                                        onDelete={handleDeleteService}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar (1/4) */}
                    <div className="lg:col-span-1">
                        <ProviderSidebar />
                    </div>
                </div>
            </div>

            <CreateServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitService}
                initialData={editingService}
                categories={categories}
            />
        </div>
    )
}
