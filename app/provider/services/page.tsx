"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, X, ArrowLeft } from "lucide-react"

interface Service {
    id: string
    title: string
    description: string
    price: number
    duration: number
    category: string
    isActive: boolean
}

export default function ManageServicesPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [services, setServices] = useState<Service[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        duration: 30,
        category: ""
    })

    useEffect(() => {
        if (!loading && (!user || user.role !== "PROVIDER")) {
            router.push("/")
        }
    }, [user, loading, router])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch services
                const servicesRes = await fetch("/api/services")
                if (servicesRes.ok) {
                    const data = await servicesRes.json()
                    setServices(data)
                }

                // Fetch categories
                const categoriesRes = await fetch("/api/categories")
                if (categoriesRes.ok) {
                    const data = await categoriesRes.json()
                    setCategories(data.map((c: any) => c.name))
                }

                // Fetch profile for interests
                const profileRes = await fetch("/api/mobile/profile")
                if (profileRes.ok) {
                    const data = await profileRes.json()
                    setSelectedInterests(data.profile?.interests || [])
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchData()
    }, [user])

    const openAddModal = () => {
        setEditingService(null)
        setFormData({ title: "", description: "", price: 0, duration: 30, category: "" })
        setIsModalOpen(true)
    }

    const openEditModal = (service: Service) => {
        setEditingService(service)
        setFormData({
            title: service.title,
            description: service.description,
            price: service.price,
            duration: service.duration,
            category: service.category
        })
        setIsModalOpen(true)
    }

    const handleSaveService = async () => {
        try {
            if (editingService) {
                // Update
                await fetch(`/api/services/${editingService.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                })
                setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...formData } : s))
            } else {
                // Create
                const res = await fetch("/api/services", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                })
                if (res.ok) {
                    const newService = await res.json()
                    setServices(prev => [...prev, newService])
                }
            }
            setIsModalOpen(false)
        } catch (error) {
            console.error("Error saving service:", error)
        }
    }

    const handleDeleteService = async (id: string) => {
        if (!confirm("Delete this service?")) return
        try {
            await fetch(`/api/services/${id}`, { method: "DELETE" })
            setServices(prev => prev.filter(s => s.id !== id))
        } catch (error) {
            console.error("Error deleting service:", error)
        }
    }

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        )
    }

    const saveInterests = async () => {
        try {
            await fetch("/api/mobile/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ interests: selectedInterests })
            })
            alert("Interests updated!")
        } catch (error) {
            console.error("Error saving interests:", error)
        }
    }

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => router.push("/provider/profile")} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
                    </Button>
                    <h1 className="text-2xl font-bold">Manage Services</h1>
                </div>

                <Tabs defaultValue="services" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="interests">Interests</TabsTrigger>
                    </TabsList>

                    {/* Services Tab */}
                    <TabsContent value="services">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <h3 className="font-semibold">Your Services</h3>
                                <Button onClick={openAddModal}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Service
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {services.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No services yet. Add your first!</p>
                                ) : (
                                    <div className="space-y-3">
                                        {services.map(service => (
                                            <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{service.title}</p>
                                                    <p className="text-sm text-gray-500">{service.category} • {service.duration} mins</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge>ZMW {service.price}</Badge>
                                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(service)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteService(service.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Interests Tab */}
                    <TabsContent value="interests">
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">Your Interests</h3>
                                <p className="text-sm text-gray-500">Select categories that match your expertise</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <Badge
                                            key={cat}
                                            variant={selectedInterests.includes(cat) ? "default" : "outline"}
                                            className="cursor-pointer px-4 py-2"
                                            onClick={() => toggleInterest(cat)}
                                        >
                                            {selectedInterests.includes(cat) && "✓ "}
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                                <Button onClick={saveInterests}>Save Interests</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Service Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g. 1-on-1 Consultation"
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe your service..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Price (ZMW)</Label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                    />
                                </div>
                                <div>
                                    <Label>Duration (mins)</Label>
                                    <Input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Category</Label>
                                <select
                                    className="w-full h-10 px-3 border rounded-md"
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveService}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
