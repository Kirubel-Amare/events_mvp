import { EventForm } from "@/components/forms/event-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, DollarSign, Sparkles, Target, Clock, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CreateEventPage() {
    const tips = [
        {
            icon: Target,
            title: "Be Specific",
            description: "Clear event titles and descriptions perform 60% better"
        },
        {
            icon: Clock,
            title: "Timing Matters",
            description: "Events on weekends get 40% more attendance"
        },
        {
            icon: DollarSign,
            title: "Pricing Strategy",
            description: "Early bird pricing increases sign-ups by 35%"
        },
        {
            icon: Users,
            title: "Capacity Planning",
            description: "Set realistic limits based on venue size"
        }
    ]

    const steps = [
        { number: 1, title: "Basic Details", description: "Title, description, category" },
        { number: 2, title: "Date & Location", description: "When and where" },
        { number: 3, title: "Ticket Settings", description: "Pricing and capacity" },
        { number: 4, title: "Review & Publish", description: "Final check and go live" }
    ]

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-200 p-8">
                {/* Subtle floating elements */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Calendar className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Create <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">New Event</span>
                            </h1>
                            <p className="text-lg text-gray-600 mt-2">
                                Share your amazing experience with the community
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-white text-gray-800 border-gray-200 hover:bg-gray-50">
                            <Sparkles className="mr-1 h-3 w-3 text-blue-500" />
                            Verified Organizer
                        </Badge>
                        <Badge className="bg-white text-gray-800 border-gray-200 hover:bg-gray-50">
                            <Award className="mr-1 h-3 w-3 text-amber-500" />
                            4.8 Organizer Rating
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form Section */}
                <div className="lg:col-span-2">
                    <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl text-gray-900">Event Details</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Fill in all required fields to publish your event
                                    </CardDescription>
                                </div>
                                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                                    Step 1 of 4
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <EventForm />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Tips & Process */}
                <div className="space-y-6">
                    {/* Creation Process */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">Creation Process</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-start gap-3">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        index === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        <span className="text-sm font-bold">{step.number}</span>
                                    </div>
                                    <div>
                                        <div className={`font-medium ${
                                            index === 0 ? 'text-gray-900' : 'text-gray-700'
                                        }`}>
                                            {step.title}
                                        </div>
                                        <div className="text-sm text-gray-600">{step.description}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Tips */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-blue-600" />
                                Pro Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {tips.map((tip, index) => (
                                <div key={index} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                            index === 0 ? 'bg-blue-100' : 
                                            index === 1 ? 'bg-purple-100' : 
                                            index === 2 ? 'bg-emerald-100' : 'bg-amber-100'
                                        }`}>
                                            <tip.icon className={`h-5 w-5 ${
                                                index === 0 ? 'text-blue-600' : 
                                                index === 1 ? 'text-purple-600' : 
                                                index === 2 ? 'text-emerald-600' : 'text-amber-600'
                                            }`} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{tip.title}</div>
                                            <div className="text-sm text-gray-600">{tip.description}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">What You Need</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">Date & Time</div>
                                    <div className="text-gray-600">Confirmed schedule</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">Location Details</div>
                                    <div className="text-gray-600">Address or venue information</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">Capacity Limits</div>
                                    <div className="text-gray-600">Maximum attendees allowed</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <DollarSign className="h-4 w-4 text-amber-600" />
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">Pricing Strategy</div>
                                    <div className="text-gray-600">Ticket prices and tiers</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support */}
                    <Card className="border border-gray-200">
                        <CardContent className="p-6">
                            <div className="text-center">
                                <div className="h-12 w-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Our support team is here to help you create amazing events
                                </p>
                                <a 
                                    href="/organizer/support" 
                                    className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Contact Event Support →
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}