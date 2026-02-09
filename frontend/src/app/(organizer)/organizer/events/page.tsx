import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/feed/event-card"
import { MOCK_EVENTS } from "@/lib/data"

export default function OrganizerEventsPage() {
    // Filter for 'my' events
    const myEvents = MOCK_EVENTS.slice(0, 2)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                    <p className="text-muted-foreground">
                        Manage your published events.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/organizer/events/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Event
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    )
}
