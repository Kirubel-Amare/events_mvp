"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Check, X, Eye } from "lucide-react"

import { adminApi } from "@/lib/api/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export function OrganizerApplications() {
    const [applications, setApplications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedApp, setSelectedApp] = useState<any>(null)
    const [adminComment, setAdminComment] = useState("")
    const [isActionLoading, setIsActionLoading] = useState(false)

    const fetchApplications = async () => {
        setIsLoading(true)
        try {
            const data = await adminApi.getOrganizerApplications("pending")
            setApplications(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch applications")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    const handleAction = async (status: "approved" | "rejected") => {
        if (!selectedApp) return
        setIsActionLoading(true)
        try {
            await adminApi.handleOrganizerApplication(selectedApp.id, status, adminComment)
            toast.success(`Application ${status} successfully`)
            setApplications(applications.filter(app => app.id !== selectedApp.id))
            setSelectedApp(null)
            setAdminComment("")
        } catch (error) {
            console.error(error)
            toast.error(`Failed to ${status} application`)
        } finally {
            setIsActionLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Organizer Applications</CardTitle>
            </CardHeader>
            <CardContent>
                {applications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No pending applications</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{app.user?.name}</p>
                                            <p className="text-xs text-muted-foreground">{app.user?.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{app.organizationName}</TableCell>
                                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedApp(app)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Handle Application</DialogTitle>
                        <DialogDescription>
                            Review the application from {selectedApp?.user?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedApp && (
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="text-sm font-medium">Organization</label>
                                <p className="text-sm mt-1">{selectedApp.organizationName || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Reason for applying</label>
                                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedApp.reason}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Admin Comment (Optional)</label>
                                <Textarea
                                    placeholder="Provide feedback for the user..."
                                    value={adminComment}
                                    onChange={(e) => setAdminComment(e.target.value)}
                                    disabled={isActionLoading}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex gap-2 sm:justify-between">
                        <Button
                            variant="destructive"
                            onClick={() => handleAction("rejected")}
                            disabled={isActionLoading}
                        >
                            {isActionLoading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />}
                            Reject
                        </Button>
                        <Button
                            onClick={() => handleAction("approved")}
                            disabled={isActionLoading}
                        >
                            {isActionLoading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
