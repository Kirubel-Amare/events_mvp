import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface FeaturedBannerProps {
    event: {
        id: string
        title: string
        description: string
        image: string
    }
}

export function FeaturedBanner({ event }: FeaturedBannerProps) {
    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-black text-white shadow-xl mb-8 group">
            <div className="absolute inset-0 z-0">
                <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>
            <div className="relative z-10 p-6 md:p-10 flex flex-col items-start justify-end min-h-[400px]">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md mb-4 text-white">
                    Featured Event
                </div>
                <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-5xl">{event.title}</h2>
                <p className="mb-6 max-w-2xl text-gray-300 md:text-lg">
                    {event.description}
                </p>
                <Button size="lg" className="bg-white text-black hover:bg-white/90" asChild>
                    <Link href={`/browse/events/${event.id}`}>
                        View Event
                    </Link>
                </Button>
            </div>
        </div>
    )
}
