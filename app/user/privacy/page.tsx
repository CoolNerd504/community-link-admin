"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { SecurityHeader } from "@/components/privacy-security/security-header"
import { SecurityScoreSidebar } from "@/components/privacy-security/security-score-sidebar"
import { AuthenticationCard } from "@/components/privacy-security/authentication-card"
import { PrivacySettingsCard } from "@/components/privacy-security/privacy-settings-card"
import { ActiveSessionsCard } from "@/components/privacy-security/active-sessions-card"
import { ChangePasswordModal, Enable2FAModal } from "@/components/privacy-security/modals"
import { ChangePasswordRequest, PrivacySettings, ActiveSession } from "@/components/privacy-security/types"

export default function UserPrivacyPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [phoneVerified, setPhoneVerified] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [isOnline, setIsOnline] = useState(false)
    const [profileVisibility, setProfileVisibility] = useState<"PUBLIC" | "PRIVATE" | "CONTACTS_ONLY">("PUBLIC")

    // Modal States
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [show2FAModal, setShow2FAModal] = useState(false)

    // Mock Active Sessions
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
        {
            id: "1",
            device: "MacBook Pro",
            browser: "Chrome",
            location: "San Francisco, CA",
            lastActive: "Now",
            isCurrent: true
        },
        {
            id: "2",
            device: "iPhone 15 Pro",
            browser: "Safari",
            location: "San Francisco, CA",
            lastActive: "2 hours ago",
            isCurrent: false
        }
    ])

    useEffect(() => {
        if (!loading && !user) router.push("/")
        // In real implementation, these would come from user profile API
        if (user) {
            setEmailVerified(true) // Mock
            setPhoneVerified(true) // Mock
        }
    }, [loading, user, router])

    const calculateSecurityScore = () => {
        let score = 40
        if (twoFactorEnabled) score += 20
        if (phoneVerified) score += 20
        if (emailVerified) score += 20
        return Math.min(score, 100)
    }

    const securityScore = calculateSecurityScore()

    const handleChangePassword = async (data: ChangePasswordRequest) => {
        console.log("Changing password:", data)
        // Mock API call
        // await fetch("/api/auth/change-password", ...)
        setShowPasswordModal(false)
        alert("Password updated successfully")
    }

    const handleToggle2FA = async () => {
        if (twoFactorEnabled) {
            // Disable logic
            setTwoFactorEnabled(false)
        } else {
            // Show Enable Modal
            setShow2FAModal(true)
        }
    }

    const handleEnable2FA = async () => {
        console.log("Enabling 2FA")
        // Mock API call
        setTwoFactorEnabled(true)
        setShow2FAModal(false)
    }

    const handlePrivacyUpdate = (key: 'isOnline' | 'profileVisibility', value: any) => {
        if (key === 'isOnline') setIsOnline(value)
        if (key === 'profileVisibility') setProfileVisibility(value)

        // Mock API call
        console.log("Updating privacy:", { [key]: value })
    }

    const handleEndSession = (sessionId: string) => {
        setActiveSessions(prev => prev.filter(s => s.id !== sessionId))
    }

    const handleEndAllSessions = () => {
        setActiveSessions(prev => prev.filter(s => s.isCurrent))
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-12">
            <SecurityHeader securityScore={securityScore} />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column (3/4) */}
                    <div className="lg:col-span-3 space-y-8">
                        <AuthenticationCard
                            twoFactorEnabled={twoFactorEnabled}
                            emailVerified={emailVerified}
                            phoneVerified={phoneVerified}
                            onChangePassword={() => setShowPasswordModal(true)}
                            onToggle2FA={handleToggle2FA}
                        />

                        <PrivacySettingsCard
                            isOnline={isOnline}
                            profileVisibility={profileVisibility}
                            onUpdatePrivacy={handlePrivacyUpdate}
                        />

                        <ActiveSessionsCard
                            sessions={activeSessions}
                            onEndSession={handleEndSession}
                            onEndAllSessions={handleEndAllSessions}
                        />
                    </div>

                    {/* Right Column (1/4) - Sticky */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <SecurityScoreSidebar
                            securityScore={securityScore}
                            twoFactorEnabled={twoFactorEnabled}
                            phoneVerified={phoneVerified}
                            emailVerified={emailVerified}
                        />
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSubmit={handleChangePassword}
            />

            <Enable2FAModal
                isOpen={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                onEnable={handleEnable2FA}
            />
        </div>
    )
}

