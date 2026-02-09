"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { User, Globe, Link as LinkIcon, Mail, Calendar, MapPin, Sparkles, Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    location: z.string().optional(),
})

type ProfileInput = z.infer<typeof profileSchema>

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "John Doe",
            username: "johndoe",
            email: "john@example.com",
            bio: "Event enthusiast, hiker, and tech lover. Always looking for new adventures and connections.",
            location: "New York, NY",
        }
    })

    const onSubmit = async (data: ProfileInput) => {
        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log(data)
            toast.success("Profile updated successfully!")
        } catch (_error) {
            toast.error("Failed to update profile. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAvatarUpload = async () => {
        setIsUploading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 800))
            toast.success("Profile picture updated!")
        } catch (_error) {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Manage your public profile and personal preferences
                    </p>
                </div>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Premium Member
                </Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Card */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <Card className="border border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                                        <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700">
                                            JD
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
                                
                                <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
                                <p className="text-gray-600">@johndoe</p>
                                
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        john@example.com
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        New York, NY
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        Joined Jan 2024
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-lg font-bold text-blue-600">12</div>
                                        <div className="text-sm text-gray-600">Events</div>
                                    </div>
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <div className="text-lg font-bold text-purple-600">45</div>
                                        <div className="text-sm text-gray-600">Friends</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Status */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">Account Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Email Verified</span>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                    Verified
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Member Since</span>
                                <span className="text-sm font-medium">Jan 2024</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Last Updated</span>
                                <span className="text-sm font-medium">2 days ago</span>
                            </div>
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100" asChild>
                                <a href="/settings/security">Security Settings</a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Edit Form */}
                <div className="lg:col-span-2">
                    <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl text-gray-900">Edit Profile</CardTitle>
                            <p className="text-gray-600">
                                Update your personal information and preferences
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="name">
                                                Full Name
                                            </label>
                                            <Input 
                                                id="name" 
                                                {...register("name")} 
                                                disabled={isLoading}
                                                className="bg-gray-50 border-gray-200 focus:bg-white"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="username">
                                                Username
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    @
                                                </div>
                                                <Input 
                                                    id="username" 
                                                    {...register("username")} 
                                                    disabled={isLoading}
                                                    className="pl-7 bg-gray-50 border-gray-200 focus:bg-white"
                                                />
                                            </div>
                                            {errors.username && (
                                                <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="email">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-gray-400" />
                                                <Input 
                                                    id="email" 
                                                    {...register("email")} 
                                                    disabled={isLoading}
                                                    type="email"
                                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="location">
                                                Location
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-gray-400" />
                                                <Input 
                                                    id="location" 
                                                    {...register("location")} 
                                                    disabled={isLoading}
                                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                                />
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
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="bio">
                                        Bio
                                    </label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us about yourself, your interests, and what kind of events you enjoy..."
                                        className="resize-none bg-gray-50 border-gray-200 focus:bg-white min-h-[120px]"
                                        {...register("bio")}
                                        disabled={isLoading}
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        {errors.bio && (
                                            <p className="text-sm text-red-600">{errors.bio.message}</p>
                                        )}
                                        <span className="text-sm text-gray-500 ml-auto">
                                            Max 160 characters
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Connected Accounts */}
                    <Card className="border border-gray-200 mt-6">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl text-gray-900">Connected Accounts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Google</div>
                                            <div className="text-sm text-gray-600">john@example.com</div>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                        Connected
                                    </Badge>
                                </div>
                                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100">
                                    Connect More Accounts
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}