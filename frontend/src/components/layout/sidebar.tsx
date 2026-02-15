"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "./navigation"
import { Button } from "@/components/ui/button"
import {
    ChevronLeft,
    ChevronRight,
    LogOut,
    Shield,
    LogIn,
    LayoutDashboard,
    Sparkles,
    Menu,
    X
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useUIStore } from "@/store/ui-store"


interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    role?: "user" | "organizer" | "admin"
}

export function Sidebar({ className, role = "user", ...props }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout, isAuthenticated } = useAuthStore()
    const { isSidebarOpen, toggleSidebar } = useUIStore()

    // Select links based on role and filter them
    const links = (NAV_LINKS[role as keyof typeof NAV_LINKS] || NAV_LINKS.user).filter(link => {
        if (link.href === "/dashboard/become-organizer" && user?.isOrganizer) {
            return false
        }
        return true
    })

    const handleLogout = async () => {
        try {
            logout()
            router.push("/login")
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Logout failed")
        }
    }

    const Logo = () => (
        <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && (
                <span className="font-bold text-xl tracking-tight">
                    Event<span className="text-blue-600">Hub</span>
                    {role === "admin" && <span className="text-xs ml-1 text-gray-400">Admin</span>}
                </span>
            )}
        </Link>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden md:flex flex-col bg-white border-r transition-all duration-300 h-screen fixed left-0 top-0 z-40",
                    isSidebarOpen ? "w-64" : "w-20",
                    className
                )}
                {...props}
            >
                <div className="p-6 flex items-center justify-between h-16">
                    <Logo />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto text-gray-400 hover:text-gray-600"
                        onClick={toggleSidebar}
                    >
                        {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-4">
                    <nav className="space-y-2 py-6">
                        {links.map((link) => {
                            const isActive = pathname === link.href ||
                                (link.href !== "/" && pathname?.startsWith(link.href + "/"))

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                                        <link.icon className={cn(
                                            "h-full w-full transition-colors",
                                            isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                        )} />
                                    </div>
                                    {isSidebarOpen && <span className="text-sm leading-none">{link.name}</span>}
                                    {!isSidebarOpen && isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t mt-auto">
                    {isAuthenticated ? (
                        <>
                            {isSidebarOpen && (
                                <div className="flex items-center gap-3 mb-4 px-2">
                                    <Avatar className="h-10 w-10 border shadow-sm">
                                        <AvatarImage src={user?.personalProfile?.profilePhoto || user?.profilePicture || ""} />
                                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                                            {user?.name?.[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate capitalize">{role}</p>
                                    </div>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors group",
                                    !isSidebarOpen && "px-0 justify-center"
                                )}
                                onClick={handleLogout}
                            >
                                <LogOut className="h-5 w-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="ml-3 font-medium leading-none">Logout</span>}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            className={cn(
                                "w-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md flex items-center justify-center gap-2",
                                !isSidebarOpen && "px-0"
                            )}
                            asChild
                        >
                            <Link href="/login">
                                <LogIn className="h-5 w-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="font-medium leading-none">Sign In</span>}
                            </Link>
                        </Button>
                    )}
                </div>
            </aside>

        </>
    )
}