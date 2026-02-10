import { Home, Calendar, PlusCircle, User, Settings, LayoutDashboard, Search } from "lucide-react"

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
}
