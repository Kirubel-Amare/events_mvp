"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, Calendar, MapPin, User, Sparkles, Bell, Heart, LogOut, LayoutDashboard, Building } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth-store"
import { useRouter, usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const [activeNav, setActiveNav] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Define paths where the header should NOT be shown
  const excludedPaths = ["/admin", "/dashboard", "/organizer", "/plans", "/profile", "/notification"]
  const isExcluded = excludedPaths.some(path => pathname?.startsWith(path))

  if (isExcluded) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/browse/events?search=${encodeURIComponent(searchQuery)}`)
      setIsMenuOpen(false) // Close mobile menu if open
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
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



          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Home", href: "/", active: activeNav === "home" },
              { label: "Browse", href: "/browse/events", active: activeNav === "browse" },
              { label: "Events", href: "/events", active: activeNav === "events" },
              { label: "contact", href: "/#contact", active: activeNav === "contact" },
              { label: "About", href: "/#about", active: activeNav === "about" },
            ].map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setActiveNav(item.href.slice(1) || "home")}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${item.active
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
                  }`}
              >
                {item.label}
                {item.active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>


        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg mx-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search events, categories, or locations..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <Button variant="outline" size="icon" className="border-gray-200 hover:bg-gray-100 hover:border-gray-300">
            <MapPin className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                  3
                </Badge>
              </Button>


              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                asChild
              >
                <Link href={user.role === 'admin' ? '/admin' : (user.role === 'organizer' ? '/organizer/dashboard' : '/dashboard')}>
                  Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                asChild
              >
                <Link href="/login">
                  Log In
                </Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                asChild
              >
                <Link href="/register">
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container py-4 space-y-6">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="pl-10 bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-1">
              {[
                { label: "Home", href: "/", icon: "🏠" },
                { label: "Browse", href: "/browse/events", icon: "🔍" },
                { label: "Events", href: "/events", icon: "🎫" },
                // { label: "Trending", href: "/trending", icon: "🔥" },
                { label: "Become an Organizer", href: "/organizer/apply", icon: "🏢" },
                // { label: "Saved", href: "/saved", icon: "❤️" },
                // { label: "Notifications", href: "/notifications", icon: "🔔" },
              ].filter(item => {
                if (item.label === "Become an Organizer" && user?.isOrganizer) {
                  return false
                }
                return true
              }).map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="flex items-center gap-3 py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.name?.[0] || "U"}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-gray-300" asChild>
                    <Link href="/dashboard">
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    asChild
                  >
                    <Link href={user.role === 'admin' ? '/admin' : (user.role === 'organizer' ? '/organizer/dashboard' : '/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-100"
                    asChild
                  >
                    <Link href="/login">
                      Log In
                    </Link>
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    asChild
                  >
                    <Link href="/register">
                      <User className="mr-2 h-4 w-4" />
                      Sign Up Free
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Footer Links */}
            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <Link href="/#about" className="hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link href="/help" className="hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>Help Center</Link>
              <Link href="/privacy" className="hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>Privacy</Link>
              <Link href="/terms" className="hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>Terms</Link>
              <Link href="/cookies" className="hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>Cookies</Link>
              <Link href="/#contact" className="hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}