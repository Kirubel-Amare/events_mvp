import Link from "next/link"
import { SafeImage } from "@/components/shared/safe-image"
import { Calendar, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Event } from "@/types"

interface EventCardProps {
    event: Event | any // Support for both real Event and mock structure
}

export function EventCard({ event }: EventCardProps) {
    const displayImage = event.mainImage || (event as any).image || (event.images && event.images[0]) || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop"
    const location = (event as any).location || event.city || "Online"
    const organizerName = typeof event.organizer === 'string' ? event.organizer : event.organizer?.organizationName || "Unknown Organizer"
    const categoryName = typeof event.category === 'string' ? event.category : event.category?.name || "Event"
    const timeDisplay = event.time || (event.date ? "TBA" : "")

    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-200 border-none shadow-md">
            <div className="relative aspect-video w-full overflow-hidden">
                <SafeImage
                    src={displayImage}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-500"
                />
                <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-md hover:bg-background/90">
                    {categoryName}
                </Badge>
            </div>
            <CardHeader className="p-4 pb-2 space-y-1">
                <div className="text-sm font-medium text-blue-600">
                    {organizerName}
                </div>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
                <CardDescription className="line-clamp-2 mb-4">
                    {event.description}
                </CardDescription>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>{event.date} • {timeDisplay}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>{location}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    <Link href={`/browse/events/${event.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
