"use client"

import { useEffect, useState } from "react"
import {
    ShieldAlert,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2,
    MoreVertical,
    BarChart3,
    User as UserIcon,
    Mail,
    Calendar,
    MessageSquare
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { quotaApi, QuotaRequest } from "@/lib/api/quota"
import toast from "react-hot-toast"

export default function AdminQuotaRequestsPage() {
    const [requests, setRequests] = useState<QuotaRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("pending")

    const fetchRequests = async () => {
        setIsLoading(true)
        try {
            const data = await quotaApi.getAllRequests()
            setRequests(data)
        } catch (error) {
            console.error("Failed to fetch quota requests:", error)
            toast.error("Failed to load quota requests")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        const comment = prompt(`Enter ${status} comment (optional):`)
        if (comment === null && status === 'rejected') return // Require comment for rejection? Maybe not required but good.

        try {
            await quotaApi.updateRequestStatus(id, status, comment || undefined)
            toast.success(`Request ${status} successfully`)
            fetchRequests()
        } catch (error) {
            console.error(`Failed to ${status} request:`, error)
            toast.error(`Failed to ${status} request`)
        }
    }

    const filteredRequests = requests.filter(req => {
        const matchesStatus = statusFilter === "all" || req.status === statusFilter
        const user = (req as any).user
        const userName = user?.fullname || user?.name || user?.username || ""
        const matchesSearch = userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.reason.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-emerald-100 text-emerald-700 border-none"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>
            case 'rejected': return <Badge className="bg-red-100 text-red-700 border-none"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
            default: return <Badge className="bg-amber-100 text-amber-700 border-none"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Quota Requests</h2>
                    <p className="text-gray-500">Manage user requests for weekly event and plan limit increases.</p>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-0 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by user or reason..."
                                className="pl-10 bg-gray-50 border-gray-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400 mr-1" />
                            <select
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p className="text-gray-500">Loading requests...</p>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                            <div className="bg-gray-100 p-4 rounded-full">
                                <ShieldAlert className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">No requests found</p>
                                <p className="text-gray-500">There are no quota requests matching your criteria.</p>
                            </div>
                            <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all") }}>Clear Filters</Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[250px]">User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Increase To</TableHead>
                                    <TableHead className="max-w-[300px]">Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.map((request) => {
                                    const user = (request as any).user
                                    return (
                                        <TableRow key={request.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-gray-100">
                                                        <AvatarImage src={user?.profilePicture || user?.personalProfile?.profilePhoto || ""} />
                                                        <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                                                            {user?.fullname?.charAt(0) || user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900 text-sm">{user?.fullname || user?.name || "N/A"}</span>
                                                        <span className="text-xs text-gray-500">@{user?.username || "username"}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">{request.type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
                                                    <span className="font-bold text-gray-900">{request.requestedValue}</span>
                                                    <span className="text-xs text-gray-400">/week</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <p className="text-sm text-gray-600 line-clamp-2" title={request.reason}>
                                                    {request.reason}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(request.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                                                    <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {request.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800"
                                                            onClick={() => handleAction(request.id, 'approved')}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                                                            onClick={() => handleAction(request.id, 'rejected')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 shadow-lg">
                                                            <DropdownMenuLabel>Logs</DropdownMenuLabel>
                                                            <DropdownMenuItem className="cursor-default">
                                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                                {request.adminComment || "No comment"}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
