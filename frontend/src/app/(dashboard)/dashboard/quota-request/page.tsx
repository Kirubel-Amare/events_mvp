"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { quotaApi, QuotaRequest } from "@/lib/api/quota"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, Plus, History, CheckCircle2, XCircle, Clock, BarChart3, ShieldAlert } from "lucide-react"
import toast from "react-hot-toast"

export default function QuotaRequestPage() {
    const { user } = useAuthStore()
    const [requests, setRequests] = useState<QuotaRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [type, setType] = useState<'event' | 'plan'>('event')
    const [requestedValue, setRequestedValue] = useState<number>(5)
    const [reason, setReason] = useState('')

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const data = await quotaApi.getMyRequests()
            setRequests(data)
        } catch (error) {
            console.error("Failed to fetch requests:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!reason.trim()) {
            toast.error("Please provide a reason for your request")
            return
        }

        setIsSubmitting(true)
        try {
            await quotaApi.createRequest({
                type,
                requestedValue,
                reason
            })
            toast.success("Request submitted successfully!")
            setReason('')
            fetchRequests()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to submit request")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />
            default: return <Clock className="h-4 w-4 text-amber-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Approved</Badge>
            case 'rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
            default: return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Quota Management</h1>
                <p className="text-gray-600 text-lg">Request increases for your weekly event or plan limits.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Request Form */}
                <div className="lg:col-span-1">
                    <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm sticky top-8">
                        <CardHeader className="border-b bg-gray-50/50">
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5 text-blue-600" />
                                New Request
                            </CardTitle>
                            <CardDescription>Submit a request for higher limits</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Request Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            type="button"
                                            variant={type === 'event' ? 'default' : 'outline'}
                                            className={type === 'event' ? 'bg-blue-600' : ''}
                                            onClick={() => setType('event')}
                                        >
                                            Event Quota
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={type === 'plan' ? 'default' : 'outline'}
                                            className={type === 'plan' ? 'bg-purple-600' : ''}
                                            onClick={() => setType('plan')}
                                        >
                                            Plan Quota
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Requested Weekly Limit</label>
                                    <div className="relative">
                                        <BarChart3 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="number"
                                            value={requestedValue}
                                            onChange={(e) => setRequestedValue(parseInt(e.target.value))}
                                            className="pl-10"
                                            min={1}
                                            max={100}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Current limit: {type === 'event' ? user?.weeklyEventQuota : user?.weeklyPlanQuota}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Reason for Request</label>
                                    <Textarea
                                        placeholder="Explain why you need a higher limit..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="min-h-[120px] resize-none"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-gray-50/50 pt-4">
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Request'
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                {/* History */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <History className="h-5 w-5 text-gray-500" />
                                    Request History
                                </CardTitle>
                                <CardDescription>Track the status of your quota requests</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                    <p className="text-gray-500">Loading your history...</p>
                                </div>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50/50">
                                    <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-4">
                                        <ShieldAlert className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <h3 className="text-gray-900 font-medium">No requests yet</h3>
                                    <p className="text-gray-500 mt-1 max-w-xs mx-auto">When you hit a limit, submit a request to increase your capacity.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {requests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="group p-5 border rounded-2xl bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl ${request.type === 'event' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                                        }`}>
                                                        <BarChart3 className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-gray-900 capitalize">{request.type} Quota</span>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="text-sm font-medium text-gray-600">to {request.requestedValue}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 line-clamp-1 italic">"{request.reason}"</p>
                                                        <div className="text-[10px] text-gray-400 mt-2">
                                                            Submitted on {new Date(request.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(request.status)}
                                                        {getStatusBadge(request.status)}
                                                    </div>
                                                    {request.adminComment && (
                                                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border max-w-xs">
                                                            <span className="font-semibold text-gray-700">Admin:</span> {request.adminComment}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="bg-blue-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <CardContent className="p-6 relative z-10 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Why are there limits?</h3>
                                <p className="text-blue-100 text-sm">
                                    Limits ensure platform stability and high-quality content.
                                    Apply for increases if you're a verified community leader or high-frequency organizer.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
