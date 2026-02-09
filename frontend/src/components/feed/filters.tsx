"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CATEGORIES } from "@/lib/data"

interface FiltersProps {
    activeCategory: string
    setActiveCategory: (category: string) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    showPlans: boolean
    setShowPlans: (show: boolean) => void
}

export function Filters({
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    showPlans,
    setShowPlans,
}: FiltersProps) {
    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search events, locations..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={!showPlans ? "default" : "outline"}
                        onClick={() => setShowPlans(false)}
                        className="rounded-full"
                    >
                        Events
                    </Button>
                    <Button
                        variant={showPlans ? "default" : "outline"}
                        onClick={() => setShowPlans(true)}
                        className="rounded-full"
                    >
                        Plans
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((category) => (
                    <Badge
                        key={category}
                        variant={activeCategory === category ? "default" : "outline"}
                        className="cursor-pointer px-4 py-1.5 text-sm hover:bg-secondary whitespace-nowrap"
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </Badge>
                ))}
                {/* Mock City filter for MVP - could be a distinct dropdown */}
            </div>
        </div>
    )
}
