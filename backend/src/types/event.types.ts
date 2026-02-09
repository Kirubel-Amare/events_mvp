export interface EventResponse {
  id: string;
  title: string;
  description: string;
  images: string[];
  city: string;
  date: Date;
  price: string;
  capacity: number;
  externalLink: string;
  isFeatured: boolean;
  status: string;
  organizer: {
    id: string;
    organizationName: string;
    profilePhoto: string;
    city: string;
    isVerified: boolean;
  };
  category?: {
    id: number;
    name: string;
    icon: string;
  };
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  title: string;
  description: string;
  images: string[];
  city: string;
  date: Date;
  price?: string;
  capacity?: number;
  externalLink?: string;
  categoryId?: number;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  images?: string[];
  city?: string;
  date?: Date;
  price?: string;
  capacity?: number;
  externalLink?: string;
  categoryId?: number;
  status?: string;
  isFeatured?: boolean;
}