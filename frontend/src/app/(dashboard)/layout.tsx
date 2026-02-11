import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-50 overflow-hidden">
            <Sidebar role="user" />
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto p-6 md:p-8 pb-24">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
