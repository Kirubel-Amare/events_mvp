"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useUIStore } from "@/store/ui-store"

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isSidebarOpen } = useUIStore()

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-hidden">
            <Sidebar role="organizer" />
            <main
                className={`flex-1 flex flex-col min-w-0 h-screen overflow-y-auto p-6 md:p-8 pb-24 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"
                    }`}
            >
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
