"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { eventSchema, type EventInput } from "@/lib/utils/validators"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { eventsApi } from "@/lib/api/events"
import { Category } from "@/types"
import { ImageUpload } from "@/components/shared/ImageUpload"

export function EventForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await eventsApi.getCategories()
                setCategories(data)
            } catch (error) {
                console.error("Failed to fetch categories", error)
                toast.error("Failed to load categories")
            }
        }
        fetchCategories()
    }, [])

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EventInput>({
        resolver: zodResolver(eventSchema),
    })

    const onSubmit = async (data: EventInput) => {
        setIsLoading(true)
        try {
            // Find category ID from the selected value (which is the ID as string)
            const categoryId = parseInt(data.category)

            await eventsApi.createEvent({
                title: data.title,
                description: data.description,
                date: new Date(data.date).toISOString(),
                city: data.city,
                images: data.image ? [data.image] : [],
                price: data.price,
                capacity: data.capacity ? parseInt(data.capacity) : undefined,
                externalLink: data.externalLink,
                categoryId: categoryId
            })

            toast.success("Event created successfully!")
            router.push("/organizer/events") // Or dashboard? 
            // The router.push was /organizer/events in previous code.
            // I should check if that route exists.
        } catch (error) {
            console.error(error)
            toast.error("Failed to create event.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="title">Event Title</label>
                <Input id="title" placeholder="e.g. Summer Music Festival" {...register("title")} disabled={isLoading} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="description">Description</label>
                <Textarea
                    id="description"
                    placeholder="Detailed description of the event..."
                    className="min-h-[150px]"
                    {...register("description")}
                    disabled={isLoading}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="category">Category</label>
                    <Select onValueChange={(val: string) => setValue("category", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="city">City</label>
                    <Input id="city" placeholder="e.g. New York" {...register("city")} disabled={isLoading} />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="date">Date & Time</label>
                <Input
                    id="date"
                    type="datetime-local"
                    {...register("date")}
                    disabled={isLoading}
                />
                {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="price">Price (Optional)</label>
                    <Input id="price" placeholder="e.g. Free or $20" {...register("price")} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="capacity">Capacity (Optional)</label>
                    <Input id="capacity" placeholder="e.g. 100" {...register("capacity")} disabled={isLoading} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="externalLink">Ticket/Info Link</label>
                <Input id="externalLink" placeholder="https://..." {...register("externalLink")} disabled={isLoading} />
                <p className="text-xs text-muted-foreground">
                    Link where users can buy tickets or find more info.
                </p>
                {errors.externalLink && <p className="text-sm text-destructive">{errors.externalLink.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Event Image</label>
                <ImageUpload
                    onUpload={(url) => setValue("image", url)}
                    value={watch("image")}
                />
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                    Create Event
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
