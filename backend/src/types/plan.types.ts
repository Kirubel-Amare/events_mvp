export interface PlanResponse {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  externalLink: string;
  status: string;
  creator: {
    id: string;
    name: string;
    username: string;
    profilePhoto: string;
  };
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlanInput {
  title: string;
  description: string;
  location: string;
  date: Date;
  externalLink?: string;
}

export interface UpdatePlanInput {
  title?: string;
  description?: string;
  location?: string;
  date?: Date;
  externalLink?: string;
  status?: string;
}