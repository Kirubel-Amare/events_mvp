"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Plus, Calendar, Users, MapPin, Clock, TrendingUp, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlanCard } from "@/components/feed/plan-card"
import { plansApi } from "@/lib/api/plans"
import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plan } from "@/types"

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await plansApi.getPlans()
                setPlans(data.plans || [])
            } catch (error) {
                console.error("Failed to fetch plans", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPlans()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    const myPlans = plans // In a real app, you might filter by current user if backend doesn't already
    const suggestedPlans = plans.slice(0, 3) // Mock suggestion logic

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Plans</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Manage your active plans and discover new opportunities
                    </p>
                </div>
                <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group"
                    asChild
                >
                    <Link href="/plans/create">
                        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                        Create New Plan
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                +1
                            </Badge>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">1</div>
                        <div className="text-sm text-gray-600">Active Plans</div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                                12
                            </Badge>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">45</div>
                        <div className="text-sm text-gray-600">Total Participants</div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Clock className="h-5 w-5 text-emerald-600" />
                            </div>
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
                                4h
                            </Badge>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">12h</div>
                        <div className="text-sm text-gray-600">Planned Hours</div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-pink-600" />
                            </div>
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">
                                92%
                            </Badge>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">4.8</div>
                        <div className="text-sm text-gray-600">Avg. Rating</div>
                    </CardContent>
                </Card>
            </div>

            {/* My Plans Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Your Active Plans</h2>
                        <p className="text-gray-600">Plans you're currently organizing</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100" asChild>
                        <Link href="/plans/past">
                            View Past Plans
                        </Link>
                    </Button>
                </div>

                {myPlans.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {myPlans.map((plan) => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                ) : (
                    <Card className="border border-gray-200 border-dashed hover:shadow-md transition-shadow">
                        <CardContent className="p-12 text-center">
                            <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Calendar className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No active plans</h3>
                            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                                You haven't created any plans yet. Start organizing your first activity!
                            </p>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                asChild
                            >
                                <Link href="/plans/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create First Plan
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Suggested Plans Section */}
            {suggestedPlans.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Suggested For You</h2>
                            <p className="text-gray-600">Plans you might be interested in</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" asChild>
                            <Link href="/browse">
                                View More
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {suggestedPlans.map((plan) => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Tips */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        Quick Tips for Better Plans
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg">
                            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 mb-1">Choose Clear Locations</div>
                                <div className="text-sm text-gray-600">Use specific landmarks or addresses</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg">
                            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 mb-1">Set Realistic Goals</div>
                                <div className="text-sm text-gray-600">Consider group size and complexity</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg">
                            <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 mb-1">Plan Time Buffers</div>
                                <div className="text-sm text-gray-600">Allow extra time for delays</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}