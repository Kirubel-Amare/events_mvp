import { Home, Calendar, PlusCircle, User, Settings, LayoutDashboard, Search, Users, Shield, AlertCircle, BarChart3, Bell, Sparkles, Ticket, ShieldAlert } from "lucide-react"

export const NAV_LINKS = {
    main: [
        // { name: "Home", href: "/", icon: Home },
        // { name: "Browse", href: "/browse/events", icon: Search },
    ],
    user: [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "My Plans", href: "/plans", icon: Calendar },
        { name: "Become Organizer", href: "/dashboard/become-organizer", icon: Sparkles },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Request Quota", href: "/dashboard/quota-request", icon: PlusCircle },
    ],
    organizer: [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Events", href: "/organizer/events", icon: Calendar },
        { name: "My Plans", href: "/plans", icon: Calendar },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Request Quota", href: "/dashboard/quota-request", icon: PlusCircle },
        { name: "Settings", href: "/organizer/settings", icon: Settings },
    ],
    admin: [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "Organizer Applications", href: "/admin/organizers", icon: Shield },
        { name: "Event Management", href: "/admin/events", icon: Calendar },
        { name: "Reported Content", href: "/admin/reports", icon: AlertCircle },
        { name: "Quota Requests", href: "/admin/quotas", icon: ShieldAlert },
        {name: }
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "My Plans", href: "/plans", icon: Calendar },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
}
