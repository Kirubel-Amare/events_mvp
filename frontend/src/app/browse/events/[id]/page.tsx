"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Calendar, MapPin, Share2, ArrowLeft, Users, Clock, Heart, Star, Instagram, Globe, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { eventsApi } from "@/lib/api/events"
import { useAuthStore } from "@/store/auth-store"
import { Event } from "@/types"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { SafeImage } from "@/components/shared/safe-image"

export default function EventDetailsPage() {
    const params = useParams()
    const id = params?.id as string
    const router = useRouter()
    const { user } = useAuthStore()

    const [event, setEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isJoining, setIsJoining] = useState(false)
    const [applications, setApplications] = useState<any[]>([])
    const [hasApplied, setHasApplied] = useState(false)

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return
            try {
                const data = await eventsApi.getEvent(id)
                setEvent(data)

                if (user) {
                    try {
                        const apps = await eventsApi.getApplications(id)
                        setApplications(apps)
                        const myApp = apps.find((app: any) => app.userId === user.id)
                        setHasApplied(!!myApp)
                    } catch (err) {
                        console.error("Failed to fetch applications", err)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch event", error)
                toast.error("Failed to load event details")
            } finally {
                setIsLoading(false)
            }
        }

        if (user && id) {
            fetchEvent()
        } else if (id) {
            eventsApi.getEvent(id).then(setEvent).catch(() => toast.error("Failed to load event")).finally(() => setIsLoading(false))
        }
    }, [id, user])

    const handleJoin = async () => {
        if (!user) {
            router.push("/login")
            return
        }
        setIsJoining(true)
        try {
            await eventsApi.joinEvent(id)
            toast.success("Joined event successfully!")
            setHasApplied(true)
            const apps = await eventsApi.getApplications(id)
            setApplications(apps)
        } catch (error) {
            toast.error("Failed to join event.")
        } finally {
            setIsJoining(false)
        }
    }

    const handleLeave = async () => {
        setIsJoining(true)
        try {
            await eventsApi.leaveEvent(id)
            toast.success("Left event successfully.")
            setHasApplied(false)
            const apps = await eventsApi.getApplications(id)
            setApplications(apps)
        } catch (error) {
            toast.error("Failed to leave event.")
        } finally {
            setIsJoining(false)
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">Event not found</h1>
                <Button asChild>
                    <Link href="/browse/events">Back to Events</Link>
                </Button>
            </div>
        )
    }

    const isOrganizer = user?.organizerProfile?.id === event.organizerId

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Image Section */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0">
                    {event.images && event.images.length > 0 ? (
                        <SafeImage
                            src={event.images[0]}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image Available</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay" />
                </div>

                {/* Navigation */}
                <div className="container relative z-10 pt-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
                        asChild
                    >
                        <Link href="/browse/events">
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </Link>
                    </Button>
                </div>

                {/* Event Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 container pb-8">
                    <div className="max-w-4xl">
                        {event.category && (
                            <Badge className="mb-4 bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30">
                                {event.category.name}
                            </Badge>
                        )}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            {event.title}
                        </h1>
                        <div className="flex items-center gap-4 text-white/90">
                            <span className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {applications.length} attending
                            </span>
                            {event.capacity && (
                                <>
                                    <span>•</span>
                                    <span>{event.capacity} max capacity</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container relative -mt-20 z-10 pb-16">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border border-gray-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                                            <Calendar className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Date & Time</div>
                                            <div className="font-semibold text-gray-900">{format(new Date(event.date), "PPP")}</div>
                                            <div className="text-sm text-gray-600">{format(new Date(event.date), "p")}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-gray-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                                            <MapPin className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Location</div>
                                            <div className="font-semibold text-gray-900">{event.city}</div>
                                            <div className="text-sm text-gray-600">See map</div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 mt-6">
                                        <div className="text-sm text-gray-600 mb-2">Event Stats</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <div className="text-lg font-bold text-blue-600">{applications.length}</div>
                                                <div className="text-xs text-gray-600">Attending</div>
                                            </div>
                                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                <div className="text-lg font-bold text-purple-600">
                                                    {event.capacity ? Math.round((applications.length / event.capacity) * 100) : 0}%
                                                </div>
                                                <div className="text-xs text-gray-600">Capacity</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* About Event */}
                        <Card className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-2xl text-gray-900">About This Event</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Participants */}
                        <Card className="border border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-xl">Attendees</CardTitle>
                                <Badge variant="secondary">{applications.length}</Badge>
                            </CardHeader>
                            <CardContent>
                                {applications.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {applications.slice(0, 6).map((app) => (
                                            <div key={app.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="h-10 w-10 text-white bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center font-bold">
                                                    {app.user?.personalProfile?.name?.[0] || app.user?.email?.[0] || "U"}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{app.user?.personalProfile?.name || "User"}</div>
                                                    <div className="text-xs text-gray-500">Joined {format(new Date(app.appliedAt), "MMM d")}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 py-4 text-center">Be the first to join!</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Action Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Ticket Card */}
                            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Price</div>
                                        <div className="text-4xl font-bold text-gray-900">
                                            {event.price && parseFloat(event.price) > 0 ? `$${event.price}` : "Free"}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {isOrganizer ? (
                                            <Button className="w-full" variant="outline" disabled>
                                                You are the organizer
                                            </Button>
                                        ) : hasApplied ? (
                                            <Button
                                                className="w-full bg-red-100 text-red-600 hover:bg-red-200 border-0"
                                                onClick={handleLeave}
                                                disabled={isJoining}
                                            >
                                                {isJoining ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
                                                Cancel Registration
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12"
                                                size="lg"
                                                onClick={handleJoin}
                                                disabled={isJoining}
                                            >
                                                {isJoining ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                                Register Now
                                            </Button>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-gray-300 hover:bg-gray-100"
                                            >
                                                <Heart className="mr-2 h-4 w-4" />
                                                Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-gray-300 hover:bg-gray-100"
                                            >
                                                <Share2 className="mr-2 h-4 w-4" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Organizer Info */}
                            {event.organizer && (
                                <Card className="border border-gray-200">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">About Organizer</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center overflow-hidden relative">
                                                    {event.organizer.profilePhoto ? (
                                                        <SafeImage src={event.organizer.profilePhoto} alt={event.organizer.organizationName} fill className="object-cover" />
                                                    ) : (
                                                        <span className="text-white font-bold">{event.organizer.organizationName[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{event.organizer.organizationName}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {event.organizer.isVerified ? "Verified Organizer" : "Organizer"}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100">
                                                View Profile
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}