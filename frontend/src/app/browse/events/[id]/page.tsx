import Link from "next/link"
import { Calendar, MapPin, Share2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_EVENTS } from "@/lib/data"

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0]

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Image */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 left-4 rounded-full bg-background/50 backdrop-blur-md border-0 hover:bg-background/80"
                    asChild
                >
                    <Link href="/browse/events">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
            </div>

            <div className="container relative -mt-20 z-10 container-padding pb-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <Badge className="mb-2">{event.category}</Badge>
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">{event.title}</h1>
                            <p className="text-lg text-muted-foreground flex items-center gap-2">
                                by <span className="text-foreground font-medium">{event.organizer}</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 py-4 border-y">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-full">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Date & Time</p>
                                    <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-full">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-sm text-muted-foreground">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">About Event</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {event.description}
                                <br /><br />
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar / Action Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Ticket Price</p>
                                <p className="text-3xl font-bold">Free</p>
                            </div>

                            <Button className="w-full" size="lg">
                                Get Tickets
                            </Button>

                            <Button variant="outline" className="w-full">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Event
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                You will be redirected to an external site to complete your purchase.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
