import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const planSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    location: z.string().min(3, "Location is required"),
    date: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Date must be in the future",
    }),
    image: z.string().optional(),
    externalLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    city: z.string().min(2, "City is required"),
    date: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Date must be in the future",
    }),
    category: z.string().min(1, "Category is required"),
    image: z.any().optional(), // For now, handle file separately or as string url
    price: z.string().optional(),
    capacity: z.string().optional(),
    externalLink: z.string().url("Must be a valid URL"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PlanInput = z.infer<typeof planSchema>
export type EventInput = z.infer<typeof eventSchema>
