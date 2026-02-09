import { EventForm } from "@/components/forms/event-form"

export default function CreateEventPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
                <p className="text-muted-foreground">
                    Publish a new event to the community.
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <EventForm />
            </div>
        </div>
    )
}
