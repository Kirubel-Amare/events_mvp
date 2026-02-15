"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useUIStore } from "@/store/ui-store"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isSidebarOpen } = useUIStore()
    const { user } = useAuthStore()

    // Determine the role based on the logged in user, default to "user"
    const sidebarRole = user?.role || "user"

    return (
        <div className="flex min-h-screen bg-gray-50 md:overflow-hidden font-sans">
            <Sidebar role={sidebarRole as any} />
            <main
                className={cn(
                    "flex-1 min-w-0 transition-all duration-300",
                    isSidebarOpen ? "md:ml-64" : "md:ml-20"
                )}
            >
                <div className="h-full md:h-screen md:overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 pb-24">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
