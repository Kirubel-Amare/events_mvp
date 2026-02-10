"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "./navigation"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, Calendar, MapPin, User, Sparkles, Bell, Heart, LogOut, LayoutDashboard, ChevronRight } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    role?: "user" | "organizer"
}

export function Sidebar({ className, role = "user", ...props }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuthStore()
    const links = role === "organizer" ? NAV_LINKS.organizer : NAV_LINKS.user

    const handleLogout = () => {
        logout()
        router.push("/login")
        toast.success("Logged out successfully")
    }

    return (
        <div className={cn("pb-12 w-64 border-r border-gray-200 bg-white min-h-screen hidden md:block flex flex-col", className)} {...props}>
            <div className="flex-1 space-y-6 py-6 overflow-y-auto">
                {/* User Profile Section */}
                <div className="px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                {user?.name?.[0] || user?.email?.[0] || "U"}
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-semibold text-gray-900 truncate">{user?.name || "User"}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.role || "Member"}</div>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mb-6"
                        asChild
                    >
                        <Link href="/plans/create">
                            <Sparkles className="mr-2 h-3 w-3" />
                            Create New Plan
                        </Link>
                    </Button>
                </div>

                {/* Main Navigation */}
                <div className="space-y-4">
                    <div className="px-6">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            {role === "organizer" ? "Organizer Tools" : "My Dashboard"}
                        </h2>
                        <div className="space-y-1">
                            {links.map((link) => {
                                const isActive = pathname === link.href ||
                                    (link.href !== "/" && pathname?.startsWith(link.href))
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
                                            isActive
                                                ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-500"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <link.icon className={cn(
                                                "mr-3 h-4 w-4",
                                                isActive ? "text-blue-600" : "text-gray-500"
                                            )} />
                                            <span className="text-sm font-medium">{link.name}</span>
                                        </div>
                                        {isActive && (
                                            <ChevronRight className="h-3 w-3 text-blue-600" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Discover Section */}
                    <div className="px-6">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Discover
                        </h2>
                        <div className="space-y-1">
                            {NAV_LINKS.main.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "flex items-center px-3 py-2 rounded-lg transition-all duration-200",
                                            isActive
                                                ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <link.icon className={cn(
                                            "mr-3 h-4 w-4",
                                            isActive ? "text-blue-600" : "text-gray-500"
                                        )} />
                                        <span className="text-sm font-medium">{link.name}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="px-6">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Quick Links
                        </h2>
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-700"
                                asChild
                            >
                                <Link href="/help">
                                    Help Center
                                </Link>
                            </Button>

                            {role === "user" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-700"
                                    asChild
                                >
                                    <Link href="/organizer/apply">
                                        <Sparkles className="mr-2 h-3 w-3" />
                                        Become Organizer
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>




                </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 mt-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}