"use client"

import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  query: string
  location: string
  onQueryChange: (v: string) => void
  onLocationChange: (v: string) => void
  onSearch: () => void
}

export function SearchBar({
  query,
  location,
  onQueryChange,
  onLocationChange,
  onSearch,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl p-2 shadow-sm">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search events"
            className="pl-12 h-12"
          />
        </div>

        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="City or location"
            className="pl-12 h-12"
          />
        </div>

        <Button onClick={onSearch} className="h-12 px-6">
          Find Events
        </Button>
      </div>
    </div>
  )
}
