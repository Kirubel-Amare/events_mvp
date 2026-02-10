"use client"

import { useState } from "react"
import { Filters } from "./filters"
import { EventCard } from "./event-card"
import { PlanCard } from "./plan-card"
import { MOCK_EVENTS, MOCK_PLANS } from "@/lib/data"
import { EmptyState } from "@/components/shared/empty-state"
import { Calendar, Search } from "lucide-react"

import { Event, Plan } from "@/types"

interface FeedContainerProps {
    events?: Event[]
    plans?: Plan[]
    initialCategory?: string
}

export function FeedContainer({ events: propEvents, plans: propPlans, initialCategory = "All" }: FeedContainerProps) {
    const [activeCategory, setActiveCategory] = useState(initialCategory)
    const [searchQuery, setSearchQuery] = useState("")
    const [showPlans, setShowPlans] = useState(false) // Toggle between Events and Plans

    // Use prop events or fallback to MOCK_EVENTS
    const displayEvents = propEvents || MOCK_EVENTS

    // Mock filtering logic
    const filteredEvents = displayEvents.filter((event) => {
        const matchesCategory = activeCategory === "All" ||
            (typeof event.category === 'string' ? event.category === activeCategory : event.category?.name === activeCategory)

        const eventLocation = (event as any).location || (event as any).city || ""
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            eventLocation.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Use prop plans or fallback to MOCK_PLANS
    const displayPlans = propPlans || MOCK_PLANS

    // Plans logic (in real app, fetched only if logged in)
    const filteredPlans = displayPlans.filter((plan) => {
        const planLocation = (plan as any).location || ""
        return plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            planLocation.toLowerCase().includes(searchQuery.toLowerCase())
    })

    return (
        <div>
            <Filters
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showPlans={showPlans}
                setShowPlans={setShowPlans}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {!showPlans && filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}

                {showPlans && filteredPlans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                ))}
            </div>

            {!showPlans && filteredEvents.length === 0 && (
                <EmptyState
                    icon={Search}
                    title="No events found"
                    description="Try adjusting your filters or search query."
                    className="mt-12"
                />
            )}

            {showPlans && filteredPlans.length === 0 && (
                <EmptyState
                    icon={Calendar}
                    title="No plans found"
                    description="Be the first to create a plan!"
                    className="mt-12"
                />
            )}
        </div>
    )
}
