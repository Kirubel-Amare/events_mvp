import Link from "next/link"
import { Calendar, MapPin, Share2, ArrowLeft, Users, Clock, Heart, Star, Instagram, Globe, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_EVENTS } from "@/lib/data"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0]

    // Mock event details expansion
    const eventDetails = {
        longDescription: `${event.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
        highlights: [
            "Live music performance by local artists",
            "Networking opportunities with industry professionals",
            "Complimentary food and beverages",
            "Interactive workshops and activities",
            "Exclusive merchandise giveaway"
        ],
        whatToBring: ["Comfortable shoes", "Photo ID", "Positive attitude"],
        faqs: [
            { question: "Is there parking available?", answer: "Yes, we have free parking available on-site." },
            { question: "Can I get a refund?", answer: "Refunds are available up to 48 hours before the event." },
            { question: "Is this event family-friendly?", answer: "Yes, this event is suitable for all ages." }
        ]
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Image Section */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay" />
                </div>

                {/* Navigation */}
                <div className="container relative z-10 pt-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
                        asChild
                    >
                        <Link href="/events">
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </Link>
                    </Button>
                </div>

                {/* Event Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 container pb-8">
                    <div className="max-w-4xl">
                        <Badge className="mb-4 bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30">
                            {event.category}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            {event.title}
                        </h1>
                        <div className="flex items-center gap-4 text-white/90">
                            <span className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {event.attendees} attending
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                4.8/5 ({event.reviews} reviews)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container relative -mt-20 z-10 pb-16">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border border-gray-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                                            <Calendar className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Date & Time</div>
                                            <div className="font-semibold text-gray-900">{event.date}</div>
                                            <div className="text-sm text-gray-600">{event.time}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-gray-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                                            <MapPin className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Location</div>
                                            <div className="font-semibold text-gray-900">{event.location}</div>
                                            <div className="text-sm text-gray-600">New York, NY</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* About Event */}
                        <Card className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-2xl text-gray-900">About This Event</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-gray-600 leading-relaxed">
                                    {eventDetails.longDescription}
                                </p>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-blue-600" />
                                        Event Highlights
                                    </h3>
                                    <ul className="space-y-2">
                                        {eventDetails.highlights.map((highlight, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                                                </div>
                                                <span className="text-gray-700">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">What to Bring</h3>
                                        <div className="space-y-2">
                                            {eventDetails.whatToBring.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2 text-gray-600">
                                                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Organizer</h3>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">CE</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{event.organizer}</div>
                                                <div className="text-sm text-gray-600">Verified Organizer</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ */}
                        <Card className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-2xl text-gray-900">Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {eventDetails.faqs.map((faq, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="font-medium text-gray-900 mb-2">{faq.question}</div>
                                            <div className="text-gray-600">{faq.answer}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Action Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Ticket Card */}
                            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Ticket Price</div>
                                        <div className="text-4xl font-bold text-gray-900">Free</div>
                                        <div className="text-sm text-gray-600">General Admission</div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button 
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12"
                                            size="lg"
                                        >
                                            Get Free Tickets
                                        </Button>

                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                className="flex-1 border-gray-300 hover:bg-gray-100"
                                            >
                                                <Heart className="mr-2 h-4 w-4" />
                                                Save
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="flex-1 border-gray-300 hover:bg-gray-100"
                                            >
                                                <Share2 className="mr-2 h-4 w-4" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600 mb-2">Event Stats</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <div className="text-lg font-bold text-blue-600">{event.attendees}</div>
                                                <div className="text-xs text-gray-600">Attending</div>
                                            </div>
                                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                <div className="text-lg font-bold text-purple-600">85%</div>
                                                <div className="text-xs text-gray-600">Capacity</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Organizer Info */}
                            <Card className="border border-gray-200">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">About Organizer</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                <span className="text-white font-bold">CE</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{event.organizer}</div>
                                                <div className="text-sm text-gray-600">Verified • 4.8★</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-blue-600">
                                                <Globe className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-pink-600">
                                                <Instagram className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-blue-400">
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100">
                                            View All Events
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Info */}
                            <Card className="border border-gray-200">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Duration</span>
                                            <span className="font-medium text-gray-900">3 hours</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Language</span>
                                            <span className="font-medium text-gray-900">English</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Accessibility</span>
                                            <Badge className="bg-green-100 text-green-700 border-0">Wheelchair Accessible</Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Age Restriction</span>
                                            <span className="font-medium text-gray-900">18+</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}