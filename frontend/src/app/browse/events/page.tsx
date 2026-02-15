"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { FeedContainer } from "@/components/feed/feed-container"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Filter,
    SortAsc,
    MapPin,
    Calendar,
    TrendingUp,
    Sparkles,
    Search,
    X,
    Loader2,
    ChevronRight,
    Heart,
    Users,
    Clock,
    ArrowRight,
    Zap,
    Target,
    Trophy,
    Music,
    Briefcase,
    Palette,
    Utensils,
    Code,
    Theater,
    BookOpen,
} from "lucide-react"
import { eventsApi } from "@/lib/api/events"
import { Event } from "@/types"
import { toast } from "react-hot-toast"
import Link from "next/link"

export default function BrowseEventsPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                    Preparing browse view...
                </p>
            </div>
        }>
            <BrowseEventsContent />
        </Suspense>
    )
}

function BrowseEventsContent() {
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [events, setEvents] = useState<Event[]>([])
    const [totalEvents, setTotalEvents] = useState(0)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
    const [location, setLocation] = useState(searchParams.get('location') || '')
    const [activeCategory, setActiveCategory] = useState("all")
    const [dateFilter, setDateFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [categories, setCategories] = useState<any[]>([])
    const [trendingCities, setTrendingCities] = useState<Array<{ name: string, count: number }>>([])
    const [likedEvents, setLikedEvents] = useState<string[]>([])

    const filters = [
        { label: "All", active: activeCategory === "all", value: "all", icon: <Sparkles className="h-3.5 w-3.5" /> },
        { label: "Today", active: dateFilter === "today", value: "today", icon: <Calendar className="h-3.5 w-3.5" /> },
        { label: "This Week", active: dateFilter === "this-week", value: "this-week", icon: <Calendar className="h-3.5 w-3.5" /> },
        { label: "Free", active: activeCategory === "free", value: "free", icon: <Trophy className="h-3.5 w-3.5" /> },
        { label: "Popular", active: activeCategory === "popular", value: "popular", icon: <TrendingUp className="h-3.5 w-3.5" /> },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                const queryParams: Record<string, string | number> = {
                    page: currentPage,
                    limit: 12,
                }

                if (searchQuery) queryParams.search = searchQuery
                if (location) queryParams.city = location
                if (activeCategory && activeCategory !== "all") {
                    if (activeCategory === "free") {
                        queryParams.price = "free"
                    } else if (activeCategory === "popular") {
                        queryParams.sort = "popular"
                    } else {
                        queryParams.category = activeCategory
                    }
                }
                if (dateFilter) {
                    const now = new Date()
                    const tomorrow = new Date(now)
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    const weekLater = new Date(now)
                    weekLater.setDate(weekLater.getDate() + 7)

                    if (dateFilter === "today") {
                        queryParams.startDate = now.toISOString()
                        queryParams.endDate = tomorrow.toISOString()
                    } else if (dateFilter === "this-week") {
                        queryParams.startDate = now.toISOString()
                        queryParams.endDate = weekLater.toISOString()
                    }
                }

                const [response, categoriesData] = await Promise.all([
                    eventsApi.getEvents(queryParams),
                    eventsApi.getCategories()
                ])
                setEvents(response.events)
                setTotalEvents(response.total || 0)

                const updatedCategories = categoriesData.map((cat, index) => {
                    const fallbackColors = [
                        { color: "from-blue-500/10 to-blue-500/5", textColor: "text-blue-600", bgColor: "bg-blue-50" },
                        { color: "from-indigo-500/10 to-indigo-500/5", textColor: "text-indigo-600", bgColor: "bg-indigo-50" },
                        { color: "from-emerald-500/10 to-emerald-500/5", textColor: "text-emerald-600", bgColor: "bg-emerald-50" },
                        { color: "from-purple-500/10 to-purple-500/5", textColor: "text-purple-600", bgColor: "bg-purple-50" },
                        { color: "from-amber-500/10 to-amber-500/5", textColor: "text-amber-600", bgColor: "bg-amber-50" },
                    ]
                    const colors = fallbackColors[index % fallbackColors.length]
                    return {
                        ...cat,
                        ...colors,
                        count: response.events.filter(e => e.categoryId === cat.id).length
                    }
                })
                setCategories(updatedCategories)

                const cityCounts = response.events.reduce((acc: Record<string, number>, event) => {
                    const city = event.city || "Unknown"
                    acc[city] = (acc[city] || 0) + 1
                    return acc
                }, {})

                const trending = Object.entries(cityCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, count]) => ({ name, count }))

                setTrendingCities(trending)

            } catch (error) {
                console.error("Failed to fetch events:", error)
                toast.error("Failed to load events")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [currentPage, activeCategory, dateFilter, searchQuery, location])

    const handleSearch = () => {
        setCurrentPage(1)
    }

    const handleFilterClick = (value: string) => {
        if (value === "all" || value === "free" || value === "popular") {
            setActiveCategory(value)
            setDateFilter("")
        } else if (value === "today" || value === "this-week") {
            setDateFilter(value)
            setActiveCategory("all")
        }
        setCurrentPage(1)
    }

    const handleCategoryClick = (categoryName: string) => {
        setActiveCategory(categoryName.toLowerCase())
        setCurrentPage(1)
    }

    const handleClearFilters = () => {
        setSearchQuery("")
        setLocation("")
        setActiveCategory("all")
        setDateFilter("")
        setCurrentPage(1)
    }

    const handleDateFilterClick = (date: string) => {
        if (date === "Today") setDateFilter("today")
        else if (date === "Tomorrow") {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            setDateFilter("today")
        }
        else if (date === "This Weekend") setDateFilter("this-week")
        setCurrentPage(1)
    }

    const toggleLike = (id: string) => {
        setLikedEvents(prev =>
            prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id]
        )
    }

    const appliedFilters = [
        ...(activeCategory && activeCategory !== "all" ? [{ label: activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1), type: 'category' }] : []),
        ...(dateFilter ? [{ label: dateFilter === "today" ? "Today" : "This Week", type: 'date' }] : []),
        ...(location ? [{ label: location, type: 'location' }] : []),
    ]

    const totalPages = Math.ceil(totalEvents / 12)

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
            {/* Hero Search Section - Already Responsive */}
            <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background border-b">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute top-0 left-10 w-32 sm:w-64 h-32 sm:h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-10 w-40 sm:w-80 h-40 sm:h-80 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="container relative z-10 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge variant="outline" className="mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-1.5 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 transition-all group animate-fade-in">
                            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2 text-primary group-hover:animate-pulse" />
                            <span className="text-xs sm:text-sm">{totalEvents.toLocaleString()}+ Events Available</span>
                            <div className="ml-1.5 sm:ml-2 h-1 w-6 sm:w-8 bg-gradient-to-r from-primary to-purple-600 rounded-full" />
                        </Badge>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
                            Discover <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Amazing Events</span>
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                            Find events and plans happening around you. Join thousands of people experiencing unforgettable moments.
                        </p>

                        {/* Enhanced Search Bar - Fully Responsive */}
                        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-2 mx-4 sm:mx-auto">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search events..."
                                            className="pl-8 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base bg-gray-50 border-gray-200"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="relative">
                                        <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                                        <Input
                                            placeholder="Location"
                                            className="pl-8 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base bg-gray-50 border-gray-200"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                </div>
                                <Button
                                    size="default"
                                    className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
                                    onClick={handleSearch}
                                >
                                    <Search className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="sm:inline">Find Events</span>
                                </Button>
                            </div>
                        </div>

                        {/* Trending Tags - Responsive */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 px-2">
                            <span className="text-xs sm:text-sm text-muted-foreground">Trending:</span>
                            {["Music", "Tech", "Food", "Sports", "Art"].map((tag) => (
                                <button
                                    key={tag}
                                    className="text-xs sm:text-sm text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-2 sm:px-3 py-1 rounded-full transition-all hover:scale-105"
                                    onClick={() => {
                                        setSearchQuery(tag)
                                        handleSearch()
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="container px-4 sm:px-6 py-8 sm:py-12">
                {/* Filters & Controls Header - Responsive */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="space-y-1 sm:space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-bold">Browse All Events</h2>
                            <p className="text-sm sm:text-base text-muted-foreground">Discover curated events based on your interests</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10">
                                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Filters</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10">
                                <SortAsc className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Sort By</span>
                            </Button>
                        </div>
                    </div>

                    {/* Quick Filters - Responsive Grid */}
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                        {filters.map((filter) => (
                            <Badge
                                key={filter.label}
                                variant={filter.active ? "default" : "outline"}
                                className={`
                                    cursor-pointer transition-all gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 group hover-lift
                                    text-xs sm:text-sm justify-center
                                    ${filter.active
                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-lg'
                                        : 'border-border hover:bg-muted hover:border-primary/50'
                                    }
                                `}
                                onClick={() => handleFilterClick(filter.value)}
                            >
                                <span className="opacity-90 h-3 w-3 sm:h-3.5 sm:w-3.5">{filter.icon}</span>
                                <span className="hidden xs:inline">{filter.label}</span>
                            </Badge>
                        ))}
                    </div>

                    {/* Applied Filters - Responsive */}
                    {appliedFilters.length > 0 && (
                        <Card className="mb-4 sm:mb-6 border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="text-xs sm:text-sm font-medium text-primary">Active:</span>
                                    {appliedFilters.map((filter, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary/10 cursor-pointer gap-1 sm:gap-2 group text-xs sm:text-sm px-2 sm:px-3 py-1"
                                            onClick={() => {
                                                if (filter.type === 'category') setActiveCategory("all")
                                                else if (filter.type === 'date') setDateFilter("")
                                                else if (filter.type === 'location') setLocation("")
                                            }}
                                        >
                                            {filter.label}
                                            <X className="h-2.5 w-2.5 sm:h-3 sm:w-3 group-hover:scale-110 transition-transform" />
                                        </Badge>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto px-2 sm:px-3 py-1 text-xs sm:text-sm text-primary hover:bg-primary/10"
                                        onClick={handleClearFilters}
                                    >
                                        Clear all
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                        <div className="relative">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20" />
                            <Loader2 className="absolute inset-0 m-auto h-5 w-5 sm:h-8 sm:w-8 animate-spin text-primary" />
                        </div>
                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground animate-pulse">
                            Loading amazing events...
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                        {/* Sidebar - Responsive (Collapsible on mobile) */}
                        <div className="lg:w-80 xl:w-96 space-y-4 sm:space-y-6">
                            {/* Categories Card */}
                            <Card className="border-border shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                                    <CardTitle className="text-base sm:text-xl flex items-center gap-2">
                                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                        Categories
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Browse by interest</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-4">
                                    {categories.map((category, index) => (
                                        <button
                                            key={category.name}
                                            className={`flex items-center justify-between w-full p-2 sm:p-3 rounded-lg sm:rounded-xl border hover:shadow-md transition-all hover-lift group ${activeCategory === category.name.toLowerCase() ? 'bg-gradient-to-r from-primary/5 via-transparent to-transparent border-primary/30' : 'hover:border-primary/30'}`}
                                            onClick={() => handleCategoryClick(category.name)}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-4">
                                                <div className={`rounded-lg bg-gradient-to-br ${category.color} p-2 sm:p-3 group-hover:scale-110 transition-transform`}>
                                                    <span className={`text-base sm:text-lg ${category.textColor}`}>{category.icon}</span>
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-xs sm:text-sm font-semibold group-hover:text-primary transition-colors">
                                                        {category.name}
                                                    </div>
                                                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                                                        {category.count} events
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className={`h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground opacity-0 group-hover:opacity-100 ${activeCategory === category.name.toLowerCase() ? 'opacity-100 text-primary' : ''}`} />
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Trending Cities Card */}
                            <Card className="border-border shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                                    <CardTitle className="text-base sm:text-xl flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                        Trending Cities
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Popular locations</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-4">
                                    {trendingCities.map((city, index) => (
                                        <button
                                            key={city.name}
                                            className="flex items-center justify-between w-full p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-all hover-lift group"
                                            onClick={() => {
                                                setLocation(city.name)
                                                setCurrentPage(1)
                                            }}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="rounded-full bg-blue-500/10 p-1.5 sm:p-2">
                                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-xs sm:text-sm font-medium">{city.name}</div>
                                                    <div className="text-[10px] sm:text-xs text-muted-foreground">{city.count} events</div>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Date Filter Card */}
                            <Card className="border-border shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                                    <CardTitle className="text-base sm:text-xl flex items-center gap-2">
                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                                        Date Range
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Filter by time</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0">
                                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                                        {["Today", "Tomorrow", "Weekend", "Next Week"].map((date) => (
                                            <button
                                                key={date}
                                                className="flex items-center justify-between w-full p-2 sm:p-3 text-xs sm:text-sm hover:bg-muted/50 rounded-lg transition-colors group border sm:border-0"
                                                onClick={() => handleDateFilterClick(date)}
                                            >
                                                <span className="text-foreground group-hover:text-primary transition-colors">{date}</span>
                                                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary/30 rounded-full group-hover:bg-primary transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content - Events Grid */}
                        <div className="flex-1">
                            {events.length === 0 ? (
                                <Card className="border-border">
                                    <CardContent className="py-10 sm:py-16 text-center">
                                        <div className="rounded-full bg-muted p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                                            <Search className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">No events found</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-sm mx-auto px-4">
                                            Try adjusting your filters or search terms to find more events
                                        </p>
                                        <Button onClick={handleClearFilters} variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
                                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                            Clear All Filters
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                    <FeedContainer events={events} />

                                    {/* Enhanced Pagination - Fully Responsive */}
                                    {events.length > 0 && (
                                        <Card className="mt-6 sm:mt-8 border-border">
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                                                    <div className="text-center sm:text-left">
                                                        <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                                                            Showing <span className="font-semibold text-foreground">
                                                                {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, totalEvents)}
                                                            </span> of <span className="font-semibold text-foreground">{totalEvents}</span> events
                                                        </div>
                                                        <div className="text-[10px] sm:text-xs text-muted-foreground">
                                                            Page {currentPage} of {totalPages}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1 sm:gap-2 border-border hover:bg-muted text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                            disabled={currentPage === 1}
                                                        >
                                                            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 rotate-180" />
                                                            <span className="hidden xs:inline">Prev</span>
                                                        </Button>

                                                        <div className="flex items-center gap-1">
                                                            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                                                const pageNum = i + 1
                                                                return (
                                                                    <Button
                                                                        key={pageNum}
                                                                        variant={pageNum === currentPage ? "default" : "ghost"}
                                                                        size="sm"
                                                                        className={`
                                                                            h-7 w-7 sm:h-9 sm:w-9 rounded-lg text-xs sm:text-sm
                                                                            ${pageNum === currentPage
                                                                                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg'
                                                                                : 'hover:bg-muted'
                                                                            }
                                                                        `}
                                                                        onClick={() => setCurrentPage(pageNum)}
                                                                    >
                                                                        {pageNum}
                                                                    </Button>
                                                                )
                                                            })}

                                                            {totalPages > 3 && currentPage > 3 && currentPage < totalPages - 2 && (
                                                                <span className="text-muted-foreground px-1 sm:px-2 text-xs sm:text-sm">...</span>
                                                            )}

                                                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg hover:bg-muted text-xs sm:text-sm"
                                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                                >
                                                                    {currentPage + 1}
                                                                </Button>
                                                            )}

                                                            {totalPages > 3 && (
                                                                <>
                                                                    <span className="text-muted-foreground px-1 sm:px-2 text-xs sm:text-sm">...</span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg hover:bg-muted text-xs sm:text-sm"
                                                                        onClick={() => setCurrentPage(totalPages)}
                                                                    >
                                                                        {totalPages}
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1 sm:gap-2 border-border hover:bg-muted text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            <span className="hidden xs:inline">Next</span>
                                                            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}