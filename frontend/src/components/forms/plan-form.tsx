"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { planSchema, type PlanInput } from "@/lib/utils/validators"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

import { plansApi } from "@/lib/api/plans"

export function PlanForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PlanInput>({
        resolver: zodResolver(planSchema),
    })

    const onSubmit = async (data: PlanInput) => {
        setIsLoading(true)
        try {
            await plansApi.createPlan(data)
            toast.success("Plan created successfully!")
            router.push("/plans")
        } catch (error) {
            console.error(error)
            toast.error("Failed to create plan.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="title">Title</label>
                <Input id="title" placeholder="e.g. Weekend Hiking" {...register("title")} disabled={isLoading} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="description">Description</label>
                <Textarea
                    id="description"
                    placeholder="Describe your plan..."
                    className="min-h-[100px]"
                    {...register("description")}
                    disabled={isLoading}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="location">Location</label>
                    <Input id="location" placeholder="e.g. Central Park" {...register("location")} disabled={isLoading} />
                    {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="date">Date</label>
                    <Input id="date" type="date" {...register("date")} disabled={isLoading} />
                    {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="externalLink">Group Link (Optional)</label>
                <Input id="externalLink" placeholder="WhatsApp / Telegram / Instagram link" {...register("externalLink")} disabled={isLoading} />
                <p className="text-xs text-muted-foreground">
                    Users will use this link to contact you or join the group.
                </p>
                {errors.externalLink && <p className="text-sm text-destructive">{errors.externalLink.message}</p>}
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                    Create Plan
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
