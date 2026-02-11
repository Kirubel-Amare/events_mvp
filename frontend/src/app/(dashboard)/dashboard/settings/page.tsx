"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Lock, User, Shield, Moon, Eye } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"

export default function SettingsPage() {
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(false)

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success("Settings saved successfully!")
        }, 1000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account preferences and security settings.</p>
            </div>

            <Separator />

            <div className="grid gap-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            <CardTitle>Profile Information</CardTitle>
                        </div>
                        <CardDescription>Update your public profile details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input id="name" defaultValue={user?.name || ""} placeholder="John Doe" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" defaultValue={user?.email || ""} disabled className="bg-gray-50" />
                            <p className="text-[12px] text-gray-400">Email cannot be changed directly for security reasons.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-600" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>Configure how you receive updates and alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-gray-500">Receive event updates and plan invites via email.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Push Notifications</Label>
                                <p className="text-sm text-gray-500">Get real-time alerts in your browser.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy & Security */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-blue-600" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>Manage your password and account security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                            </div>
                            <Button variant="secondary" size="sm">Enable</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost">Cancel</Button>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    )
}
