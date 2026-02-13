"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { Building2, Globe, Mail, MapPin, Instagram, Users, Sparkles, Camera, Link as LinkIcon, Save } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { organizerApi } from "@/lib/api/organizer" // Import api
import { useAuthStore } from "@/store/auth-store"
import { ImageUpload } from "@/components/shared/ImageUpload"

const organizerProfileSchema = z.object({
    organizationName: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    city: z.string().min(2, "City is required"),
    contactInfo: z.string().min(5, "Contact info is required"),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    profilePhoto: z.string().optional(),
})

type OrganizerProfileInput = z.infer<typeof organizerProfileSchema>

export default function OrganizerProfilePage() {
    const [isLoading, setIsLoading] = useState(false)


    const { user } = useAuthStore()

    // Fetch existing data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return
            try {
                // We need to fetch the specific organizer profile data
                // The user object might not have the latest organizer details if they were just updated
                // But for now, let's assume we can get it or use defaults. 
                // However, the best way is to fetch it.
                // Since we don't have a direct 'getOrganizerProfile' that returns the form shape, 
                // we might need to rely on what's in the user object or fetch the public profile.

                // Let's try to fetch via the API we have.
                const profile = await organizerApi.getProfile(user.id)

                // If profile exists, reset form
                if (profile) {
                    reset({
                        organizationName: profile.organizationName || "",
                        description: profile.description || "",
                        city: profile.city || "",
                        contactInfo: profile.contactInfo || "",
                        website: profile.website || "",
                        instagram: profile.instagram || "",
                        twitter: profile.twitter || "",
                        profilePhoto: profile.profilePhoto || ""
                    })
                }
            } catch (error) {
                console.error("Failed to fetch organizer profile", error)
                // Don't show error to user as they might just be setting it up
            }
        }

        fetchProfile()
    }, [user, reset])

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OrganizerProfileInput>({
        resolver: zodResolver(organizerProfileSchema),
        defaultValues: {
            organizationName: "",
            description: "",
            city: "",
            contactInfo: "",
            website: "",
            instagram: "",
            twitter: "",
            profilePhoto: ""
        }
    })

    const profilePhoto = watch("profilePhoto")

    const onSubmit = async (data: OrganizerProfileInput) => {
        setIsLoading(true)
        try {
            await organizerApi.updateProfile(data) // Use real API
            toast.success("Organizer profile updated successfully!")
        } catch (error) {
            toast.error("Failed to update profile. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
                <p className="text-lg text-gray-600 mt-2">
                    Manage your organization's public information
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Preview */}
                <div className="space-y-6">
                    <Card className="border border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4">
                                    <ImageUpload
                                        value={profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=CityEvents"}
                                        onUpload={(url) => setValue("profilePhoto", url)}
                                        className="h-32 w-32 mx-auto"
                                        rounded="rounded-full"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{watch("organizationName") || "City Events Co."}</h2>
                                <p className="text-gray-500 text-sm">Preview</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Form */}
                <div className="lg:col-span-2">
                    <Card className="border border-gray-200">
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>
                                This information will be displayed on your public organizer page
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
                                                className="pl-10"
                                            />
                                        </div>
                                        {errors.organizationName && (
                                            <p className="text-sm text-red-600 mt-1">{errors.organizationName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="description">
                                            About
                                        </label>
                                        <Textarea
                                            id="description"
                                            className="min-h-[120px] resize-none"
                                            {...register("description")}
                                            disabled={isLoading}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                                        )}
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
                                                    className="pl-10"
                                                />
                                            </div>
                                            {errors.city && (
                                                <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="contactInfo">
                                                Contact Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="contactInfo"
                                                    {...register("contactInfo")}
                                                    disabled={isLoading}
                                                    className="pl-10"
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
                                                placeholder="https://"
                                                {...register("website")}
                                                disabled={isLoading}
                                                className="pl-10"
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
                                                    className="pl-10"
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
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white min-w-[120px]"
                                    >
                                        {isLoading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                        Save Profile
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
