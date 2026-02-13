"use client"

import { useEffect, useState } from "react"
import {
    Users,
    Calendar,
    MapPin,
    AlertCircle,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    CheckCircle2, // Added CheckCircle2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { adminApi, AdminStats } from "@/lib/api/admin"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"

// Define a type for recent activity items based on usage
interface RecentActivityItem {
    id: string;
    type: 'user' | 'event' | 'report';
    title: string;
    time: string;
    status: string;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]) // Fixed type
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, activityData] = await Promise.all([
                    adminApi.getStats(),
                    adminApi.getRecentActivity()
                ])
                setStats(statsData)
                setRecentActivity(activityData)
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error)
                toast.error("Failed to load dashboard statistics")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const statCards = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            description: stats?.growth?.users !== undefined ? (stats.growth.users >= 0 ? `+${stats.growth.users}% from last month` : `${stats.growth.users}% from last month`) : "0% from last month",
            trend: (stats?.growth?.users || 0) >= 0 ? "up" : "down",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Total Events",
            value: stats?.totalEvents || 0,
            icon: Calendar,
            description: stats?.growth?.events !== undefined ? (stats.growth.events >= 0 ? `+${stats.growth.events}% from last month` : `${stats.growth.events}% from last month`) : "0% from last month",
            trend: (stats?.growth?.events || 0) >= 0 ? "up" : "down",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "Active Plans",
            value: stats?.totalPlans || 0,
            icon: MapPin,
            description: stats?.growth?.plans !== undefined ? (stats.growth.plans >= 0 ? `+${stats.growth.plans}% from last month` : `${stats.growth.plans}% from last month`) : "0% from last month",
            trend: (stats?.growth?.plans || 0) >= 0 ? "up" : "down",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
        {
            title: "Reports",
            value: stats?.totalReports || 0,
            icon: AlertCircle,
            description: stats?.growth?.reports !== undefined ? (stats.growth.reports >= 0 ? `+${stats.growth.reports}% from last month` : `${stats.growth.reports}% from last month`) : "0% from last month",
            trend: (stats?.growth?.reports || 0) >= 0 ? "up" : "down",
            color: "text-amber-600",
            bgColor: "bg-amber-50"
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-500 mt-1">
                    Welcome to the admin panel. Here&apos;s what&apos;s happening today.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <Card key={i} className="border-none shadow-sm bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    statCards.map((card, index) => (
                        <Card key={index} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                                <div className={`${card.bgColor} ${card.color} p-2 rounded-lg`}>
                                    <card.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</div>
                                <div className="flex items-center mt-1">
                                    {card.trend === "up" ? (
                                        <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                                    ) : card.trend === "down" ? (
                                        <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
                                    ) : null}
                                    <p className={`text-xs font-medium ${card.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>{card.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle>Activity Overview</CardTitle>
                        <CardDescription>System activity over the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl m-6 mt-0">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Activity visualization will appear here</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-3">
                            <button className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">Verify Organizers</p>
                                        <p className="text-xs text-gray-500">Check pending applications</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </button>

                            <button className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">Review Events</p>
                                        <p className="text-xs text-gray-500">Approve new event listings</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </button>

                            <button className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                        <AlertCircle className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">User Reports</p>
                                        <p className="text-xs text-gray-500">Handle reported content</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest system-wide events and actions</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mt-1 ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'event' ? 'bg-purple-100 text-purple-600' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                            {activity.type === 'user' ? <Users className="h-4 w-4" /> :
                                                activity.type === 'event' ? <Calendar className="h-4 w-4" /> :
                                                    <AlertCircle className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">{activity.title}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-gray-500">
                                                    {new Date(activity.time).toLocaleString()}
                                                </p>
                                                <span className="text-xs text-gray-300">•</span>
                                                <button className="text-xs text-blue-600 hover:underline">View Details</button>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${activity.status === 'approved' || activity.status === 'New User' ? 'bg-green-50 text-green-700 ring-green-700/10' :
                                            activity.status === 'pending' ? 'bg-amber-50 text-amber-700 ring-amber-700/10' :
                                                'bg-gray-50 text-gray-700 ring-gray-700/10'
                                            }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No recent activity</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
