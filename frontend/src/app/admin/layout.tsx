"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
    Bell,
    ChevronRight,
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/layout/sidebar"
import toast from "react-hot-toast"
import { NAV_LINKS } from "@/components/layout/navigation"

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, isAuthenticated } = useAuthStore()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        if (user?.role !== "admin") {
            toast.error("Access denied. Admin privileges required.")
            router.push("/")
        }
    }, [isAuthenticated, user, router])

    if (!isMounted || !isAuthenticated || user?.role !== "admin") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const currentRouteName = NAV_LINKS.admin.find(item => item.href === pathname)?.name || "Dashboard"

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar role="admin" />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen">
                <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shrink-0">
                    <div className="flex-1 px-4 hidden md:block">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-0.5">
                            <span className="hover:text-blue-600 transition-colors cursor-pointer">Admin</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="text-gray-900 font-semibold">{currentRouteName}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        </Button>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-bold text-gray-900 leading-none mb-1.5">{user.name}</p>
                                <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-full inline-block border border-blue-100">
                                    {user.role}
                                </p>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-white shadow-md ring-1 ring-gray-100">
                                <AvatarImage src={user.personalProfile?.profilePhoto || ""} />
                                <AvatarFallback className="bg-blue-600 text-white font-black text-sm">
                                    {user.name?.charAt(0) || "A"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
