import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface EventCardProps {
    event: {
        id: string
        title: string
        description: string
        date: string
        time: string
        location: string
        image: string
        images?: string[]
        category: string
        organizer: string
    }
}

export function EventCard({ event }: EventCardProps) {
    const displayImage = event.image || (event.images && event.images[0]) || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop"

    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-200 border-none shadow-md">
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={displayImage}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-500"
                />
                <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-md hover:bg-background/90">
                    {event.category}
                </Badge>
            </div>
            <CardHeader className="p-4 pb-2 space-y-1">
                <div className="text-sm text-muted-foreground font-medium text-primary">
                    {event.organizer}
                </div>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
                <CardDescription className="line-clamp-2 mb-4">
                    {event.description}
                </CardDescription>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full bg-slate-900 text-white hover:bg-slate-800">
                    <Link href={`/browse/events/${event.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
