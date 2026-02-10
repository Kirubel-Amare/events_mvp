"use client"

import { useEffect, useState } from "react"
import {
    AlertCircle,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Flag,
    Eye,
    MoreVertical,
    Loader2,
    Trash2,
    MessageSquare,
    User as UserIcon,
    Calendar as EventIcon,
    Clock
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
import { adminApi, AdminReport } from "@/lib/api/admin"
import toast from "react-hot-toast"

export default function ReportManagementPage() {
    const [reports, setReports] = useState<AdminReport[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>("pending")

    const fetchReports = async () => {
        setIsLoading(true)
        try {
            const data = await adminApi.getReports(statusFilter === "all" ? undefined : statusFilter)
            setReports(data)
        } catch (error) {
            console.error("Failed to fetch reports:", error)
            toast.error("Failed to load reports")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [statusFilter])

    const handleUpdateStatus = async (reportId: string, status: string) => {
        try {
            await adminApi.updateReportStatus(reportId, status)
            toast.success(`Report status updated to ${status}`)
            fetchReports()
        } catch (error) {
            toast.error("Failed to update report status")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "resolved":
                return <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5">Resolved</Badge>
            case "dismissed":
                return <Badge className="bg-gray-100 text-gray-700 border-none px-2 py-0.5">Dismissed</Badge>
            case "reviewed":
                return <Badge className="bg-blue-100 text-blue-700 border-none px-2 py-0.5">Reviewed</Badge>
            default:
                return <Badge className="bg-amber-100 text-amber-700 border-none px-2 py-0.5">Pending</Badge>
        }
    }

    const getTargetIcon = (type: string) => {
        switch (type) {
            case "user": return <UserIcon className="h-4 w-4" />
            case "event": return <EventIcon className="h-4 w-4" />
            default: return <MessageSquare className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Report Moderation</h2>
                    <p className="text-gray-500">Handle user-reported content and maintaining safety.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`px-3 py-1 ${reports.length > 0 ? "border-amber-200 text-amber-600 bg-amber-50" : "border-emerald-200 text-emerald-600 bg-emerald-50"}`}>
                        {reports.length} Reports {statusFilter}
                    </Badge>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-0 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400 mr-1" />
                            <select
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Reports</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="resolved">Resolved</option>
                                <option value="dismissed">Dismissed</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p className="text-gray-500">Retrieving moderation queue...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                            <div className="bg-emerald-50 p-4 rounded-full">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">No reports to show</p>
                                <p className="text-gray-500">Great job! The platform is clean.</p>
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[100px]">Type</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Reporter</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-2 capitalize text-sm font-medium text-gray-600">
                                                {getTargetIcon(report.targetType)}
                                                {report.targetType}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[200px] truncate">
                                                <span className="text-sm text-gray-900">{report.reason}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{report.reporter?.name || "Anonymous"}</span>
                                                <span className="text-xs text-gray-500">ID: {report.reporterId.substring(0, 8)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(report.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                                                >
                                                    Review
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 shadow-lg">
                                                        <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                                                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateStatus(report.id, 'resolved')}>
                                                            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" /> Mark Resolved
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateStatus(report.id, 'dismissed')}>
                                                            <XCircle className="h-4 w-4 mr-2 text-gray-400" /> Dismiss Report
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Eye className="h-4 w-4 mr-2" /> View Target Content
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer text-red-600">
                                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Target
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
