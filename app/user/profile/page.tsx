"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { signOut } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Shield, CreditCard, CheckCircle, LogOut, ChevronRight, Edit } from "lucide-react"

export default function UserProfilePage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [kycStatus, setKycStatus] = useState("PENDING")

    useEffect(() => {
        if (!loading && !user) router.push("/")
        if (!loading && user?.role === "PROVIDER") router.push("/provider/profile")
    }, [loading, user, router])

    useEffect(() => {
        const fetchKyc = async () => {
            try {
                const res = await fetch("/api/kyc/status")
                if (res.ok) {
                    const data = await res.json()
                    setKycStatus(data.status)
                }
            } catch (error) {
                console.error("Error fetching KYC:", error)
            }
        }

        if (user) fetchKyc()
    }, [user])

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    const menuItems = [
        {
            icon: CheckCircle,
            label: "Verification",
            description: `KYC Status: ${kycStatus}`,
            href: "/kyc",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            icon: Shield,
            label: "Privacy & Security",
            description: "PIN, password, and security",
            href: "/user/privacy",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            icon: CreditCard,
            label: "Linked Accounts",
            description: "Payment methods",
            href: "/user/linked-accounts",
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Profile</h1>

                {/* User Info Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={user?.image || ""} />
                                <AvatarFallback className="text-2xl">{user?.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
                                <p className="text-gray-500">{user?.email}</p>
                                <Badge variant="secondary" className="mt-2">Client</Badge>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => router.push("/profile/edit")}>
                                <Edit className="w-4 h-4" />
                            </Button>
                        </div>
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
                                    <div className={`w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center`}>
                                        <item.icon className={`w-5 h-5 ${item.iconColor}`} />
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
