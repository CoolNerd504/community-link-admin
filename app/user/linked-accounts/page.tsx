"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Phone, Plus, Trash2, Building } from "lucide-react"

interface PaymentMethod {
    id: string
    type: "MOBILE_MONEY" | "BANK" | "CARD"
    name: string
    lastFour?: string
    isDefault: boolean
}

export default function UserLinkedAccountsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [methods, setMethods] = useState<PaymentMethod[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newMethod, setNewMethod] = useState({ type: "MOBILE_MONEY", phone: "", bankName: "", accountNumber: "" })

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchMethods = async () => {
            setIsLoading(true)
            try {
                const res = await fetch("/api/payment-methods")
                if (res.ok) {
                    const data = await res.json()
                    setMethods(data)
                }
            } catch (error) {
                console.error("Error fetching payment methods:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchMethods()
    }, [user])

    const handleAdd = async () => {
        try {
            const res = await fetch("/api/payment-methods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMethod)
            })
            if (res.ok) {
                const created = await res.json()
                setMethods(prev => [...prev, created])
                setIsModalOpen(false)
                setNewMethod({ type: "MOBILE_MONEY", phone: "", bankName: "", accountNumber: "" })
            }
        } catch (error) {
            console.error("Error adding method:", error)
        }
    }

    const handleRemove = async (id: string) => {
        if (!confirm("Remove this payment method?")) return
        try {
            await fetch(`/api/payment-methods/${id}`, { method: "DELETE" })
            setMethods(prev => prev.filter(m => m.id !== id))
        } catch (error) {
            console.error("Error removing method:", error)
        }
    }

    const handleSetDefault = async (id: string) => {
        try {
            await fetch(`/api/payment-methods/${id}/default`, { method: "POST" })
            setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })))
        } catch (error) {
            console.error("Error setting default:", error)
        }
    }

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    const getIcon = (type: string) => {
        switch (type) {
            case "MOBILE_MONEY": return Phone
            case "BANK": return Building
            default: return CreditCard
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">Linked Accounts</h1>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                </div>

                {methods.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">No payment methods linked</p>
                            <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                                Add Payment Method
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {methods.map(method => {
                            const Icon = getIcon(method.type)
                            return (
                                <Card key={method.id}>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{method.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {method.lastFour ? `****${method.lastFour}` : method.type}
                                                </p>
                                            </div>
                                            {method.isDefault && <Badge>Default</Badge>}
                                        </div>
                                        <div className="flex gap-2">
                                            {!method.isDefault && (
                                                <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method.id)}>
                                                    Set Default
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleRemove(method.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}

                {/* Add Method Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Payment Method</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Type</Label>
                                <select
                                    className="w-full h-10 px-3 border rounded-md"
                                    value={newMethod.type}
                                    onChange={(e) => setNewMethod(prev => ({ ...prev, type: e.target.value as any }))}
                                >
                                    <option value="MOBILE_MONEY">Mobile Money</option>
                                    <option value="BANK">Bank Account</option>
                                </select>
                            </div>

                            {newMethod.type === "MOBILE_MONEY" && (
                                <div>
                                    <Label>Phone Number</Label>
                                    <Input
                                        placeholder="0971234567"
                                        value={newMethod.phone}
                                        onChange={(e) => setNewMethod(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                            )}

                            {newMethod.type === "BANK" && (
                                <>
                                    <div>
                                        <Label>Bank Name</Label>
                                        <Input
                                            placeholder="Bank name"
                                            value={newMethod.bankName}
                                            onChange={(e) => setNewMethod(prev => ({ ...prev, bankName: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Account Number</Label>
                                        <Input
                                            placeholder="Account number"
                                            value={newMethod.accountNumber}
                                            onChange={(e) => setNewMethod(prev => ({ ...prev, accountNumber: e.target.value }))}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdd}>Add</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
