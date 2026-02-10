"use client"

import { Settings, Shield, Bell, Globe, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Admin Settings</h2>
                <p className="text-gray-500">Global system configuration and admin preferences.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-semibold">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Security & Access
                        </CardTitle>
                        <CardDescription>Manage system-wide security policies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Require Email Verification</Label>
                                <p className="text-sm text-gray-500">Users must verify email before posting events.</p>
                            </div>
                            <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Auto-approve Events</Label>
                                <p className="text-sm text-gray-500">Automatically approve events from verified organizers.</p>
                            </div>
                            <Switch checked={false} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-semibold">
                            <Bell className="h-5 w-5 text-purple-600" />
                            Notification Settings
                        </CardTitle>
                        <CardDescription>Manage how admins receive system alerts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Report Alerts</Label>
                                <p className="text-sm text-gray-500">Receive notifications when a new report is filed.</p>
                            </div>
                            <Switch checked={true} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-3 mt-8">
                <Button variant="outline">Discard Changes</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Configuration</Button>
            </div>
        </div>
    )
}
