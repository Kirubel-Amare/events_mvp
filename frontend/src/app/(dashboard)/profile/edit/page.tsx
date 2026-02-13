"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { User, Globe, Link as LinkIcon, Mail, Calendar, MapPin, Sparkles, Camera, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth-store"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { usersApi } from "@/lib/api/users"
import Link from "next/link"
import { useRouter } from "next/navigation"

const profileSchema = z.object({
    fullname: z.string().min(2, "Full name must be at least 2 characters").optional(),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    location: z.string().optional(),
    profilePhoto: z.string().optional(),
})

type ProfileInput = z.infer<typeof profileSchema>

export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const { setUser, user } = useAuthStore()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
    })

    const profilePhoto = watch("profilePhoto")

    useEffect(() => {
        if (user) {
            reset({
                fullname: user.fullname || user.name || "",
                username: user.username || "",
                email: user.email || "",
                bio: user.personalProfile?.bio || "",
                website: user.personalProfile?.website || "",
                location: user.personalProfile?.city || "",
                profilePhoto: user.profilePicture || user.personalProfile?.profilePhoto || ""
            })
        }
    }, [user, reset])

    const onSubmit = async (data: ProfileInput) => {
        setIsLoading(true)
        try {
            const response = await usersApi.updateProfile({
                fullname: data.fullname,
                username: data.username,
                bio: data.bio,
                city: data.location,
                website: data.website || undefined,
                profilePicture: data.profilePhoto,
                profilePhoto: data.profilePhoto
            })
            if (response.user) {
                // Update the store with the new user data
                setUser({ ...user, ...response.user } as any);
            }
            toast.success("Profile updated successfully!")
            router.push("/profile")
        } catch (error: any) {
            console.error("Profile update error:", error)
            const errorMessage = error.response?.data?.error || "Failed to update profile. Please try again."

            if (errorMessage.toLowerCase().includes("username already taken")) {
                toast.error("Username is already taken. Please choose another.")
            } else {
                toast.error(errorMessage)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/profile">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-gray-600">Update your personal information</p>
                </div>
            </div>

            <Card className="border border-gray-200">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Image Upload Section - Top Center */}
                        <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-100">
                            <div className="mb-4">
                                <ImageUpload
                                    onUpload={(url) => setValue("profilePhoto", url)}
                                    value={profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user?.name || "User")}
                                    className="w-32 h-32 mx-auto"
                                    rounded="rounded-full"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Click to upload new picture</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="fullname">
                                        Full Name
                                    </label>
                                    <Input
                                        id="fullname"
                                        {...register("fullname")}
                                        disabled={isLoading}
                                        className="bg-gray-50 border-gray-200 focus:bg-white"
                                    />
                                    {errors.fullname && (
                                        <p className="text-sm text-red-600 mt-1">{errors.fullname.message}</p>
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

                        <div className="flex gap-3 pt-6 border-t border-gray-200 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                className="border-gray-300 hover:bg-gray-100"
                                onClick={() => router.push("/profile")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white min-w-[120px]"
                            >
                                {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
