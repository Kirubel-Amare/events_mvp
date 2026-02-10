export interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    role: 'user' | 'organizer' | 'admin';
    isVerified?: boolean;
    isOrganizer: boolean;
    isAdmin: boolean;
    organizerProfile?: OrganizerProfile;
    personalProfile?: {
        id: string;
        name: string;
        username?: string;
        profilePhoto: string;
        bio: string;
        city: string;
    };
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
}

export interface Plan {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    externalLink: string | null;
    status: 'active' | 'completed' | 'cancelled';
    creatorId: string;
    creator?: User;
    createdAt: string;
    updatedAt: string;
}
