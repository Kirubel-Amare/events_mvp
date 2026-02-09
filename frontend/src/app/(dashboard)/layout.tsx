import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            <Sidebar role="user" />
            <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
    )
}
