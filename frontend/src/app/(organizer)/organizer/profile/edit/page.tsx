"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { Building2, Globe, Mail, MapPin, Instagram, Link as LinkIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { organizerApi } from "@/lib/api/organizer"
import { useAuthStore } from "@/store/auth-store"
import { ImageUpload } from "@/components/shared/ImageUpload"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

export default function EditOrganizerProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuthStore()
    const router = useRouter()

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

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return
            try {
                const profile = await organizerApi.getProfile(user.id)
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
            }
        }

        fetchProfile()
    }, [user, reset])

    const onSubmit = async (data: OrganizerProfileInput) => {
        setIsLoading(true)
        try {
            await organizerApi.updateProfile(data)
            toast.success("Organizer profile updated successfully!")
            router.push("/organizer/profile")
        } catch (error) {
            toast.error("Failed to update profile. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/organizer/profile">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Edit Organization</h1>
                    <p className="text-gray-600">Update your organization's public information and social presence</p>
                </div>
            </div>

            <Card className="border border-gray-200">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Image Upload Section - Top Center */}
                        <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-100">
                            <div className="mb-4">
                                <ImageUpload
                                    value={profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=CityEvents"}
                                    onUpload={(url) => setValue("profilePhoto", url)}
                                    className="h-32 w-32 mx-auto"
                                    rounded="rounded-full"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Click to upload organization logo</p>
                        </div>

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

                        <div className="flex justify-end pt-4 gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                className="border-gray-300 hover:bg-gray-100"
                                onClick={() => router.push("/organizer/profile")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white min-w-[120px]"
                            >
                                {isLoading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
