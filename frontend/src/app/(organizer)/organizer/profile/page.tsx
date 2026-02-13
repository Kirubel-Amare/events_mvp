"use client"

import { useState, useEffect } from "react"
import { Building2, Globe, Mail, MapPin, Instagram, Link as LinkIcon, Edit2, Calendar, Users, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { organizerApi } from "@/lib/api/organizer"
import { useAuthStore } from "@/store/auth-store"
import Link from "next/link"
import { SafeImage } from "@/components/shared/safe-image"

export default function OrganizerProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthStore()

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return
            try {
                const data = await organizerApi.getProfile(user.id)
                setProfile(data)
            } catch (error) {
                console.error("Failed to fetch organizer profile", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [user])

    if (isLoading) {
        return <div className="p-8 text-center">Loading profile...</div>
    }

    if (!profile) {
        return <div className="p-8 text-center">Profile not found.</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Manage your organization's public presence
                    </p>
                </div>
                <Button asChild className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm">
                    <Link href="/organizer/profile/edit">
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Link>
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border border-gray-200 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600"></div>
                        <CardContent className="relative pt-0 pb-8 px-6">
                            <div className="relative -mt-16 mb-4 flex justify-center">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-lg overflow-hidden">
                                    {profile.profilePhoto ? (
                                        <SafeImage
                                            src={profile.profilePhoto}
                                            alt={profile.organizationName}
                                            fill
                                            className="object-cover"
                                            fallbackSrc={"https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.organizationName}
                                        />
                                    ) : (
                                        <AvatarFallback className="text-3xl bg-white text-purple-600">
                                            {profile.organizationName?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </div>

                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900">{profile.organizationName}</h2>
                                <p className="text-gray-500 font-medium flex items-center justify-center gap-1">
                                    <MapPin className="h-4 w-4" /> {profile.city}
                                </p>
                            </div>

                            <div className="mt-6 space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Building2 className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">Organization</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{profile.user?.email || profile.contactInfo}</span>
                                </div>
                                {profile.website && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                                            {profile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Social Links */}
                            {(profile.instagram || profile.twitter) && (
                                <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
                                    {profile.instagram && (
                                        <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                                            <Instagram className="h-5 w-5" />
                                        </a>
                                    )}
                                    {profile.twitter && (
                                        <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                            <LinkIcon className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Details & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About Section */}
                    <Card className="border border-gray-200">
                        <CardHeader>
                            <CardTitle>About Organization</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {profile.description || "No description provided."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Card className="border border-gray-200">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {profile.events?.length || 0}
                                </h3>
                                <p className="text-sm text-gray-500">Total Events</p>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-200">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                                    <Users className="h-5 w-5 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    1.2k
                                </h3>
                                <p className="text-sm text-gray-500">Total Attendees</p>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-200">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    4.8
                                </h3>
                                <p className="text-sm text-gray-500">Average Rating</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
