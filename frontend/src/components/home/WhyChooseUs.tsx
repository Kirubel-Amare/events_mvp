import { SafeImage } from "@/components/shared/safe-image"
import { Users as UsersIcon, Globe, MessageSquare } from "lucide-react"

export function WhyChooseUs() {
  return (
    <section className="container py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Why Choose Our Platform</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          We make it easy to discover events and connect with your community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl group">
          <div className="absolute inset-0 opacity-10">
            <SafeImage
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Community"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Vibrant Community</h3>
            <p className="text-sm text-gray-600">
              Connect with 10,000+ like-minded individuals who share your interests
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl group">
          <div className="absolute inset-0 opacity-10">
            <SafeImage
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Diverse Events"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Diverse Events</h3>
            <p className="text-sm text-gray-600">
              Discover 500+ monthly events across all categories and interests
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl group">
          <div className="absolute inset-0 opacity-10">
            <SafeImage
              src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Easy Planning"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Planning</h3>
            <p className="text-sm text-gray-600">
              Create and manage your own events with our intuitive planning tools
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}