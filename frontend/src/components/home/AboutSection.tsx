import Link from "next/link"
import { SafeImage } from "@/components/shared/safe-image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AboutSection() {
  return (
    <section className="py-20 bg-gray-900 text-white overflow-hidden relative" id="about">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <SafeImage
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&auto=format&fit=crop&q=80"
          alt="Event Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 mb-4 px-4 py-1">Our Mission</Badge>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Bringing People Together Through <span className="text-blue-400">Shared Experiences</span>
              </h2>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed">
              Founded with a simple goal: to make the world a smaller, more connected place. We believe that the best moments in life happen when people gather together, share passions, and create new stories.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-blue-500">10k+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Active Members</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-purple-500">500+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Monthly Events</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-emerald-500">50+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Active Cities</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-amber-500">4.9/5</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">User Rating</div>
              </div>
            </div>
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 transition-colors" asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <SafeImage
                src="https://images.unsplash.com/photo-1528605248644-14dd04cb113d?w=800&auto=format&fit=crop&q=80"
                alt="Connecting People"
                width={800}
                height={600}
                className="w-full"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}