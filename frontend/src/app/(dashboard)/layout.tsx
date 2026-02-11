"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useUIStore } from "@/store/ui-store"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isSidebarOpen } = useUIStore()

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-hidden">
            <Sidebar role="user" />
            <main
                className={`flex-1 min-w-0 p-6 md:p-8 pb-24 h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"
                    }`}
            >
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
