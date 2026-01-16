"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AdminDashboard } from "../features/admin/AdminDashboard"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle } from "lucide-react"

export default function AdminPage() {
    const router = useRouter()
    const { user, loading } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!loading && user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            // User is logged in but not an admin, redirect to home
            router.push('/')
        }
    }, [user, loading, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoggingIn(true)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid credentials")
            } else {
                // Login successful, page will refresh with user data
                window.location.reload()
            }
        } catch (error) {
            setError("An error occurred during login")
        } finally {
            setIsLoggingIn(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Show login page if not logged in
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <Shield className="w-8 h-8 text-indigo-600" />
                        </div>
                        <CardTitle className="text-2xl">Admin Login</CardTitle>
                        <CardDescription>
                            Sign in with your admin credentials to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-800 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={isLoggingIn}>
                                {isLoggingIn ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                        <div className="mt-4 text-center">
                            <Button variant="link" onClick={() => router.push("/")}>
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Show access denied if logged in but not admin
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                    <Button onClick={() => router.push("/")}>Go to Home</Button>
                </div>
            </div>
        )
    }

    return <AdminDashboard currentUser={user} />
}
