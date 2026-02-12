import Link from "next/link"
import { SafeImage } from "@/components/shared/safe-image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Calendar, MapPin, Users as UsersIcon, Heart, ChevronRight } from "lucide-react"
import { Event } from "@/types"

interface FeaturedEventsProps {
  events: Event[]
  likedEvents: string[]
  onToggleLike: (id: string) => void
}

export function FeaturedEvents({ events, likedEvents, onToggleLike }: FeaturedEventsProps) {
  return (
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
        {events.map((event) => (
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
                  onClick={() => onToggleLike(event.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      likedEvents.includes(event.id)
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
                    <div className="text-sm" suppressHydrationWarning>
                      {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
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
                  {event.organizer?.organizationName && (
                    <div className="font-medium">by {event.organizer.organizationName}</div>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}