"use client"

import Link from "next/link"
import { Calendar, Plus, User, Settings, Bell, Heart, TrendingUp, Users, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth-store"
import { useEffect, useState } from "react"
import { usersApi, Application } from "@/lib/api/users"
import { organizerApi } from "@/lib/api/organizer"
import { format } from "date-fns"
import { Event } from "@/types"

export default function DashboardPage() {
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState(true)
    const [applications, setApplications] = useState<Application[]>([])
    const [myEvents, setMyEvents] = useState<Event[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return

            try {
                // Fetch user applications
                const appsData = await usersApi.getApplications()
                setApplications(appsData)

                // If organizer, fetch own events
                if (user.isOrganizer && user.organizerProfile) {
                    const eventsData = await organizerApi.getOrganizerEvents(user.organizerProfile.id)
                    setMyEvents(eventsData)
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [user])

    if (!user) return null // Or redirect

    // Process data
    const upcomingEvents = applications
        .filter(app => app.event && new Date(app.event.date) > new Date())
        .map(app => ({
            id: app.event.id,
            title: app.event.title,
            date: format(new Date(app.event.date), "PPP p"),
            location: app.event.city,
            attendees: app.event.capacity ? `${app.event.capacity} cap` : "Open"
        }))
        .slice(0, 3)

    const recentActivity = applications.slice(0, 5).map(app => ({
        id: app.id,
        action: "Joined",
        event: app.event?.title || app.plan?.title || "Event",
        time: format(new Date(app.appliedAt), "MMM d, h:mm a")
    }))

    // Stats
    const stats = [
        { label: "Events Joined", value: applications.length.toString(), change: "+", icon: Calendar },
        { label: "Account Status", value: user.isVerified ? "Verified" : "Standard", change: "", icon: Users },
        // Add more dependent on role
        ...(user.isOrganizer ? [
            { label: "Events Hosted", value: myEvents.length.toString(), change: "+", icon: Sparkles },
        ] : [])
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome back, {user.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-gray-600 mt-2">
                        Here's what's happening with your events and plans.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-100">
                        <Settings className="h-4 w-4 text-gray-600" />
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${index % 4 === 0 ? 'bg-blue-100' : index % 4 === 1 ? 'bg-purple-100' : index % 4 === 2 ? 'bg-emerald-100' : 'bg-pink-100'}`}>
                                    <stat.icon className={`h-5 w-5 ${index % 4 === 0 ? 'text-blue-600' : index % 4 === 1 ? 'text-purple-600' : index % 4 === 2 ? 'text-emerald-600' : 'text-pink-600'}`} />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Upcoming Events */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-900">Upcoming Events</CardTitle>
                                    <CardDescription>Events you're attending soon</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" asChild>
                                    <Link href="/browse/events">
                                        View All
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
                            ) : upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{event.title}</div>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                    <span>{event.date}</span>
                                                    <span>•</span>
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-500 text-sm">
                                    No upcoming events. <Link href="/browse/events" className="text-blue-600 hover:underline">Find one?</Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Organized Events (For Organizers) */}
                    {user.isOrganizer && (
                        <Card className="border border-gray-200">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl text-gray-900">Your Hosted Events</CardTitle>
                                        <CardDescription>Events you have created</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" asChild>
                                        <Link href="/organizer/events">
                                            Manage
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {myEvents.length > 0 ? (
                                    myEvents.slice(0, 3).map(event => (
                                        <div key={event.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className="font-medium text-gray-900">{event.title}</div>
                                            <div className="text-sm text-gray-500">{format(new Date(event.date), "MMM d")}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500 text-sm">
                                        You haven't supervised any events yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {user.isOrganizer ? (
                                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                                    <Link href="/events/create">
                                        <Plus className="mr-3 h-4 w-4" />
                                        Create Event
                                    </Link>
                                </Button>
                            ) : (
                                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                                    <Link href="/plans/create">
                                        <Plus className="mr-3 h-4 w-4" />
                                        Create New Plan
                                    </Link>
                                </Button>
                            )}
                            <Button variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/browse/events">
                                    <Sparkles className="mr-3 h-4 w-4" />
                                    Explore Events
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Become Organizer Callout (If not organizer) */}
                    {!user.isOrganizer && (
                        <Card className="border-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl text-gray-900">Become an Organizer</CardTitle>
                                <CardDescription>Host public events and grow your community</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                                    <Link href="/organizer/apply">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Apply Now
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}