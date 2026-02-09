import Link from "next/link"
import { Calendar, Plus, User, Settings, Bell, Heart, TrendingUp, Users, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
    // Mock data
    const upcomingEvents = [
        { id: 1, title: "Morning Yoga Session", date: "Today, 8:00 AM", location: "Central Park", attendees: 25 },
        { id: 2, title: "Tech Meetup", date: "Tomorrow, 6:00 PM", location: "Tech Hub", attendees: 120 },
    ]

    const recentActivity = [
        { id: 1, action: "Joined", event: "Food Tasting Tour", time: "2 hours ago" },
        { id: 2, action: "Saved", event: "Art Gallery Opening", time: "1 day ago" },
        { id: 3, action: "Created", event: "Weekend Hike Plan", time: "3 days ago" },
    ]

    const stats = [
        { label: "Events Attended", value: "12", change: "+2", icon: Calendar },
        { label: "Friends Connected", value: "45", change: "+5", icon: Users },
        { label: "Plans Created", value: "3", change: "+1", icon: Plus },
        { label: "Liked Events", value: "28", change: "+3", icon: Heart },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome back, John! 👋</h1>
                    <p className="text-gray-600 mt-2">
                        Here's what's happening with your events and plans.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-100">
                        <Bell className="h-4 w-4 text-gray-600" />
                    </Button>
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
                                <div className={`p-2 rounded-lg ${index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-purple-100' : index === 2 ? 'bg-emerald-100' : 'bg-pink-100'}`}>
                                    <stat.icon className={`h-5 w-5 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-purple-600' : index === 2 ? 'text-emerald-600' : 'text-pink-600'}`} />
                                </div>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                    {stat.change}
                                </Badge>
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
                                    <Link href="/events/upcoming">
                                        View All
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcomingEvents.map((event) => (
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
                                    <div className="flex items-center gap-2">
                                        <Users className="h-3 w-3 text-gray-400" />
                                        <span className="text-sm text-gray-600">{event.attendees}</span>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                                <Link href="/browse">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Discover More Events
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-900">Recent Activity</CardTitle>
                                    <CardDescription>Your recent interactions</CardDescription>
                                </div>
                                <Badge variant="outline" className="border-gray-300">Today</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.action === 'Joined' ? 'bg-blue-100' : activity.action === 'Saved' ? 'bg-pink-100' : 'bg-emerald-100'}`}>
                                            {activity.action === 'Joined' && <Users className="h-4 w-4 text-blue-600" />}
                                            {activity.action === 'Saved' && <Heart className="h-4 w-4 text-pink-600" />}
                                            {activity.action === 'Created' && <Plus className="h-4 w-4 text-emerald-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                                You {activity.action.toLowerCase()} "{activity.event}"
                                            </div>
                                            <div className="text-sm text-gray-500">{activity.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
                            <CardDescription>Things you can do right now</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                                <Link href="/plans/create">
                                    <Plus className="mr-3 h-4 w-4" />
                                    Create New Plan
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/browse">
                                    <Sparkles className="mr-3 h-4 w-4" />
                                    Explore Events
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/profile">
                                    <User className="mr-3 h-4 w-4" />
                                    Edit Profile
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/settings">
                                    <Settings className="mr-3 h-4 w-4" />
                                    Settings
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Profile Stats */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">JD</span>
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-gray-900">John Doe</CardTitle>
                                    <CardDescription>Premium Member</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Member Since</span>
                                <span className="font-medium">Jan 2024</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Account Level</span>
                                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                                    <TrendingUp className="mr-1 h-3 w-3" />
                                    Growing
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Events This Month</span>
                                <span className="font-medium">4</span>
                            </div>
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/profile">
                                    View Full Profile
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Become Organizer */}
                    <Card className="border-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl text-gray-900">Become an Organizer</CardTitle>
                            <CardDescription>Host public events and grow your community</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Plus className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Start Hosting</div>
                                    <div className="text-sm text-gray-600">Create amazing experiences</div>
                                </div>
                            </div>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                                <Link href="/organizer/apply">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Apply Now
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}