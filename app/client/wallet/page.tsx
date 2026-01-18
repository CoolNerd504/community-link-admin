"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Clock, CreditCard, History } from "lucide-react"

interface MinutePackage {
    id: string
    name: string
    minutes: number
    price: number
}

export default function ClientWalletPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [wallet, setWallet] = useState<any>(null)
    const [packages, setPackages] = useState<MinutePackage[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push("/")
    }, [loading, user, router])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch wallet
                const walletRes = await fetch("/api/wallet")
                if (walletRes.ok) {
                    const data = await walletRes.json()
                    setWallet(data)
                }

                // Fetch packages
                const packagesRes = await fetch("/api/minute-packages")
                if (packagesRes.ok) {
                    const data = await packagesRes.json()
                    setPackages(data)
                }
            } catch (error) {
                console.error("Error fetching wallet:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user) fetchData()
    }, [user])

    const handlePurchase = async (packageId: string) => {
        try {
            await fetch("/api/wallet/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ packageId, paymentMethod: "MOBILE_MONEY" })
            })
            alert("Purchase initiated! Check your phone for payment prompt.")
        } catch (error) {
            console.error("Purchase error:", error)
        }
    }

    if (loading || isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">My Wallet</h1>

                {/* Balance Card */}
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Available Balance</p>
                                <p className="text-3xl font-bold">ZMW {wallet?.balance?.toLocaleString() || 0}</p>
                            </div>
                            <Wallet className="w-12 h-12 text-blue-200" />
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-500 flex items-center gap-6">
                            <div>
                                <p className="text-blue-100 text-sm">Available Minutes</p>
                                <p className="text-xl font-semibold flex items-center gap-1">
                                    <Clock className="w-5 h-5" />
                                    {wallet?.availableMinutes || 0} mins
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Minute Packages */}
                <Card>
                    <CardHeader>
                        <h3 className="font-semibold">Buy Minutes</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {packages.length === 0 ? (
                                <p className="col-span-3 text-gray-500 text-center py-4">No packages available</p>
                            ) : (
                                packages.map(pkg => (
                                    <Card key={pkg.id} className="border-2 hover:border-blue-500 transition-colors">
                                        <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-blue-600">{pkg.minutes}</p>
                                            <p className="text-gray-500 mb-2">Minutes</p>
                                            <p className="text-lg font-semibold">ZMW {pkg.price}</p>
                                            <Button className="w-full mt-4" onClick={() => handlePurchase(pkg.id)}>
                                                <CreditCard className="w-4 h-4 mr-2" /> Buy
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Transaction History */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <h3 className="font-semibold">Transaction History</h3>
                        <History className="w-5 h-5 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        {wallet?.transactions?.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No transactions yet</p>
                        ) : (
                            <div className="space-y-3">
                                {(wallet?.transactions || []).slice(0, 10).map((tx: any) => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{tx.description || tx.type}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge variant={tx.type === "CREDIT" ? "default" : "secondary"}>
                                            {tx.type === "CREDIT" ? "+" : "-"} ZMW {tx.amount}
                                        </Badge>
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
