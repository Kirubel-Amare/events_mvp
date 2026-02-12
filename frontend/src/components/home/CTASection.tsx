"use client"

import { MouseEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Crown } from "lucide-react"

export function CTASection() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  const handleStartOrganizing = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (isAuthenticated) {
      router.push("/organizer/dashboard")
    } else {
      router.push("/login?redirect=/become-organizer")
    }
  }

  return (
    <section className="container py-16 md:py-20">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-200">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />

        <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Start Your <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Journey</span> Today
            </h2>

            <p className="text-lg text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto">
              Join thousands of like-minded individuals discovering amazing events
              and creating meaningful connections every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-10">
              <Button
                size="lg"
                className="px-8 md:px-10 h-12 md:h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 group shadow-lg"
                asChild
              >
                <Link href="/register" className="flex items-center justify-center">
                  <span className="mr-3">Get Started Free</span>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>

              <Button
                size="lg"
                className="px-8 md:px-10 h-12 md:h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 group shadow-lg"
                onClick={handleStartOrganizing}
              >
                <span className="mr-3">Start Organizing</span>
                <Crown className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>

            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm mb-3 md:mb-4">Trusted by over 10,000+ members</p>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-gray-500 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>Free to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}