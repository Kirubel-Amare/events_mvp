"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { Shield, Send, Loader2, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { organizerApi } from "@/lib/api/organizer"
import { useAuthStore } from "@/store/auth-store"
import { authApi } from "@/lib/api/auth"

const applicationSchema = z.object({
    organizationName: z.string().min(2, "Organization name must be at least 2 characters").optional().or(z.literal("")),
    reason: z.string().min(20, "Please provide a more detailed reason (min 20 characters)"),
})

type ApplicationInput = z.infer<typeof applicationSchema>

export function OrganizerApplicationForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const router = useRouter()
    const { user, setUser } = useAuthStore()

    // Check for role updates on mount
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const updatedUser = await authApi.getCurrentUser()
                setUser(updatedUser)
            } catch (error) {
                console.error("Failed to refresh user status", error)
            }
        }
        checkStatus()
    }, [setUser])

    // Redirect if already an organizer
    useEffect(() => {
        if (user?.role === 'organizer') {
            router.push('/organizer')
        }
    }, [user, router])

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

            // Check if error is because they are already an organizer
            if (message.includes("already an organizer")) {
                router.push('/organizer')
                return
            }

            // Check if application is pending
            if (message.includes("pending application")) {
                setIsSubmitted(true)
                return
            }

            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    if (user?.role === 'organizer') {
        return (
            <Card className="border border-green-100 bg-green-50/50">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <PartyPopper className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">You are an Organizer!</CardTitle>
                    <CardDescription>
                        Congratulations! Your account has been upgraded. You can now create and manage events.
                    </CardDescription>
                    <Button onClick={() => router.push('/organizer')} className="w-full sm:w-auto">
                        Go to Organizer Dashboard
                    </Button>
                </CardContent>
            </Card>
        )
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
                <CardTitle>Become an Organizer</CardTitle>
                <CardDescription className="space-y-4 pt-2">
                    <p>By submitting this application, you are requesting approval to become an event organizer on our platform.</p>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg space-y-2 text-blue-900">
                        <p className="font-semibold text-blue-800">Please note:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Your account will remain a regular user until your application is approved.</li>
                            <li>You will not have access to the organizer dashboard or organizer features during the review process.</li>
                            <li>An administrator will review your application and make a decision.</li>
                            <li>You will be notified once your application is approved or rejected.</li>
                        </ul>
                    </div>
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
