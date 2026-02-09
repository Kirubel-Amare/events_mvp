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

const organizerSchema = z.object({
    organizerName: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    city: z.string().min(2, "City is required"),
    contactEmail: z.string().email("Invalid email"),
    instagram: z.string().optional(),
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
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log(data)
            toast.success("Application submitted!")
            router.push("/organizer/dashboard") // Auto-approve for MVP
        } catch (_error) {
            toast.error("Failed to submit application.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="organizerName">Organizer / Brand Name</label>
                <Input id="organizerName" placeholder="e.g. City Events Co." {...register("organizerName")} disabled={isLoading} />
                {errors.organizerName && <p className="text-sm text-destructive">{errors.organizerName.message}</p>}
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
                    <label className="text-sm font-medium" htmlFor="contactEmail">Contact Email</label>
                    <Input id="contactEmail" type="email" {...register("contactEmail")} disabled={isLoading} />
                    {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="instagram">Instagram (Optional)</label>
                <Input id="instagram" placeholder="@username" {...register("instagram")} disabled={isLoading} />
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
