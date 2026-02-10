"use client"

import { useEffect, useState } from "react"
import { eventsApi } from "@/lib/api/events"
import { Event } from "@/types"
import { toast } from "react-hot-toast"
import { Loader2, Calendar, MapPin, ChevronRight, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function EventsPage() {
    const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true)
                const [featured, upcoming] = await Promise.all([
                    eventsApi.getFeaturedEvents(),
                    eventsApi.getEvents({ limit: 12, sort: 'date', order: 'ASC' })
                ])
                setFeaturedEvents(featured)
                setUpcomingEvents(upcoming.events)
            } catch (error) {
                console.error("Failed to fetch events:", error)
                toast.error("Failed to load events")
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container py-12 space-y-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <Badge variant="outline" className="px-4 py-1.5 bg-blue-50 text-blue-700 border-blue-200">
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    Curated For You
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Discover Amazing Events</h1>
                <p className="text-lg text-gray-600">
                    From workshops to conferences, find the best experiences happening in your community.
                </p>
            </div>

            {/* Featured Events */}
            {featuredEvents.length > 0 && (
                <section className="space-y-8">
                    <div className="flex items-center gap-3 pb-2 border-b">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                        <h2 className="text-2xl font-bold">Featured Experiences</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredEvents.map((event) => (
                            <Card key={event.id} className="group overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all">
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={event.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-white/90 text-blue-700 hover:bg-white">Featured</Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="text-sm font-medium text-blue-600 mb-1">{event.category?.name}</div>
                                    <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="line-clamp-2 mb-4">
                                        {event.description}
                                    </CardDescription>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {event.city}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button className="w-full" asChild>
                                        <Link href={`/browse/events/${event.id}`}>
                                            Get Tickets
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Events */}
            <section className="space-y-8">
                <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-blue-600" />
                        <h2 className="text-2xl font-bold">Upcoming Events</h2>
                    </div>
                    <Button variant="ghost" asChild>
                        <Link href="/browse/events">
                            View All Browse
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {upcomingEvents.map((event) => (
                        <Card key={event.id} className="group hover:shadow-lg transition-shadow">
                            <div className="relative h-40 overflow-hidden">
                                <Image
                                    src={event.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"}
                                    alt={event.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <CardHeader className="p-4">
                                <CardTitle className="text-base line-clamp-1">{event.title}</CardTitle>
                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(event.date).toLocaleDateString()}
                                </div>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0">
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={`/browse/events/${event.id}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Explore All CTA */}
            <section className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center space-y-6 text-white shadow-xl shadow-blue-200">
                <h2 className="text-3xl font-bold">Didn't find what you're looking for?</h2>
                <p className="text-blue-100 max-w-xl mx-auto">
                    Explore our full catalog of events with powerful filters to find exactly what you need.
                </p>
                <Button size="lg" variant="secondary" className="px-12 h-14 text-blue-600 font-bold hover:bg-white" asChild>
                    <Link href="/browse/events">Go to Browse Page</Link>
                </Button>
            </section>
        </div>
    )
}
