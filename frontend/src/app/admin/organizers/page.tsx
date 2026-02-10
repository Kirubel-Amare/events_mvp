"use client"

import { useEffect, useState } from "react"
import { adminApi } from "@/lib/api/admin"
import { toast } from "react-hot-toast"
import { Loader2, CheckCircle, XCircle, Clock, User, Building, Info, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Modal as Dialog, ModalContent as DialogContent, ModalDescription as DialogDescription, ModalFooter as DialogFooter, ModalHeader as DialogHeader, ModalTitle as DialogTitle, ModalTrigger as DialogTrigger } from "@/components/ui/modal"

export default function AdminOrganizersPage() {
    const [applications, setApplications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState<string | null>(null)
    const [adminComment, setAdminComment] = useState("")

    const fetchApplications = async () => {
        try {
            setIsLoading(true)
            const data = await adminApi.getOrganizerApplications()
            setApplications(data)
        } catch (error) {
            toast.error("Failed to fetch applications")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    const handleApplication = async (id: string, status: 'approved' | 'rejected') => {
        setIsProcessing(id)
        try {
            await adminApi.handleOrganizerApplication(id, status, adminComment)
            toast.success(`Application ${status} successfully`)
            setAdminComment("")
            fetchApplications()
        } catch (error) {
            toast.error(`Failed to ${status} application`)
        } finally {
            setIsProcessing(null)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organizer Applications</h1>
                    <p className="text-gray-600">Review and manage requests to become an organizer</p>
                </div>
                <Button variant="outline" onClick={fetchApplications}>Refresh</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Applications List</CardTitle>
                    <CardDescription>
                        {applications.length} total applications found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No applications found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <div className="font-medium">{app.user?.name}</div>
                                                    <div className="text-xs text-gray-500">{app.user?.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-gray-400" />
                                                <span>{app.organizationName || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    app.status === 'approved' ? 'default' :
                                                        app.status === 'rejected' ? 'destructive' :
                                                            'outline'
                                                }
                                                className={app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                            >
                                                {app.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                                                {app.status.charAt(0) + app.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {app.status === 'pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <Info className="mr-2 h-4 w-4" />
                                                                Details
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Application Details</DialogTitle>
                                                                <DialogDescription>
                                                                    Submitted by {app.user?.name} on {new Date(app.createdAt).toLocaleString()}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-semibold flex items-center gap-2">
                                                                        <MessageSquare className="h-4 w-4" />
                                                                        Reason for applying
                                                                    </h4>
                                                                    <p className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                                                        "{app.reason}"
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-sm font-medium">Admin Comment (Optional)</label>
                                                                    <Textarea
                                                                        placeholder="Add a comment for the user..."
                                                                        value={adminComment}
                                                                        onChange={(e) => setAdminComment(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter className="gap-2 sm:gap-0">
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={() => handleApplication(app.id, 'rejected')}
                                                                    disabled={!!isProcessing}
                                                                >
                                                                    {isProcessing === app.id ? <Loader2 className="animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                                                                    Reject
                                                                </Button>
                                                                <Button
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                    onClick={() => handleApplication(app.id, 'approved')}
                                                                    disabled={!!isProcessing}
                                                                >
                                                                    {isProcessing === app.id ? <Loader2 className="animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                                                    Approve
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Processed</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
