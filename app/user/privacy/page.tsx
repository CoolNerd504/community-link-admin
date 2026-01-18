"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Lock, Key, Shield } from "lucide-react"

export default function UserPrivacyPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [currentPin, setCurrentPin] = useState("")
    const [newPin, setNewPin] = useState("")
    const [confirmPin, setConfirmPin] = useState("")
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    const handleChangePin = async () => {
        if (newPin !== confirmPin) {
            alert("PINs do not match")
            return
        }
        if (newPin.length !== 6) {
            alert("PIN must be 6 digits")
            return
        }

        setIsUpdating(true)
        try {
            await fetch("/api/auth/change-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPin, newPin })
            })
            alert("PIN updated successfully")
            setCurrentPin("")
            setNewPin("")
            setConfirmPin("")
        } catch (error) {
            console.error("Error changing PIN:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleToggle2FA = async (enabled: boolean) => {
        setTwoFactorEnabled(enabled)
        try {
            await fetch("/api/auth/2fa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled })
            })
        } catch (error) {
            console.error("Error updating 2FA:", error)
            setTwoFactorEnabled(!enabled)
        }
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">Privacy & Security</h1>
                </div>

                {/* Change PIN */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Lock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Change PIN</h3>
                            <p className="text-sm text-gray-500">Update your 6-digit transaction PIN</p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Current PIN</Label>
                            <Input
                                type="password"
                                maxLength={6}
                                value={currentPin}
                                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                                placeholder="••••••"
                            />
                        </div>
                        <div>
                            <Label>New PIN</Label>
                            <Input
                                type="password"
                                maxLength={6}
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                                placeholder="••••••"
                            />
                        </div>
                        <div>
                            <Label>Confirm New PIN</Label>
                            <Input
                                type="password"
                                maxLength={6}
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                                placeholder="••••••"
                            />
                        </div>
                        <Button onClick={handleChangePin} disabled={isUpdating}>
                            {isUpdating ? "Updating..." : "Update PIN"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Change Password */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Key className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Change Password</h3>
                            <p className="text-sm text-gray-500">Update your account password</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" onClick={() => router.push("/auth/forgot-password")}>
                            Change Password
                        </Button>
                    </CardContent>
                </Card>

                {/* Two-Factor Authentication */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                        <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
