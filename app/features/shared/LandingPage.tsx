"use client"
import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import {
  Star,
  Users,
  Shield,
  Zap,
  Video,
  MessageCircle,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle,
  Play,
  LayoutDashboard
} from "lucide-react"
import { AuthPage } from "./AuthPage"
import { useAuth } from "../../../hooks/use-auth"
import { useRouter } from "next/navigation"
import { getDashboardPath } from "@/lib/navigation"

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const getDashboardRoute = () => {
    return getDashboardPath(user?.role)
  }

  const getDashboardLabel = () => {
    if (!user) return "Dashboard"
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") return "Admin Dashboard"
    if (user.role === "PROVIDER") return "Provider Dashboard"
    return "My Dashboard"
  }

  if (showAuth) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CommLink</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push(getDashboardRoute())}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {getDashboardLabel()}
                  </Button>
                  <Button onClick={() => router.push("/search")}>
                    Find Providers
                  </Button>
                  <Button variant="ghost" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setShowAuth(true)}>
                    Sign In
                  </Button>
                  <Button onClick={() => setShowAuth(true)}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with
            <span className="text-blue-600"> Service Providers</span>
            <br />
            Instantly
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            CommLink bridges the gap between clients and verified service providers through real-time voice calls,
            instant messaging, and secure payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowAuth(true)} className="text-lg px-8 py-3">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose CommLink?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience seamless connections with verified professionals across various services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Instant Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with service providers in real-time through high-quality voice calls and instant messaging.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Verified Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All service providers are thoroughly vetted and verified to ensure quality and reliability.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Quality Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Rate and review your experiences to help build a trusted community of professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Provider</h3>
              <p className="text-gray-600">
                Browse through our verified service providers and find the perfect match for your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Instantly</h3>
              <p className="text-gray-600">
                Start a voice call or send a message to connect with your chosen provider immediately.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600">
                Receive professional services and support, then rate your experience to help others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600">
              Find the help you need across various categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Life Coaching", icon: "🎯", count: "50+ providers" },
              { name: "Therapy", icon: "🧠", count: "30+ providers" },
              { name: "Fitness Training", icon: "💪", count: "40+ providers" },
              { name: "Career Advice", icon: "💼", count: "25+ providers" },
              { name: "Nutrition", icon: "🥗", count: "20+ providers" },
              { name: "Business Consulting", icon: "📈", count: "35+ providers" },
              { name: "Language Learning", icon: "🗣️", count: "15+ providers" },
              { name: "Creative Arts", icon: "🎨", count: "20+ providers" },
            ].map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <h3 className="font-semibold mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already connecting with verified service providers on CommLink.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setShowAuth(true)}
              className="text-lg px-8 py-3"
            >
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowAuth(true)}
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CommLink</h3>
              <p className="text-gray-400">
                Connecting clients with verified service providers through instant communication.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Find Providers</li>
                <li>Book Sessions</li>
                <li>Rate & Review</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Get Verified</li>
                <li>Manage Profile</li>
                <li>Earn Money</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CommLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 