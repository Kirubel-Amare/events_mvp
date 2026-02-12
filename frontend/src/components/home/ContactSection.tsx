import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MessageSquare, Globe, MapPin } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-20 bg-white" id="contact">
      <div className="container">
        <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-16 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-gray-600">Have questions or need help? Our premium support team is here for you 24/7.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Live Chat</div>
                    <div className="text-sm text-gray-500">Average response: 2 mins</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email Support</div>
                    <div className="text-sm text-gray-500">support@eventhub.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Headquarters</div>
                    <div className="text-sm text-gray-500">123 Event St, San Francisco, CA</div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-4">Follow us on social media</p>
                <div className="flex gap-4">
                  {['Twitter', 'Instagram', 'LinkedIn', 'Facebook'].map(social => (
                    <div key={social} className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-gray-400 hover:text-blue-600">
                      <span className="sr-only">{social}</span>
                      <Globe className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 md:p-16 flex flex-col justify-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6">Send us a direct message</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="First Name" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12" />
                    <Input placeholder="Last Name" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12" />
                  </div>
                  <Input placeholder="Email Address" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12" />
                  <Textarea placeholder="How can we help you?" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[120px]" />
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 h-12 font-bold shadow-lg">
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}