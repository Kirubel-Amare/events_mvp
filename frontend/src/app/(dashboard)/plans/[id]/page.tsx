"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, MapPin, Share2, ArrowLeft, Users, Clock, MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { plansApi } from "@/lib/api/plans"
import { useAuthStore } from "@/store/auth-store"
import { Plan } from "@/types"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

export default function PlanDetailsPage() {
    const params = useParams()
    const id = params?.id as string
    const router = useRouter()
    const { user } = useAuthStore()

    const [plan, setPlan] = useState<Plan | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isJoining, setIsJoining] = useState(false)
    const [applications, setApplications] = useState<any[]>([])
    const [hasApplied, setHasApplied] = useState(false)

    useEffect(() => {
        const fetchPlan = async () => {
            if (!id) return
            try {
                const data = await plansApi.getPlan(id);
                setPlan(data);

                // Check if user has applied
                if (user) {
                    try {
                        const apps = await plansApi.getApplications(id);
                        setApplications(apps);
                        const myApp = apps.find((app: any) => app.userId === user.id);
                        setHasApplied(!!myApp);
                    } catch (err) {
                        console.error("Failed to fetch applications", err);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch plan", error);
                toast.error("Failed to load plan details");
            } finally {
                setIsLoading(false);
            }
        };

        if (user && id) {
            fetchPlan();
        } else if (id) {
            // If not logged in, just fetch plan
            plansApi.getPlan(id).then(setPlan).catch(() => toast.error("Failed to load plan")).finally(() => setIsLoading(false));
        }
    }, [id, user]);

    const handleJoin = async () => {
        if (!user) {
            router.push("/login"); // Or open auth modal
            return;
        }
        setIsJoining(true);
        try {
            await plansApi.joinPlan(id);
            toast.success("Joined plan successfully!");
            setHasApplied(true);
            // Refresh participants
            const apps = await plansApi.getApplications(id);
            setApplications(apps);
        } catch (error) {
            toast.error("Failed to join plan.");
        } finally {
            setIsJoining(false);
        }
    };

    const handleLeave = async () => {
        setIsJoining(true);
        try {
            await plansApi.leavePlan(id);
            toast.success("Left plan successfully.");
            setHasApplied(false);
            // Refresh participants
            const apps = await plansApi.getApplications(id);
            setApplications(apps);
        } catch (error) {
            toast.error("Failed to leave plan.");
        } finally {
            setIsJoining(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
    }

    if (!plan) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-2xl font-bold">Plan not found</h1>
                <Button className="mt-4" asChild>
                    <Link href="/plans">Back to Plans</Link>
                </Button>
            </div>
        )
    }

    const isCreator = user?.id === plan.creatorId;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
            <div className="container pt-8">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600" asChild>
                    <Link href="/plans">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Plans
                    </Link>
                </Button>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden relative">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                            <CardContent className="relative p-8 space-y-6">
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
                                    Plan
                                </Badge>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                    {plan.title}
                                </h1>
                                <div className="flex flex-wrap gap-6 text-white/90">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        <span className="font-medium">{format(new Date(plan.date), "PPP")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        <span className="font-medium">{format(new Date(plan.date), "p")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        <span className="font-medium">{plan.location}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-xl">About This Plan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                    {plan.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Participants */}
                        <Card className="border border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-xl">Participants</CardTitle>
                                <Badge variant="secondary">{applications.length} joined</Badge>
                            </CardHeader>
                            <CardContent>
                                {applications.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {applications.map((app) => (
                                            <div key={app.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="h-10 w-10 text-white bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center font-bold">
                                                    {app.user?.personalProfile?.name?.[0] || app.user?.email?.[0] || "U"}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{app.user?.personalProfile?.name || "User"}</div>
                                                    <div className="text-xs text-gray-500">Joined {format(new Date(app.appliedAt), "MMM d")}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 py-4 text-center">No one has joined yet. Be the first!</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border border-gray-200 shadow-sm sticky top-24">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Created By</div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Users className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {plan.creator?.personalProfile?.name || plan.creator?.name || "Unknown"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Plan Organizer
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 space-y-3">
                                    {isCreator ? (
                                        <Button className="w-full" variant="outline" disabled>
                                            You are the organizer
                                        </Button>
                                    ) : hasApplied ? (
                                        <Button
                                            className="w-full bg-red-100 text-red-600 hover:bg-red-200 border-0"
                                            onClick={handleLeave}
                                            disabled={isJoining}
                                        >
                                            {isJoining ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
                                            Leave Plan
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                                            onClick={handleJoin}
                                            disabled={isJoining}
                                        >
                                            {isJoining ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                            Join Plan
                                        </Button>
                                    )}

                                    {plan.externalLink && (
                                        <Button variant="outline" className="w-full" asChild>
                                            <a href={plan.externalLink} target="_blank" rel="noopener noreferrer">
                                                Visit Group Link
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
