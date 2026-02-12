"use client"

import Link from "next/link"
import { Calendar, Mail, Facebook, Twitter, Instagram } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { useAuthStore } from "@/store/auth-store"

export default function Footer() {
  const [activeNav, setActiveNav] = useState("home")
  const { user } = useAuthStore()

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" onClick={() => setActiveNav("home")}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EventHub
                </span>

              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover events and create social plans. Connect through shared interests.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-muted-foreground hover:text-primary transition-colors">
                  Create Plans
                </Link>
              </li>
              {!user?.isOrganizer && (
                <li>
                  <Link href="/organizer" className="text-muted-foreground hover:text-primary transition-colors">
                    Become Organizer
                  </Link>
                </li>
              )}
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get notified about featured events.
            </p>
            <form className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-l-lg border border-input bg-background px-3 py-2 text-sm"
                />
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  asChild
                >
                  <Link href="/subscribe">
                    <Mail className="mr-2 h-4 w-4" />

                  </Link>
                </Button>
              </div>
            </form>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
          <p className="mt-1">Connecting people through events and social plans.</p>
        </div>
      </div>
    </footer>
  )
}