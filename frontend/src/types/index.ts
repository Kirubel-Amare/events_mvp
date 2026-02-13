export interface User {
    isVerified: any;
    id: string;
    email: string;
    name: string;
    username: string;
    fullname: string | null;
    profilePicture: string | null;
    role: 'user' | 'organizer' | 'admin';
    isOrganizer: boolean;
    isAdmin: boolean;
    weeklyEventQuota: number;
    weeklyPlanQuota: number;
    organizerProfile?: OrganizerProfile;
    personalProfile?: {
        id: string;
        name: string;
        username?: string;
        profilePhoto: string;
        bio: string;
        city: string;
        website?: string;
        instagram?: string;
        twitter?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface OrganizerProfile {
    id: string;
    organizationName: string;
    profilePhoto: string;
    city: string;
    description: string;
    contactEmail: string;
    contactPhone?: string;
    website?: string;
    instagram?: string;
    twitter?: string;
    isVerified: boolean;
}

export interface Category {
    id: number;
    name: string;
    icon?: string;
    slug?: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    mainImage: string | null;
    images: string[];
    city: string;
    date: string;
    time?: string;
    price: string | null;
    capacity: number | null;
    externalLink: string | null;
    isFeatured: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    organizerId: string;
    organizer?: OrganizerProfile; // In backend it is relation to OrganizerProfile
    categoryId?: number;
    category?: Category;
    createdAt: string;
    updatedAt: string;
    reviews?: number; // Added for frontend mock/future
    attendees?: number; // Added for frontend mock/future
    attendeesCount?: number; // Added to fix dashboard error
}

export interface Plan {
    id: string;
    title: string;
    description: string;
    location: string;
    image: string | null;
    date: string;
    externalLink: string | null;
    status: 'active' | 'completed' | 'cancelled';
    creatorId: string;
    creator?: User;
    createdAt: string;
    updatedAt: string;
}
