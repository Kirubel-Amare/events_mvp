import Link from "next/link"
import { Calendar, PlusCircle, Users, TrendingUp, DollarSign, Star, Activity, Target, Sparkles, ArrowRight, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function OrganizerDashboardPage() {
    const stats = [
        {
            label: "Total Events",
            value: "12",
            change: "+2",
            icon: Calendar,
            color: "bg-gradient-to-br from-blue-500 to-cyan-500",
            trend: "up"
        },
        {
            label: "Total Followers",
            value: "2,350",
            change: "+180",
            icon: Users,
            color: "bg-gradient-to-br from-purple-500 to-pink-500",
            trend: "up"
        },
        {
            label: "Total Revenue",
            value: "$4,850",
            change: "+$420",
            icon: DollarSign,
            color: "bg-gradient-to-br from-emerald-500 to-green-500",
            trend: "up"
        },
        {
            label: "Avg. Rating",
            value: "4.8",
            change: "+0.2",
            icon: Star,
            color: "bg-gradient-to-br from-amber-500 to-orange-500",
            trend: "up"
        }
    ]

    const upcomingEvents = [
        { id: 1, title: "Summer Music Fest", date: "Jun 15", attendeesCount: "850/1000", status: "Active" },
        { id: 2, title: "Tech Conference", date: "Jun 20", attendeesCount: "320/500", status: "Active" },
        { id: 3, title: "Yoga Retreat", date: "Jun 25", attendeesCount: "45/50", status: "Almost Full" },
    ]

    const performance = [
        { metric: "Event Views", value: "12.5K", change: "+24%" },
        { metric: "Ticket Sales", value: "845", change: "+18%" },
        { metric: "Engagement Rate", value: "8.2%", change: "+2.1%" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Organizer Dashboard</h1>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Verified
                        </Badge>
                    </div>
                    <p className="text-lg text-gray-600">
                        Manage your events, track performance, and grow your audience
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

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <Badge className={`${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} hover:bg-green-100 border-0`}>
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {stat.change}
                                </Badge>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Upcoming Events */}
                <div className="lg:col-span-2">
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-900">Upcoming Events</CardTitle>
                                    <CardDescription className="text-gray-600">Events happening soon</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" asChild>
                                    <Link href="/organizer/events">
                                        View All
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                <Calendar className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {event.title}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span>{event.date}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {event.attendeesCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={
                                            event.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                event.status === 'Almost Full' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                        }>
                                            {event.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-6 border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/organizer/events/create">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add New Event
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Performance Metrics */}
                    <Card className="border border-gray-200 mt-6">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <BarChart className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-xl text-gray-900">Performance Metrics</CardTitle>
                            </div>
                            <CardDescription className="text-gray-600">Last 30 days performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {performance.map((item, index) => (
                                    <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">{item.metric}</span>
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                                {item.change}
                                            </Badge>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                                        <div className="h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                style={{ width: `${70 + index * 10}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Quick Actions & Insights */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" asChild>
                                <Link href="/organizer/events/create">
                                    <PlusCircle className="mr-3 h-4 w-4" />
                                    Create Event
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/organizer/analytics">
                                    <BarChart className="mr-3 h-4 w-4" />
                                    View Analytics
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/organizer/audience">
                                    <Users className="mr-3 h-4 w-4" />
                                    Audience Insights
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/organizer/settings">
                                    <Activity className="mr-3 h-4 w-4" />
                                    Settings
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Insights */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                                <Target className="h-5 w-5 text-purple-600" />
                                Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-900 mb-1">Tip of the Day</div>
                                <div className="text-sm text-blue-700">
                                    Posting events 2-3 weeks in advance increases attendance by 40%
                                </div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="text-sm font-medium text-purple-900 mb-1">Best Time to Post</div>
                                <div className="text-sm text-purple-700">
                                    Tuesdays & Thursdays at 10 AM get 25% more views
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Goals */}
                    <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl text-gray-900">Monthly Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">Event Creation</span>
                                        <span className="font-medium text-gray-900">2/5</span>
                                    </div>
                                    <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '40%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">Revenue Target</span>
                                        <span className="font-medium text-gray-900">$850/$2,000</span>
                                    </div>
                                    <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '42.5%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">New Followers</span>
                                        <span className="font-medium text-gray-900">180/500</span>
                                    </div>
                                    <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{ width: '36%' }} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}