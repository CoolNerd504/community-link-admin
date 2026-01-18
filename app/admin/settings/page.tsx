"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Lock, Globe, CreditCard } from "lucide-react"

export default function AdminSettingsPage() {
    return (
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-[28px] font-bold text-[#181818] mb-1">Platform Settings</h1>
                <p className="text-[15px] text-[#767676]">Configure global settings, payments, and notifications.</p>
            </div>

            <div className="space-y-6">
                <Card className="rounded-[24px] shadow-sm border-gray-100">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Globe className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">General Settings</CardTitle>
                                <CardDescription>Basic platform information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="platform-name">Platform Name</Label>
                                <Input id="platform-name" defaultValue="CommLink" className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="support-email">Support Email</Label>
                                <Input id="support-email" defaultValue="support@commlink.com" className="rounded-xl" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[24px] shadow-sm border-gray-100">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <CreditCard className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Commission & Payments</CardTitle>
                                <CardDescription>Manage platform fees and payout settings</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Platform Commission</Label>
                                <p className="text-sm text-gray-500">Percentage taken from every booking</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input defaultValue="15" className="w-20 rounded-xl text-right" />
                                <span className="text-gray-500 font-medium">%</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Instant Payouts</Label>
                                <p className="text-sm text-gray-500">Allow providers to withdraw instantly</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 flex justify-end">
                <Button size="lg" className="rounded-xl bg-blue-600 hover:bg-blue-700">
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
