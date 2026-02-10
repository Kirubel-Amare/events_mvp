"use client"

import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Analytics</h2>
                <p className="text-gray-500">Detailed insights and system performance metrics.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>New registrations over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg m-4 mt-0">
                        <BarChart3 className="h-8 w-8 text-gray-300" />
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle>Event Engagement</CardTitle>
                        <CardDescription>Views and interactions per event</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg m-4 mt-0">
                        <TrendingUp className="h-8 w-8 text-gray-300" />
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle>Conversion Rate</CardTitle>
                        <CardDescription>Plan creation per active user</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg m-4 mt-0">
                        <Users className="h-8 w-8 text-gray-300" />
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <BarChart3 className="h-12 w-12 text-gray-200 mb-4" />
                <p className="text-gray-500 font-medium">Advanced Analytics coming soon</p>
                <p className="text-sm text-gray-400">We are processing historical data to provide real-time insights.</p>
            </div>
        </div>
    )
}
