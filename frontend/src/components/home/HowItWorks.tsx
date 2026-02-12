import { Badge } from "@/components/ui/badge"
import { Users as UsersIcon, Search, Sparkles } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-blue-50 text-blue-600 border-blue-100">
            Simple & Easy
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">How It Works</h2>
          <p className="text-lg text-gray-600">
            Join our platform in three simple steps and start creating meaningful connections today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 -z-10" />

          <div className="text-center space-y-4 group">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="h-10 w-10 text-white" />
            </div>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mb-2">1</div>
            <h3 className="text-xl font-bold text-gray-900">Create Account</h3>
            <p className="text-gray-600 text-sm">Sign up in seconds and personalize your profile to match your interests.</p>
          </div>

          <div className="text-center space-y-4 group">
            <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Search className="h-10 w-10 text-white" />
            </div>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold mb-2">2</div>
            <h3 className="text-xl font-bold text-gray-900">Find or Create</h3>
            <p className="text-gray-600 text-sm">Browse amazing events or use our tools to organize your own gatherings.</p>
          </div>

          <div className="text-center space-y-4 group">
            <div className="w-20 h-20 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold mb-2">3</div>
            <h3 className="text-xl font-bold text-gray-900">Connect & Enjoy</h3>
            <p className="text-gray-600 text-sm">Attend events, meet new people, and build lasting memories together.</p>
          </div>
        </div>
      </div>
    </section>
  )
}