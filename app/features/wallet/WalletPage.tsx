"use client"

import { useState, useEffect } from "react"
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CreditCard,
    Banknote,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getProviderWalletAction, requestPayoutAction } from "@/app/actions"

export function WalletPage({ providerId }: { providerId: string }) {
    const [wallet, setWallet] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRequesting, setIsRequesting] = useState(false)
    const [payoutAmount, setPayoutAmount] = useState("")
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false)

    const loadWallet = async () => {
        try {
            setIsLoading(true)
            const data = await getProviderWalletAction(providerId)
            setWallet(data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadWallet()
    }, [providerId])

    const handleRequestPayout = async () => {
        const amount = parseFloat(payoutAmount)
        if (!amount || amount <= 0 || amount > (wallet?.balance || 0)) {
            alert("Invalid amount")
            return
        }

        try {
            setIsRequesting(true)
            await requestPayoutAction(providerId, amount, JSON.stringify({ method: "mobile_money" })) // Mock bank details
            alert("Payout requested successfully!")
            setIsPayoutModalOpen(false)
            setPayoutAmount("")
            loadWallet()
        } catch (err) {
            alert("Failed to request payout")
        } finally {
            setIsRequesting(false)
        }
    }

    if (isLoading) return <div className="p-8 text-center">Loading wallet...</div>

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-lg col-span-1 md:col-span-2">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-100 font-medium mb-1">Total Balance</p>
                                <h2 className="text-4xl font-bold">ZMW {wallet?.balance?.toFixed(2)}</h2>
                                <div className="flex items-center mt-4 text-blue-100 bg-white/10 px-3 py-1 rounded-full w-fit text-sm">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>Pending: ZMW {wallet?.pendingBalance?.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Wallet className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <Dialog open={isPayoutModalOpen} onOpenChange={setIsPayoutModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                                        <ArrowUpRight className="w-4 h-4 mr-2" />
                                        Withdraw Funds
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Request Payout</DialogTitle>
                                        <DialogDescription>
                                            Enter the amount you wish to withdraw details.
                                            Available balance: ZMW {wallet?.balance?.toFixed(2)}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Amount (ZMW)</Label>
                                            <Input
                                                type="number"
                                                value={payoutAmount}
                                                onChange={(e) => setPayoutAmount(e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsPayoutModalOpen(false)}>Cancel</Button>
                                        <Button onClick={handleRequestPayout} disabled={isRequesting}>
                                            {isRequesting ? "Requesting..." : "Confirm Withdrawal"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats or Actions */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500">Earnings this month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">ZMW {wallet?.balance?.toFixed(2)}</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>Recent earnings and withdrawals.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {wallet?.transactions?.length > 0 ? (
                                    wallet.transactions.map((tx: any) => (
                                        <div key={tx.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${tx.type === 'WITHDRAWAL' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                    {tx.type === 'WITHDRAWAL' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{tx.description || tx.type}</p>
                                                    <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${tx.type === 'WITHDRAWAL' ? 'text-gray-900' : 'text-green-600'}`}>
                                                    {tx.type === 'WITHDRAWAL' ? '-' : '+'} ZMW {tx.amount.toFixed(2)}
                                                </p>
                                                <Badge variant="outline" className="text-xs">{tx.status}</Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">No transactions yet</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payouts">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payout Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {wallet?.payoutRequests?.map((req: any) => (
                                    <div key={req.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Withdrawal Request</p>
                                            <p className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">ZMW {req.amount.toFixed(2)}</p>
                                            <Badge variant={req.status === 'APPROVED' ? 'default' : req.status === 'PENDING' ? 'secondary' : 'destructive'}>
                                                {req.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
