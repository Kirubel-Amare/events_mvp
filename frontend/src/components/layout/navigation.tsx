import { Home, Calendar, PlusCircle, User, Settings, LayoutDashboard, Search, Users, Shield, AlertCircle, BarChart3 } from "lucide-react"

export const NAV_LINKS = {
    main: [
        // { name: "Home", href: "/", icon: Home },
        // { name: "Browse", href: "/browse/events", icon: Search },
    ],
    user: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Plans", href: "/plans", icon: Calendar },
        // { name: "Create Plan", href: "/plans/create", icon: PlusCircle },
        { name: "Profile", href: "/profile", icon: User },
    ],
    organizer: [
        { name: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
        { name: "Events", href: "/organizer/events", icon: Calendar },
        { name: "Create Event", href: "/organizer/events/create", icon: PlusCircle },
        { name: "Settings", href: "/organizer/settings", icon: Settings },
    ],
    admin: [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "Organizer Applications", href: "/admin/organizers", icon: Shield },
        { name: "Event Management", href: "/admin/events", icon: Calendar },
        { name: "Reported Content", href: "/admin/reports", icon: AlertCircle },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
}
