export const APP_NAME = 'EventHub';
export const APP_DESCRIPTION = 'Discover events and create social plans';

// Pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Validation
export const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
export const PASSWORD_MIN_LENGTH = 8;

// Limits
export const MAX_PLANS_PER_USER = 1;
export const PLANS_PER_WEEK_LIMIT = 1;

// Categories
export const DEFAULT_CATEGORIES = [
  { name: 'Music', icon: '🎵' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Art', icon: '🎨' },
  { name: 'Food', icon: '🍕' },
  { name: 'Tech', icon: '💻' },
  { name: 'Wellness', icon: '🧘' },
  { name: 'Business', icon: '💼' },
  { name: 'Social', icon: '👥' },
  { name: 'Education', icon: '📚' },
  { name: 'Outdoor', icon: '🌳' },
];