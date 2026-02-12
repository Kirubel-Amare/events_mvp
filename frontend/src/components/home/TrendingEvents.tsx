import Link from "next/link"
import { SafeImage } from "@/components/shared/safe-image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ChevronRight } from "lucide-react"
import { Event } from "@/types"

interface TrendingEventsProps {
  events: Event[]
}

export function TrendingEvents({ events }: TrendingEventsProps) {
  return (
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
        {events.map((event) => (
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
  )
}