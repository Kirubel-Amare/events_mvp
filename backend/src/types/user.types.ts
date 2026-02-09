export interface UserResponse {
  id: string;
  email: string;
  isOrganizer: boolean;
  isAdmin: boolean;
  personalProfile?: PersonalProfileResponse;
  organizerProfile?: OrganizerProfileResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalProfileResponse {
  id: string;
  name: string;
  username: string;
  bio: string;
  profilePhoto: string;
  additionalImages: string[];
  city: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizerProfileResponse {
  id: string;
  organizationName: string;
  profilePhoto: string;
  city: string;
  description: string;
  contactInfo: string;
  isVerified: boolean;
  verifiedAt: Date;
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}