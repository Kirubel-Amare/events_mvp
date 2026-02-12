"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { notificationsApi, Notification } from "@/lib/api/notifications"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function NotificationsPage() {
    const { user } = useAuthStore()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)

    const fetchNotifications = async () => {
        try {
            setIsLoading(true)
            const data = await notificationsApi.getAll()
            setNotifications(data.notifications)
            setUnreadCount(data.unreadCount)
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
            toast.error("Failed to load notifications")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationsApi.markAsRead(id)
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
            toast.success("Marked as read")
        } catch (error) {
            toast.error("Failed to mark as read")
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead()
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
            toast.success("All notifications marked as read")
        } catch (error) {
            toast.error("Failed to mark all as read")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await notificationsApi.delete(id)
            setNotifications(prev => prev.filter(n => n.id !== id))
            if (notifications.find(n => n.id === id)?.isRead === false) {
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
            toast.success("Notification deleted")
        } catch (error) {
            toast.error("Failed to delete notification")
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
            case 'error': return <XCircle className="h-5 w-5 text-red-500" />
            default: return <Info className="h-5 w-5 text-blue-500" />
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {user?.role === 'admin' ? 'System Alerts' :
                            user?.role === 'organizer' ? 'Organizer Notifications' :
                                'Your Notifications'}
                    </h2>
                    <p className="text-muted-foreground">
                        {user?.role === 'admin' ? 'Global system updates and moderation alerts.' :
                            user?.role === 'organizer' ? 'Manage your event activities and attendee updates.' :
                                'Stay updated with your latest interests and plans.'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <Card className="h-[600px] flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Recent Notifications
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {unreadCount} New
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Stay updated with the latest events and activities.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[500px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <p className="text-muted-foreground">Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                                <Bell className="h-10 w-10 text-muted-foreground/20 mb-2" />
                                <p className="text-muted-foreground">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications.map((notification, index) => (
                                    <div key={notification.id}>
                                        <div className={cn(
                                            "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                                            !notification.isRead && "bg-muted/30 border-l-2 border-primary"
                                        )}>
                                            <div className="mt-1">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className={cn("text-sm font-medium leading-none", !notification.isRead && "font-bold")}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {notification.message}
                                                </p>
                                                {notification.link && (
                                                    <Button variant="link" className="h-auto p-0 text-primary" asChild>
                                                        <Link href={notification.link}>View Details</Link>
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!notification.isRead && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDelete(notification.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        {index < notifications.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
