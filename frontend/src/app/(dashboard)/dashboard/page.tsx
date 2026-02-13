"use client"

import Link from "next/link"
import { Calendar, Plus, User, Settings, Bell, Heart, TrendingUp, Users, Sparkles, ArrowRight, Loader2, MapPin, Clock, ChevronRight, Zap, Target, Award, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/store/auth-store"
import { useEffect, useState } from "react"
import { usersApi, Application } from "@/lib/api/users"
import { organizerApi } from "@/lib/api/organizer"
import { format, formatDistance } from "date-fns"
import { Event } from "@/types"

export default function DashboardPage() {
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState(true)
    const [applications, setApplications] = useState<Application[]>([])
    const [myEvents, setMyEvents] = useState<Event[]>([])
    const [dashboardStats, setDashboardStats] = useState<any>(null)
    const [activeTab, setActiveTab] = useState("events")

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setIsLoading(false)
                return
            }

            try {
                // Fetch user applications
                const appsData = await usersApi.getApplications()
                setApplications(appsData)

                // If organizer, fetch own events
                if (user.isOrganizer && user.organizerProfile) {
                    const eventsData = await organizerApi.getOrganizerEvents(user.organizerProfile.id)
                    setMyEvents(eventsData)
                }

                // Fetch dashboard stats
                const statsData = await usersApi.getDashboardStats()
                setDashboardStats(statsData)
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [user])

    if (!user) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                    <User className="h-8 w-8 text-primary" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">Please sign in</h2>
                <p className="mt-2 text-muted-foreground">Sign in to access your dashboard</p>
                <Button className="mt-6" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                </Button>
            </div>
        )
    }

    // Process data
    const upcomingEvents = applications
        .filter(app => app.event && app.event.date && new Date(app.event.date).toString() !== 'Invalid Date' && new Date(app.event.date) > new Date())
        .map(app => {
            const eventDate = new Date(app.event.date);
            const isValidDate = eventDate.toString() !== 'Invalid Date';

            return {
                id: app.event.id,
                title: app.event.title,
                date: isValidDate ? format(eventDate, "PPP") : "TBD",
                time: isValidDate ? format(eventDate, "p") : "TBD",
                location: app.event.city,
                category: typeof app.event.category === 'object' ? app.event.category.name : app.event.category,
                attendees: app.event.capacity ? `${app.event.capacity} cap` : "Open",
                image: app.event.image || (app.event.images && app.event.images[0]) || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop"
            }
        })
        .slice(0, 5)

    const recentActivity = applications.slice(0, 5).map(app => {
        const appliedDate = app.appliedAt ? new Date(app.appliedAt) : null;
        const isValidDate = appliedDate && appliedDate.toString() !== 'Invalid Date';

        return {
            id: app.id,
            action: "Joined",
            event: app.event?.title || app.plan?.title || "Event",
            time: isValidDate ? format(appliedDate!, "MMM d, h:mm a") : "Recently",
            type: app.event ? "event" : "plan",
            status: app.status
        }
    })

    // Stats with enhanced data
    const totalEventsJoined = applications.length
    const upcomingCount = upcomingEvents.length
    const organizerEventsCount = myEvents.length
    const completionRate = applications.length > 0 ?
        Math.round((applications.filter(app => app.status === 'approved').length / applications.length) * 100) : 0

    const stats = [
        {
            label: "Events Joined",
            value: totalEventsJoined.toString(),
            change: "+12%",
            icon: Calendar,
            color: "from-primary/80 to-primary",
            trend: "up"
        },
        {
            label: "Upcoming Events",
            value: upcomingCount.toString(),
            change: upcomingCount > 0 ? `${upcomingCount} active` : "None scheduled",
            icon: Clock,
            color: "from-blue-500/80 to-blue-600",
            trend: "neutral"
        },
        {
            label: "Account Level",
            value: user.isVerified ? "Verified" : "Standard",
            change: user.isVerified ? "✓ Premium" : "Upgrade available",
            icon: Award,
            color: "from-purple-500/80 to-purple-600",
            trend: user.isVerified ? "verified" : "standard"
        },
        ...(user.isOrganizer ? [
            {
                label: "Events Hosted",
                value: organizerEventsCount.toString(),
                change: "+5 this month",
                icon: Sparkles,
                color: "from-amber-500/80 to-amber-600",
                trend: "up"
            },
        ] : []),
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            change: completionRate > 80 ? "Excellent" : "Good",
            icon: Target,
            color: "from-emerald-500/80 to-emerald-600",
            trend: completionRate > 80 ? "excellent" : "good"
        }
    ]

    const quickActions = user.isOrganizer ? [
        { icon: Plus, label: "Create Event", href: "/events/create", color: "bg-primary/10 text-primary border-primary/20" },
        { icon: BarChart, label: "Analytics", href: "/organizer/analytics", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
        { icon: Users, label: "Audience", href: "/organizer/audience", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
        { icon: Settings, label: "Settings", href: "/organizer/settings", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
    ] : [
        { icon: Plus, label: "Create Plan", href: "/plans/create", color: "bg-primary/10 text-primary border-primary/20" },
        { icon: Sparkles, label: "Explore Events", href: "/browse/events", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
        { icon: Heart, label: "Saved Events", href: "/saved", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
        { icon: Bell, label: "Notifications", href: "/notifications", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Enhanced Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-background p-8 border">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="h-14 w-14 rounded-full relative flex  items-center justify-center  bg-gradient-to-r from-blue-600 to-purple-600">
                                        <span className="text-xl font-bold text-white">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold">
                                        Welcome back,{" "}
                                        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                            {user.name?.split(' ')[0]}
                                        </span>
                                        ! 👋
                                    </h1>
                                    <p className="text-muted-foreground mt-2">
                                        Here's what's happening with your events and plans.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="gap-2 px-4 py-2">
                                {user.isOrganizer ? (
                                    <>
                                        <Sparkles className="h-3 w-3" />
                                        Organizer
                                    </>
                                ) : (
                                    <>
                                        <User className="h-3 w-3" />
                                        Member
                                    </>
                                )}
                            </Badge>

                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid with Modern Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="group hover-lift transition-all duration-300 overflow-hidden border-border"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-5 w-5 text-white" />
                                </div>
                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' :
                                    stat.trend === 'verified' ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300' :
                                        'bg-gray-500/10 text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {stat.change}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                            <div className="mt-4 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs for Events/Plans */}
                    <Tabs defaultValue="events" className="w-full" onValueChange={setActiveTab}>
                        <Card className="border-border">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl">Your Activities</CardTitle>
                                        <CardDescription>Manage your events and plans</CardDescription>
                                    </div>
                                    <TabsList className="grid w-full sm:w-auto grid-cols-2">
                                        <TabsTrigger value="events" className="gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Events
                                        </TabsTrigger>
                                        <TabsTrigger value="plans" className="gap-2">
                                            <Users className="h-4 w-4" />
                                            Plans
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </CardHeader>

                            <TabsContent value="events" className="m-0">
                                <CardContent className="space-y-4">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="text-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                                                <p className="mt-3 text-sm text-muted-foreground">Loading events...</p>
                                            </div>
                                        </div>
                                    ) : upcomingEvents.length > 0 ? (
                                        upcomingEvents.map((event, index) => (
                                            <div
                                                key={event.id}
                                                className="group flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-all hover-lift animate-fade-in stagger-item"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="hidden sm:block">
                                                        <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-3">
                                                            <Calendar className="h-5 w-5 text-primary" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold group-hover:text-primary transition-colors">
                                                                {event.title}
                                                            </h4>
                                                            <Badge variant="outline" className="text-xs">
                                                                {event.category}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {event.date}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {event.time}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {event.location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                                    <Link href={`/events/${event.id}`}>
                                                        View
                                                        <ChevronRight className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4">
                                                <Calendar className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-semibold mb-2">No upcoming events</h3>
                                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                                You haven't joined any events yet. Explore events to get started!
                                            </p>
                                            <Button size="lg"
                                                className="px-8 md:px-10 h-12 md:h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 group shadow-lg"
                                                asChild>
                                                <Link href="/browse/events">
                                                    <Sparkles className="mr-3 h-4 w-4" />
                                                    Browse Events
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                                {upcomingEvents.length > 0 && (
                                    <CardFooter className="border-t">
                                        <Button variant="ghost" className="w-full gap-2" asChild>
                                            <Link href="/my/events">
                                                View All Events
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                )}
                            </TabsContent>

                            <TabsContent value="plans" className="m-0">
                                <CardContent className="text-center py-12">
                                    <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4">
                                        <Users className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold mb-2">No active plans</h3>
                                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                        Start a new plan to organize gatherings with friends and community.
                                    </p>
                                    <Button asChild>
                                        <Link href="/plans/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create New Plan
                                        </Link>
                                    </Button>
                                </CardContent>
                            </TabsContent>
                        </Card>
                    </Tabs>

                    {/* Organized Events Section (For Organizers) */}
                    {user.isOrganizer && myEvents.length > 0 && (
                        <Card className="border-border">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-amber-500" />
                                            Your Hosted Events
                                        </CardTitle>
                                        <CardDescription>Events you have created and managed</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="gap-2">
                                        <TrendingUp className="h-3 w-3" />
                                        {myEvents.length} total
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {myEvents.slice(0, 3).map((event, index) => (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors group animate-fade-in"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-3">
                                                    <Calendar className="h-5 w-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold group-hover:text-amber-600 transition-colors">
                                                        {event.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                        <span>{format(new Date(event.date), "PPP")}</span>
                                                        <span>•</span>
                                                        <span>{typeof event.category === 'object' ? event.category.name : (event.category || "General")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" className="gap-2" asChild>
                                                    <Link href={`/organizer/events/${event.id}`}>
                                                        Manage
                                                        <ChevronRight className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            {myEvents.length > 3 && (
                                <CardFooter className="border-t">
                                    <Button variant="ghost" className="w-full gap-2" asChild>
                                        <Link href="/organizer/events">
                                            View All {myEvents.length} Events
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions Grid */}
                    <Card className="border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-500" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="h-auto flex items-center justify-start gap-2 p-2.5 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                                    asChild
                                >
                                    <Link href={action.href} className="w-full flex items-center gap-2.5">
                                        <div className={`rounded-lg p-2 flex-shrink-0 border ${action.color}`}>
                                            <action.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium truncate">{action.label}</span>
                                    </Link>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Become Organizer Callout */}
                    {!user.isOrganizer && (
                        <Card className="border-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background shadow-lg overflow-hidden">
                            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16" />
                            <CardHeader className="relative">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-gradient-to-r from-primary to-purple-600 p-2">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Become an Organizer</CardTitle>
                                </div>
                                <CardDescription>
                                    Host public events and grow your community
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative space-y-4">
                                <ul className="space-y-3 text-sm">
                                    {[
                                        "Create unlimited events",
                                        "Access advanced analytics",
                                        "Monetize your expertise",
                                        "Build your audience"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="relative">
                                <Button

                                    className=" w-full px-10 md:px-10 h-12 md:h-10 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 group shadow-lg"
                                    asChild
                                >
                                    <Link href="/dashboard/become-organizer">
                                        <Sparkles className="mr-5 h-4 w-4" />
                                        Start Application
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Recent Activity */}
                    <Card className="border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl">Recent Activity</CardTitle>
                            <CardDescription>Your latest actions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors group"
                                    >
                                        <div className={`rounded-full p-2 ${activity.type === 'event' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'
                                            }`}>
                                            {activity.type === 'event' ? (
                                                <Calendar className="h-4 w-4" />
                                            ) : (
                                                <Users className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{activity.event}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.action} • {activity.time}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground text-sm">
                                    No recent activity
                                </div>
                            )}
                        </CardContent>
                        {recentActivity.length > 0 && (
                            <CardFooter className="border-t">
                                <Button variant="ghost" className="w-full text-sm" asChild>
                                    <Link href="/activity">View All Activity</Link>
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    {/* Profile Completion */}
                    <Card className="border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl">Profile Strength</CardTitle>
                            <CardDescription>Complete your profile for better recommendations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Progress value={dashboardStats?.profileStrength || 0} className="h-2" />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Profile Strength</span>
                                    <Badge variant="outline" className={dashboardStats?.profileStrength > 70 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}>
                                        {dashboardStats?.profileStrength || 0}%
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Interests</span>
                                    <Badge variant="outline">Add 3+</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Profile Photo</span>
                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300">
                                        Recommended
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className=" w-full px-10 md:px-10 h-12 md:h-10 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 group shadow-lg"
                                asChild>
                                <Link href="/profile">
                                    <Settings className="mr-5 h-4 w-4" />
                                    Complete Profile
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}