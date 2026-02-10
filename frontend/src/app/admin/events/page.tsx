"use client"

import { useEffect, useState } from "react"
import {
    Calendar,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Star,
    ExternalLink,
    MapPin,
    Clock,
    Eye,
    MoreVertical,
    Loader2,
    AlertTriangle
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { adminApi } from "@/lib/api/admin"
import { Event } from "@/types"
import toast from "react-hot-toast"

export default function EventManagementPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const fetchEvents = async () => {
        setIsLoading(true)
        try {
            // For now we're primarily focused on pending events for approval
            // In a full implementation we'd have a way to fetch all events with filtering
            const data = await adminApi.getPendingEvents()
            setEvents(data)
        } catch (error) {
            console.error("Failed to fetch events:", error)
            toast.error("Failed to load events")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleStatusUpdate = async (eventId: string, status: 'approved' | 'rejected') => {
        try {
            await adminApi.updateEventStatus(eventId, status)
            toast.success(`Event has been ${status}`)
            setEvents(events.filter(e => e.id !== eventId))
        } catch (error) {
            toast.error(`Failed to update event status`)
        }
    }

    const handleToggleFeature = async (eventId: string, isFeatured: boolean) => {
        try {
            await adminApi.toggleEventFeature(eventId, isFeatured)
            toast.success(isFeatured ? "Event featured" : "Event unfeatured")
            setEvents(events.map(e => e.id === eventId ? { ...e, isFeatured } : e))
        } catch (error) {
            toast.error("Failed to update featured status")
        }
    }

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5">Approved</Badge>
            case "rejected":
                return <Badge className="bg-red-100 text-red-700 border-none px-2 py-0.5">Rejected</Badge>
            default:
                return <Badge className="bg-amber-100 text-amber-700 border-none px-2 py-0.5">Pending Review</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Event Approval Queue</h2>
                    <p className="text-gray-500">Review and moderate upcoming event listings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-600 bg-blue-50">
                        {events.length} Pending Events
                    </Badge>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-0 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search events by title or city..."
                                className="pl-10 bg-gray-50 border-gray-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p className="text-gray-500">Scanning event queue...</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                            <div className="bg-emerald-50 p-4 rounded-full">
                                <CheckCircle className="h-8 w-8 text-emerald-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Queue all clear!</p>
                                <p className="text-gray-500">There are no events waiting for approval.</p>
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[300px]">Event Details</TableHead>
                                    <TableHead>Location & Date</TableHead>
                                    <TableHead>Organizer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEvents.map((event) => (
                                    <TableRow key={event.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                    {event.images && event.images[0] ? (
                                                        <img src={event.images[0]} alt="" className="object-cover h-full w-full" />
                                                    ) : (
                                                        <Calendar className="h-6 w-6 text-gray-400 m-auto absolute inset-0" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-medium text-gray-900 text-sm truncate">{event.title}</span>
                                                    <span className="text-xs text-gray-500 line-clamp-1">{event.category?.name || "General"}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <MapPin className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                                    {event.city}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                                    {new Date(event.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-medium text-gray-700">
                                                {event.organizer?.organizationName || "Unknown Org"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(event.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                                    onClick={() => handleStatusUpdate(event.id, 'approved')}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => handleStatusUpdate(event.id, 'rejected')}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 shadow-lg">
                                                        <DropdownMenuLabel>Moderation Tools</DropdownMenuLabel>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Eye className="h-4 w-4 mr-2" /> Preview Listing
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleToggleFeature(event.id, !event.isFeatured)}
                                                        >
                                                            <Star className={`h-4 w-4 mr-2 ${event.isFeatured ? "text-amber-500 fill-amber-500" : ""}`} />
                                                            {event.isFeatured ? "Remove Featured" : "Mark as Featured"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer text-amber-600">
                                                            <AlertTriangle className="h-4 w-4 mr-2" /> Request Changes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer text-blue-600">
                                                            <ExternalLink className="h-4 w-4 mr-2" /> View Original Source
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
