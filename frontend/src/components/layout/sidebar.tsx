"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "./navigation"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, Calendar, MapPin, User, Sparkles, Bell, Heart, LogOut, LayoutDashboard, ChevronRight, LogIn } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    role?: "user" | "organizer"
}

export function Sidebar({ className, role = "user", ...props }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout, isAuthenticated } = useAuthStore()
    const links = role === "organizer" ? NAV_LINKS.organizer : NAV_LINKS.user

    const handleLogout = () => {
        logout()
        router.push("/login")
        toast.success("Logged out successfully")
    }

    return (
        <div className={cn("pb-12 w-64 border-r border-border bg-background min-h-screen hidden md:block flex flex-col", className)} {...props}>
            <div className="flex-1 space-y-6 py-6 overflow-y-auto">
                {/* User Profile Section - Only show when authenticated */}
                {isAuthenticated ? (
                    <div className="px-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-semibold truncate">{user?.name || "User"}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                    {user?.role === "organizer" ? "Organizer" : "Member"}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Sign in prompt when not authenticated
                    <div className="px-6">
                        <div className="rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 mb-6">
                            <h3 className="font-semibold text-sm mb-2">Join EventHub</h3>
                            <p className="text-xs text-muted-foreground mb-3">
                                Sign in to access your events and create plans
                            </p>
                            <Button size="sm" className="w-full gap-2" asChild>
                                <Link href="/auth/signin">
                                    <LogIn className="h-3 w-3" />
                                    Sign In
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Main Navigation - Only show when authenticated */}
                {isAuthenticated && (
                    <div className="space-y-4">
                        <div className="px-6">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
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
                                                "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group",
                                                isActive
                                                    ? "bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border-l-4 border-primary"
                                                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <link.icon className={cn(
                                                    "mr-3 h-4 w-4 transition-colors",
                                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                )} />
                                                <span className="text-sm font-medium">{link.name}</span>
                                            </div>
                                            {isActive && (
                                                <ChevronRight className="h-3 w-3 text-primary" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Quick Links Section */}
                        <div className="px-6">
                            <div className="space-y-2">
                                {role === "user" && isAuthenticated && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start border-border hover:bg-muted hover:border-primary/50 text-foreground group"
                                        asChild
                                    >
                                        <Link href="/dashboard/become-organizer">
                                            <Sparkles className="mr-2 h-3 w-3 text-primary group-hover:animate-pulse" />
                                            Become Organizer
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Section - Authentication Button */}
            <div className="px-6 py-4 border-t border-border mt-auto">
                {isAuthenticated ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors group"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-4 w-4 group-hover:animate-pulse" />
                        Logout
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        size="sm"
                        className="w-full justify-start bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all"
                        asChild
                    >
                        <Link href="/auth/signin">
                            <LogIn className="mr-3 h-4 w-4" />
                            Sign In / Sign Up
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    )
}