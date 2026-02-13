"use client"

import { SafeImage } from "@/components/shared/safe-image"
import { Badge } from "@/components/ui/badge"
import { Users, Globe, Award, Heart, MessageSquare, Zap, Shield, Sparkles } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <SafeImage
                        src="/images/about-bg.png"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900" />
                </div>

                <div className="container relative z-10 text-center space-y-8">
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 py-1.5 animate-in fade-in slide-in-from-bottom-4">
                        Discover HubHub
                    </Badge>
                    <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
                        We Connect People <br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Through Passion
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-300 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        EventHub is the premier platform for discovering, creating, and joining unforgettable experiences.
                        We believe every event is an opportunity to build community and ignite inspiration.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <SafeImage
                                src="/images/about-people.png"
                                alt="Our Team"
                                width={800}
                                height={600}
                                className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                        </div>
                        <div className="space-y-8">
                            <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Our Mission: <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    Empowering Human Connection
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                In a world that's increasingly digital, our mission is to leverage technology to bring people
                                together in the physical world. We provide organizers with the tools they need to succeed
                                and attendees with a seamless path to discovery.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: Users, title: "Community First", desc: "Building strong bonds between people." },
                                    { icon: Globe, title: "Global Reach", desc: "Connecting events across sixty cities." },
                                    { icon: Shield, title: "Trusted Platform", desc: "Safe and secure for all users." },
                                    { icon: Award, title: "Excellence", desc: "Commitment to the highest quality." }
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-blue-600">
                                            <feature.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{feature.title}</h4>
                                            <p className="text-sm text-gray-500">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-gray-50">
                <div className="container text-center space-y-16">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Our Core Values</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">The principles that guide everything we do at EventHub.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { color: "blue", icon: Heart, title: "Inclusivity", text: "We welcome everyone and celebrate diverse perspectives and backgrounds." },
                            { color: "purple", icon: Zap, title: "Innovation", text: "We constantly push boundaries to redefine the event experience." },
                            { color: "emerald", icon: MessageSquare, title: "Transparency", text: "Honest communication is the foundation of our community trust." }
                        ].map((value, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className={`h-14 w-14 rounded-2xl bg-${value.color}-50 flex items-center justify-center text-${value.color}-600 mx-auto mb-6`}>
                                    <value.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
