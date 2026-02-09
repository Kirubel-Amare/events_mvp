import { OrganizerApplicationForm } from "@/components/forms/organizer-application"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Users, Award, Shield, CheckCircle, TrendingUp, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ApplyPage() {
    const benefits = [
        {
            icon: Users,
            title: "Reach Thousands",
            description: "Showcase your events to our community of 10,000+ members"
        },
        {
            icon: TrendingUp,
            title: "Grow Your Brand",
            description: "Build your reputation as an event organizer"
        },
        {
            icon: Award,
            title: "Premium Tools",
            description: "Access advanced event management features"
        },
        {
            icon: Shield,
            title: "Secure Payments",
            description: "Handle ticket sales and payments securely"
        }
    ]

    const requirements = [
        "Be at least 18 years old",
        "Have hosted at least 2 successful events",
        "Provide valid identification",
        "Agree to our organizer terms",
        "Maintain a 4.0+ event rating"
    ]

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-gray-200 p-8 md:p-12">
                {/* Floating elements */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Become an <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Organizer</span>
                            </h1>
                            <p className="text-lg text-gray-600 mt-2">
                                Host amazing events and grow your community
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Badge className="bg-white text-gray-800 border-gray-200 hover:bg-gray-50">
                            <Star className="mr-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                            4.8 Organizer Rating
                        </Badge>
                        <Badge className="bg-white text-gray-800 border-gray-200 hover:bg-gray-50">
                            <Users className="mr-1 h-3 w-3 text-blue-500" />
                            500+ Active Organizers
                        </Badge>
                        <Badge className="bg-white text-gray-800 border-gray-200 hover:bg-gray-50">
                            <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                            98% Success Rate
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Application Form */}
                <div className="lg:col-span-2">
                    <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl text-gray-900">Application Form</CardTitle>
                            <CardDescription className="text-gray-600">
                                Complete this form to apply as an event organizer. We typically review applications within 2-3 business days.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <OrganizerApplicationForm />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Benefits & Requirements */}
                <div className="space-y-6">
                    {/* Benefits */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-blue-600" />
                                Organizer Benefits
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                        index === 0 ? 'bg-blue-100' : 
                                        index === 1 ? 'bg-purple-100' : 
                                        index === 2 ? 'bg-emerald-100' : 'bg-amber-100'
                                    }`}>
                                        <benefit.icon className={`h-5 w-5 ${
                                            index === 0 ? 'text-blue-600' : 
                                            index === 1 ? 'text-purple-600' : 
                                            index === 2 ? 'text-emerald-600' : 'text-amber-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{benefit.title}</div>
                                        <div className="text-sm text-gray-600">{benefit.description}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">Requirements</CardTitle>
                            <CardDescription className="text-gray-600">
                                What you need to become an organizer
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {requirements.map((requirement, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{requirement}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Process */}
                    <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">Application Process</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                                        1
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Submit Application</div>
                                        <div className="text-xs text-gray-600">Complete this form</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold">
                                        2
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Review Period</div>
                                        <div className="text-xs text-gray-600">2-3 business days</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white flex items-center justify-center text-sm font-bold">
                                        3
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Get Verified</div>
                                        <div className="text-xs text-gray-600">Start creating events!</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support Card */}
                    <Card className="border border-gray-200">
                        <CardContent className="p-6">
                            <div className="text-center">
                                <div className="h-12 w-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Our team is here to help you through the application process
                                </p>
                                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100" asChild>
                                    <a href="/contact">Contact Support</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}