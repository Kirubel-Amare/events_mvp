"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Bell, ArrowLeft, Calendar, Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notificationApi, Notification } from "@/lib/api/notification"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import toast from "react-hot-toast"

export default function NotificationDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [notification, setNotification] = useState<Notification | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchNotification = async () => {
            if (!params.id) return
            try {
                const data = await notificationApi.getNotificationById(params.id as string)
                setNotification(data)

                // Mark as read if not already
                if (!data.isRead) {
                    await notificationApi.markAsRead(data.id)
                }
            } catch (error) {
                console.error("Failed to fetch notification:", error)
                toast.error("Notification not found")
                router.push("/notifications")
            } finally {
                setIsLoading(false)
            }
        }

        fetchNotification()
    }, [params.id, router])

    const handleDelete = async () => {
        if (!notification) return
        try {
            await notificationApi.deleteNotification(notification.id)
            toast.success("Notification deleted")
            router.push("/notifications")
        } catch (error) {
            toast.error("Failed to delete notification")
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-6 w-6 text-green-500" />
            case 'warning': return <AlertTriangle className="h-6 w-6 text-amber-500" />
            case 'error': return <XCircle className="h-6 w-6 text-red-500" />
            default: return <Info className="h-6 w-6 text-blue-500" />
        }
    }

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'success': return "bg-green-50 border-green-100"
            case 'warning': return "bg-amber-50 border-amber-100"
            case 'error': return "bg-red-50 border-red-100"
            default: return "bg-blue-50 border-blue-100"
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <Skeleton className="h-10 w-32" />
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-40" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!notification) return null

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Notifications
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </div>

            <Card className="border-0 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100">
                <div className={`h-2 w-full bg-gradient-to-r ${notification.type === 'success' ? 'from-green-500 to-emerald-500' :
                        notification.type === 'warning' ? 'from-amber-500 to-orange-500' :
                            notification.type === 'error' ? 'from-red-500 to-rose-500' :
                                'from-blue-500 to-purple-500'
                    }`} />
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-2xl ${getTypeStyles(notification.type)}`}>
                                {getTypeIcon(notification.type)}
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                                    {notification.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {format(new Date(notification.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className={`capitalize ${notification.type === 'success' ? 'bg-green-100 text-green-700' :
                                notification.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                                    notification.type === 'error' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                            } border-0`}>
                            {notification.type}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                    <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                        {notification.message}
                    </div>

                    {notification.link && (
                        <div className="flex items-center gap-4 pt-4">
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-200"
                                asChild
                            >
                                <a href={notification.link} target={notification.link.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer">
                                    View Related Content
                                </a>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
