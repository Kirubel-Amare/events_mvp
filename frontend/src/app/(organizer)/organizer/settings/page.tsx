"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

const organizerSettingsSchema = z.object({
    organizerName: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    city: z.string().min(2, "City is required"),
    contactEmail: z.string().email("Invalid email"),
    instagram: z.string().optional(),
})

type OrganizerSettingsInput = z.infer<typeof organizerSettingsSchema>

export default function OrganizerSettingsPage() {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrganizerSettingsInput>({
        resolver: zodResolver(organizerSettingsSchema),
        defaultValues: {
            organizerName: "City Events Co.",
            description: "We organize the best city events.",
            city: "New York",
            contactEmail: "contact@cityevents.com"
        }
    })

    const onSubmit = async (data: OrganizerSettingsInput) => {
        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log(data)
            toast.success("Settings updated!")
        } catch (error) {
            toast.error("Failed to update settings.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Organizer Settings</h1>
                <p className="text-muted-foreground">
                    Update your public organizer profile.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="organizerName">Display Name</label>
                        <Input id="organizerName" {...register("organizerName")} disabled={isLoading} />
                        {errors.organizerName && <p className="text-sm text-destructive">{errors.organizerName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="description">About</label>
                        <Textarea
                            id="description"
                            className="min-h-[100px]"
                            {...register("description")}
                            disabled={isLoading}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="city">City</label>
                            <Input id="city" {...register("city")} disabled={isLoading} />
                            {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="contactEmail">Public Contact Email</label>
                            <Input id="contactEmail" {...register("contactEmail")} disabled={isLoading} />
                            {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="instagram">Instagram</label>
                        <Input id="instagram" {...register("instagram")} disabled={isLoading} />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                        Save Settings
                    </Button>
                </form>
            </div>
        </div>
    )
}
