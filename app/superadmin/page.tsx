"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, UserPlus, Trash2, Key, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function SuperAdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [secretKey, setSecretKey] = useState("")
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [newAdminEmail, setNewAdminEmail] = useState("")
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Super Admin Creation
    const [showCreateSuperAdmin, setShowCreateSuperAdmin] = useState(false)
    const [superAdminData, setSuperAdminData] = useState({
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    })

    // Secret key for one-time access
    const SUPER_ADMIN_KEY = process.env.NEXT_PUBLIC_SUPER_ADMIN_KEY || "COMMLINK_SUPER_2024"

    const handleAuthenticate = () => {
        if (secretKey === SUPER_ADMIN_KEY) {
            setIsAuthenticated(true)
            checkSuperAdminExists()
        } else {
            setMessage({ type: 'error', text: 'Invalid secret key' })
        }
    }

    const checkSuperAdminExists = async () => {
        try {
            const response = await fetch('/api/superadmin/users')
            if (response.ok) {
                const data = await response.json()
                const superAdmin = data.users?.find((u: any) => u.role === 'SUPER_ADMIN')
                if (!superAdmin) {
                    setShowCreateSuperAdmin(true)
                } else {
                    loadUsers()
                }
            }
        } catch (error) {
            console.error('Failed to check super admin', error)
        }
    }

    const createSuperAdmin = async () => {
        if (superAdminData.password !== superAdminData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            return
        }

        if (superAdminData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/superadmin/create-superadmin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: superAdminData.email,
                    phoneNumber: superAdminData.phoneNumber,
                    password: superAdminData.password,
                    secretKey
                })
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Super Admin account created successfully! You can now log in at /admin' })
                setShowCreateSuperAdmin(false)
                loadUsers()
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Failed to create super admin' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error creating super admin' })
        } finally {
            setLoading(false)
        }
    }

    const loadUsers = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/superadmin/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users || [])
            }
        } catch (error) {
            console.error('Failed to load users', error)
        } finally {
            setLoading(false)
        }
    }

    const promoteToAdmin = async (userId: string) => {
        setLoading(true)
        try {
            const response = await fetch('/api/superadmin/promote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, secretKey })
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'User promoted to admin successfully' })
                loadUsers()
            } else {
                setMessage({ type: 'error', text: 'Failed to promote user' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error promoting user' })
        } finally {
            setLoading(false)
        }
    }

    const demoteAdmin = async (userId: string) => {
        setLoading(true)
        try {
            const response = await fetch('/api/superadmin/demote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, secretKey })
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Admin demoted successfully' })
                loadUsers()
            } else {
                setMessage({ type: 'error', text: 'Failed to demote admin' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error demoting admin' })
        } finally {
            setLoading(false)
        }
    }

    const createAdminByEmail = async () => {
        if (!newAdminEmail) return

        setLoading(true)
        try {
            const response = await fetch('/api/superadmin/create-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newAdminEmail, secretKey })
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'User promoted to admin successfully' })
                setNewAdminEmail("")
                loadUsers()
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Failed to create admin' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error creating admin' })
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <Shield className="w-8 h-8 text-indigo-600" />
                        </div>
                        <CardTitle className="text-2xl">SuperAdmin Access</CardTitle>
                        <CardDescription>
                            Enter the secret key to access admin management
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="secretKey">Secret Key</Label>
                            <Input
                                id="secretKey"
                                type="password"
                                placeholder="Enter secret key"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAuthenticate()}
                            />
                        </div>
                        {message && (
                            <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                }`}>
                                {message.text}
                            </div>
                        )}
                        <Button onClick={handleAuthenticate} className="w-full">
                            <Key className="w-4 h-4 mr-2" />
                            Authenticate
                        </Button>
                        <p className="text-xs text-center text-gray-500">
                            This is a one-time access page for initial setup
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Show Super Admin Creation Form
    if (showCreateSuperAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <Shield className="w-8 h-8 text-indigo-600" />
                        </div>
                        <CardTitle className="text-2xl">Create Super Admin Account</CardTitle>
                        <CardDescription>
                            Set up the primary super administrator account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-sm text-blue-800">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>This account will have full system access. Only one Super Admin can exist.</p>
                        </div>

                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="superadmin@example.com"
                                value={superAdminData.email}
                                onChange={(e) => setSuperAdminData({ ...superAdminData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+260 XXX XXX XXX"
                                value={superAdminData.phoneNumber}
                                onChange={(e) => setSuperAdminData({ ...superAdminData, phoneNumber: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Minimum 6 characters"
                                value={superAdminData.password}
                                onChange={(e) => setSuperAdminData({ ...superAdminData, password: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter password"
                                value={superAdminData.confirmPassword}
                                onChange={(e) => setSuperAdminData({ ...superAdminData, confirmPassword: e.target.value })}
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <Button
                            onClick={createSuperAdmin}
                            className="w-full"
                            disabled={loading || !superAdminData.email || !superAdminData.phoneNumber || !superAdminData.password}
                        >
                            {loading ? 'Creating...' : 'Create Super Admin Account'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Panel</h1>
                    </div>
                    <p className="text-gray-600">Manage admin users and permissions</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <XCircle className="w-5 h-5" />
                        )}
                        {message.text}
                    </div>
                )}

                {/* Create Admin by Email */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Promote User to Admin</CardTitle>
                        <CardDescription>Enter a user's email to grant them admin privileges</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                placeholder="user@example.com"
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && createAdminByEmail()}
                            />
                            <Button onClick={createAdminByEmail} disabled={loading || !newAdminEmail}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Promote to Admin
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Users List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>Manage user roles and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>No users found. Click "Load Users" to fetch from database.</p>
                                <Button onClick={loadUsers} className="mt-4">Load Users</Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.image || ""} />
                                                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.name || "Unnamed User"}</p>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                            {user.role === 'SUPER_ADMIN' ? (
                                                <Badge variant="outline" className="text-indigo-600">Protected</Badge>
                                            ) : user.role === 'ADMIN' ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => demoteAdmin(user.id)}
                                                    disabled={loading}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Demote
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => promoteToAdmin(user.id)}
                                                    disabled={loading}
                                                >
                                                    <UserPlus className="w-4 h-4 mr-1" />
                                                    Make Admin
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
