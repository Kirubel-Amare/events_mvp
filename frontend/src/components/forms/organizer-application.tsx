"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { organizerApi } from "@/lib/api/organizer"

const organizerSchema = z.object({
    organizationName: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    city: z.string().min(2, "City is required"),
    contactInfo: z.string().min(5, "Contact info is required (email or phone)"),
})

type OrganizerInput = z.infer<typeof organizerSchema>

export function OrganizerApplicationForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrganizerInput>({
        resolver: zodResolver(organizerSchema),
    })

    const onSubmit = async (data: OrganizerInput) => {
        setIsLoading(true)
        try {
            await organizerApi.apply({
                organizationName: data.organizationName,
                reason: data.description // Mapping description to reason for API
            })
            toast.success("Application submitted!")
            router.push("/dashboard") // Redirect to dashboard to see organizer view
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to submit application.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="organizationName">Organizer / Brand Name</label>
                <Input id="organizationName" placeholder="e.g. City Events Co." {...register("organizationName")} disabled={isLoading} />
                {errors.organizationName && <p className="text-sm text-destructive">{errors.organizationName.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="description">Description</label>
                <Textarea
                    id="description"
                    placeholder="Tell us about what kind of events you organize..."
                    className="min-h-[100px]"
                    {...register("description")}
                    disabled={isLoading}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="city">City</label>
                    <Input id="city" placeholder="e.g. New York" {...register("city")} disabled={isLoading} />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="contactInfo">Contact Info</label>
                    <Input id="contactInfo" placeholder="Email or Phone" {...register("contactInfo")} disabled={isLoading} />
                    {errors.contactInfo && <p className="text-sm text-destructive">{errors.contactInfo.message}</p>}
                </div>
            </div>



            <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                    Submit Application
                </Button>
            </div>
        </form>
    )
}
