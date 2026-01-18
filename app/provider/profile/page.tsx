"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { signOut } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Briefcase, LogOut, ChevronRight, CheckCircle } from "lucide-react"

export default function ProviderProfilePage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [kycStatus, setKycStatus] = useState("PENDING")

    useEffect(() => {
        if (!loading && !user) router.push("/")
        if (!loading && user?.role !== "PROVIDER") router.push("/dashboard")
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Profile</h1>

                {/* User Info */}
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user?.image || ""} />
                            <AvatarFallback className="text-xl">{user?.name?.[0] || "P"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">{user?.name}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                            <Badge variant="secondary" className="mt-1">Provider</Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push("/profile/edit")}>
                            Edit
                        </Button>
                    </CardContent>
                </Card>

                {/* Menu Items */}
                <div className="space-y-2">
                    {/* KYC */}
                    <Card className="cursor-pointer hover:bg-gray-50" onClick={() => router.push("/kyc")}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Verification</p>
                                    <p className="text-sm text-gray-500">KYC Status: {kycStatus}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </CardContent>
                    </Card>

                    {/* Manage Services */}
                    <Card className="cursor-pointer hover:bg-gray-50" onClick={() => router.push("/provider/services")}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Manage Services</p>
                                    <p className="text-sm text-gray-500">Add, edit, or remove services</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card className="cursor-pointer hover:bg-gray-50" onClick={() => router.push("/settings/security")}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Privacy & Security</p>
                                    <p className="text-sm text-gray-500">PIN, password, and security settings</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </CardContent>
                    </Card>
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
