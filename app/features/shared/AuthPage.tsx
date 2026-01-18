"use client"
import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Badge } from "../../../components/ui/badge"
import { Star, Users } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getDashboardPath } from "@/lib/navigation"

export function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [selectedUserType, setSelectedUserType] = useState<"individual" | "provider">("individual")
  const [authMethod, setAuthMethod] = useState<"email" | "google" | "phone">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [emailForm, setEmailForm] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    phoneNumber: "",
    pin: "",
    userType: "individual" as "individual" | "provider"
  })

  // Update emailForm when user type changes
  const handleUserTypeChange = (value: string) => {
    const newUserType = value as "individual" | "provider"
    setSelectedUserType(newUserType)
    setEmailForm(prev => ({ ...prev, userType: newUserType }))
  }

  const router = useRouter()

  const handleEmailAuth = async () => {
    setLoading(true)
    setError(null)

    try {
      if (authMode === "login") {
        const result = await signIn("credentials", {
          email: emailForm.email,
          password: emailForm.password,
          redirect: false,
        })

        if (result?.error) {
          setError("Invalid email or password")
        } else {
          router.push("/dashboard")
          router.refresh()
        }
      } else {
        // Handle signup via API
        const payload = {
          name: emailForm.name,
          email: emailForm.email,
          password: emailForm.password,
          username: emailForm.username,
          phoneNumber: emailForm.phoneNumber,
          pin: emailForm.pin,
          role: emailForm.userType === "provider" ? "PROVIDER" : "USER"
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Registration failed")
        }

        // Auto login after signup
        const result = await signIn("credentials", {
          email: emailForm.email,
          password: emailForm.password,
          redirect: false,
        })

        if (result?.ok) {
          router.push("/dashboard")
          router.refresh()
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError(null)
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch (err: any) {
      setError("Google authentication failed")
      setLoading(false)
    }
  }

  const handlePhoneAuth = async () => {
    setError("Phone auth is currently disabled for migration.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CommLink</h1>
          <p className="text-gray-600">Connect with service providers instantly</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {authMode === "login" ? "Welcome Back" : "Join CommLink"}
            </CardTitle>
            <p className="text-gray-600">
              {authMode === "login"
                ? "Sign in to your account"
                : "Create your account to get started"
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Type Tabs */}
            <Tabs value={selectedUserType} onValueChange={handleUserTypeChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="individual" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Individual</span>
                </TabsTrigger>
                <TabsTrigger value="provider" className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Service Provider</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="individual" className="space-y-6">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    <Users className="h-3 w-3 mr-1" />
                    Individual User
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {authMode === "login"
                      ? "Sign in to connect with service providers"
                      : "Join as a client to access professional services"
                    }
                  </p>
                </div>

                {/* Auth Method Tabs */}
                <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="google">Google</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="space-y-4">
                    {authMode === "signup" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="John Doe"
                              value={emailForm.name}
                              onChange={(e) => setEmailForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              type="text"
                              placeholder="jdoe"
                              value={emailForm.username}
                              onChange={(e) => setEmailForm(prev => ({ ...prev, username: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+26097..."
                            value={emailForm.phoneNumber}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="pin">Secure PIN (6 Digits)</Label>
                          <Input
                            id="pin"
                            type="password"
                            placeholder="123456"
                            maxLength={6}
                            value={emailForm.pin}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '') }))}
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={emailForm.email}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Strong password"
                        value={emailForm.password}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <Button
                      onClick={handleEmailAuth}
                      disabled={loading || !emailForm.email || !emailForm.password}
                      className="w-full"
                    >
                      {loading ? "Loading..." : authMode === "login" ? "Sign In" : "Sign Up"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="google" className="space-y-4">
                    <Button
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </Button>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <Button
                      onClick={handlePhoneAuth}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      Continue with Phone
                    </Button>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="provider" className="space-y-6">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    <Star className="h-3 w-3 mr-1" />
                    Service Provider
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {authMode === "login"
                      ? "Sign in to manage your services"
                      : "Join as a provider to offer your expertise"
                    }
                  </p>
                </div>

                {/* Auth Method Tabs */}
                <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="google">Google</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="space-y-4">
                    {authMode === "signup" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="provider-name">Full Name</Label>
                            <Input
                              id="provider-name"
                              type="text"
                              placeholder="Jane Doe"
                              value={emailForm.name}
                              onChange={(e) => setEmailForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="provider-username">Username</Label>
                            <Input
                              id="provider-username"
                              type="text"
                              placeholder="janedoe_pro"
                              value={emailForm.username}
                              onChange={(e) => setEmailForm(prev => ({ ...prev, username: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="provider-phone">Phone Number</Label>
                          <Input
                            id="provider-phone"
                            type="tel"
                            placeholder="+26097..."
                            value={emailForm.phoneNumber}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="provider-pin">Secure PIN (6 Digits)</Label>
                          <Input
                            id="provider-pin"
                            type="password"
                            placeholder="123456"
                            maxLength={6}
                            value={emailForm.pin}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '') }))}
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <Label htmlFor="provider-email">Email</Label>
                      <Input
                        id="provider-email"
                        type="email"
                        placeholder="pro@example.com"
                        value={emailForm.email}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="provider-password">Password</Label>
                      <Input
                        id="provider-password"
                        type="password"
                        placeholder="Strong password"
                        value={emailForm.password}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <Button
                      onClick={handleEmailAuth}
                      disabled={loading || !emailForm.email || !emailForm.password}
                      className="w-full"
                    >
                      {loading ? "Loading..." : authMode === "login" ? "Sign In" : "Sign Up"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="google" className="space-y-4">
                    <Button
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </Button>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <Button
                      onClick={handlePhoneAuth}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      Continue with Phone
                    </Button>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Toggle Auth Mode */}
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                className="text-sm"
              >
                {authMode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}