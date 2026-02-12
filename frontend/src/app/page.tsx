"use client"

import { useEffect, useState, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { SafeImage } from "@/components/shared/safe-image"
import Link from "next/link"
import { useAuthStore } from "@/store/auth-store"
import { eventsApi } from "@/lib/api/events"
import { plansApi } from "@/lib/api/plans"
import { Event, Plan } from "@/types"
import { toast } from "react-hot-toast"
import {
  Loader2,
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  Clock,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Globe,
  MessageSquare,
  ArrowRight,
  Search,
  Users as UsersIcon,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

// Categories with static images/icons

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likedEvents, setLikedEvents] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLocation, setSearchLocation] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Always fetch events and categories
        const [featured, all, categoriesData] = await Promise.all([
          eventsApi.getFeaturedEvents(),
          eventsApi.getEvents({ limit: 8, sort: 'createdAt', order: 'DESC' }),
          eventsApi.getCategories()
        ])

        setFeaturedEvents(featured || [])
        setAllEvents(all?.events || [])
        setCategories(categoriesData || [])

        // Fetch plans only if authenticated
        if (isAuthenticated) {
          const userPlans = await plansApi.getPlans()
          setPlans(userPlans)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to load some content")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  const toggleLike = (id: string) => {
    setLikedEvents(prev =>
      prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id]
    )
  }

  const handleSearch = () => {
    if (searchQuery.trim() || searchLocation.trim()) {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (searchLocation) params.set('location', searchLocation)
      router.push(`/browse/events?${params.toString()}`)
    }
  }

  const handleStartOrganizing = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (isAuthenticated) {
      if (user?.role === "organizer") {
        router.push("/organizer/dashboard")
      } else {
        router.push("/organizer/dashboard")
      }
    } else {
      router.push("/login?redirect=/become-organizer")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image with overlay */}
        <div className="absolute inset-0">
          <SafeImage
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1920&auto=format&fit=crop&q=90"
            alt="People at an event"
            fill
            sizes="100vw"
            className="object-cover opacity-100"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/20 to-black/70" />
        </div>


        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 bg-white/80 backdrop-blur-sm border-blue-200">
              <Sparkles className="h-3.5 w-3.5 mr-2 text-blue-500" />
              Join 10,000+ Community Members
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Discover <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Events</span> &
              <span className="block">Create <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600">Connections</span></span>
            </h1>

            <p className="text-lg md:text-xl text-white  mb-10 max-w-2xl mx-auto leading-relaxed">
              Find amazing events, organize social gatherings, and connect with people who share your passions.
              Join over <span className="font-semibold text-gray-900">10,000+</span> community members.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="px-8 md:px-10 h-12 md:h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 group shadow-lg"
                asChild
              >
                <Link href="/browse/events" className="flex items-center justify-center">
                  <span className="mr-3">Get Started Free</span>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="What type of event are you looking for?"
                      className="pl-12 h-12 bg-gray-50 border-gray-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="City or location"
                      className="pl-12 h-12 bg-gray-50 border-gray-200"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <Button
                  size="lg"
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Trending Now with Images */}
      {featuredEvents.length > 0 && (
        <section className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-gray-900">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Trending Now
              </h2>
              <p className="text-gray-600">Premium events happening soon</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative h-40 overflow-hidden">
                  <SafeImage
                    src={event.mainImage || event.images?.[0] || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=60"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-white/90 text-amber-700 border-amber-200">
                      Trending
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.category?.name || "Event"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full h-8 text-blue-600 hover:text-blue-700" asChild>
                    <Link href={`/browse/events/${event.id}`}>
                      View Event
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-blue-50 text-blue-600 border-blue-100">
              Simple & Easy
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">How It Works</h2>
            <p className="text-lg text-gray-600">
              Join our platform in three simple steps and start creating meaningful connections today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 -z-10" />

            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="h-10 w-10 text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mb-2">1</div>
              <h3 className="text-xl font-bold text-gray-900">Create Account</h3>
              <p className="text-gray-600 text-sm">Sign up in seconds and personalize your profile to match your interests.</p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Search className="h-10 w-10 text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold mb-2">2</div>
              <h3 className="text-xl font-bold text-gray-900">Find or Create</h3>
              <p className="text-gray-600 text-sm">Browse amazing events or use our tools to organize your own gatherings.</p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold mb-2">3</div>
              <h3 className="text-xl font-bold text-gray-900">Connect & Enjoy</h3>
              <p className="text-gray-600 text-sm">Attend events, meet new people, and build lasting memories together.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Categories with Images */}
      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Browse by Category</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Find events that match your interests from our diverse collection
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => category?.name && setActiveCategory(category.name.toLowerCase())}
              className={`group relative overflow-hidden rounded-xl transition-all ${activeCategory === category?.name?.toLowerCase()
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:shadow-md'
                }`}
            >
              <div className="relative h-32">
                <SafeImage
                  src={`https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&category=${category.name}`}
                  alt={category.name}
                  fill
                  className="object-cover opacity-30"
                />
                <div className={`absolute inset-0 bg-blue-100 opacity-80`} />
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                  <span className="text-2xl mb-2">{category.icon || "✨"}</span>
                  <div className="font-semibold text-sm text-center mb-1">{category.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Events with Images */}
      {
        featuredEvents.length > 0 && (
          <section className="container py-16">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900">Featured Events</h2>
                <p className="text-gray-600">Premium experiences curated for you</p>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" asChild>
                <Link href="/events/featured">
                  View All
                  <ChevronRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <SafeImage
                      src={event.mainImage || event.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/90 hover:bg-white rounded-full"
                        onClick={() => toggleLike(event.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${likedEvents.includes(event.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                            }`}
                        />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="outline" className="bg-white/90 text-gray-700">
                        {event.category?.name || "Event"}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div className="text-sm">
                            {event.date ? (
                              <span suppressHydrationWarning>
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                            ) : 'Date TBD'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div className="font-medium text-sm text-gray-900 truncate max-w-[150px]">{event.city}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{event.price || "Free"}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/browse/events/${event.id}`}>
                            Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-gray-50 pt-4">
                    <div className="flex items-center justify-between w-full text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <UsersIcon className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                          {event.organizer?.organizationName && (
                            <div className="font-medium">by {event.organizer.organizationName}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )
      }

      {/* All Events Grid with Images */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">All Events</h2>
              <p className="text-gray-600">Discover what's happening around you</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allEvents.map((event) => (
              <Card key={event.id} className="group overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className="relative h-40 overflow-hidden">
                  <SafeImage
                    src={event.mainImage || event.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 bg-white/90 hover:bg-white rounded-full"
                    onClick={() => toggleLike(event.id)}
                  >
                    <Heart
                      className={`h-3 w-3 ${likedEvents.includes(event.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                        }`}
                    />
                  </Button>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="bg-white/90 text-gray-700">
                      {event.category?.name || "Event"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-3">
                  <CardDescription className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {event.description}
                  </CardDescription>

                  <div className="space-y-2 text-xs mb-3">
                    <span className="font-medium text-gray-900" suppressHydrationWarning>
                      {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                    </span>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600 truncate">{event.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <div className="font-bold text-gray-900">{event.price || "Free"}</div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button className="w-full text-sm" variant="outline" size="sm" asChild>
                    <Link href={`/browse/events/${event.id}`}>
                      View Event
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us with Images */}
      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Why Choose Our Platform</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            We make it easy to discover events and connect with your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl group">
            <div className="absolute inset-0 opacity-10">
              <SafeImage
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Community"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Vibrant Community</h3>
              <p className="text-sm text-gray-600">
                Connect with 10,000+ like-minded individuals who share your interests
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl group">
            <div className="absolute inset-0 opacity-10">
              <SafeImage
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Diverse Events"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Diverse Events</h3>
              <p className="text-sm text-gray-600">
                Discover 500+ monthly events across all categories and interests
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl group">
            <div className="absolute inset-0 opacity-10">
              <SafeImage
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Easy Planning"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Planning</h3>
              <p className="text-sm text-gray-600">
                Create and manage your own events with our intuitive planning tools
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us & Stats Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <SafeImage
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&auto=format&fit=crop&q=80"
            alt="Event Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 mb-4 px-4 py-1">Our Mission</Badge>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Bringing People Together Through <span className="text-blue-400">Shared Experiences</span>
                </h2>
              </div>
              <p className="text-lg text-gray-400 leading-relaxed">
                Founded with a simple goal: to make the world a smaller, more connected place. We believe that the best moments in life happen when people gather together, share passions, and create new stories.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-blue-500">10k+</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Active Members</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-purple-500">500+</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Monthly Events</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-500">50+</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Active Cities</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-amber-500">4.9/5</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">User Rating</div>
                </div>
              </div>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 transition-colors" asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                <SafeImage
                  src="https://images.unsplash.com/photo-1528605248644-14dd04cb113d?w=800&auto=format&fit=crop&q=80"
                  alt="Connecting People"
                  width={800}
                  height={600}
                  className="w-full"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="py-20 bg-white" id="contact">
        <div className="container">
          <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-16 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                  <p className="text-gray-600">Have questions or need help? Our premium support team is here for you 24/7.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Live Chat</div>
                      <div className="text-sm text-gray-500">Average response: 2 mins</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Email Support</div>
                      <div className="text-sm text-gray-500">support@eventhub.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Headquarters</div>
                      <div className="text-sm text-gray-500">123 Event St, San Francisco, CA</div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-4">Follow us on social media</p>
                  <div className="flex gap-4">
                    {['Twitter', 'Instagram', 'LinkedIn', 'Facebook'].map(social => (
                      <div key={social} className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-gray-400 hover:text-blue-600">
                        <span className="sr-only">{social}</span>
                        <Globe className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 md:p-16 flex flex-col justify-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Send us a direct message</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First Name" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12" />
                      <Input placeholder="Last Name" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12" />
                    </div>
                    <Input placeholder="Email Address" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12" />
                    <Textarea placeholder="How can we help you?" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[120px]" />
                    <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 h-12 font-bold shadow-lg">
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-200">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />

          <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Start Your <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Journey</span> Today
              </h2>

              <p className="text-lg text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto">
                Join thousands of like-minded individuals discovering amazing events
                and creating meaningful connections every day.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-10">
                <Button
                  size="lg"
                  className="px-8 md:px-10 h-12 md:h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 group shadow-lg"
                  asChild
                >
                  <Link href="/register" className="flex items-center justify-center">
                    <span className="mr-3">Get Started Free</span>
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  className="px-8 md:px-10 h-12 md:h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 group shadow-lg"
                  onClick={handleStartOrganizing}
                >
                  <span className="mr-3">Start Organizing</span>
                  <Crown className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-3 md:mb-4">Trusted by over 10,000+ members</p>
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-gray-500 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Free to join</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <SafeImage
                src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80"
                alt="Blue Pattern"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white">Stay Updated</h3>
                <p className="text-blue-100 max-w-sm">Join our newsletter to receive the latest events and community updates directly in your inbox.</p>
              </div>
              <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                <Input placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 h-12" />
                <Button className="bg-white text-blue-900 hover:bg-blue-50 h-12 px-8 font-bold whitespace-nowrap">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div >
  )
}