"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { organizerApi } from "@/lib/api/organizer"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"
import { Event } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Filter, PlusCircle, SortAsc, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { EventCard } from "@/components/feed/event-card"

export default function OrganizerEventsPage() {
    const { user } = useAuthStore()
    const [myEvents, setMyEvents] = useState<Event[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            if (!user?.id) return
            try {
                const [eventsData, statsData] = await Promise.all([
                    organizerApi.getOrganizerEvents(user.id),
                    organizerApi.getStats(user.id)
                ])
                setMyEvents(eventsData)
                setStats(statsData)
            } catch (error) {
                console.error("Failed to fetch organizer events:", error)
                toast.error("Failed to load your events.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchEvents()
    }, [user])

    const activeEvents = myEvents.filter(e => new Date(e.date) >= new Date())
    const pastEvents = myEvents.filter(e => new Date(e.date) < new Date())

    const statOverview = [
        { label: "Total Events", value: stats?.totalEvents || 0, change: "+0", icon: Calendar, color: "blue" },
        { label: "Total Attendees", value: stats?.totalAttendees || 0, change: "+0", icon: Users, color: "purple" },
        { label: "Avg. Attendance", value: stats?.rating ? `${stats.rating}/5` : "N/A", change: "Rating", icon: TrendingUp, color: "emerald" },
    ]

    if (isLoading) {
        return (
            <div className="space-y-8 p-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Events</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Manage and track all your published events
                    </p>
                </div>
                <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group"
                    asChild
                >
                    <Link href="/organizer/events/create">
                        <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                        Create New Event
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statOverview.map((stat, index) => (
                    <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-100' :
                                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-emerald-100'
                                    }`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color === 'blue' ? 'text-blue-600' :
                                        stat.color === 'purple' ? 'text-purple-600' : 'text-emerald-600'
                                        }`} />
                                </div>
                                <Badge className={
                                    stat.change.startsWith('+') || stat.change === 'Rating'
                                        ? 'bg-green-100 text-green-700 hover:bg-green-100 border-0'
                                        : 'bg-red-100 text-red-700 hover:bg-red-100 border-0'
                                }>
                                    {stat.change}
                                </Badge>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                        <Filter className="mr-2 h-3 w-3" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                        <SortAsc className="mr-2 h-3 w-3" />
                        Sort By
                    </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline" className="border-gray-300">All Events</Badge>
                    <Badge variant="outline" className="border-gray-300">Upcoming</Badge>
                </div>
            </div>

            {/* Active Events */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Active Events</h2>
                        <p className="text-gray-600">Currently published and upcoming events</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                        {activeEvents.length} Events
                    </Badge>
                </div>

                {activeEvents.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {activeEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <Card className="border border-gray-200 border-dashed hover:shadow-md transition-shadow">
                        <CardContent className="p-12 text-center">
                            <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Calendar className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No active events</h3>
                            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                                You haven't created any events yet. Start sharing your experiences with the community!
                            </p>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                asChild
                            >
                                <Link href="/organizer/events/create">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create First Event
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
                            <p className="text-gray-600">Events that have already taken place</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pastEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            )}

            {/* Tips */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Pro Tip</h3>
                            <p className="text-gray-600">
                                Events with photos get 3x more views. Make sure to upload high-quality images!
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}