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
import { MapPin, Heart } from "lucide-react"
import { Event } from "@/types"

interface AllEventsGridProps {
  events: Event[]
  likedEvents: string[]
  onToggleLike: (id: string) => void
}

export function AllEventsGrid({ events, likedEvents, onToggleLike }: AllEventsGridProps) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">All Events</h2>
            <p className="text-gray-600">Discover what's happening around you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {events.map((event) => (
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
                  onClick={() => onToggleLike(event.id)}
                >
                  <Heart
                    className={`h-3 w-3 ${
                      likedEvents.includes(event.id)
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
  )
}