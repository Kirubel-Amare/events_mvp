"use client"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { eventsApi } from "@/lib/api/events"
import { plansApi } from "@/lib/api/plans"
import { Event, Plan } from "@/types"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"

// Home components
import { HeroSection } from "@/components/home/HeroSection"
import { TrendingEvents } from "@/components/home/TrendingEvents"
import { HowItWorks } from "@/components/home/HowItWorks"
import { CategoriesSection } from "@/components/home/CategoriesSection"
import { FeaturedEvents } from "@/components/home/FeaturedEvents"
import { AllEventsGrid } from "@/components/home/AllEventsGrid"
import { WhyChooseUs } from "@/components/home/WhyChooseUs"
import { AboutSection } from "@/components/home/AboutSection"
import { ContactSection } from "@/components/home/ContactSection"
import { CTASection } from "@/components/home/CTASection"
import { NewsletterSection } from "@/components/home/NewsletterSection"

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const [categories, setCategories] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likedEvents, setLikedEvents] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const [featured, all, categoriesData] = await Promise.all([
          eventsApi.getFeaturedEvents(),
          eventsApi.getEvents({ limit: 8, sort: 'createdAt', order: 'DESC' }),
          eventsApi.getCategories()
        ])

        setFeaturedEvents(featured || [])
        setAllEvents(all?.events || [])
        setCategories(categoriesData || [])

        if (isAuthenticated) {
          const userPlansData = await plansApi.getPlans()
          setPlans(userPlansData.plans || [])
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to load some content")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  const toggleLike = (id: string) => {
    setLikedEvents(prev =>
      prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id]
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection />
      
      {featuredEvents.length > 0 && (
        <TrendingEvents events={featuredEvents.slice(0, 3)} />
      )}
      
      <HowItWorks />
      
      <CategoriesSection 
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      
      {featuredEvents.length > 0 && (
        <FeaturedEvents 
          events={featuredEvents} 
          likedEvents={likedEvents}
          onToggleLike={toggleLike}
        />
      )}
      
      <AllEventsGrid 
        events={allEvents}
        likedEvents={likedEvents}
        onToggleLike={toggleLike}
      />
      
      <WhyChooseUs />
      <AboutSection />
      <ContactSection />
      <CTASection />
      <NewsletterSection />
    </div>
  )
}