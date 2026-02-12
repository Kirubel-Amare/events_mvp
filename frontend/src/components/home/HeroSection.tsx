"use client"

import { useState } from "react"
import Link from "next/link"
import { SafeImage } from "@/components/shared/safe-image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, Search, MapPin } from "lucide-react"

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLocation, setSearchLocation] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim() || searchLocation.trim()) {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (searchLocation) params.set('location', searchLocation)
      router.push(`/browse/events?${params.toString()}`)
    }
  }

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <SafeImage
          src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1920&auto=format&fit=crop&q=90"
          alt="People at an event"
          fill
          sizes="100vw"
          className="object-cover opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/20 to-black/70" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 bg-white/80 backdrop-blur-sm border-blue-200">
            <Sparkles className="h-3.5 w-3.5 mr-2 text-blue-500" />
            Join 10,000+ Community Members
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Events</span> &
            <span className="block">Create <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600">Connections</span></span>
          </h1>

          <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto leading-relaxed">
            Find amazing events, organize social gatherings, and connect with people who share your passions.
            Join over <span className="font-semibold text-gray-900">10,000+</span> community members.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="px-8 md:px-10 h-12 md:h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 group shadow-lg"
              asChild
            >
              <Link href="/browse/events" className="flex items-center justify-center">
                <span className="mr-3">Get Started Free</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-2">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="What type of event are you looking for?"
                    className="pl-12 h-12 bg-gray-50 border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="City or location"
                    className="pl-12 h-12 bg-gray-50 border-gray-200"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <Button
                size="lg"
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4" />
                Find Events
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}