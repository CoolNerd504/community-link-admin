"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Tag, Package, CreditCard, MoreHorizontal, Edit, Trash, CheckCircle } from "lucide-react"
import {
    getCategoriesAction,
    getPricingTiersAction,
    getMinutePackagesAction,
    deleteCategoryAction,
    deletePricingTierAction,
    deleteMinutePackageAction
} from "@/app/actions"

export default function AdminPlatformPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [pricingTiers, setPricingTiers] = useState<any[]>([])
    const [minutePackages, setMinutePackages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                const [cats, tiers, packages] = await Promise.all([
                    getCategoriesAction(),
                    getPricingTiersAction(),
                    getMinutePackagesAction()
                ])
                setCategories(cats)
                setPricingTiers(tiers)
                setMinutePackages(packages)
            } catch (error) {
                console.error("Error loading platform data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#181818] mb-1">Platform Management</h1>
                    <p className="text-[15px] text-[#767676]">Manage categories, pricing tiers, and calling packages.</p>
                </div>
            </div>

            <Tabs defaultValue="categories" className="space-y-6">
                <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-gray-100 h-auto inline-flex overflow-x-auto max-w-full no-scrollbar">
                    <TabsTrigger value="categories" className="rounded-xl px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all whitespace-nowrap">
                        <Tag className="size-4 mr-2" />
                        Categories
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="rounded-xl px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all whitespace-nowrap">
                        <CreditCard className="size-4 mr-2" />
                        Pricing Tiers
                    </TabsTrigger>
                    <TabsTrigger value="packages" className="rounded-xl px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all whitespace-nowrap">
                        <Package className="size-4 mr-2" />
                        Packages & Rates
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="categories">
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-full max-w-md">
                            <Input placeholder="Search categories..." className="pl-4 h-11 rounded-xl bg-white border-gray-200" />
                        </div>
                        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 h-11">
                            <Plus className="size-4 mr-2" />
                            Add Category
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-bold">
                                    {category.icon ? <span>{category.icon}</span> : <Tag className="size-6" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{category.providerServices?.length || 0} services</p>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="pricing">
                    <div className="flex justify-end mb-6">
                        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 h-11">
                            <Plus className="size-4 mr-2" />
                            Add Pricing Tier
                        </Button>
                    </div>

                    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-500">Tier Name</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-500">Price Range</th>
                                    <th className="py-4 px-6 text-sm font-semibold text-gray-500">Commission</th>
                                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricingTiers.map((tier) => (
                                    <tr key={tier.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td className="py-4 px-6 font-medium text-gray-900">{tier.name}</td>
                                        <td className="py-4 px-6 text-gray-600">{tier.minPrice} - {tier.maxPrice} ZMW</td>
                                        <td className="py-4 px-6 text-gray-600">{tier.commissionRate}%</td>
                                        <td className="py-4 px-6 text-right">
                                            <Button variant="ghost" size="icon" className="size-8 rounded-full">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                <TabsContent value="packages">
                    <div className="flex justify-end mb-6">
                        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 h-11">
                            <Plus className="size-4 mr-2" />
                            Add Minute Package
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {minutePackages.map((pkg) => (
                            <div key={pkg.id} className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Package className="size-24 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                                <div className="text-3xl font-bold text-blue-600 mb-1">{pkg.minutes} <span className="text-sm font-medium text-gray-500">mins</span></div>
                                <p className="text-lg font-medium text-gray-700 mb-6">ZMW {pkg.price}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <CheckCircle className="size-4 text-green-500 mr-2" />
                                        Valid for 30 days
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <CheckCircle className="size-4 text-green-500 mr-2" />
                                        Works with all providers
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1 rounded-xl border-gray-200">Edit</Button>
                                    <Button variant="ghost" className="rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600">
                                        <Trash className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
