"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { Building2, Globe, Mail, MapPin, Instagram, Users, Shield, Sparkles, Camera, Link as LinkIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const organizerSettingsSchema = z.object({
    organizationName: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    city: z.string().min(2, "City is required"),
    contactInfo: z.string().min(5, "Contact info is required"),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
})

type OrganizerSettingsInput = z.infer<typeof organizerSettingsSchema>

export default function OrganizerSettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrganizerSettingsInput>({
        resolver: zodResolver(organizerSettingsSchema),
        defaultValues: {
            organizationName: "City Events Co.",
            description: "We organize the best city events in New York, bringing together communities through cultural experiences, music festivals, and food markets.",
            city: "New York",
            contactInfo: "contact@cityevents.com",
            website: "https://cityevents.com",
            instagram: "@cityeventsnyc",
            twitter: "@cityevents_nyc"
        }
    })

    const onSubmit = async (data: OrganizerSettingsInput) => {
        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log(data)
            toast.success("Organizer settings updated successfully!")
        } catch (error) {
            toast.error("Failed to update settings. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAvatarUpload = async () => {
        setIsUploading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 800))
            toast.success("Logo updated successfully!")
        } catch (error) {
            toast.error("Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Organizer Settings</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Manage your public profile and preferences
                    </p>
                </div>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    <Shield className="mr-1 h-3 w-3" />
                    Verified Organizer
                </Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Profile & Stats */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <Card className="border border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=CityEvents" />
                                        <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700">
                                            CE
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        size="icon"
                                        className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        onClick={handleAvatarUpload}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <LoadingSpinner className="h-4 w-4" />
                                        ) : (
                                            <Camera className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900">City Events Co.</h2>
                                <p className="text-gray-600">@cityeventsco</p>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        New York, NY
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users className="h-4 w-4" />
                                        2,350 Followers
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Sparkles className="h-4 w-4" />
                                        4.8 Organizer Rating
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-lg font-bold text-blue-600">12</div>
                                        <div className="text-sm text-gray-600">Events</div>
                                    </div>
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <div className="text-lg font-bold text-purple-600">85%</div>
                                        <div className="text-sm text-gray-600">Attendance</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">Social Links</CardTitle>
                            <CardDescription className="text-gray-600">
                                Connected social media accounts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                                        <Instagram className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Instagram</div>
                                        <div className="text-sm text-gray-600">@cityeventsnyc</div>
                                    </div>
                                </div>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                    Connected
                                </Badge>
                            </div>
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100">
                                Connect More Accounts
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Edit Form */}
                <div className="lg:col-span-2">
                    <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl text-gray-900">Organizer Profile</CardTitle>
                            <CardDescription className="text-gray-600">
                                Update your public information and contact details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="organizationName">
                                            Organizer Name
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="organizationName"
                                                {...register("organizationName")}
                                                disabled={isLoading}
                                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                            />
                                        </div>
                                        {errors.organizationName && (
                                            <p className="text-sm text-red-600 mt-1">{errors.organizationName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="description">
                                            About Your Organization
                                        </label>
                                        <Textarea
                                            id="description"
                                            className="min-h-[120px] bg-gray-50 border-gray-200 focus:bg-white resize-none"
                                            {...register("description")}
                                            disabled={isLoading}
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            {errors.description && (
                                                <p className="text-sm text-red-600">{errors.description.message}</p>
                                            )}
                                            <span className="text-sm text-gray-500 ml-auto">
                                                Tell people what you do
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="city">
                                                Location
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="city"
                                                    {...register("city")}
                                                    disabled={isLoading}
                                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                                />
                                            </div>
                                            {errors.city && (
                                                <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="contactInfo">
                                                Public Contact
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="contactInfo"
                                                    {...register("contactInfo")}
                                                    disabled={isLoading}
                                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                                />
                                            </div>
                                            {errors.contactInfo && (
                                                <p className="text-sm text-red-600 mt-1">{errors.contactInfo.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="website">
                                            Website
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="website"
                                                placeholder="https://yourwebsite.com"
                                                {...register("website")}
                                                disabled={isLoading}
                                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                            />
                                        </div>
                                        {errors.website && (
                                            <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="instagram">
                                                Instagram
                                            </label>
                                            <div className="relative">
                                                <Instagram className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="instagram"
                                                    placeholder="@username"
                                                    {...register("instagram")}
                                                    disabled={isLoading}
                                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="twitter">
                                                Twitter
                                            </label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="twitter"
                                                    placeholder="@username"
                                                    {...register("twitter")}
                                                    disabled={isLoading}
                                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <CardTitle className="text-lg text-gray-900 mb-4">Notification Settings</CardTitle>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="email-notifications" className="text-gray-900">Email Notifications</Label>
                                                <p className="text-sm text-gray-600">Receive updates about your events</p>
                                            </div>
                                            <Switch
                                                id="email-notifications"
                                                checked={emailNotifications}
                                                onCheckedChange={setEmailNotifications}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="push-notifications" className="text-gray-900">Push Notifications</Label>
                                                <p className="text-sm text-gray-600">Get real-time event updates</p>
                                            </div>
                                            <Switch
                                                id="push-notifications"
                                                checked={pushNotifications}
                                                onCheckedChange={setPushNotifications}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-gray-200">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                    >
                                        {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                                        Save Changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isLoading}
                                        className="border-gray-300 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={isLoading}
                                        className="text-gray-600 hover:text-gray-900 ml-auto"
                                        asChild
                                    >
                                        <a href="/organizer/deactivate">Deactivate Account</a>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}