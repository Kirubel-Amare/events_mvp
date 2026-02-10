"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { CheckCircle, Sparkles, Users, Calendar, Shield, Award, ArrowRight, FileText, Building, Target, Zap, Star, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { organizerApi } from "@/lib/api/organizer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

const applySchema = z.object({
    organizationName: z.string().min(2, "Organization name is required"),
    reason: z.string().min(20, "Please provide a detailed reason (at least 20 characters)"),
    website: z.string().optional(),
    experience: z.string().min(10, "Please describe your experience").optional(),
})

type ApplyInput = z.infer<typeof applySchema>

export default function ApplyOrganizerPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 3

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ApplyInput>({
        resolver: zodResolver(applySchema),
    })

    const onSubmit = async (data: ApplyInput) => {
        setIsLoading(true)
        try {
            await organizerApi.apply(data)
            toast.success("Application submitted successfully! An admin will review it soon.")
            setCurrentStep(3) // Move to success step
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.error || "Failed to submit application.")
        } finally {
            setIsLoading(false)
        }
    }

    const features = [
        {
            icon: <Calendar className="h-6 w-6 text-blue-600" />,
            title: "Create Unlimited Events",
            description: "Host as many events as you want with no limits"
        },
        {
            icon: <TrendingUp className="h-6 w-6 text-green-600" />,
            title: "Advanced Analytics",
            description: "Track attendance, engagement, and growth metrics"
        },
        {
            icon: <Shield className="h-6 w-6 text-purple-600" />,
            title: "Verification Badge",
            description: "Get a verified badge to build trust with attendees"
        },
        {
            icon: <Users className="h-6 w-6 text-orange-600" />,
            title: "Community Building",
            description: "Grow and manage your own community"
        }
    ]


    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-16 md:py-24">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                
                <div className="container relative">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Join our verified organizer community
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Become a{" "}
                            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Verified Organizer
                            </span>
                        </h1>
                        
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Share your passion, build your community, and create unforgettable experiences
                            with our professional event hosting platform.
                        </p>
                        
                        <div className="pt-4">
                            <Button 
                                size="lg" 
                                className="gap-2 px-8 animate-bounce-subtle"
                                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <Zap className="h-5 w-5" />
                                Start Application
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-center mb-8">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`
                                        flex items-center justify-center w-12 h-12 rounded-full border-2
                                        ${currentStep >= step 
                                            ? 'bg-primary text-primary-foreground border-primary' 
                                            : 'bg-muted text-muted-foreground border-border'}
                                        font-semibold
                                    `}>
                                        {step}
                                    </div>
                                    {step < 3 && (
                                        <div className={`w-24 h-1 mx-4 ${currentStep > step ? 'bg-primary' : 'bg-border'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">
                                {currentStep === 1 && "Step 1: Learn About Benefits"}
                                {currentStep === 2 && "Step 2: Submit Application"}
                                {currentStep === 3 && "Step 3: Application Submitted"}
                            </h3>
                            <p className="text-muted-foreground">
                                {currentStep === 1 && "Discover what you get as a verified organizer"}
                                {currentStep === 2 && "Tell us about your organization and experience"}
                                {currentStep === 3 && "Your application is under review"}
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Features & Benefits */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Step 1: Benefits */}
                            {currentStep === 1 && (
                                <div className="space-y-8 animate-fade-in">
                                    <Card className="border-0 shadow-xl overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-transparent">
                                            <CardTitle className="text-2xl flex items-center gap-3">
                                                <div className="rounded-lg bg-primary p-2">
                                                    <Award className="h-5 w-5 text-white" />
                                                </div>
                                                Why Become a Verified Organizer?
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                {features.map((feature, index) => (
                                                    <div 
                                                        key={index} 
                                                        className="flex items-start gap-4 p-4 rounded-xl border hover:bg-muted/30 transition-all hover-lift"
                                                    >
                                                        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 p-3">
                                                            {feature.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-1">{feature.title}</h4>
                                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Success Stories */}
                                    <Card className="border-0 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-2xl">Success Stories</CardTitle>
                                            <CardDescription>Hear from organizers who built thriving communities</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-transparent">
                                                    <div className="rounded-full bg-blue-500/10 p-3">
                                                        <Star className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">Tech Meetups NYC</h4>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            "Within 6 months, we grew from 50 to 5,000 members using EventHub's tools."
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-transparent">
                                                    <div className="rounded-full bg-purple-500/10 p-3">
                                                        <TrendingUp className="h-5 w-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">Wellness Retreats CA</h4>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            "The analytics helped us optimize our events and increase attendance by 300%."
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-center gap-4">
                                        <Button onClick={nextStep} size="lg" className="gap-2 px-8">
                                            Continue to Application
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Application Form */}
                            {currentStep === 2 && (
                                <Card id="application-form" className="border-0 shadow-xl overflow-hidden animate-fade-in">
                                    <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-transparent">
                                        <CardTitle className="text-2xl">Organizer Application</CardTitle>
                                        <CardDescription>
                                            Fill out the form below to start your journey as a verified organizer
                                        </CardDescription>
                                    </CardHeader>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <CardContent className="space-y-6 p-6">
                                            {/* Organization Details */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    <Building className="h-5 w-5 text-primary" />
                                                    Organization Details
                                                </h3>
                                                
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block" htmlFor="organizationName">
                                                            Organization Name *
                                                        </label>
                                                        <Input
                                                            id="organizationName"
                                                            placeholder="e.g. Tech Community, Hiking Club, Fitness Group"
                                                            {...register("organizationName")}
                                                            disabled={isLoading}
                                                            className="h-12"
                                                        />
                                                        {errors.organizationName && (
                                                            <p className="text-sm text-destructive mt-2">{errors.organizationName.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block" htmlFor="website">
                                                            Website (Optional)
                                                        </label>
                                                        <Input
                                                            id="website"
                                                            placeholder="https://example.com"
                                                            {...register("website")}
                                                            disabled={isLoading}
                                                            className="h-12"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Experience & Reason */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                    Tell Us About Yourself
                                                </h3>

                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block" htmlFor="experience">
                                                            Previous Experience *
                                                        </label>
                                                        <Textarea
                                                            id="experience"
                                                            placeholder="Describe your experience with event organization, community management, or related fields..."
                                                            className="min-h-[100px]"
                                                            {...register("experience")}
                                                            disabled={isLoading}
                                                        />
                                                        {errors.experience && (
                                                            <p className="text-sm text-destructive mt-2">{errors.experience.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block" htmlFor="reason">
                                                            Why do you want to become an organizer? *
                                                        </label>
                                                        <Textarea
                                                            id="reason"
                                                            placeholder="Describe your motivation, what kind of events you plan to host, and your vision for the community..."
                                                            className="min-h-[120px]"
                                                            {...register("reason")}
                                                            disabled={isLoading}
                                                        />
                                                        {errors.reason && (
                                                            <p className="text-sm text-destructive mt-2">{errors.reason.message}</p>
                                                        )}
                                                        <div className="text-xs text-muted-foreground mt-2">
                                                            {watch('reason')?.length || 0}/20 characters minimum
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex gap-4 p-6 border-t">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={prevStep}
                                                disabled={isLoading}
                                                className="flex-1"
                                            >
                                                Back
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                disabled={isLoading}
                                                className="flex-1 gap-2 bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <LoadingSpinner className="mr-2 h-4 w-4" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        Submit Application
                                                        <CheckCircle className="h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            )}

                            {/* Step 3: Success */}
                            {currentStep === 3 && (
                                <Card className="border-0 shadow-xl overflow-hidden animate-scale-in">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-16 translate-x-16" />
                                    <CardContent className="p-12 text-center">
                                        <div className="rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                            <CheckCircle className="h-12 w-12 text-green-600" />
                                        </div>
                                        
                                        <h2 className="text-3xl font-bold mb-4">Application Submitted! 🎉</h2>
                                        
                                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                            Thank you for applying to become a verified organizer! Our team will review 
                                            your application within 24-48 hours. You'll receive an email notification 
                                            once a decision has been made.
                                        </p>
                                        
                                        <div className="space-y-6">
                                            <div className="rounded-xl border p-6 max-w-md mx-auto">
                                                <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">
                                                    <Shield className="h-4 w-4 text-primary" />
                                                    What Happens Next?
                                                </h3>
                                                <ul className="space-y-3 text-sm text-left">
                                                    <li className="flex items-start gap-3">
                                                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                                        </div>
                                                        <span>Application review by our team</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                                        </div>
                                                        <span>Background verification check</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                                        </div>
                                                        <span>Email notification with decision</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                                        </div>
                                                        <span>Onboarding and setup guidance</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Button asChild className="gap-2">
                                                    <Link href="/dashboard">
                                                        Go to Dashboard
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" asChild>
                                                    <Link href="/browse/events">
                                                        Browse Events
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            
                      
                            {/* Benefits Card */}
                            <Card className="border-border shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-amber-500" />
                                        Quick Benefits
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Verification Badge</span>
                                        <Badge variant="outline" className="bg-primary/10">✓ Included</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Analytics Dashboard</span>
                                        <Badge variant="outline" className="bg-primary/10">✓ Included</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Priority Support</span>
                                        <Badge variant="outline" className="bg-primary/10">✓ Included</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Promotion Tools</span>
                                        <Badge variant="outline" className="bg-primary/10">✓ Included</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Stats Card */}
                            <Card className="border-border shadow-lg">
                                <CardHeader>
                                    <CardTitle>Organizer Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm">Approval Rate</span>
                                            <span className="text-sm font-semibold">85%</span>
                                        </div>
                                        <Progress value={85} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm">Average Review Time</span>
                                            <span className="text-sm font-semibold">24-48h</span>
                                        </div>
                                        <Progress value={90} className="h-2" />
                                    </div>
                                    <div className="text-center text-sm text-muted-foreground pt-2">
                                        Join 5,000+ active organizers
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Support Card */}
                            <Card className="border-border shadow-lg bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                            <Users className="h-6 w-6 text-primary" />
                                        </div>
                                        <h4 className="font-semibold mb-2">Need Help?</h4>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Our support team is here to help with your application
                                        </p>
                                        <Button variant="outline" size="sm" className="w-full" asChild>
                                            <Link href="/support">
                                                Contact Support
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}