"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
    BarChart3,
    Users,
    Calendar,
    AlertCircle,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    LayoutDashboard,
    Menu,
    X,
    Shield,
    Bell
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import toast from "react-hot-toast"

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, isAuthenticated, logout } = useAuthStore()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        if (user?.role !== "admin") {
            toast.error("Access denied. Admin privileges required.")
            router.push("/")
        }
    }, [isAuthenticated, user, router])

    if (!isAuthenticated || user?.role !== "admin") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const navItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "Organizer Applications", href: "/admin/organizers", icon: Shield },
        { name: "Event Management", href: "/admin/events", icon: Calendar },
        { name: "Reported Content", href: "/admin/reports", icon: AlertCircle },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    const handleLogout = async () => {
        try {
            await logout()
            router.push("/login")
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Logout failed")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex flex-col bg-white border-r transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"
                    }`}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">Admin<span className="text-blue-600">Hub</span></span>
                        </Link>
                    ) : (
                        <Shield className="h-8 w-8 text-blue-600" />
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-4">
                    <nav className="space-y-2 py-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === item.href
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t mt-auto">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={user.personalProfile?.profilePhoto || ""} />
                                <AvatarFallback>{user.name?.charAt(0) || "A"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${!isSidebarOpen && "px-0 justify-center"}`}
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                        {isSidebarOpen && <span className="ml-3">Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transition-transform md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6 flex items-center justify-between border-b">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-blue-600" />
                        <span className="font-bold text-xl tracking-tight">AdminHub</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === item.href
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                    <Separator className="my-4" />
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                    </Button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 px-4 hidden md:block">
                        <h1 className="text-lg font-semibold text-gray-800">
                            {navItems.find(item => item.href === pathname)?.name || "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-gray-600">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </Button>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                            <Avatar className="h-8 w-8 border">
                                <AvatarImage src={user.personalProfile?.profilePhoto || ""} />
                                <AvatarFallback>{user.name?.charAt(0) || "A"}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
