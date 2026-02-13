"use client"

import { useAuthStore } from "@/store/auth-store"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Calendar, Sparkles, User, Globe, Edit2 } from "lucide-react"
import Link from "next/link"
import { OrganizerApplicationForm } from "@/components/forms/OrganizerApplicationForm"

export default function ProfilePage() {
    const { user } = useAuthStore()

    if (!user) return null

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Profile</h1>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Premium Member
                        </Badge>
                    </div>
                    <p className="text-lg text-gray-600 mt-2">
                        Manage your public profile and personal preferences
                    </p>
                </div>
                <Button asChild className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm">
                    <Link href="/profile/edit">
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Link>
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border border-gray-200 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                        <CardContent className="relative pt-0 pb-8 px-6">
                            <div className="relative -mt-16 mb-4 flex justify-center">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                    <AvatarImage src={user.personalProfile?.profilePhoto || user.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name} className="object-cover" />
                                    <AvatarFallback className="text-3xl">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900">{user.fullname || user.name}</h2>
                                <p className="text-gray-500 font-medium">@{user.username}</p>

                                <div className="flex items-center justify-center gap-2 pt-2">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                        {user.role === 'organizer' ? 'Organizer' : 'Member'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{user.personalProfile?.city || "No location set"}</span>
                                </div>
                                {user.personalProfile?.website && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <a href={user.personalProfile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                                            {user.personalProfile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Unknown'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Status */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">Account Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Email Verified</span>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                    Verified
                                </Badge>
                            </div>
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100" asChild>
                                <Link href="/settings">Security Settings</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Center/Right Column - Details & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bio Section */}
                    <Card className="border border-gray-200">
                        <CardHeader>
                            <CardTitle>About Me</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 leading-relaxed">
                                {user.personalProfile?.bio || "No bio yet. Click Edit Profile to add one!"}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card className="border border-gray-200 bg-blue-50/50">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Events Attended</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-1">12</h3>
                                </div>
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-200 bg-purple-50/50">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Plans Created</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-1">5</h3>
                                </div>
                                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="h-6 w-6 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Weekly Quotas */}
                    {(user.role === 'user' || user.role === 'organizer') && (
                        <Card className="border border-gray-200">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg text-gray-900">Weekly Activity Quotas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Event Interactions</span>
                                        <span className="font-medium">{user.weeklyEventQuota} remaining</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: '60%' }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Plan Creations</span>
                                        <span className="font-medium">{user.weeklyPlanQuota} remaining</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{ width: '30%' }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Organizer Application */}
                    {!user?.isOrganizer && (
                        <OrganizerApplicationForm />
                    )}
                </div>
            </div>
        </div>
    )
}