"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { Shield, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { organizerApi } from "@/lib/api/organizer"

const applicationSchema = z.object({
    organizationName: z.string().min(2, "Organization name must be at least 2 characters").optional().or(z.literal("")),
    reason: z.string().min(20, "Please provide a more detailed reason (min 20 characters)"),
})

type ApplicationInput = z.infer<typeof applicationSchema>

export function OrganizerApplicationForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ApplicationInput>({
        resolver: zodResolver(applicationSchema),
    })

    const onSubmit = async (data: ApplicationInput) => {
        setIsLoading(true)
        try {
            await organizerApi.apply(data)
            setIsSubmitted(true)
            toast.success("Application submitted successfully!")
            reset()
        } catch (error: any) {
            const message = error.response?.data?.error || "Failed to submit application"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <Card className="border border-blue-100 bg-blue-50/50">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <Send className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Application Pending</CardTitle>
                    <CardDescription>
                        Your application to become an organizer has been submitted and is currently being reviewed by our administrators. We'll notify you once a decision is made.
                    </CardDescription>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border border-gray-200">
            <CardHeader>
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Become an Organizer</span>
                </div>
                <CardTitle>Grow Your Community</CardTitle>
                <CardDescription>
                    Apply to host events, manage attendees, and build your brand on our platform.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="organizationName">
                            Organization Name (Optional)
                        </label>
                        <Input
                            id="organizationName"
                            placeholder="e.g. Tech Community, Hiking Club"
                            {...register("organizationName")}
                            disabled={isLoading}
                        />
                        {errors.organizationName && (
                            <p className="text-xs text-red-600">{errors.organizationName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="reason">
                            Why do you want to become an organizer?
                        </label>
                        <Textarea
                            id="reason"
                            placeholder="Tell us about your experience and the types of events you plan to host..."
                            className="min-h-[100px] resize-none"
                            {...register("reason")}
                            disabled={isLoading}
                        />
                        {errors.reason && (
                            <p className="text-xs text-red-600">{errors.reason.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Application"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
