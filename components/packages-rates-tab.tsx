"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Switch } from "./ui/switch"
import {
    getMinutePackagesAction,
    createMinutePackageAction,
    updateMinutePackageAction,
    deleteMinutePackageAction,
    getAllMinutePurchasesAction,
    getMinutePurchaseStatsAction,
    getAllProviderEarningsAction,
    getProviderEarningsStatsAction,
    processProviderPayoutAction
} from "../app/actions"

export function PackagesRatesTab() {
    // Packages & Rates state
    const [minutePackages, setMinutePackages] = useState<any[]>([])
    const [minutePurchases, setMinutePurchases] = useState<any[]>([])
    const [purchaseStats, setPurchaseStats] = useState<any>(null)
    const [providerEarnings, setProviderEarnings] = useState<any[]>([])
    const [earningsStats, setEarningsStats] = useState<any>(null)
    const [packagesLoading, setPackagesLoading] = useState(true)
    const [purchasesLoading, setPurchasesLoading] = useState(true)
    const [earningsLoading, setEarningsLoading] = useState(true)

    // Package form state
    const [showAddPackageDialog, setShowAddPackageDialog] = useState(false)
    const [newPackage, setNewPackage] = useState({
        name: '',
        minutes: 0,
        priceZMW: 0,
        discountPercent: 0,
        description: '',
        isActive: true,
        isPopular: false
    })

    // Load minute packages
    const loadMinutePackages = async () => {
        try {
            setPackagesLoading(true)
            const packages = await getMinutePackagesAction()
            setMinutePackages(packages as any[])
        } catch (error) {
            console.error("Error loading minute packages:", error)
        } finally {
            setPackagesLoading(false)
        }
    }

    // Load minute purchases
    const loadMinutePurchases = async () => {
        try {
            setPurchasesLoading(true)
            const [purchases, stats] = await Promise.all([
                getAllMinutePurchasesAction(),
                getMinutePurchaseStatsAction()
            ])
            setMinutePurchases(purchases as any[])
            setPurchaseStats(stats)
        } catch (error) {
            console.error("Error loading minute purchases:", error)
        } finally {
            setPurchasesLoading(false)
        }
    }

    // Load provider earnings
    const loadProviderEarnings = async () => {
        try {
            setEarningsLoading(true)
            const [earnings, stats] = await Promise.all([
                getAllProviderEarningsAction(),
                getProviderEarningsStatsAction()
            ])
            setProviderEarnings(earnings as any[])
            setEarningsStats(stats)
        } catch (error) {
            console.error("Error loading provider earnings:", error)
        } finally {
            setEarningsLoading(false)
        }
    }

    // Load data on mount
    useEffect(() => {
        loadMinutePackages()
        loadMinutePurchases()
        loadProviderEarnings()
    }, [])

    return (
        <div className="space-y-6">
            <Tabs defaultValue="packages">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="packages">Minute Packages</TabsTrigger>
                    <TabsTrigger value="purchases">User Purchases</TabsTrigger>
                    <TabsTrigger value="earnings">Provider Earnings</TabsTrigger>
                    <TabsTrigger value="rates">Provider Rates</TabsTrigger>
                </TabsList>

                {/* MINUTE PACKAGES SUB-TAB */}
                <TabsContent value="packages" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Minute Packages</h2>
                        <Button onClick={() => setShowAddPackageDialog(true)}>
                            Add Package
                        </Button>
                    </div>

                    {packagesLoading ? (
                        <div className="text-center py-8">Loading packages...</div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {minutePackages.map((pkg: any) => (
                                <Card key={pkg.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{pkg.name}</CardTitle>
                                                {pkg.isPopular && (
                                                    <Badge variant="default" className="mt-1">Popular</Badge>
                                                )}
                                            </div>
                                            <Switch
                                                checked={pkg.isActive}
                                                onCheckedChange={async (checked) => {
                                                    await updateMinutePackageAction(pkg.id, { isActive: checked })
                                                    loadMinutePackages()
                                                }}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Minutes:</span>
                                                <span className="font-semibold">{pkg.minutes} min</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Price:</span>
                                                <span className="font-semibold">{pkg.priceZMW} ZMW</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Per Minute:</span>
                                                <span className="font-semibold">{(pkg.priceZMW / pkg.minutes).toFixed(2)} ZMW</span>
                                            </div>
                                            {pkg.discountPercent > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Discount:</span>
                                                    <Badge variant="secondary">{pkg.discountPercent}% off</Badge>
                                                </div>
                                            )}
                                            {pkg.description && (
                                                <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
                                            )}
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full mt-4"
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to delete this package?')) {
                                                        await deleteMinutePackageAction(pkg.id)
                                                        loadMinutePackages()
                                                    }
                                                }}
                                            >
                                                Delete Package
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Add Package Dialog */}
                    {showAddPackageDialog && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <Card className="w-full max-w-md">
                                <CardHeader>
                                    <CardTitle>Add Minute Package</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Package Name</Label>
                                        <Input
                                            value={newPackage.name}
                                            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                                            placeholder="e.g., Starter Pack"
                                        />
                                    </div>
                                    <div>
                                        <Label>Minutes</Label>
                                        <Input
                                            type="number"
                                            value={newPackage.minutes}
                                            onChange={(e) => setNewPackage({ ...newPackage, minutes: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Price (ZMW)</Label>
                                        <Input
                                            type="number"
                                            value={newPackage.priceZMW}
                                            onChange={(e) => setNewPackage({ ...newPackage, priceZMW: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Discount %</Label>
                                        <Input
                                            type="number"
                                            value={newPackage.discountPercent}
                                            onChange={(e) => setNewPackage({ ...newPackage, discountPercent: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            value={newPackage.description}
                                            onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={newPackage.isPopular}
                                            onCheckedChange={(checked) => setNewPackage({ ...newPackage, isPopular: checked })}
                                        />
                                        <Label>Mark as Popular</Label>
                                    </div>
                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button variant="outline" onClick={() => setShowAddPackageDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={async () => {
                                            if (!newPackage.name || !newPackage.minutes || !newPackage.priceZMW) {
                                                alert('Please fill in all required fields')
                                                return
                                            }
                                            await createMinutePackageAction(newPackage)
                                            setShowAddPackageDialog(false)
                                            setNewPackage({ name: '', minutes: 0, priceZMW: 0, discountPercent: 0, description: '', isActive: true, isPopular: false })
                                            loadMinutePackages()
                                        }}>
                                            Create Package
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* USER PURCHASES SUB-TAB */}
                <TabsContent value="purchases" className="space-y-4">
                    <h2 className="text-xl font-bold">User Minute Purchases</h2>

                    {/* Stats Cards */}
                    {purchaseStats && (
                        <div className="grid gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Purchases</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{purchaseStats.totalPurchases}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Minutes Sold</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{purchaseStats.totalMinutes.toLocaleString()}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{purchaseStats.totalRevenue.toLocaleString()} ZMW</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{purchaseStats.pendingPayments}</div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Purchases Table */}
                    {purchasesLoading ? (
                        <div className="text-center py-8">Loading purchases...</div>
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">User</th>
                                                <th className="text-left p-2">Package</th>
                                                <th className="text-right p-2">Minutes</th>
                                                <th className="text-right p-2">Price</th>
                                                <th className="text-left p-2">Payment Method</th>
                                                <th className="text-left p-2">Status</th>
                                                <th className="text-left p-2">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {minutePurchases.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="text-center p-4 text-muted-foreground">No purchases found</td>
                                                </tr>
                                            ) : (
                                                minutePurchases.map((purchase: any) => (
                                                    <tr key={purchase.id} className="border-b">
                                                        <td className="p-2">{purchase.wallet?.user?.name || 'Unknown'}</td>
                                                        <td className="p-2">{purchase.packageName}</td>
                                                        <td className="text-right p-2">{purchase.minutesPurchased}</td>
                                                        <td className="text-right p-2">{purchase.priceZMW} ZMW</td>
                                                        <td className="p-2">{purchase.paymentMethod || 'N/A'}</td>
                                                        <td className="p-2">
                                                            <Badge variant={purchase.paymentStatus === 'COMPLETED' ? 'default' : 'secondary'}>
                                                                {purchase.paymentStatus}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-2">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* PROVIDER EARNINGS SUB-TAB */}
                <TabsContent value="earnings" className="space-y-4">
                    <h2 className="text-xl font-bold">Provider Earnings</h2>

                    {/* Stats Cards */}
                    {earningsStats && (
                        <div className="grid gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Minutes Serviced</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{earningsStats.totalMinutesServiced.toLocaleString()}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings Paid</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{earningsStats.totalEarningsPaid.toLocaleString()} ZMW</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{earningsStats.pendingPayouts.toLocaleString()} ZMW</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Providers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{earningsStats.activeProviders}</div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Earnings Table */}
                    {earningsLoading ? (
                        <div className="text-center py-8">Loading earnings...</div>
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">Provider</th>
                                                <th className="text-right p-2">Total Minutes</th>
                                                <th className="text-right p-2">This Month</th>
                                                <th className="text-right p-2">Total Earnings</th>
                                                <th className="text-right p-2">Month Earnings</th>
                                                <th className="text-right p-2">Pending Payout</th>
                                                <th className="text-left p-2">Last Payout</th>
                                                <th className="text-left p-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {providerEarnings.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="text-center p-4 text-muted-foreground">No provider earnings found</td>
                                                </tr>
                                            ) : (
                                                providerEarnings.map((earning: any) => (
                                                    <tr key={earning.id} className="border-b">
                                                        <td className="p-2">{earning.provider?.name || 'Unknown'}</td>
                                                        <td className="text-right p-2">{earning.totalMinutesServiced}</td>
                                                        <td className="text-right p-2">{earning.currentMonthMinutes}</td>
                                                        <td className="text-right p-2">{earning.totalEarningsZMW.toLocaleString()} ZMW</td>
                                                        <td className="text-right p-2">{earning.currentMonthEarnings.toLocaleString()} ZMW</td>
                                                        <td className="text-right p-2 font-semibold">{earning.pendingPayoutZMW.toLocaleString()} ZMW</td>
                                                        <td className="p-2">
                                                            {earning.lastPayoutDate
                                                                ? new Date(earning.lastPayoutDate).toLocaleDateString()
                                                                : 'Never'}
                                                        </td>
                                                        <td className="p-2">
                                                            {earning.pendingPayoutZMW > 0 && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={async () => {
                                                                        if (confirm(`Process payout of ${earning.pendingPayoutZMW} ZMW for ${earning.provider?.name}?`)) {
                                                                            await processProviderPayoutAction(earning.providerId, earning.pendingPayoutZMW)
                                                                            loadProviderEarnings()
                                                                        }
                                                                    }}
                                                                >
                                                                    Process Payout
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* PROVIDER RATES SUB-TAB */}
                <TabsContent value="rates" className="space-y-4">
                    <h2 className="text-xl font-bold">Provider Rates</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">Provider rate management coming soon...</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                This section will allow you to set and manage per-minute rates for each provider.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
