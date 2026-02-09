import { PlanForm } from "@/components/forms/plan-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, MapPin, Clock, Sparkles } from "lucide-react"

export default function CreatePlanPage() {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-200 p-8">
                {/* Subtle floating elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-100/30 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Create Your <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Perfect Plan</span>
                            </h1>
                            <p className="text-lg text-gray-600 mt-2">
                                Organize amazing experiences and invite others to join
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form Section */}
                <div className="lg:col-span-2">
                    <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl text-gray-900">Plan Details</CardTitle>
                            <CardDescription className="text-gray-600">
                                Fill in the details of your activity. All fields are required unless marked optional.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <PlanForm />
                        </CardContent>
                    </Card>
                </div>

                {/* Tips & Guidelines Sidebar */}
                <div className="space-y-6">
                    {/* Quick Tips */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-blue-600" />
                                Quick Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Be Specific</div>
                                    <div className="text-sm text-gray-600">Clear details attract more participants</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <div className="h-2 w-2 bg-purple-600 rounded-full" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Set Clear Goals</div>
                                    <div className="text-sm text-gray-600">Define what participants can expect</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <div className="h-2 w-2 bg-emerald-600 rounded-full" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Check Availability</div>
                                    <div className="text-sm text-gray-600">Ensure your dates don't conflict with popular events</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">What You'll Need</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <div>
                                    <div className="font-medium text-gray-900">Date & Time</div>
                                    <div className="text-sm text-gray-600">When your plan starts</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <MapPin className="h-5 w-5 text-purple-600" />
                                <div>
                                    <div className="font-medium text-gray-900">Location</div>
                                    <div className="text-sm text-gray-600">Where to meet</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Users className="h-5 w-5 text-emerald-600" />
                                <div>
                                    <div className="font-medium text-gray-900">Group Size</div>
                                    <div className="text-sm text-gray-600">Max number of participants</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Clock className="h-5 w-5 text-amber-600" />
                                <div>
                                    <div className="font-medium text-gray-900">Duration</div>
                                    <div className="text-sm text-gray-600">How long it will last</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">What's Next?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                        1
                                    </div>
                                    <span className="text-sm text-gray-700">Submit your plan</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                                        2
                                    </div>
                                    <span className="text-sm text-gray-700">Get approved (if public)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                                        3
                                    </div>
                                    <span className="text-sm text-gray-700">Invite participants</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                                        4
                                    </div>
                                    <span className="text-sm text-gray-700">Start your activity!</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}