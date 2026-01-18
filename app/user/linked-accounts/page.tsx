"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LinkedAccountsHeader } from "@/components/linked-accounts/linked-accounts-header"
import { ProviderCard } from "@/components/linked-accounts/provider-card"
import { LinkedAccountsSidebar } from "@/components/linked-accounts/linked-accounts-sidebar"
import { UnlinkModal } from "@/components/linked-accounts/unlink-modal"
import { ProviderConfig, LinkedAccount } from "@/components/linked-accounts/types"
import { Github, Facebook, Linkedin, Twitter } from "lucide-react"

// Mock Icons using Lucide (Standard SVGs would be better for brands)
const GoogleIcon = () => (
    <svg className="size-6" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
)

const providers: ProviderConfig[] = [
    {
        id: "google",
        name: "Google",
        icon: <GoogleIcon />,
        description: "Sign in with your Google account",
        color: "#4285F4",
        bgColor: "#E8F0FE"
    },
    {
        id: "github",
        name: "GitHub",
        icon: <Github className="size-6" />,
        description: "Connect your GitHub account",
        color: "#181717",
        bgColor: "#333333"
    },
    {
        id: "facebook",
        name: "Facebook",
        icon: <Facebook className="size-6" />,
        description: "Link your Facebook profile",
        color: "#1877F2",
        bgColor: "#E7F3FF"
    },
    {
        id: "twitter",
        name: "Twitter",
        icon: <Twitter className="size-6" />,
        description: "Connect with Twitter",
        color: "#1DA1F2",
        bgColor: "#E8F5FD"
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: <Linkedin className="size-6" />,
        description: "Link your LinkedIn profile",
        color: "#0A66C2",
        bgColor: "#E7F3FF"
    }
]

export default function UserLinkedAccountsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [accounts, setAccounts] = useState<LinkedAccount[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modal State
    const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false)
    const [providerToUnlink, setProviderToUnlink] = useState<ProviderConfig | null>(null)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchAccounts = async () => {
            setIsLoading(true)
            try {
                // In a real app, this would be GET /api/user/accounts
                // Mocking response for UI demo
                setTimeout(() => {
                    setAccounts([
                        { id: "1", provider: "google", type: "oauth", createdAt: new Date().toISOString() }
                    ])
                }, 500)
            } catch (error) {
                console.error("Error fetching linked accounts:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchAccounts()
    }, [user])

    const handleLink = (providerId: string) => {
        // In real app: signIn(providerId) from next-auth/react
        console.log("Linking:", providerId)

        // Mock successful link
        const newAccount: LinkedAccount = {
            id: Math.random().toString(),
            provider: providerId,
            type: "oauth",
            createdAt: new Date().toISOString()
        }
        setAccounts(prev => [...prev, newAccount])
    }

    const handleUnlinkClick = (providerId: string) => {
        const config = providers.find(p => p.id === providerId)
        if (config) {
            setProviderToUnlink(config)
            setIsUnlinkModalOpen(true)
        }
    }

    const handleUnlinkConfirm = async () => {
        if (!providerToUnlink) return

        try {
            // In real app: DELETE /api/user/accounts/${providerToUnlink.id}
            console.log("Unlinking:", providerToUnlink.id)

            setAccounts(prev => prev.filter(a => a.provider !== providerToUnlink.id))
            setIsUnlinkModalOpen(false)
            setProviderToUnlink(null)
        } catch (error) {
            console.error("Error unlinking account:", error)
        }
    }

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    const connectedCount = accounts.length
    const isLinked = (providerId: string) => accounts.some(a => a.provider === providerId)
    const getLinkedAccount = (providerId: string) => accounts.find(a => a.provider === providerId)

    const connectedProviders = providers.filter(p => isLinked(p.id))
    const availableProviders = providers.filter(p => !isLinked(p.id))

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-12">
            <LinkedAccountsHeader connectedCount={connectedCount} />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column (3/4) */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* Connected Accounts */}
                        {connectedCount > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-[20px] font-bold text-[#181818] mb-1">
                                            Connected Accounts
                                        </h2>
                                        <p className="text-[14px] text-[#767676]">
                                            Accounts you've linked to your profile
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {connectedProviders.map(provider => (
                                        <ProviderCard
                                            key={provider.id}
                                            provider={provider}
                                            isLinked={true}
                                            account={getLinkedAccount(provider.id)}
                                            onUnlink={handleUnlinkClick}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Accounts */}
                        {availableProviders.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-[20px] font-bold text-[#181818] mb-1">
                                            Available to Connect
                                        </h2>
                                        <p className="text-[14px] text-[#767676]">
                                            Link more accounts to enhance your experience
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableProviders.map(provider => (
                                        <ProviderCard
                                            key={provider.id}
                                            provider={provider}
                                            isLinked={false}
                                            onLink={handleLink}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (1/4) - Sticky */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <LinkedAccountsSidebar />
                    </div>
                </div>
            </div>

            <UnlinkModal
                isOpen={isUnlinkModalOpen}
                provider={providerToUnlink}
                onClose={() => setIsUnlinkModalOpen(false)}
                onConfirm={handleUnlinkConfirm}
            />
        </div>
    )
}

