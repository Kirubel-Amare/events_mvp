import bcrypt from 'bcryptjs';

export class Helpers {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare password
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate random string
  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Format date
  static formatDate(date: Date, format: string = 'en-US'): string {
    return new Intl.DateTimeFormat(format, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  // Sanitize object (remove undefined values)
  static sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
    const sanitized: Partial<T> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null && value !== '') {
        sanitized[key as keyof T] = value;
      }
    }
    return sanitized;
  }

  // Paginate array
  static paginate<T>(array: T[], page: number, limit: number): T[] {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return array.slice(startIndex, endIndex);
  }

  // Calculate offset for pagination
  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  // Generate slug
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
}