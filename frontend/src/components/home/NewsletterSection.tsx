import { SafeImage } from "@/components/shared/safe-image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function NewsletterSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <SafeImage
              src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80"
              alt="Blue Pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Stay Updated</h3>
              <p className="text-blue-100 max-w-sm">Join our newsletter to receive the latest events and community updates directly in your inbox.</p>
            </div>
            <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
              <Input placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 h-12" />
              <Button className="bg-white text-blue-900 hover:bg-blue-50 h-12 px-8 font-bold whitespace-nowrap">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}