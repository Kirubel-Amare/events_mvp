"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
  Users as UsersIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

// Categories with static images/icons
const categories = [
  { name: "Music", icon: "🎵", count: 156, color: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { name: "Business", icon: "💼", count: 89, color: "bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-700", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { name: "Wellness", icon: "🧘", count: 124, color: "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { name: "Art & Culture", icon: "🎨", count: 67, color: "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-700", image: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { name: "Food & Drink", icon: "🍴", count: 92, color: "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { name: "Technology", icon: "💻", count: 78, color: "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-700", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { name: "Entertainment", icon: "🎭", count: 112, color: "bg-gradient-to-br from-pink-100 to-pink-50 text-pink-700", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { name: "Education", icon: "📚", count: 95, color: "bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-700", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
]

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const [activeCategory, setActiveCategory] = useState("all")
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likedEvents, setLikedEvents] = useState<string[]>([]) // Changed to string UUIDs

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Always fetch events
        const [featured, all] = await Promise.all([
          eventsApi.getFeaturedEvents(),
          eventsApi.getEvents({ limit: 8 })
        ])

        setFeaturedEvents(featured)
        setAllEvents(all.events)

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
          <Image
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            alt="People at an event"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-white/30 to-purple-600/10" />
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

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Find amazing events, organize social gatherings, and connect with people who share your passions.
              Join over <span className="font-semibold text-gray-900">10,000+</span> community members.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="px-8 h-12 text-base group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                <Link href="/events">
                  Explore Events
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 h-12 text-base border-gray-300 hover:bg-gray-100" asChild>
                <Link href="/plans/create">
                  Create Your Plan
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
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="City or location"
                      className="pl-12 h-12 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
                <Button size="lg" className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
                  <Image
                    src={event.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
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
              key={category.name}
              onClick={() => setActiveCategory(category.name.toLowerCase())}
              className={`group relative overflow-hidden rounded-xl transition-all ${activeCategory === category.name.toLowerCase()
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:shadow-md'
                }`}
            >
              <div className="relative h-32">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover opacity-30"
                />
                <div className={`absolute inset-0 ${category.color} opacity-80`} />
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                  <span className="text-2xl mb-2">{category.icon}</span>
                  <div className="font-semibold text-sm text-center mb-1">{category.name}</div>
                  <div className="text-xs">{category.count} events</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Events with Images */}
      {featuredEvents.length > 0 && (
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
                  <Image
                    src={event.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
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
                          <div className="font-medium text-gray-900">
                            {new Date(event.date).toLocaleDateString()}
                          </div>
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
      )}

      {/* Plans Section (Only for authenticated users) */}
      {isAuthenticated && plans.length > 0 && (
        <section className="container py-16 bg-blue-50/50">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">My Community Plans</h2>
              <p className="text-gray-600">Casual gatherings and meetups</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/plans/create">
                Create Plan
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">Plan</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2">{plan.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{plan.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(plan.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{plan.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {plan.externalLink && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={plan.externalLink} target="_blank" rel="noopener noreferrer">
                        Join Plan
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

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
                  <Image
                    src={event.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
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
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
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
              <Image
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
              <Image
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
              <Image
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

      {/* CTA Section - Modern Gradient with Floating Elements */}
      <section className="container py-16 md:py-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-200">
          {/* Subtle floating elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-100/40 rounded-full blur-2xl animate-pulse" />

          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

          <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center">
            <div className="max-w-2xl mx-auto">
              {/* Animated icon */}
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
                  <Link href="/signup" className="flex items-center justify-center">
                    <span className="mr-3">Get Started Free</span>
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 md:px-10 h-12 md:h-14 text-base font-medium text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
                  asChild
                >
                  <Link href="/organizer" className="flex items-center justify-center">
                    <span className="mr-3">Start Organizing</span>
                    <UsersIcon className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
                  </Link>
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
    </div>
  )
}