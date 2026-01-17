"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Service {
    id: string
    title: string
    description: string
    price: number
    duration: number
    category: string
    isActive: boolean
}

export default function ServiceList() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services")
            if (res.ok) {
                const data = await res.json()
                setServices(data)
            }
        } catch (error) {
            console.error("Failed to fetch services", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading services...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Services</h2>
                <button
                    onClick={() => router.push("/provider/services/new")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add New Service
                </button>
            </div>

            {services.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">You haven't created any services yet.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{service.title}</h3>
                                <div className="space-x-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {service.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                            <div className="flex justify-between items-center text-sm border-t pt-3 mt-2">
                                <div>
                                    <span className="font-medium">Price:</span> K{service.price}
                                </div>
                                <div>
                                    <span className="font-medium">Duration:</span> {service.duration}m
                                </div>
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => router.push(`/provider/services/${service.id}/edit`)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 text-sm"
                                >
                                    Edit
                                </button>
                                <button className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 text-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
