import { FeedContainer } from "@/components/feed/feed-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, SortAsc, MapPin, Calendar, TrendingUp, Sparkles, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function BrowseEventsPage() {
    const filters = [
        { label: "All", active: true },
        { label: "Today", active: false },
        { label: "This Week", active: false },
        { label: "Free", active: false },
        { label: "Nearby", active: false },
        { label: "Popular", active: false },
    ]

    const categories = [
        { name: "Music", count: 42, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
        { name: "Business", count: 28, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
        { name: "Wellness", count: 35, color: "bg-gradient-to-r from-emerald-500 to-green-500" },
        { name: "Food & Drink", count: 51, color: "bg-gradient-to-r from-amber-500 to-orange-500" },
        { name: "Technology", count: 39, color: "bg-gradient-to-r from-slate-600 to-gray-600" },
        { name: "Art & Culture", count: 27, color: "bg-gradient-to-r from-violet-500 to-purple-500" },
    ]

    const trendingCities = [
        { name: "New York", count: 156 },
        { name: "Los Angeles", count: 89 },
        { name: "Chicago", count: 72 },
        { name: "Miami", count: 48 },
        { name: "Austin", count: 65 },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Search Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
                <div className="container py-12">
                    {/* Floating elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl" />
                    
                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <Badge className="mb-4 px-4 py-1.5 bg-white/80 backdrop-blur-sm border-blue-200">
                                <Sparkles className="h-3.5 w-3.5 mr-2 text-blue-500" />
                                10,000+ Events Available
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                                Discover Amazing <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Events</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                                Find events and plans happening around you. Join thousands of people experiencing unforgettable moments.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-3xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Search events, categories, or keywords..."
                                    className="pl-12 h-14 text-base bg-white border-gray-300 focus:border-blue-500"
                                />
                                <Button 
                                    size="lg" 
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                    Search
                                </Button>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                                <span className="text-sm text-gray-600">Trending:</span>
                                {["Music Festival", "Yoga", "Tech Meetup", "Food Tasting", "Networking"].map((tag) => (
                                    <button key={tag} className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                {/* Filters & Controls */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
                            <p className="text-gray-600">Browse through our curated collection of events</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                                <Filter className="mr-2 h-3 w-3" />
                                Filters
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                                <SortAsc className="mr-2 h-3 w-3" />
                                Sort By
                            </Button>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {filters.map((filter) => (
                            <Badge
                                key={filter.label}
                                variant={filter.active ? "default" : "outline"}
                                className={`
                                    cursor-pointer transition-all
                                    ${filter.active 
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0' 
                                        : 'border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                    }
                                `}
                            >
                                {filter.label}
                            </Badge>
                        ))}
                    </div>

                    {/* Applied Filters */}
                    <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-gray-700">Applied:</span>
                        <Badge className="bg-white border-gray-300 hover:bg-white">
                            Today
                            <X className="ml-1 h-3 w-3" />
                        </Badge>
                        <Badge className="bg-white border-gray-300 hover:bg-white">
                            New York
                            <X className="ml-1 h-3 w-3" />
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 text-blue-600 hover:text-blue-700">
                            Clear all
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Categories */}
                        <Card className="border border-gray-200">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg text-gray-900">Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {categories.map((category) => (
                                    <button
                                        key={category.name}
                                        className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-lg ${category.color}`} />
                                            <span className="text-gray-700 group-hover:text-gray-900">{category.name}</span>
                                        </div>
                                        <Badge variant="outline" className="border-gray-300 bg-gray-50">
                                            {category.count}
                                        </Badge>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Trending Cities */}
                        <Card className="border border-gray-200">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    Trending Cities
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {trendingCities.map((city) => (
                                    <button
                                        key={city.name}
                                        className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-700">{city.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{city.count} events</span>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Date Filter */}
                        <Card className="border border-gray-200">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                    Date Range
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {["Today", "Tomorrow", "This Weekend", "Next Week", "This Month"].map((date) => (
                                        <button
                                            key={date}
                                            className="flex items-center justify-between w-full p-2 text-sm hover:bg-gray-50 rounded transition-colors"
                                        >
                                            <span className="text-gray-700">{date}</span>
                                            <div className="h-2 w-2 bg-gray-300 rounded-full" />
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Premium Events */}
                        <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Premium Events</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Access exclusive events with premium features
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                                    >
                                        Upgrade Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <FeedContainer />

                        {/* Pagination & Stats */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">1-12</span> of <span className="font-semibold text-gray-900">156</span> events
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, '...', 13].map((num, i) => (
                                            <Button
                                                key={i}
                                                variant={num === 1 ? "default" : "ghost"}
                                                size="sm"
                                                className={`
                                                    h-8 w-8 ${num === 1 
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                                        : 'text-gray-700 hover:text-gray-900'
                                                    }
                                                `}
                                            >
                                                {num}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}