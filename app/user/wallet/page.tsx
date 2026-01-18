"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Plus, History } from "lucide-react"

import { WalletHeader } from "@/components/wallet/wallet-header"
import { BalanceCard } from "@/components/wallet/balance-card"
import { MinutePackageGrid } from "@/components/wallet/minute-package-grid"
import { PaymentMethodSelector } from "@/components/wallet/payment-method-selector"
import { TransactionHistory } from "@/components/wallet/transaction-history"
import { WalletSidebar } from "@/components/wallet/wallet-sidebar"

export default function UserWalletPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [wallet, setWallet] = useState<any>(null)
    const [packages, setPackages] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<"packages" | "history">("packages")
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch Wallet
                const walletRes = await fetch("/api/wallet/balance")
                if (walletRes.ok) {
                    const data = await walletRes.json()
                    setWallet(data)
                }

                // Fetch Packages
                const packagesRes = await fetch("/api/minute-packages")
                if (packagesRes.ok) {
                    const data = await packagesRes.json()
                    setPackages(data)
                }
            } catch (error) {
                console.error("Error fetching wallet data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchData()
    }, [user])

    const handlePurchase = async () => {
        if (!selectedPackage || !selectedPaymentMethod) return

        try {
            const res = await fetch("/api/wallet/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ packageId: selectedPackage, paymentMethod: selectedPaymentMethod })
            })

            if (res.ok) {
                const purchase = await res.json()
                alert("Purchase Successful!")

                // Refresh wallet data
                const walletRes = await fetch("/api/wallet/balance")
                if (walletRes.ok) {
                    const data = await walletRes.json()
                    setWallet(data)
                }

                // Reset selection and switch to history
                setSelectedPackage(null)
                setSelectedPaymentMethod(null)
                setActiveTab("history")
            } else {
                const error = await res.json()
                alert(`Purchase failed: ${error.message}`)
            }
        } catch (error) {
            console.error("Purchase error:", error)
            alert("An error occurred during purchase.")
        }
    }

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
            </div>
        )
    }

    const stats = {
        availableMinutes: wallet?.availableMinutes || 0,
        totalPurchased: wallet?.totalMinutesPurchased || 0,
        totalSpent: wallet?.transactions?.filter((t: any) => t.type === 'DEPOSIT').reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0,
        avgSessionLength: 45, // Calc from sessions eventually
        currency: wallet?.currency || "ZMW"
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-12">
            <WalletHeader onViewHistory={() => setActiveTab("history")} />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Column (3/4 width) */}
                    <div className="lg:col-span-3">
                        <BalanceCard stats={stats} />

                        {/* Custom Tab Navigation */}
                        <div className="backdrop-blur-[16px] bg-[rgba(252,252,252,0.95)] rounded-[24px] border border-[#eee] p-2 mb-6 shadow-[0px_16px_35px_0px_rgba(0,0,0,0.04)]">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab("packages")}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-[14px] font-semibold transition-all ${activeTab === "packages"
                                            ? "bg-[#2563eb] text-white shadow-md"
                                            : "text-[#767676] hover:bg-[#f5f5f5] hover:text-[#181818]"
                                        }`}
                                >
                                    <Plus className="size-4" />
                                    Buy Minutes
                                </button>
                                <button
                                    onClick={() => setActiveTab("history")}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-[14px] font-semibold transition-all ${activeTab === "history"
                                            ? "bg-[#2563eb] text-white shadow-md"
                                            : "text-[#767676] hover:bg-[#f5f5f5] hover:text-[#181818]"
                                        }`}
                                >
                                    <History className="size-4" />
                                    Transaction History
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "packages" && (
                            <div className="space-y-8">
                                <MinutePackageGrid
                                    packages={packages}
                                    selectedPackage={selectedPackage}
                                    onSelect={setSelectedPackage}
                                    currency={stats.currency}
                                />

                                {selectedPackage && (
                                    <PaymentMethodSelector
                                        packages={packages}
                                        selectedPackageId={selectedPackage}
                                        selectedMethod={selectedPaymentMethod}
                                        onSelectMethod={setSelectedPaymentMethod}
                                        onPurchase={handlePurchase}
                                        currency={stats.currency}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === "history" && (
                            <TransactionHistory
                                transactions={wallet?.transactions || []}
                                currency={stats.currency}
                            />
                        )}
                    </div>

                    {/* Sidebar Column (1/4 width) */}
                    <div className="lg:col-span-1">
                        <WalletSidebar />
                    </div>
                </div>
            </div>
        </div>
    )
}

