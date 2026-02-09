import Link from "next/link"
import { PlusCircle, Calendar, Users, TrendingUp, Filter, SortAsc, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/feed/event-card"
import { MOCK_EVENTS } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function OrganizerEventsPage() {
    // Filter for 'my' events
    const myEvents = MOCK_EVENTS.slice(0, 2)
    const pastEvents = MOCK_EVENTS.slice(2, 4)
    
    const stats = [
        { label: "Total Events", value: "12", change: "+2", icon: Calendar, color: "blue" },
        { label: "Total Attendees", value: "2,350", change: "+180", icon: Users, color: "purple" },
        { label: "Avg. Attendance", value: "82%", change: "+5%", icon: TrendingUp, color: "emerald" },
    ]

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
                {stats.map((stat, index) => (
                    <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                    stat.color === 'blue' ? 'bg-blue-100' : 
                                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-emerald-100'
                                }`}>
                                    <stat.icon className={`h-5 w-5 ${
                                        stat.color === 'blue' ? 'text-blue-600' : 
                                        stat.color === 'purple' ? 'text-purple-600' : 'text-emerald-600'
                                    }`} />
                                </div>
                                <Badge className={
                                    stat.change.startsWith('+') 
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                                <MoreVertical className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Export Events</DropdownMenuItem>
                            <DropdownMenuItem>Bulk Actions</DropdownMenuItem>
                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline" className="border-gray-300">All Events</Badge>
                    <Badge variant="outline" className="border-gray-300">Upcoming</Badge>
                    <Badge variant="outline" className="border-gray-300">Past</Badge>
                    <Badge variant="outline" className="border-gray-300">Draft</Badge>
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
                        {myEvents.length} Events
                    </Badge>
                </div>

                {myEvents.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {myEvents.map((event) => (
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
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" asChild>
                            <Link href="/organizer/events/past">
                                View All Past Events
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pastEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-gray-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold text-blue-600">4.8</div>
                        <div className="text-sm text-gray-600">Avg. Rating</div>
                    </CardContent>
                </Card>
                <Card className="border border-gray-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold text-purple-600">92%</div>
                        <div className="text-sm text-gray-600">Attendance Rate</div>
                    </CardContent>
                </Card>
                <Card className="border border-gray-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold text-emerald-600">85%</div>
                        <div className="text-sm text-gray-600">Repeat Attendees</div>
                    </CardContent>
                </Card>
                <Card className="border border-gray-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold text-amber-600">24h</div>
                        <div className="text-sm text-gray-600">Avg. Response Time</div>
                    </CardContent>
                </Card>
            </div>

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
                        <Button variant="outline" className="border-gray-300 hover:bg-white/50" asChild>
                            <Link href="/organizer/tips">
                                View More Tips
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}