"use client"

import { usePathname } from "next/navigation"
import Footer from "./footer"

export default function ConditionalFooter() {
    const pathname = usePathname()

    // Define paths where the footer should NOT be shown
    const excludedPaths = ["/admin", "/user", "/organizer", "/dashboard", "/profile", "/settings", "/plans","/notification"]

    // Check if the current path starts with any of the excluded paths
    const isExcluded = excludedPaths.some(path => pathname.startsWith(path))

    if (isExcluded) {
        return null
    }

    return <Footer />
}
