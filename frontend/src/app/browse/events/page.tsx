import { FeedContainer } from "@/components/feed/feed-container"

export default function BrowseEventsPage() {
    return (
        <div className="container py-8 container-padding">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Browse Events</h1>
                <p className="text-muted-foreground">
                    Find events and plans happing around you.
                </p>
            </div>
            <FeedContainer />
        </div>
    )
}
